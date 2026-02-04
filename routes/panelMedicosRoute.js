const express = require('express');
const router = express.Router();

const PanelMedicosController = require('../controllers/panelMedicosController');
const panelMedicosController = new PanelMedicosController();

const autenticar = require('../middleware/autenticacion')([1, 3, 2]);


// --- Rutas del Panel ---

// Ya no necesitas poner 'auth' en cada una, porque router.use() ya lo hizo
router.get('/panelMedicos',autenticar, panelMedicosController.mostrarPanelGeneral);

router.get('/panelMedicos/calendarioTurnos', autenticar, panelMedicosController.mostrarCalendario);

// Esta ruta también queda protegida automáticamente
router.get('/calendarioMedico/obtenerTurnos',autenticar, panelMedicosController.obtenerTurnosCalendarioMedicos);

router.post('/turnos/confirmar/:id', autenticar, panelMedicosController.confirmarTurno);

router.get('/recetas', autenticar, panelMedicosController.mostrarMisRecetas);
router.get('/recetas/nueva', autenticar, panelMedicosController.mostrarFormularioReceta);
router.post('/recetas/guardar', autenticar, panelMedicosController.guardarReceta);

module.exports = router;