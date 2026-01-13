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
router.get('/paciente/:pacienteId/historia-clinica/agregar', historiaClinicaController.mostrarAgregarHCE);
router.post('/paciente/:pacienteId/historia-clinica/agregar', historiaClinicaController.guardarHistoriaClinica);
router.get('/paciente/:pacienteId/historia-clinica/:historiaId/editar', historiaClinicaController.mostrarEditarHCE);
router.put('/paciente/:pacienteId/historia-clinica/:historiaId/editar', historiaClinicaController.editarHistoriaClinica);


// RECETAS
router.post('/pacientes/receta/crear', pacienteController.crearReceta);
router.put('/pacientes/receta/editar', pacienteController.editarReceta);
router.delete('/pacientes/receta/eliminar/:id', pacienteController.eliminarReceta);

module.exports = router; //exporto el módulo para que pueda ser incorporado en app.js