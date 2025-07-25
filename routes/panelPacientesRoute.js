const express = require('express');
const router = express.Router();

const PanelPacientesController = require('../controllers/panelPacientesController');
const panelPacientesController = new PanelPacientesController();

//rutas redirección a home
router.get('/panelPacientes', panelPacientesController.mostrarPanelPacientes);


module.exports = router;