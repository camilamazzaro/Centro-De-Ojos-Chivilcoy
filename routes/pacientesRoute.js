const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController'); 
const pacienteController = new PacienteController();

const HistoriaClinicaController = require('../controllers/historiaClinicaController');
const historiaClinicaController = new HistoriaClinicaController();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

// const autenticar = require('../middleware/autenticacion')([1, 2, 3]);

//Ruta para listar los pacientes
router.get('/pacientes', pacienteController.listarPacientes);

//Ruta para editar y agregar pacientes
router.get('/pacientes/editar/:id', pacienteController.editarPaciente);
// router.post('/pacientes/editar/:id', pacienteController.guardarPaciente);
router.get('/pacientes/agregar/0', pacienteController.mostrarAgregarPaciente);

//Rutas para agregar por pasos al cliente
router.post('/pacientes/guardar-info-personal', pacienteController.guardarInfoPersonal); //paso 1
router.post('/pacientes/guardar-info-medica', pacienteController.guardarInfoMedica); //paso 2
router.post('/pacientes/agregar/0', pacienteController.crearPaciente);

//Ruta para eliminar pacientes
router.delete('/pacientes/eliminar/:id', pacienteController.eliminarPaciente);

//Ruta para editar datos del paciente
router.put('/pacientes/editar/:id', pacienteController.editarPaciente)

// HISTORIAS CLÍNICAS
router.get('/paciente/historias-clinicas/:pacienteId', historiaClinicaController.mostrarListadoHCE);

module.exports = router; //exporto el módulo para que pueda ser incorporado en app.js