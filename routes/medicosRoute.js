// routes/medicos.js
const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');
const medicoController = new MedicoController();
const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();
const upload = require('../middleware/upload');

const autenticar = require('../middleware/autenticacion')([1, 3]);

// roles permitidos para este módulo
// const ROLES = [1,3]; 
// router.use(auth(ROLES));


// Ruta para listar todos los médicos
router.get('/medicos',autenticar, medicoController.listarMedicos);


// Rutas para mostrar el formulario de inserción de un nuevo médico y guardar nuevo médico
router.get('/medico/agregar/0', autenticar, medicoController.insertarMedico);
router.post('/medico/agregar/0', upload.single('foto'), medicoController.guardarMedico);

// Rutas para mostrar el formulario de edición de un médico (por ID) y guardar datos actualizados
router.get('/medico/editar/:id', autenticar, medicoController.editarMedico);
router.post('/medico/editar/:id', upload.single('foto'), medicoController.guardarMedico);


// Ruta para eliminar un médico (por ID)
router.delete('/medicos/eliminar/:medicoId', medicoController.eliminarMedico);

//Obtener médicos por obra social
router.get('/medicos/por-obra-social/:obraSocialId', autenticar, medicoController.obtenerMedicosPorObraSocial);

module.exports = router;