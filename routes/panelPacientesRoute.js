const express = require('express');
const router = express.Router();

const PanelPacientesController = require('../controllers/panelPacientesController');
const panelPacientesController = new PanelPacientesController();

const sessionData = require('../middleware/sessionData');

router.use(sessionData);

const autenticar = require('../middleware/autenticacion')([4]);


// roles permitidos para este módulo
// const ROLES = [4]; 
// router.use(auth(ROLES));

router.get('/panelPacientes',autenticar, panelPacientesController.mostrarPanelPacientes);
router.get('/panelPacientes/turnos',autenticar, panelPacientesController.pacienteTurnos);

//PANEL PACIENTES-TURNOS
router.get('/panelPacientes/nuevo-turno',autenticar, panelPacientesController.nuevoTurno);
router.post('/panelPacientes/api/disponibilidad', panelPacientesController.obtenerDisponibilidad);
router.post('/panelPacientes/reservar', panelPacientesController.reservarTurno);

//PANEL PACIENTES-PERFIL
router.get('/panelPacientes/perfil',autenticar, panelPacientesController.miPerfil);

router.post('/panelPacientes/perfil/actualizarDatos', panelPacientesController.actualizarDatosUsuario);

router.post('/panelPacientes/perfil/cambiarPassword', panelPacientesController.cambiarPassword);

router.get('/panelPacientes/recetas',autenticar, panelPacientesController.misRecetas);

module.exports = router;