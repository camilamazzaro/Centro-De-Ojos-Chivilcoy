const TurnoModel = require('../models/turnoModel');
const RecetaModel = require('../models/recetaModel');
const MedicoModel = require('../models/medicoModel');
const PacienteModel = require('../models/pacienteModel')
const moment = require('moment');
const nodemailer = require('nodemailer'); // Necesario para confirmar turno

const turnoModel = new TurnoModel();
const recetaModel = new RecetaModel();
const medicoModel = new MedicoModel();
const pacienteModel = new PacienteModel();

class PanelMedicosController {

    // 1. PANEL GENERAL (DASHBOARD)
    async mostrarPanelGeneral(req, res) {
        try {
            const idMedico = req.session.idMedico; 
            
            if (!idMedico) return res.redirect('/login');

            const hoyInicio = moment().format('YYYY-MM-DD 00:00:00');
            const hoyFin = moment().format('YYYY-MM-DD 23:59:59');

            console.log("👨‍⚕️ Cargando panel para Médico ID:", idMedico);

            const [turnosHoy, ultimasRecetas, medicos, proximosTurnos] = await Promise.all([
                new Promise(resolve => {
                    const sql = `
                        SELECT t.*, p.nombre as nombre_paciente, p.dni, p.id as id_paciente, pr.nombre as nombre_practica
                        FROM turnos t
                        JOIN pacientes p ON t.id_paciente = p.id
                        LEFT JOIN practicas pr ON t.id_practica = pr.id
                        WHERE t.id_medico = ? 
                        AND t.fecha_hora BETWEEN ? AND ?
                        AND t.id_estado_turno IN (2, 3, 4) 
                        ORDER BY t.fecha_hora ASC
                    `;
                    // IMPORTANTE: Ajusta 'require' si usas 'conx' global o pool
                    require('../database/db').query(sql, [idMedico, hoyInicio, hoyFin], (err, results) => {
                        if(err) console.error(err);
                        resolve(results || []);
                    });
                }),
                new Promise(resolve => {
                    const sql = `
                        SELECT r.*, p.nombre as nombre_paciente
                        FROM recetas r
                        JOIN pacientes p ON r.id_paciente = p.id
                        WHERE r.id_medico = ?
                        ORDER BY r.created_at DESC LIMIT 5
                    `;
                    require('../database/db').query(sql, [idMedico], (err, results) => {
                        resolve(results || []);
                    });
                }),
                new Promise(resolve => {
                    medicoModel.listarMedicos(medicos => resolve(medicos || []));
                }),
                new Promise(resolve => {
                    turnoModel.listarProximosTurnos(idMedico, 10, (resultados) => {
                        resolve(resultados || []);
                    });
                })
            ]);

            const ahora = new Date();
            const proximoPaciente = turnosHoy.find(t => {
                return new Date(t.fecha_hora) > ahora && (t.id_estado_turno === 2 || t.id_estado_turno === 3);
            });

            res.render('panel/panelMedicos', {
                title: 'Portal Médico',
                usuario: {
                    nombre: req.session.nombre,
                    email: req.session.email,
                    foto: req.session.foto || 'default.jpg' 
                },
                turnosHoy: turnosHoy,
                proximoPaciente: proximoPaciente,
                ultimasRecetas: ultimasRecetas,
                proximosTurnos: proximosTurnos,
                stats: {
                    totalHoy: turnosHoy.length,
                    atendidos: turnosHoy.filter(t => t.id_estado_turno === 4).length
                },
                medicos: medicos, 
                obrasSociales: []
            });

        } catch (error) {
            console.error('🔥 Error en Panel Médicos:', error);
            res.status(500).send("Error al cargar el panel.");
        }
    }

    // 2. MOSTRAR VISTA DEL CALENDARIO (Faltaba esta función)
    mostrarCalendario(req, res) {
        // Validación de seguridad extra
        if (!req.session.idMedico) return res.redirect('/login');

        res.render('panel/calendarioMedico', { 
            title: 'Mi Agenda',
            idMedico: req.session.idMedico, // Esto es lo importante
            
            // Datos para la barra lateral
            usuario: { 
                nombre: req.session.nombre, 
                email: req.session.email 
            },
            nombreUsuario: req.session.nombre,
            emailUsuario: req.session.email,
            categoria: req.session.categoria
        });
    }

    // 3. DATOS JSON PARA FULLCALENDAR (Faltaba esta función)
    obtenerTurnosCalendarioMedicos(req, res) {
        let fechaInicio = req.query.start;
        let fechaFin = req.query.end;
        let estado = req.query.estado || 'todos';

        // 1. OBTENER ID CON VALIDACIÓN
        const idMedicoLogueado = req.session.idMedico;
        
        console.log(`📅 [CALENDARIO] Solicitud de turnos.`);
        console.log(`   - Médico ID: ${idMedicoLogueado}`);
        console.log(`   - Fechas: ${fechaInicio} a ${fechaFin}`);

        // Si no hay ID, devolvemos array vacío (no error 500) para no romper el calendario
        if (!idMedicoLogueado) {
            console.error("⛔ [CALENDARIO] Error: No hay ID de médico en sesión.");
            return res.json([]); 
        }

        const medicosParaModelo = [idMedicoLogueado]; 

        const filtroInicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm:ss");
        const filtroFin = moment(fechaFin).format("YYYY-MM-DD HH:mm:ss");

        turnoModel.seleccionarTurnosCalendario(medicosParaModelo, estado, filtroInicio, filtroFin, (turnos) => {
            if (turnos) {
                console.log(`✅ [CALENDARIO] Turnos encontrados: ${turnos.length}`);
                
                const eventos = turnos.map(turno => {
                    let colorFondo = '#3788d8'; 
                    let colorTexto = '#ffffff';
                    const estadoID = parseInt(turno.id_estado_turno);

                    switch (estadoID) {
                        case 1: colorFondo = '#198754'; break; 
                        case 2: colorFondo = '#ffc107'; colorTexto = '#000000'; break; 
                        case 3: colorFondo = '#0d6efd'; break; 
                        case 4: colorFondo = '#6c757d'; break; 
                    }

                    const apellidoMedico = turno.medico_nombre ? turno.medico_nombre.split(' ').pop() : 'Médico';

                    return {
                        id: turno.id,
                        title: apellidoMedico, 
                        start: moment(turno.fecha_hora).format("YYYY-MM-DD HH:mm:ss"),
                        end: moment(turno.fecha_hora).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
                        color: colorFondo,
                        textColor: colorTexto,
                        extendedProps: {
                            pacienteNombre: turno.paciente_nombre || 'Sin paciente',
                            nombreMedico: turno.medico_nombre || 'Sin médico',
                            estadoTurno: estadoID,
                            medicoId: turno.id_medico,
                            idPaciente: turno.id_paciente
                        }
                    };
                });
                res.json(eventos);
            } else {
                // Si el modelo devuelve null (error SQL), devolvemos array vacío para que el frontend no muestre error rojo
                console.error("❌ [CALENDARIO] Error en consulta SQL");
                res.json([]); 
            }
        });
    }
    // 4. CONFIRMAR TURNO (Faltaba esta función)
    async confirmarTurno(req, res) {
        const idTurno = req.params.id;

        try {
            await new Promise((resolve, reject) => {
                turnoModel.cambiarEstado(idTurno, 3, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            // Lógica de envío de mail simplificada
            turnoModel.obtenerDetalleTurno(idTurno, async (err, turno) => {
                if (!err && turno && turno.email_paciente) {
                    try {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'camilamazzaro90@gmail.com',
                                pass: 'sbbu sttl uuei kbht'
                            }
                        });
                        // ... Configuración del mail ...
                        // (Puedes copiar el envío de mail completo si lo necesitas aquí)
                    } catch (e) {
                        console.error("Error envío mail:", e);
                    }
                }
            });

            res.json({ success: true, message: "Turno confirmado" });

        } catch (error) {
            console.error("Error al confirmar:", error);
            res.status(500).json({ success: false, message: "Error interno" });
        }
    }

    mostrarMisRecetas(req, res) {
        const idMedico = req.session.idMedico;
        
        if (!idMedico) return res.redirect('/login');

        recetaModel.listarTodasPorMedico(idMedico, (recetas) => {
            res.render('panel/recetasMedicos', {
                title: 'Mis Recetas',
                recetas: recetas,
                
                // Datos de sesión para la barra lateral
                usuario: {
                    nombre: req.session.nombre,
                    email: req.session.email
                },
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email,
                categoria: req.session.categoria
            });
        });
    }

    mostrarFormularioReceta(req, res) {
        const idMedico = req.session.idMedico;
        if (!idMedico) return res.redirect('/login');

        // Obtenemos la lista de pacientes para el buscador
        pacienteModel.listarPacientes(1000, 0, {}, (pacientes) => {
            res.render('panel/nuevaReceta', {
                title: 'Nueva Receta',
                pacientes: pacientes,
                idMedico: idMedico,
                fechaHoy: new Date().toISOString().split('T')[0], // Para el input date
                
                usuario: {
                    nombre: req.session.nombre,
                    email: req.session.email
                },
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email,
                categoria: req.session.categoria
            });
        });
    }

    // 7. GUARDAR LA RECETA (POST)
    guardarReceta(req, res) {
        const idMedico = req.session.idMedico;
        if (!idMedico) return res.status(401).json({ error: 'No autorizado' });

        const datos = {
            id_medico: idMedico,
            id_paciente: req.body.id_paciente,
            fecha: req.body.fecha,
            tratamiento: req.body.tratamiento,
            diagnostico: req.body.diagnostico,
            indicaciones: req.body.indicaciones,
            comentarios: req.body.comentarios,
            copias: req.body.copias || 'sin',
            formato_pdf: req.body.formato_pdf || 'A4'
        };

        recetaModel.crearReceta(datos, (insertId) => {
            if (insertId) {
                res.json({ success: true, message: 'Receta generada con éxito' });
            } else {
                res.status(500).json({ success: false, message: 'Error al guardar la receta' });
            }
        });
    }

}

module.exports = PanelMedicosController;