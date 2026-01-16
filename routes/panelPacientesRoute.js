const express = require('express');
const router = express.Router();

const PanelPacientesController = require('../controllers/panelPacientesController');
const panelPacientesController = new PanelPacientesController();

const sessionData = require('../middleware/sessionData');

router.use(sessionData);


router.get('/panelPacientes', panelPacientesController.mostrarPanelPacientes);
router.get('/panelPacientes/turnos', panelPacientesController.pacienteTurnos);

//PANEL PACIENTES-TURNOS
router.get('/panelPacientes/nuevo-turno', panelPacientesController.nuevoTurno);
router.post('/panelPacientes/api/disponibilidad', panelPacientesController.obtenerDisponibilidad);
router.post('/panelPacientes/reservar', panelPacientesController.reservarTurno);

//PANEL PACIENTES-PERFIL
router.get('/panelPacientes/perfil', panelPacientesController.miPerfil);

router.post('/panelPacientes/perfil/actualizarDatos', panelPacientesController.actualizarDatosUsuario);

router.post('/panelPacientes/perfil/cambiarPassword', panelPacientesController.cambiarPassword);

router.get('/panelPacientes/recetas', panelPacientesController.misRecetas);

module.exports = router;