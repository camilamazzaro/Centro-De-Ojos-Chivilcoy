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



class PanelPacientesController{

    async mostrarPanelPacientes(req, res) {
        try {
            const idPaciente = req.session.usuario.id_paciente;

            const turnos = await turnoModel.listarTurnosPaciente(idPaciente);

            res.render('panel/panelPacientes', {
                title: 'Panel del Paciente',
                turnos, 
            });
        } catch (error) {
            console.error('Error al listar los turnos:', error);
            res.render('panel/panelPacientes', {
                title: 'Panel del Paciente',
                turnos: [],
                error: 'No se pudieron cargar los turnos',
            });
        }
    }

    async pacienteTurnos(req, res) {
        try {
            if (!req.session.usuario) {
                return res.redirect('/loginPacientes');
            }

            const idPaciente = req.session.usuario.id_paciente; 

            const turnos = await turnoModel.obtenerPorPaciente(idPaciente);

            res.render('pacientes/pacienteTurnos', {
                title: 'Mis Turnos',
                user: req.session.usuario,
                nombreUsuario: req.session.usuario.nombre,
                emailUsuario: req.session.usuario.email,
                turnos: turnos,
                moment: moment
            });
        } catch (error) {
            console.error(error);
            res.render('panel/pacienteTurnos', {
                title: 'Mis Turnos',
                user: req.session.usuario || {},
                nombreUsuario: req.session.usuario?.nombre || 'Invitado',
                emailUsuario: req.session.usuario?.email || '',
                turnos: [],
                error: 'Error al cargar los turnos.',
                moment: moment
            });
        }
    }

    async nuevoTurno(req, res) {
        try {
            if (!req.session.usuario) {
                return res.redirect('/loginPacientes');
            }

            const idPaciente = req.session.usuario.id_paciente;

            turnoModel.obtenerPerfil(idPaciente, (datosPaciente) => {
                
                pacienteModel.obtenerObrasSociales((obrasSociales) => {

                    res.render('pacientes/pacienteNuevoTurno', {
                        title: 'Solicitar Nuevo Turno',
                        user: req.session.usuario,
                        
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
            const idPaciente = req.session.usuario.id_paciente;
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
                user: req.session.usuario 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el perfil');
        }
    }

    async actualizarDatosUsuario(req, res) {
        try {
            const idUsuario = req.session.usuario.id;
            const idPaciente = req.session.usuario.id_paciente; 
            const { nombre, email } = req.body;

            if (!nombre || !email) {
                return res.json({ success: false, mensaje: 'Todos los campos son obligatorios.' });
            }

            // Actualizo ambas tablas (usuarios y pacientes)
            await usuarioModel.actualizarDatosSimples(idUsuario, nombre, email);

            if (idPaciente) {
                await pacienteModel.actualizarDatosBasicos(idPaciente, nombre, email);
            }

            // Actualizo la sesión para que se vea reflejado en la web
            req.session.usuario.nombre = nombre;
            req.session.usuario.email = email;
            
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
            const idUsuario = req.session.usuario.id;
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
            const idPaciente = req.session.usuario.id_paciente;

            const recetas = await recetaModel.listarPorPaciente(idPaciente);

            res.render('pacientes/pacienteRecetas', {
                title: 'Mis Recetas',
                user: req.session.usuario, 
                recetas: recetas
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar las recetas.');
        }
    }
}

module.exports = PanelPacientesController;