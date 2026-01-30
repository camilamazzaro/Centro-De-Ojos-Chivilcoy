const express = require('express');
const router = express.Router();

const PanelSecretariaController = require('../controllers/panelSecretariaController');
const panelSecretariaController = new PanelSecretariaController();

const autenticar = require('../middleware/autenticacion')([1, 3]);


// --- Rutas del Panel ---

// Ya no necesitas poner 'auth' en cada una, porque router.use() ya lo hizo
router.get('/panelSecretaria',autenticar, panelSecretariaController.mostrarPanelGeneral);

router.get('/panelSecretaria/calendarioTurnos', autenticar, panelSecretariaController.mostrarCalendario);

// Esta ruta también queda protegida automáticamente
router.get('/calendario/obtenerTurnos',autenticar, panelSecretariaController.obtenerTurnosCalendarioMedicos);

module.exports = router;