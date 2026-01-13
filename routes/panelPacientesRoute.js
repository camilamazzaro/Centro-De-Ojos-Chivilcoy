const express = require('express');
const router = express.Router();

const PanelPacientesController = require('../controllers/panelPacientesController');
const panelPacientesController = new PanelPacientesController();

const sessionData = require('../middleware/sessionData');

router.use(sessionData);


//rutas redirección a home
router.get('/panelPacientes', panelPacientesController.mostrarPanelPacientes);
router.get('/panelPacientes/turnos', panelPacientesController.pacienteTurnos);

// --- NUEVAS RUTAS PARA EL PROCESO DE TURNOS ---

// 1. Mostrar la pantalla de selección (Paso 1)
router.get('/panelPacientes/nuevo-turno', panelPacientesController.nuevoTurno);

// 2. API que consulta el JS para traer médicos al cambiar la fecha
router.post('/panelPacientes/api/disponibilidad', panelPacientesController.obtenerDisponibilidad);

// 3. Confirmación final de la reserva
router.post('/panelPacientes/reservar', panelPacientesController.reservarTurno);

module.exports = router;