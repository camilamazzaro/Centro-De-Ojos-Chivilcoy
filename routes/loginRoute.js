const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/loginController');
const loginController = new LoginController();


router.get('/logout', loginController.logoutUsuario); // Logout de pacientes
router.get('/logoutPanel', loginController.logoutPanel); // Logout de secres, admin y médicos


//rutas para ingreso
router.get('/login', loginController.mostrarFormulario); 
router.post('/login', loginController.validarFormulario); 

module.exports = router;
