const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

const moment = require('moment');
const nodemailer = require('nodemailer');

class PanelSecretariaController {

    // Mostrar panel general
    mostrarPanelGeneral(req, res) {

        try {
            // Llamar a listarMedicos, obtenerObrasSociales y listarTurnos en paralelo
            const listarMedicosPromise = new Promise((resolve, reject) => {
                medicoModel.listarMedicos((medicos) => {
                    if (medicos) {
                        resolve(medicos);
                    } else {
                        reject('Error al listar médicos');
                    }
                });
            });

            const obtenerObrasSocialesPromise = new Promise((resolve, reject) => {
                pacienteModel.obtenerObrasSociales((obrasSociales) => {
                    if (obrasSociales) {
                        resolve(obrasSociales);
                    } else {
                        reject('Error al obtener obras sociales');
                    }
                });
            });

            const listarTurnosPromise = new Promise((resolve, reject) => {
                turnoModel.listarTurnos('', 15, 0, (turnos, total) => {
                    if (turnos) {
                        resolve({turnos, total});
                    } else {
                        reject('Error al listar turnos');
                    }
                });
            });
            
            const listarReservadosPromise = new Promise((resolve, reject) => {
                turnoModel.obtenerTurnosReservados((resultados) => {
                    resolve(resultados || []); 
                });
            });

            // Ejecutar todas las promesas en paralelo
            Promise.all([listarMedicosPromise, obtenerObrasSocialesPromise, listarTurnosPromise, listarReservadosPromise])
                .then(([medicos, obrasSociales, {turnos, total}, turnosReservados]) => {
                    
                    res.render('panel/panelSecretarias', {
                        title: 'Panel General Secretarias',
                        medicos: medicos,
                        obrasSociales: obrasSociales,
                        turnos: turnos,
                        totalTurnos: total,
                        turnosReservados: turnosReservados || []
                    });
                })
                .catch(error => {
                    console.error('Error al obtener datos para la página de panel secretarias:', error);
                    res.status(500).send('Error al cargar el panel de secretarias');
                });

        } catch (error) {
            console.error('Error al obtener datos para la página de panel secretarias:', error);
            res.status(500).send('Error al cargar el panel de secretarias');
        }
    }

    async confirmarTurno(req, res) {
        const idTurno = req.params.id;

        try {
            // 1. Actualizar estado en la BD
            await new Promise((resolve, reject) => {
                turnoModel.cambiarEstado(idTurno, 3, (err, result) => {
                    if (err) reject(new Error("Error al actualizar estado en BD: " + err.message));
                    else resolve(result);
                });
            });

            // 2. Obtener datos del turno para el mail
            const turno = await new Promise((resolve, reject) => {
                turnoModel.obtenerDetalleTurno(idTurno, (err, data) => {
                    if (err) reject(new Error("Error al obtener datos: " + err.message));
                    else resolve(data);
                });
            });

            // Validación
            if (!turno || !turno.email_paciente) {
                console.warn("Turno confirmado, pero faltan datos para el mail.");
                return res.json({ success: true, message: "Turno confirmado (Sin mail)" });
            }

            // 3. ENVÍO DE MAIL (Directo aquí para evitar errores de 'this')
            (async () => {
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
                        subject: '✅ Turno Confirmado - Centro de Ojos',
                        html: `
                            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                                <h2 style="color: #005b6f; text-align: center;">¡Turno Confirmado!</h2>
                                <p>Hola <strong>${turno.nombre_paciente}</strong>,</p>
                                <p>Tu turno ha sido confirmado exitosamente.</p>
                                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #005b6f; margin: 20px 0;">
                                    <p><strong>👨‍⚕️ Profesional:</strong> ${turno.nombre_medico}</p>
                                    <p><strong>📅 Fecha:</strong> ${fechaTexto} hs</p>
                                    <p><strong>📍 Lugar:</strong> Centro de Ojos Chivilcoy</p>
                                </div>
                                <hr>
                                <p style="font-size: 12px; color: #777; text-align: center;">Por favor no responder a este correo.</p>
                            </div>
                        `
                    };

                    await transporter.sendMail(mailOptions);
                    console.log(`📧 Email enviado exitosamente a: ${turno.email_paciente}`);
                } catch (errorMail) {
                    console.error("❌ Error enviando mail:", errorMail);
                }
            })(); // Ejecución inmediata de la función asíncrona

            // 4. Responder al cliente inmediatamente
            res.json({ success: true, message: "Turno confirmado y procesando envío de mail." });

        } catch (error) {
            console.error("🔥 Error crítico en confirmarTurno:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    mostrarCalendario (req, res){
        medicoModel.listarMedicos((medicos) =>{
            res.render('panel/calendarioSecretarias', {
                title: 'Calendario de Médicos',
                medicos: medicos
            });
        });
    }


    obtenerTurnosCalendarioMedicos(req, res) {
    let fechaInicio = req.query.start;
    let fechaFin = req.query.end;
    let idUsuario = req.session.idUsuario;
    let categoriaUsuario = req.session.categoria;
    let medicos = req.query.medicos ? req.query.medicos.split(',') : [];
    let estado = req.query.estado || '3'; // Por defecto mostrar confirmados

    const filtroInicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm:ss");
    const filtroFin = moment(fechaFin).format("YYYY-MM-DD HH:mm:ss");

    turnoModel.seleccionarTurnosCalendario(idUsuario, categoriaUsuario, medicos, estado, filtroInicio, filtroFin, (turnos) => {
        if (turnos) {
            res.json(turnos);
        } else {
            res.status(500).json({ error: "Error al obtener los turnos" });
        }
    });
}
}

module.exports = PanelSecretariaController;
