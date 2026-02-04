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

    async validarFormulario(req, res) {
        const { email, password, recordar } = req.body;

        // Paso 1: Validar credenciales básicas (Email y Pass)
        loginModel.validarUsuario(email, password, async (err, usuario) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error de servidor." });
            }

            // Verificar si el usuario existe y la contraseña coincide
            // Nota: Se recomienda usar siempre bcrypt.compare (asíncrono) o compareSync
            const passwordValida = usuario && (await bcrypt.compare(password, usuario.password));

            if (usuario && passwordValida) {
                
                // --- CONFIGURACIÓN BASE DE LA SESIÓN ---
                req.session.cookie.maxAge = recordar ? (1000 * 60 * 60 * 24 * 7) : (1000 * 60 * 60); // 7 días o 1 hora
                
                req.session.idUsuario = usuario.id;
                req.session.categoria = usuario.id_categoriaUsuario;
                req.session.nombre = usuario.nombre; // Usamos 'nombre' para consistencia con app.js
                req.session.email = usuario.email;

                // --- LÓGICA ESPECÍFICA POR ROL ---
                
                // CASO A: ES MÉDICO (Categoría 2)
                if (usuario.id_categoriaUsuario === 2) {
                    loginModel.obtenerIdMedico(usuario.id, (err, idMedico) => {
                        if (idMedico) {
                            req.session.idMedico = idMedico; // ¡ESTO ES LO IMPORTANTE!
                        }
                        guardarYResponder();
                    });
                } 
                // CASO C: ADMIN O SECRETARIA (No requieren ID extra)
                else {
                    guardarYResponder();
                }

                // Función auxiliar para no repetir código
                function guardarYResponder() {
                    req.session.save((errSave) => {
                        if (errSave) {
                            console.error("Error sesión:", errSave);
                            return res.status(500).json({ error: 1 });
                        }
                        // Respondemos al frontend con éxito
                        res.json({
                            error: 0,
                            categoria: usuario.id_categoriaUsuario,
                            idUsuario: usuario.id
                        });
                    });
                }

            } else {
                // Usuario o contraseña incorrectos
                res.json({ error: 1, message: "Credenciales incorrectas" });
            }
        });
    }

}

module.exports = LoginController;