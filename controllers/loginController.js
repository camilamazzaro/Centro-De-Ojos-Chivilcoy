const UsuarioModel = require("../models/usuariosModel");
const bcrypt = require('bcrypt');
const usuarioModel = new UsuarioModel();

const jwt = require('jsonwebtoken'); //pide la librería jwt
const nodemailer = require('nodemailer'); //pide la librería nodemailer

const JWT_SECRET = 'Emilia'; //token para la asegurar la contraseña


require('dotenv').config();

class LoginController {

    async logoutUsuario (req, res) { //para cerrar sesión 
        req.session.destroy ((err) => {
            if (err) {
                return res.status (500).json({
                    success: false,
                    message: "Error al cerrar sesión"
                });
            }
            res.redirect ('/');
        });
    }

}

module.exports = LoginController;