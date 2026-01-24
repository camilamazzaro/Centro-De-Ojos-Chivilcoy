const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController'); 
const pacienteController = new PacienteController();

const upload = require('../middleware/upload');

const HistoriaClinicaController = require('../controllers/historiaClinicaController');
const historiaClinicaController = new HistoriaClinicaController();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const auth = require('../middleware/autenticacion');

// roles permitidos para este módulo
const ROLES = [1, 3, 4]; 
router.use(auth(ROLES));

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
router.post('/pacientes/receta/crear', 
    upload.fields([
        { name: 'archivo_manuscrita', maxCount: 1 }, 
        { name: 'archivo_digital', maxCount: 1 }
    ]), 
    pacienteController.crearReceta
);
router.put('/pacientes/receta/editar', 
    upload.fields([
        { name: 'archivo_manuscrita', maxCount: 1 }, 
        { name: 'archivo_digital', maxCount: 1 }
    ]), 
    pacienteController.editarReceta
);
router.delete('/pacientes/receta/eliminar/:id', pacienteController.eliminarReceta);
router.get('/receta/ver/:id', pacienteController.generarPdfReceta);


module.exports = router; //exporto el módulo para que pueda ser incorporado en app.js