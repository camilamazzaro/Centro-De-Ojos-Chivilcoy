const UsuarioModel = require("../models/usuariosModel");
const bcrypt = require('bcrypt');
const usuarioModel = new UsuarioModel();

const LoginModel = require("../models/loginModel");
const loginModel = new LoginModel();

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
    async logoutPanel (req, res) { 
        req.session.destroy ((err) => {
            if (err) {
                return res.status (500).json({
                    success: false,
                    message: "Error al cerrar sesión"
                });
            }
            res.redirect ('/login');
        });
    }

    async mostrarFormulario (req, res) { 
        console.log (req.session);
        res.render ('usuarios/login');
    }

    async validarFormulario (req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const recordar = req.body.recordar;
    
        // Paso 1: Validar al usuario
        loginModel.validarUsuario (email, password, (err, usuario) => {
            if (err) {
                return res.status (500).json({
                    success: false,
                    message: "Error al validar el usuario."
                });
            }
    
            if (usuario && (bcrypt.compareSync(password, usuario.password) || password === usuario.password)) {
                // Usuario válido
                req.session.cookie.maxAge = recordar ? (1000 * 60 * 60 * 24 * 7) : (1000 * 60 * 60);
                req.session.idUsuario = usuario.id;
                req.session.categoria = usuario.id_categoriaUsuario;
                req.session.nombreUsuario = usuario.nombre;
                req.session.emailUsuario = usuario.email;
    
                // Paso 2: Obtener el ID del médico, si aplica. Esto es para poder usar el id del médico en menu lateral del panel de médicos.
                loginModel.obtenerIdMedicoPorUsuario (usuario.id, (err, idMedico) => {
                    if (err) {
                        console.error ("Error al obtener el ID del médico:", err);
                        return res.status (500).json({
                            success: false,
                            message: "Error al obtener el ID del médico."
                        });
                    }
    
                    req.session.save((err) => {
                        if (err) {
                            console.error("Error al guardar la sesión:", err);
                            return res.status(500).json({ error: 1, message: "Error al iniciar sesión" });
                        }

                        res.json({
                            idUsuario: usuario.id,
                            categoria: usuario.id_categoriaUsuario,
                            error: 0 
                        });
                    });
                });
            } else {
                // No hay usuario
                res.json ({
                    error: 1, // error en el usuario o la contraseña
                });
            }
        });
    }

}

module.exports = LoginController;