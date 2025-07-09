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

    //funcion para agregar turnos
    async guardarTurno(req, res){
        const datos = req.body;
        console.log(datos);
        turnoModel.guardarTurno(datos, (result)=>{
            res.send({
                "success": true,
            });
        });
        console.log("Datos recibidos:", datos);

    }

    //Funcion para agregar el nuevo turno
    async agregarTurno(req, res) {
        let turno = {
            id_medico: '',
            id_paciente: '',
            id_practica: '',
            fecha_hora: '',
            id_estadoTurno: ''
        };
        
        //para obtener los médicos y pacientes
        Promise.all([
            new Promise((resolve, reject) => {
                const limit = req.query.limit || 10; 
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
                if(turno.id_medico) {
                    medicoModel.obtenerPracticasPorMedico(turno.id_medico, (practicas) => {
                        resolve(practicas);
                    });
                } else {
                    resolve([]);  // Si no hay id_medico, devolvemos un array vacío
                }
            })
        ])
        .then(([pacientes, medicos, estado_turnos, practicas]) => {
            res.render("../views/turnos/agregarTurno", {
                turno: {
                    id: 0,
                    id_medico: '',
                    id_paciente: '',
                    id_practica: '',
                    fecha_hora: '',
                    id_estadoTurno: ''
                }, 
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
    
    //funcion para cancelar turnos
    async cancelarTurno(req, res) {
        const id = req.params.id;
        turnoModel.cancelarTurno(id, (result) => {
            if (!result) {
                return res.status(500).send("Error al cancelar el turno.");
            } else {
            res.redirect('/turnos'); // Redirige a la lista de turnos tras cancelar el turno
            }
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
            id_practica
        } = req.body;

        console.log("Datos recibidos:", req.body);

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


    async confirmarTurno(req, res) {
        const idTurno = req.params.id;
    
        turnoModel.obtenerTurno(idTurno, (turno) => {
            if (!turno || turno.id_paciente === null) {
                res.json({
                    "mensaje": "El turno no tiene asignado un paciente, por lo tanto, no se puede confirmar."
                });
                return;
            }
    
            if (turno.id_estadoTurno != 2) {
                res.json({
                    "mensaje": "El turno no se encuentra en estado reservado, por lo tanto, no se puede confirmar."
                });
                return;
            }
    
            turnoModel.confirmarTurno(idTurno, (resultado) => {
                if (resultado === null) {
                    res.json({
                        "mensaje": "Hubo un error al confirmar el turno. Contacte con un administrador."
                    });
                } else {
                    res.json({
                        "success": true,
                        "mensaje": "Turno confirmado con éxito"
                    });
                }
            });
        });
    }
    

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