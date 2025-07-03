const express = require('express');
const router = express.Router();

const PanelAdminController = require('../controllers/panelAdminController');
const panelAdminController = new PanelAdminController();
// const autenticar = require('../middleware/autenticacion')([3]); 

//rutas redirección a home
// router.get('/panelAdmin', autenticar, panelSecretariaController.mostrarPanelGeneral);

router.get('/panelAdmin/calendario-turnos', panelAdminController.mostrarCalendario);

router.get('/calendario/obtener-turnos', panelAdminController.obtenerTurnosCalendarioMedicos);

module.exports = router;