const conx = require('../database/db'); // Conexión a la base de datos

const bcrypt = require('bcrypt'); //pide la librería bcrypt
const rondas = 10; // Cantidad de veces que se aplica el hash

class LoginModel {

    actualizarPasswordHash(callback) { //hashear contraseñas que no lo estén 
        const sql = "SELECT id, password FROM usuarios WHERE LENGTH(password) < 60"; 
        conx.query(sql, (err, results) => {
            if (err) {
                return callback(err, null); 
            }
            results.forEach((usuario) => {
                const hashPass = bcrypt.hashSync(usuario.password, rondas); // Encriptar contraseña de forma sincrónica

                const sqlActualizar = "UPDATE usuarios SET password = ? WHERE id = ?";
                conx.query(sqlActualizar, [hashPass, usuario.id], (err, result) => {
                    if (err) {
                        console.log(`Error actualizando la contraseña del usuario ID ${usuario.id}: `, err);
                    } else {
                        console.log(`Contraseña del usuario ID ${usuario.id} actualizada.`);
                    }
                });
            });
        });
    }

    actualizarPassword (usuarioId, nuevaPassword, callback){
        const sql = "UPDATE usuarios SET password = ? WHERE id = ?";
        conx.query (sql, [nuevaPassword, usuarioId], (err, results) => {
            callback(err, results);
        });
    }

    encontrarUsuarioPorMail(email, callback) { //encuentra el mail del usuario
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        conx.query(sql, [email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    }

    validarUsuario(email, password, callback) { //corrobora q el usuario que ingresó esté registrado
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        conx.query(sql, [email], (err, results) => {
            if (err) {
                return callback(err, null); 
            }
            if (results.length === 0) {
                return callback(null, false);
            }
            
            const usuario = results[0];
            const equalPassword = bcrypt.compareSync(password, usuario.password);

            if (equalPassword) {
                callback(null, usuario); // El usuario es correcto
            } else {
                callback(null, false);
            }
        });
    }

    obtenerIdMedicoPorUsuario(idUsuario, callback) {
        const sql = `
            SELECT m.id 
            FROM medicos m
            INNER JOIN usuarios u ON m.id_usuario = u.id
            WHERE u.id = ? AND u.id_categoriaUsuario = 2
        `;
        conx.query(sql, [idUsuario], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length > 0) {
                callback(null, results[0].id); // Devuelve el id del médico encontrado
            } else {
                callback(null, null); // No se encontró ningún médico para este usuario
            }
        });
    }
    
}

module.exports = LoginModel;
