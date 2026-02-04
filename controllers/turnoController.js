//importo el model para poder acceder a las funciones que interactuan con la bbdd
const moment = require('moment');

const HorarioModel = require('../models/horarioModel');
const horarioModel = new HorarioModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const EstadoTurnoModel = require('../models/estadoTurnoModel');
const estadoTurnoModel = new EstadoTurnoModel();

const nodemailer = require('nodemailer'); 

const diasSpanish = {
    "Monday": 'lunes',
    "Tuesday": 'martes',
    "Wednesday": 'miercoles',
    "Thursday": 'jueves',
    "Friday": 'viernes',
    "Saturday": 'sabado',
    "Sunday": 'domingo',
}

class TurnoController {
    //funcion para listar los turnos
    async listarTurnos(req, res) {
        let { buscar, page = 1, limit = 15 } = req.query;
    
        page = parseInt(page) || 1; 
        limit = parseInt(limit) || 15; 
    
        const offset = (page - 1) * limit;
        let filtro = '';
        
        if (buscar) {
            filtro = `
                WHERE pacientes.nombre LIKE '%${buscar}%' 
                OR usuarios.nombre LIKE '%${buscar}%' 
                OR pacientes.dni LIKE '%${buscar}%'
            `;
        }
    
        turnoModel.listarTurnos(filtro, limit, offset, (turnos, total) => {
            if (!turnos || turnos.length === 0) {
                console.log("No se encontraron turnos.");
            }
    
            const totalPages = Math.ceil(total / limit);
    
            res.render("../views/turnos/listarTurnos", {
                turno: turnos,
                currentPage: parseInt(page),
                totalPages: totalPages,
                buscar: buscar || '',
                limit: limit // Pasamos el límite seleccionado a la vista para mantenerlo en el select
            });
        });
    }    

    //funcion para editar los turnos
    async editarTurno(req, res){
        const id = req.params.id;
        turnoModel.obtenerTurno(id, (turno)=>{

        if (!turno) {
            return res.status(404).send("Turno no encontrado");
        }

        // Obtener pacientes y médicos en paralelo usando Promises
        Promise.all([
            new Promise((resolve, reject) => {
                const limit = req.query.limit || 10; // Por ejemplo, puedes definir un límite predeterminado
                const offset = req.query.offset || 0;
                pacienteModel.listarPacientes(limit, offset, {}, (pacientes, total) => {
                    resolve(pacientes);
                });
            }),
            new Promise((resolve, reject) => {
                medicoModel.listarMedicos((medicos) => {
                    resolve(medicos);
                });
            }),
            new Promise((resolve, reject) => {
                estadoTurnoModel.listarEstadoTurno((estado_turnos) => {
                    resolve(estado_turnos);
                });
            }),
            new Promise((resolve, reject) => {
                const idMedico = turno.id_medico;
                medicoModel.obtenerPracticasPorMedico(idMedico, (practicas) => {
                    resolve(practicas);
                });
            })
        ])
        .then(([pacientes, medicos, estado_turnos, practicas]) => {
            res.render("../views/turnos/editarTurno", {
                turno: turno,
                pacientes: pacientes,
                medicos: medicos,
                estado_turnos: estado_turnos,
                practicas: practicas
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al cargar la información");
        });
    });
    }

    // Función para guardar (crear o editar) turnos
    async guardarTurno(req, res) {
        const datos = req.body;
        console.log("💾 Datos recibidos para guardar:", datos);

        // Si la fecha_hora viene vacía o inválida, evitamos guardar basura en la BD
        if (!datos.fecha_hora || datos.fecha_hora.trim() === '') {
            return res.status(400).send({ "success": false, "message": "La fecha y hora son obligatorias" });
        }

        const enviarEmailNovedadLocal = async (turno, esEdicion) => {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'camilamazzaro90@gmail.com',
                        pass: 'sbbu sttl uuei kbht'        
                    }
                });

                const fechaObj = new Date(turno.fecha_hora);
                const fechaTexto = fechaObj.toLocaleString('es-AR', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                });

                const titulo = esEdicion ? "‼️ Cambio en tu Turno" : "Nuevo Turno Agendado";
                const mensajeIntro = esEdicion 
                    ? "Te informamos que hubo una <strong>modificación</strong> en los datos de tu turno."
                    : "Te informamos que se ha generado un <strong>nuevo turno</strong> a tu nombre.";

                const mailOptions = {
                    from: 'Centro de Ojos Chivilcoy <camilamazzaro90@gmail.com>',
                    to: turno.email_paciente,
                    subject: `${titulo} - Centro de Ojos`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                            <h2 style="color: #005b6f; text-align: center;">${titulo}</h2>
                            <p>Hola <strong>${turno.nombre_paciente}</strong>,</p>
                            <p>${mensajeIntro}</p>
                            
                            <div style="background-color: #e7f1ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #005b6f;">
                                <h3 style="margin-top: 0; color: #005b6f;">Detalles Actualizados:</h3>
                                <p><strong>👨‍⚕️ Profesional:</strong> ${turno.nombre_medico}</p>
                                <p><strong>📅 Fecha y Hora:</strong> ${fechaTexto} hs</p>
                                <p><strong>🏥 Lugar:</strong> Centro de Ojos Chivilcoy</p>
                            </div>

                            <p style="font-size: 14px; color: #666;">Si no realizaste esta solicitud o tienes dudas, por favor comunícate con nosotros.</p>
                            <hr>
                            <p style="text-align: center; font-size: 12px; color: #777;">Sistema de Turnos Automático</p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`📧 Notificación enviada a ${turno.email_paciente}`);
            } catch (error) {
                console.error("❌ Error enviando mail:", error);
            }
        };

        turnoModel.guardarTurno(datos, (result) => {
            if (!result) {
                return res.status(500).send({ "success": false, "message": "Error al guardar en BD" });
            }

            const idTurno = (datos.id && datos.id != 0) ? datos.id : result.insertId;
            const esEdicion = (datos.id && datos.id != 0);

            // Buscamos detalles para el mail
            turnoModel.obtenerDetalleTurno(idTurno, (err, turnoDetalle) => {
                if (!err && turnoDetalle && turnoDetalle.email_paciente) {
                    enviarEmailNovedadLocal(turnoDetalle, esEdicion); 
                }
                
                res.send({
                    "success": true,
                    "message": "Turno guardado correctamente"
                });
            });
        });
    }


    // Función para agregar el nuevo turno (Vista)
    // Función para agregar o editar turno (Vista)
    async agregarTurno(req, res) {
        
        // 1. Detectar si es Edición (ID > 0) o Alta (ID 0)
        // El router suele ser: router.get('/turnos/agregar/:id', ...)
        const idParam = req.params.id || 0; 

        let turno = {
            id: idParam, // Si viene del calendario, este será el ID del turno "Libre"
            id_medico: '',
            id_paciente: '',
            id_practica: '',
            fecha_hora: new Date(),
            id_estadoTurno: ''
        };

        // 2. CAPTURA DE DATOS DESDE EL CALENDARIO (Query Params)
        if (req.query.medico) {
            turno.id_medico = req.query.medico; // Guardamos el ID del médico
        }

        if (req.query.fecha && req.query.hora) {
            const fechaMoment = moment(`${req.query.fecha} ${req.query.hora}`, "YYYY-MM-DD HH:mm");
            if (fechaMoment.isValid()) {
                turno.fecha_hora = fechaMoment.toDate();
            }
        }

        // 3. Si tenemos un ID válido (click desde calendario en turno existente), 
        // buscamos ese turno en la BD para asegurar que los datos sean reales.
        if (idParam > 0) {
            await new Promise((resolve) => {
                // Reutilizamos tu modelo 'obtenerTurno' o similar
                // Nota: Esto sobreescribirá lo de arriba si la BD tiene datos, lo cual es correcto.
                turnoModel.obtenerTurno(idParam, (result) => {
                    if (result) {
                        turno = result; 
                        // Si venía fecha/hora nueva por URL (reprogramación), podrías priorizarla aquí si quisieras
                    }
                    resolve();
                });
            });
        }

        // 4. Carga de listas (Pacientes, Médicos, etc)
        Promise.all([
            new Promise((resolve) => {
                const limit = req.query.limit || 10;
                const offset = req.query.offset || 0;
                pacienteModel.listarPacientes(limit, offset, {}, (pacientes) => resolve(pacientes));
            }),
            new Promise((resolve) => {
                medicoModel.listarMedicos((medicos) => resolve(medicos));
            }),
            new Promise((resolve) => {
                estadoTurnoModel.listarEstadoTurno((estado_turnos) => resolve(estado_turnos));
            }),
            new Promise((resolve) => {
                // Cargamos prácticas del médico pre-seleccionado
                if (turno.id_medico) {
                    medicoModel.obtenerPracticasPorMedico(turno.id_medico, (practicas) => resolve(practicas));
                } else {
                    resolve([]);
                }
            })
        ])
        .then(([pacientes, medicos, estado_turnos, practicas]) => {
            res.render("../views/turnos/agregarTurno", {
                title: idParam > 0 ? 'Confirmar/Editar Turno' : 'Agregar Turno',
                turno: turno, 
                pacientes: pacientes,
                medicos: medicos,
                estado_turnos: estado_turnos,
                practicas: practicas
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al cargar la información");
        });
    }
    
    // Función para cancelar turnos
    async cancelarTurno(req, res) {
        const id = req.params.id;

        turnoModel.obtenerDetalleTurno(id, (err, turno) => {
            
            turnoModel.cancelarTurno(id, (result) => {
                if (!result) {
                    return res.status(500).json({ success: false, message: "Error al cancelar el turno en BD." });
                }

                if (!err && turno && turno.email_paciente) {
                    
                    const enviarEmailCancelacion = async () => {
                        try {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'camilamazzaro90@gmail.com',
                                    pass: 'sbbu sttl uuei kbht' 
                                }
                            });

                            const fechaObj = new Date(turno.fecha_hora);
                            const fechaTexto = fechaObj.toLocaleString('es-AR', { 
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                            });

                            const mailOptions = {
                                from: 'Centro de Ojos Chivilcoy <camilamazzaro90@gmail.com>',
                                to: turno.email_paciente,
                                subject: '❌ Turno Cancelado - Centro de Ojos',
                                html: `
                                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                                        <h2 style="color: #dc3545; text-align: center;">Turno Cancelado</h2>
                                        <p>Hola <strong>${turno.nombre_paciente}</strong>,</p>
                                        <p>Te informamos que el siguiente turno ha sido <strong>cancelado</strong>:</p>
                                        
                                        <div style="background-color: #fff5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #dc3545;">
                                            <p style="margin: 5px 0;"><strong>👨‍⚕️ Profesional:</strong> ${turno.nombre_medico}</p>
                                            <p style="margin: 5px 0;"><strong>📅 Fecha original:</strong> ${fechaTexto} hs</p>
                                        </div>

                                        <p style="font-size: 14px;">Si usted no solicitó esta cancelación o desea reprogramar, por favor ingrese nuevamente al sistema o comuníquese con la secretaría.</p>
                                        <hr>
                                        <p style="text-align: center; font-size: 12px; color: #777;">Centro de Ojos Chivilcoy</p>
                                    </div>
                                `
                            };

                            await transporter.sendMail(mailOptions);
                            console.log(`📧 Mail de cancelación enviado a ${turno.email_paciente}`);

                        } catch (error) {
                            console.error("❌ Error enviando mail de cancelación:", error);
                        }
                    };

                    enviarEmailCancelacion();
                }

                res.json({ success: true, message: "Turno cancelado correctamente." }); 
            });
        });
    }
    async obtenerTurnosDisponibles(req, res) {
        const { fecha, id_medico } = req.params;

        // Obtener turnos ocupados para ese día
        const ocupados = await Turno.findAll({ where: { Fecha: fecha, id_medico: id_medico } });

        // Generar intervalos de 15 minutos
        const turnos = [];
        for (let hora = 8; hora < 18; hora += 0.25) {
            const tiempo = `${Math.floor(hora)}:${(hora % 1) * 60 === 0 ? '00' : '15'}`;
            if (!ocupados.some(turno => turno.Hora === tiempo)) {
                turnos.push(tiempo);
            }
        }

        res.json(turnos);
    }


    async reservarTurno(req, res) {
        const {
            id_turno,
            cobertura,
            nombre_apellido,
            dni,
            fecha_nacimiento,
            telefono,
            correo,
            nro_afiliado,
            id_practica,
            nombre_medico,
            fecha_turno_texto
        } = req.body;

        console.log("Datos recibidos:", req.body);

        // FUNCIÓN AUXILIAR PARA ENVIAR MAIL 
        const enviarConfirmacionEmail = async (destinatario, nombrePaciente) => {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'camilamazzaro90@gmail.com', 
                        pass: 'sbbu sttl uuei kbht'
                    }
                });

                const mailOptions = {
                    from: 'Centro de Ojos Chivilcoy <tucorreo@gmail.com>',
                    to: destinatario,
                    subject: 'Confirmación de Solicitud de Turno - Centro de Ojos',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2 style="color: #005b6f;">¡Hola ${nombrePaciente}!</h2>
                            <p>Hemos recibido tu solicitud de turno. El mismo se encuentra <strong>pendiente de confirmación</strong> por parte de nuestra secretaría.</p>
                            
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <h3>Detalles del turno:</h3>
                                <p><strong>Médico:</strong> ${nombre_medico}</p>
                                <p><strong>Fecha y Hora:</strong> ${fecha_turno_texto}</p>
                                <p><strong>Paciente:</strong> ${nombrePaciente}</p>
                            </div>

                            <p>Te enviaremos otro correo cuando tu turno haya sido confirmado definitivamente.</p>
                            <hr>
                            <p style="font-size: 12px; color: #777;">Centro de Ojos Chivilcoy</p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log("E mail enviado correctamente a " + destinatario);
            } catch (error) {
                console.error("Error enviando email:", error);
            }
        };

        // Paso 1: Verificamos si el turno está disponible
        turnoModel.obtenerTurno(id_turno, (turno) => {
            if (!turno || turno.id_paciente != null || turno.id_estado_turno != 1) {
            return res.json({
                mensaje: "El turno ya se encuentra confirmado por otra persona. Por favor seleccione otro horario."
            });
            }

            // Paso 2: Buscamos si ya existe un paciente con ese DNI
            pacienteModel.obtenerPacientePorDNI(dni, (paciente) => {
            // Construimos el objeto paciente con los campos correctos
            const pacienteObjeto = {
                nombre_apellido: nombre_apellido,
                dni,
                fecha_nacimiento,
                genero: null,       
                direccion: null,     
                telefono,
                email: correo,
                cobertura,
                nro_afiliado
            };

            // Si no existe, lo creamos
            if (!paciente) {
                pacienteModel.crearPaciente(pacienteObjeto, (datos) => {
                if (!datos || !datos.insertId) {
                    return res.json({ mensaje: "Error al crear paciente" });
                }

                const idPacienteNuevo = datos.insertId;

                // Confirmamos el turno con el paciente nuevo
                turnoModel.reservarTurno(id_turno, idPacienteNuevo, id_practica, (resultado) => {
                    if (!resultado) {
                    return res.json({ mensaje: "Error confirmando el turno. Contacte al administrador." });
                    }
                    enviarConfirmacionEmail(correo, nombre_apellido);
                    res.json({ success: true });
                });
                });

            } else {
                // Si ya existe, lo actualizamos
                pacienteModel.editarPaciente(paciente.id, pacienteObjeto)
                .then(() => {
                    // Confirmamos el turno con el paciente existente
                    turnoModel.reservarTurno(id_turno, paciente.id, id_practica, (resultado) => {
                    if (!resultado) {
                        return res.json({ mensaje: "Error confirmando el turno. Contacte al administrador." });
                    }
                    enviarConfirmacionEmail(correo, nombre_apellido);
                    res.json({ success: true });
                    });
                })
                .catch((err) => {
                    console.error("Error actualizando paciente:", err);
                    res.json({ mensaje: "Error al actualizar los datos del paciente" });
                });
            }
            });
        });
        }


    // async confirmarTurno(req, res) {
    //     const idTurno = req.params.id;
    
    //     turnoModel.obtenerTurno(idTurno, (turno) => {
    //         if (!turno || turno.id_paciente === null) {
    //             res.json({
    //                 "mensaje": "El turno no tiene asignado un paciente, por lo tanto, no se puede confirmar."
    //             });
    //             return;
    //         }
    
    //         if (turno.id_estadoTurno != 2) {
    //             res.json({
    //                 "mensaje": "El turno no se encuentra en estado reservado, por lo tanto, no se puede confirmar."
    //             });
    //             return;
    //         }
    
    //         turnoModel.confirmarTurno(idTurno, (resultado) => {
    //             if (resultado === null) {
    //                 res.json({
    //                     "mensaje": "Hubo un error al confirmar el turno. Contacte con un administrador."
    //                 });
    //             } else {
    //                 res.json({
    //                     "success": true,
    //                     "mensaje": "Turno confirmado con éxito"
    //                 });
    //             }
    //         });
    //     });
    // }
    

    async crearTurnosDesdeHorarios(req, res) {
        const { fechaDesde, fechaHasta } = req.query;

        // Hardcodeo las fechas para hacer pruebas
        //const fechaDesde = '2024-10-11';
        //const fechaHasta = '2024-11-10';

        if (!fechaDesde || !fechaHasta) {
            return res.status(400).json({ error: 'Las fechas son obligatorias' });
        }

        const dateFechaDesde = moment(fechaDesde);
        const datefechaHasta = moment(fechaHasta);
        var fechaRecorrida = dateFechaDesde;

        var turnosCreados = 0;

        while (fechaRecorrida <= datefechaHasta) {
            // En este momento fechaRecorrida va a equivaler a cada uno de los dias
            // Que hay dentro de la fecha desde y fecha hasta, ej: fechaDesde: 2024-10-11, fechaHasta: 2024-10-13
            // Fecha recorrida va a ser igual a: 2024-10-11, 2024-10-12, 2024-10-13
            const nombreDia = fechaRecorrida.format("dddd"); // Ej Friday, Saturday, etc
            const nombreDiaSpanish = diasSpanish[nombreDia]; // Ej Viernes, Sabado, etc
            let diaDelAnio = fechaRecorrida.format("YYYY-MM-DD"); // Ej: 2024-10-11

            const horarios = await horarioModel.obtenerHorariosPorDia(nombreDiaSpanish);
            // Recorremos todos los horarios disponibles que haya en ese dia: ej Lunes hay horario de 10:00 a 13:00
            for (let horario of horarios) {

                // Excluir el id_medico = 1(esteban que trabaja por orden de llegada)
                // if (horario.id_medico === 1) {
                //     continue; // Salta la iteración al siguiente horario si el id_medico es 1
                // }

                let horarioDeInicio = moment(`${diaDelAnio} ${horario.hora_inicio}`);
                let horarioDeFin = moment(`${diaDelAnio} ${horario.hora_fin}`);
                let horaRecorrida = horarioDeInicio;

                // Conseguimos todos los turnos que haya cada 15 minutos de cada horario
                // Ej. si horarioDeInicio es 2024-10-11 10:00:00 y horarioDeFin es 2024-10-11 11:00:00
                // Conseguimos 2024-10-11 10:15:00, 2024-10-11 10:30:00, 2024-10-11 10:45:00
                while (horaRecorrida < horarioDeFin) {
                    let fechaFormatoYmdHis = horaRecorrida.format("YYYY-MM-DD HH:mm:ss"); // Ej: 2024-10-11 10:15:00

                    // Como este script se puede ejecutar infinitas veces, tenemos que ver que ya no haya un turno creado
                    // Para esa fecha, para ese horario, y para ese medico...
                    let existeTurnoParaEsaFechaYhora = await turnoModel.obtenerTurnoPorMedicoYFecha(
                        horario.id_medico, 
                        fechaFormatoYmdHis
                    );

                    // Si no existe el turno para esa fecha, lo creamos
                    // Si ya existe, no hacemos nada para evitar errores
                    if (existeTurnoParaEsaFechaYhora.length == 0) {
                        console.log(`creando turno para fecha ${fechaFormatoYmdHis} para medico ${horario.id_medico}`);
                        // Objeto para el nuevo turno
                        let nuevoTurno = {
                            id: 0,
                            id_paciente: null,
                            id_medico: horario.id_medico,
                            fecha_hora: fechaFormatoYmdHis,
                            id_estadoTurno: 1
                        };

                        turnoModel.guardarTurno(nuevoTurno, (turno) => {
                            turnosCreados++;
                        });
                    }

                    horaRecorrida.add(15, 'minutes');
                }
            }
            // Aumentamos un día a fechaRecorrida para que siga el ciclo
            fechaRecorrida = moment(fechaRecorrida).add(1, 'days');
        }

        res.json({
            "error": 0,
            "turnosCreados": turnosCreados
        })
    }

    async listarTurnosMedico(req, res) {
        const medicoId = req.params.idMedico; // Supongo que el ID del médico llega como parámetro en la URL
        let { buscar, page = 1, limit = 15 } = req.query;
    
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 15;
    
        const offset = (page - 1) * limit;
        let filtro = ''; // Inicializamos el filtro vacío
    
        // Agrega condiciones de búsqueda si se proporciona una palabra clave
        if (buscar) {
            filtro = `
                pacientes.nombre LIKE '%${buscar}%' 
                OR usuarios.nombre LIKE '%${buscar}%' 
                OR pacientes.dni LIKE '%${buscar}%'
            `;
        }
    
        // Llamamos al modelo para listar turnos de un solo médico
        turnoModel.listarTurnosPorMedico(medicoId, filtro, limit, offset, (turnos, total) => {
            if (!turnos || turnos.length === 0) {
                console.log("No se encontraron turnos para el médico especificado.");
            }
    
            const totalPages = Math.ceil(total / limit);
    
            res.render("../views/turnos/turnosMedicoIndividual", {
                turno: turnos,
                currentPage: page,
                totalPages: totalPages,
                buscar: buscar || '',
                medicoId: medicoId, // Pasamos el ID del médico a la vista en caso de que sea necesario
                limit: limit 
            });
        });
    }

    async obtenerPracticasPorMedico(req, res) {
        const id_medico = req.params.id_medico;
        medicoModel.obtenerPracticasPorMedico(id_medico, (practicas) => {
            if (practicas.length > 0) {
                res.json(practicas); // Envía las prácticas como respuesta JSON
            } else {
                res.status(404).json({ error: "No se encontraron prácticas para este médico" });
            }
        });
    }
    
};

//exporto el controller con la funcion de listar
module.exports = TurnoController;