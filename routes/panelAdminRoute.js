const express = require('express');
const router = express.Router();

const PanelAdminController = require('../controllers/panelAdminController');
const panelAdminController = new PanelAdminController();

const auth = require('../middleware/autenticacion');

// roles permitidos para este módulo
const ROLES = [1]; 
router.use(auth(ROLES));

//rutas redirección a home
router.get('/panelAdmin', panelAdminController.mostrarPanelGeneral);

router.get('/panelAdmin/calendario-turnos', panelAdminController.mostrarCalendario);

router.get('/calendario/obtener-turnos', panelAdminController.obtenerTurnosCalendarioMedicos);

module.exports = router;