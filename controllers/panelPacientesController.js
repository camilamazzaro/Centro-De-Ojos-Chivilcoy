const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();
const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();
const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();
const UsuarioModel = require('../models/usuariosModel');
const usuarioModel = new UsuarioModel();
const RecetaModel = require('../models/recetaModel');
const recetaModel = new RecetaModel();

const bcrypt = require('bcrypt'); 
const moment = require('moment');

class PanelPacientesController {

    async mostrarPanelPacientes(req, res) {
        try {
            const idPaciente = req.session.idPaciente;
            if (!idPaciente) return res.redirect('/loginPacientes');

            console.log("⏳ Cargando panel para paciente:", idPaciente);

            // 1. Carga en Paralelo (Turnos y Recetas)
            const [todosLosTurnos, recetas] = await Promise.all([
                new Promise((resolve) => {
                    turnoModel.listarTurnosPorPaciente(idPaciente, (result) => resolve(result || []));
                }),
                recetaModel.listarPorPaciente(idPaciente).catch(() => [])
            ]);

            // 2. Procesar Próximo Turno (Tarjeta Destacada)
            const ahora = new Date();
            let proximoTurno = null;

            // Buscamos el primer turno futuro confirmado/reservado
            const indexProximo = todosLosTurnos.findIndex(t => {
                const fechaTurno = new Date(t.fecha_hora);
                return fechaTurno > ahora && (t.id_estado_turno === 2 || t.id_estado_turno === 3);
            });

            if (indexProximo !== -1) {
                proximoTurno = todosLosTurnos[indexProximo];
            }

            // 3. Historial Completo
            // CAMBIO: Ya NO filtramos el próximo turno. Mostramos TODO en la tabla.
            // Si quieres ocultarlo de la tabla, descomenta la linea de abajo.
            let historialTurnos = todosLosTurnos; 
            // historialTurnos = todosLosTurnos.filter((t, index) => index !== indexProximo);

            // Ordenamos: Los más recientes primero
            historialTurnos.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

            res.render('panel/panelPacientes', { 
                title: 'Mi Panel',
                proximoTurno: proximoTurno,       
                historialTurnos: historialTurnos, 
                ultimasRecetas: recetas.slice(0, 3),   
                
                // Datos de sesión para la barra lateral
                usuario: { 
                    nombre: req.session.nombre, 
                    email: req.session.email 
                },
                // Variables sueltas por si la barra lateral las usa así
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email
            });

        } catch (error) {
            console.error('🔥 Error en panel:', error);
            res.status(500).send("Error al cargar el panel.");
        }
    }

    async pacienteTurnos(req, res) {
        try {
            const idPaciente = req.session.idPaciente;

            if (!idPaciente) return res.redirect('/loginPacientes');

            const turnos = await turnoModel.obtenerPorPaciente(idPaciente);

            res.render('pacientes/pacienteTurnos', {
                title: 'Mis Turnos',
                user: { 
                    nombre: req.session.nombre,
                    email: req.session.email
                },
                // FORZAMOS EL ENVÍO DE DATOS
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email,
                turnos: turnos,
                moment: moment
            });
        } catch (error) {
            console.error(error);
            res.render('pacientes/pacienteTurnos', {
                title: 'Mis Turnos',
                user: { nombre: req.session.nombre, email: req.session.email },
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email,
                turnos: [],
                error: 'Error al cargar los turnos.',
                moment: moment
            });
        }
    }

    async nuevoTurno(req, res) {
        try {
            const idPaciente = req.session.idPaciente;

            if (!idPaciente) return res.redirect('/loginPacientes');

            turnoModel.obtenerPerfil(idPaciente, (datosPaciente) => {
                pacienteModel.obtenerObrasSociales((obrasSociales) => {
                    res.render('pacientes/pacienteNuevoTurno', {
                        title: 'Solicitar Nuevo Turno',
                        user: {
                            nombre: req.session.nombre,
                            email: req.session.email
                        },
                        // FORZAMOS EL ENVÍO DE DATOS
                        nombreUsuario: req.session.nombre,
                        emailUsuario: req.session.email,
                        paciente: datosPaciente, 
                        obras_sociales: obrasSociales || []
                    });
                });
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Error al cargar el formulario');
        }
    }

    async obtenerDisponibilidad(req, res) {
        try {
            medicoModel.obtenerMedicosConTurnosPorFiltros(req.body, (medicos) => {
                res.json(medicos); 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar disponibilidad' });
        }
    }

    async reservarTurno(req, res) {
        try {
            const idPaciente = req.session.idPaciente;
            const { id_turno, id_practica } = req.body;

            if (!id_turno) return res.json({ success: false, mensaje: "Error: No se seleccionó un turno." });

            turnoModel.obtenerTurno(id_turno, (turno) => {
                if (!turno || turno.id_paciente != null || turno.id_estado_turno != 1) {
                    return res.json({ success: false, mensaje: "El turno ya no está disponible." });
                }

                turnoModel.reservarTurno(id_turno, idPaciente, id_practica || null, (resultado) => {
                    if (resultado) {
                        res.json({ success: true });
                    } else {
                        res.json({ success: false, mensaje: "Error al guardar en base de datos." });
                    }
                });
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
        }
    }
    
    async miPerfil(req, res) {
        try {
            res.render('pacientes/perfilPaciente', {
                title: 'Mi Perfil',
                user: { 
                    id: req.session.idUsuario,
                    nombre: req.session.nombre,
                    email: req.session.email,
                    id_paciente: req.session.idPaciente
                },
                // --- AQUÍ ESTABA EL PROBLEMA ---
                // Pasamos las variables con los nombres que espera tu app.js/sidebar
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email,
                usuario: { 
                    nombre: req.session.nombre, 
                    email: req.session.email 
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el perfil');
        }
    }

    async actualizarDatosUsuario(req, res) {
        try {
            const idUsuario = req.session.idUsuario;
            const idPaciente = req.session.idPaciente; 
            const { nombre, email } = req.body;

            if (!nombre || !email) {
                return res.json({ success: false, mensaje: 'Todos los campos son obligatorios.' });
            }

            await usuarioModel.actualizarDatosSimples(idUsuario, nombre, email);

            if (idPaciente) {
                await pacienteModel.actualizarDatosBasicos(idPaciente, nombre, email);
            }

            req.session.nombre = nombre;
            req.session.email = email;
            
            req.session.save(err => {
                if (err) console.error("Error guardando sesión", err);
                res.json({ success: true, mensaje: 'Datos actualizados correctamente.' });
            });

        } catch (error) {
            console.error('Error al actualizar datos:', error);
            res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
        }
    }

    async cambiarPassword(req, res) {
        try {
            const idUsuario = req.session.idUsuario;
            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.json({ success: false, mensaje: 'Las contraseñas nuevas no coinciden.' });
            }

            if (newPassword.length < 6) {
                return res.json({ success: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
            }

            const esCorrecta = await usuarioModel.verificarPassword(idUsuario, currentPassword);

            if (!esCorrecta) {
                return res.json({ success: false, mensaje: 'La contraseña actual es incorrecta.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await usuarioModel.actualizarPassword(idUsuario, hashedPassword, (err, result) => {
                if (err) throw err;
                res.json({ success: true, mensaje: 'Contraseña actualizada con éxito.' });
            });

        } catch (error) {
            console.error('Error al cambiar password:', error);
            res.status(500).json({ success: false, mensaje: 'Error interno al procesar la solicitud.' });
        }
    }

    async misRecetas(req, res) {
        try {
            const idPaciente = req.session.idPaciente;

            if (!idPaciente) return res.redirect('/loginPacientes');

            const recetas = await recetaModel.listarPorPaciente(idPaciente);

            res.render('pacientes/pacienteRecetas', {
                title: 'Mis Recetas',
                user: {
                    nombre: req.session.nombre,
                    email: req.session.email
                },
                recetas: recetas,
                // --- AQUÍ TAMBIÉN AGREGAMOS LOS DATOS ---
                nombreUsuario: req.session.nombre,
                emailUsuario: req.session.email,
                usuario: { 
                    nombre: req.session.nombre, 
                    email: req.session.email 
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar las recetas.');
        }
    }
}

module.exports = PanelPacientesController;