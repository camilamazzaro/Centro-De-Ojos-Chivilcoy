const conx = require('../database/db');

class usuariosModel{

    obtenerUsuarioBase() { 
        return { 
            id: 0,
            nombre: '',
            email: '',
            password: '',
            id_categoriaUsuario: 0
        };
    }

    listarUsuarios(callback) {
        let sql = `
            SELECT 
                usuarios.id, 
                usuarios.nombre, 
                usuarios.email, 
                CASE 
                    WHEN usuario_categorias.id = 1 THEN 'Administradores' 
                    WHEN usuario_categorias.id = 2 THEN 'Médicos' 
                    WHEN usuario_categorias.id = 3 THEN 'Secretarias' 
                END AS categoria
            FROM usuarios
            JOIN usuario_categorias ON usuarios.id_categoriaUsuario = usuario_categorias.id
        `;
        conx.query(sql, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    obtenerUsuario(id, callback) {
        const sql = 
        `
        SELECT * FROM usuarios WHERE id = ?
        `
        ;
        conx.query(sql, [id], (err, results) => {
            if (err) {
                return callback(err, null); 
            }
            if (results.length === 0) {
                return callback(null, false);
            }
            callback(null, results[0]);
        });
    }

    // Registrar nuevo usuario
    registrarUsuario(datos, callback) {
        const sql = 
        `
        INSERT INTO usuarios (nombre, email, password, id_categoriaUsuario)
        VALUES (?, ?, ?, ?)
        `;

        conx.query(sql, [datos.nombre, datos.email, datos.password, datos.categoria], (err, results) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    // Listado de cateogorías de usuarios
    async listarCategorias(){
        return new Promise ((resolve, reject) => {
            let sql = 
            `
            SELECT * FROM usuario_categorias
            `;
            conx.query(sql, [], async(err,results) => {
                if(err) {
                    console.error("Error al obtener categoria", err);
                    reject(err);
                } else{
                    resolve(results);
                }
            });
        });
    }

    // Actualizar datos del usuario
    actualizarUsuario(datos, callback) {        
        let sql = 
        `
        UPDATE usuarios SET nombre = ?, email = ?, password = ?, id_categoriaUsuario = ? WHERE id = ?;
        `
        conx.query(sql, [datos.nombre, datos.email, datos.password, datos.categoria, datos.id], async (err, results) => {
            if (err) {
                console.error(err);
                return callback(null);
            } else {
            callback(results);
            }
        });
    }

    // Eliminar usuarios
    async eliminarUsuario(id, callback) {
        let sql = 
        `
        DELETE FROM usuarios
        WHERE id = ?`;
        conx.query(sql, [id], (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
            }else {
                callback(results);
            }
        });
    }
}

module.exports = usuariosModel;