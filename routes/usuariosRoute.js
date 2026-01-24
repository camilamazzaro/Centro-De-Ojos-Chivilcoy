const express = require('express');
const router = express.Router(); 

const UsuariosController = require('../controllers/usuariosController');
const usuariosController = new UsuariosController();

const auth = require('../middleware/autenticacion');

// roles permitidos para este módulo
const ROLES = [1]; 
router.use(auth(ROLES));

//LISTAR USUARIOS
router.get('/usuarios', usuariosController.listarUsuarios);

//REGISTRO USUARIOS
router.get('/usuario/agregar/0', usuariosController.registrarUsuario); 
router.post('/usuario/agregar/0',usuariosController.guardarUsuario); 

//EDITAR USUARIOS
router.get('/usuario/editar/:id', usuariosController.editarUsuario);
router.post('/usuario/editar/:id', usuariosController.guardarUsuario);

//ELIMINAR USUARIO
router.delete('/usuario/eliminar/:id', usuariosController.eliminarUsuario);

module.exports = router; 