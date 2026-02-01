const express = require('express');
const router = express.Router();

const PanelAdminController = require('../controllers/panelAdminController');
const panelAdminController = new PanelAdminController();

const autenticar = require('../middleware/autenticacion')([1]);


// roles permitidos para este módulo
// const ROLES = [1]; 
// router.use(auth(ROLES));

//rutas redirección a home
router.get('/panelAdmin',autenticar, panelAdminController.mostrarPanelGeneral);

router.get('/panelAdmin/calendario-turnos',autenticar, panelAdminController.mostrarCalendario);

router.get('/calendario/obtener-turnos',autenticar, panelAdminController.obtenerTurnosCalendarioMedicos);

module.exports = router;