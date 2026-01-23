const UsuarioModel = require('../models/usuariosModel');
const usuarioModel = new UsuarioModel();
const bcrypt = require('bcrypt');

class usuariosController {

    // Listar todos los usuarios
    async listarUsuarios(req, res) {
        try {
            const categorias = await usuarioModel.listarCategorias();
            usuarioModel.listarUsuarios((err, usuarios) => {
                if (err) {
                    console.error("Error al listar:", err);
                    return res.status(500).send("Error al listar los usuarios.");
                }
                res.render("usuarios/listarUsuarios", { usuarios, categorias });
            });
        } catch (error) {
            res.status(500).send("Error interno.");
        }
    }

    // Mostrar registro de usuarios
    async registrarUsuario(req, res) {
        try {
            const categorias = await usuarioModel.listarCategorias();
            const usuario = usuarioModel.obtenerUsuarioBase();
            res.render("usuarios/registrarUsuarios", {
                user: { id: 0 },
                usuario: usuario,
                categorias: categorias
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error interno.");
        }
    }

    // Editar usuario
    async editarUsuario(req, res) {
        const id = req.params.id;
        try {
            const usuario = await new Promise((resolve, reject) => {
                usuarioModel.obtenerUsuario(id, (err, usuario) => {
                    if (err || !usuario) return reject(new Error("Usuario no encontrado"));
                    resolve(usuario);
                });
            });
            const categoria = await usuarioModel.listarCategorias();

            res.render("usuarios/editarUsuario", {
                usuario: usuario,
                categorias: categoria
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error al cargar usuario.");
        }
    }

    // ---------------------------------------------------------
    // MÉTODO GUARDAR (CREAR Y EDITAR) - LÓGICA CORREGIDA
    // ---------------------------------------------------------
    async guardarUsuario(req, res) {
        const datos = req.body;

        // Validación básica
        if (!datos.nombre || !datos.email || !datos.categoria) {
            return res.status(400).json({ success: false, message: "Datos incompletos." });
        }

        try {
            // ======================================================
            // CASO 1: CREAR NUEVO (ID es 0 o undefined)
            // ======================================================
            if (!datos.id || datos.id == 0) {

                if (!datos.password) {
                    return res.status(400).json({ success: false, message: "Contraseña obligatoria." });
                }

                // 1. Encriptar contraseña
                datos.password = await bcrypt.hash(datos.password, 10);

                // 2. Guardar usando AWAIT (Porque tu modelo retorna una Promise)
                try {
                    await usuarioModel.registrarUsuario(datos);
                    // Si no da error, respondemos ÉXITO
                    return res.status(200).json({ success: true, message: "Usuario creado." });
                } catch (error) {
                    console.error("Error modelo:", error);
                    return res.status(500).json({ success: false, message: "Error en base de datos." });
                }

            } else {
                // ======================================================
                // CASO 2: EDITAR EXISTENTE
                // ======================================================
                
                // Función interna para actualizar (evita el error de 'this')
                const procesarActualizacion = (datosFinales) => {
                    usuarioModel.actualizarUsuario(datosFinales, (result) => {
                        if (!result) {
                            return res.status(500).json({ success: false, message: "Error al actualizar." });
                        }
                        return res.status(200).json({ success: true, message: "Usuario actualizado." });
                    });
                };

                // A. ¿Escribió nueva contraseña?
                if (datos.password && datos.password.trim() !== "") {
                    datos.password = await bcrypt.hash(datos.password, 10);
                    procesarActualizacion(datos);
                } 
                // B. No escribió contraseña -> Mantener la vieja
                else {
                    usuarioModel.obtenerUsuario(datos.id, (err, usuarioViejo) => {
                        if (err || !usuarioViejo) {
                            return res.status(500).json({ success: false, message: "Error recuperando usuario." });
                        }
                        datos.password = usuarioViejo.password; // Usamos la vieja
                        procesarActualizacion(datos);
                    });
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Error interno del servidor." });
        }
    }

    // Eliminar
    async eliminarUsuario(req, res) {
        const id = req.params.id;
        usuarioModel.eliminarUsuario(id, (result) => {
            if (!result) return res.status(500).json({ success: false });
            return res.json({ success: true });
        });
    }
}

module.exports = usuariosController;