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
    
    obtenerIdMedico(idUsuario, callback) {
        const sql = "SELECT id FROM medicos WHERE id_usuario = ?";
        // Asegúrate de usar tu variable de conexión (conx, pool, o db)
        conx.query(sql, [idUsuario], (err, rows) => {
            if (err) {
                console.error("Error buscando médico:", err);
                return callback(err, null);
            }
            // Si encuentra fila, devuelve el ID, si no devuelve null
            callback(null, rows.length > 0 ? rows[0].id : null);
        });
    }

    obtenerIdPaciente(idUsuario, callback) {
        const sql = "SELECT id FROM pacientes WHERE id_usuario = ?"; // Asumiendo que pacientes tiene id_usuario
        /* NOTA: Si tu tabla pacientes NO tiene id_usuario y se vincula por email,
           deberías cambiar la consulta a: "SELECT id FROM pacientes WHERE email = ?"
           y pasar el email en vez del idUsuario.
        */
        conx.query(sql, [idUsuario], (err, rows) => {
            if (err) return callback(err, null);
            callback(null, rows.length > 0 ? rows[0].id : null);
        });
    }

    listarTurnosHoyMedico(idMedico, fechaInicio, fechaFin, callback) {
        const sql = `
            SELECT t.*, p.nombre as nombre_paciente, p.dni, p.id as id_paciente, pr.nombre as nombre_practica
            FROM turnos t
            JOIN pacientes p ON t.id_paciente = p.id
            LEFT JOIN practicas pr ON t.id_practica = pr.id
            WHERE t.id_medico = ? 
            AND t.fecha_hora BETWEEN ? AND ?
            AND t.id_estado_turno IN (3, 4) -- 3: Confirmado, 4: Completado/Atendido
            ORDER BY t.fecha_hora ASC
        `;
        
        // Asumiendo que usas 'conx' como en tus otros modelos
        conx.query(sql, [idMedico, fechaInicio, fechaFin], (err, results) => {
            if (err) {
                console.error("Error listando turnos hoy:", err);
                return callback([]);
            }
            callback(results);
        });
    }
}

module.exports = LoginModel;
