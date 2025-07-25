const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/loginController');
const loginController = new LoginController();


router.get('/logout', loginController.logoutUsuario);

module.exports = router;
