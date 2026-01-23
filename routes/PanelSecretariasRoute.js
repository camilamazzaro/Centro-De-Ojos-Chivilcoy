const express = require('express');
const router = express.Router();

const PanelSecretariaController = require('../controllers/panelSecretariaController');
const panelSecretariaController = new PanelSecretariaController();

const auth = require('../middleware/autenticacion');

// roles permitidos para este módulo
const ROLES_SECRETARIA = [3]; 

// Esto ejecutará 'autenticacion' antes de CUALQUIER ruta definida abajo.
router.use(auth(ROLES_SECRETARIA));


// --- Rutas del Panel ---

// Ya no necesitas poner 'auth' en cada una, porque router.use() ya lo hizo
router.get('/panelSecretaria', panelSecretariaController.mostrarPanelGeneral);

router.get('/panelSecretaria/calendarioTurnos', panelSecretariaController.mostrarCalendario);

// Esta ruta también queda protegida automáticamente
router.get('/calendario/obtenerTurnos', panelSecretariaController.obtenerTurnosCalendarioMedicos);

module.exports = router;