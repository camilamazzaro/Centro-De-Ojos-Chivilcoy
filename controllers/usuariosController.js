const UsuarioModel = require('../models/usuariosModel');
const usuarioModel = new UsuarioModel();

class usuariosController{

    // Listar todos los usuarios
    async listarUsuarios(req, res){
        const categorias = await usuarioModel.listarCategorias();
        usuarioModel.listarUsuarios((err, usuarios) => {
            if (err) {
                console.error("Error al listar los usuarios:", err);
                return res.status(500).send("Error al listar los usuarios.");
            }
            res.render("usuarios/listarUsuarios", {
                usuarios,
                categorias: categorias
            });
        });
    }
    
    //Mostrar registro de usuarios
    async registrarUsuario(req, res){
        try {
            const categorias = await usuarioModel.listarCategorias();
            console.log("Categorías obtenidas en controller: ", categorias)

            const usuario = usuarioModel.obtenerUsuarioBase();
            res.render("usuarios/registrarUsuarios", {
                user: {id: 0},
                usuario: usuario,
                categorias: categorias
            });
        } catch (err) {
            console.error("Error creando el usuario: ", err);
            res.status(500).send("Error creando el usuario.");
        }
    }

    //Editar usuario (renderizar)
    async editarUsuario(req, res){
        const id = req.params.id;
        try {
            const usuario = await new Promise((resolve, reject) => {
                usuarioModel.obtenerUsuario(id, (err, usuario) => {
                    if (err || !usuario) {
                        return reject(new Error("No se encontró el usuario"));
                    }
                    resolve(usuario);
                });
            });
            console.log('Usuario obtenido:', usuario);

            const categoria = await usuarioModel.listarCategorias();

            res.render("usuarios/editarUsuario", {
                usuario: usuario,
                categorias: categoria
            });
        } catch (err) {
            console.error("Error cargando  el usuario:", err);
            res.status(500).send("Error cargando el usuario.");
        }
    }

    //Guardar nuevo usuario o actualizar datos de uno existente
    async guardarUsuario(req, res) {
        const datos = req.body;
        console.log(datos);
        
        if (!datos.nombre || !datos.email || !datos.password || !datos.categoria) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
        }
    
        try {
            if (datos.id === undefined || datos.id == 0) {
                usuarioModel.registrarUsuario(datos, (err, result) => {
                    if (err || !result) {
                        return res.status(500).json({ 
                            success: false, 
                            message: "Error al guardar el usuario." 
                        });
                    }
                    res.status(200).json({ 
                        success: true, 
                        message: "El usuario se creó correctamente." 
                    });
                });
            } else {
                usuarioModel.actualizarUsuario(datos, (result) => {
                    if (!result) {
                        return res.status(500).json({ 
                            success: false, 
                            message: "Error al actualizar el usuario." 
                        });
                    } else {
                        res.status(200).json({ 
                            success: true, 
                            message: "El usuario se actualizó correctamente." 
                        });
                    }   
                });
            }
        } catch (err) {
            console.error("Error al guardar el usuario: ", err);
            res.status(500).send("Error al guardar el usuario.");
        }
    }

    //Eliminar usuario
    async eliminarUsuario(req, res) {
        const id = req.params.id;
        usuarioModel.eliminarUsuario(id, (result) => {
            if (!result) {
                return res.status(500).json({ success: false, message: "Error al eliminar el usuario." });
            } else {
                return res.json({ success: true });
            }
        });
    }    
}

module.exports = usuariosController;