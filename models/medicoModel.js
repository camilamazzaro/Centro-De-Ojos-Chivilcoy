// models/medicoModel.js
const conx = require('../database/db');
const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

class MedicoModel {

    //Inicializamos un nuevo objeto médico para utilizar al crear un nuevo registro de médicos
    obtenerMedicoBase() { //valores por defecto
        return { 
            id: 0,
            id_usuario: 0, 
            telefono: '',
            foto: '',
            descripcion: ''
        };
    }

    //listado de médicos
    async listarMedicos(callback) {
        let sql = `
            SELECT 
                medicos.id, 
                usuarios.nombre AS nombre_medico, 
                medicos.telefono, 
                medicos.descripcion,
                medicos.matricula, 
                medicos.foto 
            FROM medicos
            JOIN usuarios ON medicos.id_usuario = usuarios.id
        `;
        conx.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                return callback([]);
            }
            callback(results);
        });
    }

    async listarMedicosAsync() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    medicos.id, 
                    usuarios.nombre AS nombre, 
                    medicos.telefono, 
                    medicos.descripcion AS especialidad,
                    medicos.matricula AS matricula
                FROM medicos
                JOIN usuarios ON medicos.id_usuario = usuarios.id
            `;
            conx.query(sql, [], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }


    //para obtener los datos de un médico en específico
    async obtenerMedico(id, callback) {
        let sql = `SELECT medicos.*, usuarios.nombre AS nombre_medico 
                    FROM medicos 
                    JOIN usuarios ON medicos.id_usuario = usuarios.id 
                    WHERE medicos.id = ?`;
        conx.query(sql, [id], (err, results) => {
            if (err || results.length === 0) {
                callback(false);
            } else {
                callback(results[0]);
            }
        });
    }


    async obtenerMedicosPorObraSocial(obraSocialId, callback) {
        const query = `
            SELECT medicos.*, usuarios.nombre AS nombre_medico
            FROM medicos
            JOIN medico_obrassociales ON medicos.id = medico_obrassociales.id_medico
            JOIN usuarios ON medicos.id_usuario = usuarios.id
            WHERE medico_obrassociales.id_obraSocial = ?`;

        conx.query(query, [obraSocialId], (error, results) => {
            if (error) {
                console.error('Error al obtener médicos por obra social:', error);
                callback([]);
            } else {
                callback(results);
            }
        });
    }

    async obtenerObrasSocialesPorMedico(idMedico, callback) {
        const sql = `
            SELECT os.id, os.nombre
            FROM medico_obrassociales mo
            INNER JOIN obras_sociales os ON mo.id_obraSocial = os.id
            WHERE mo.id_medico = ?;
        `;
    
        conx.query(sql, [idMedico], (err, results) => {
            if (err) {
                console.error('Error al obtener obras sociales del médico:', err);
                return callback([]);
            }
            callback(results);
        });
    }


    //guardar un nuevo médico en la base de datos, o guardar datos actualizados en el formulario de editar médico
    async guardarMedico(datos, callback) {

        //si el id del médico es 0, crea un nuevo médico
        if(datos.id == 0){
        let sql = `INSERT INTO medicos (id_usuario, telefono, descripcion, matricula, foto)`;
        sql += `VALUES (?, ?, ?, ?, ?)`;
        conx.query(sql, [datos.id_usuario, datos.telefono, datos.descripcion, datos.matricula ,datos.foto], async (err, results) => {
            if(err){
                console.error(err);
                callback(null);
            }else{
                callback(results);
            }
        });

        }else{ //si no, actualiza datos existentes
        let sql = `UPDATE medicos SET id_usuario = ?, telefono = ?, descripcion = ?, matricula = ?, foto = ? WHERE id = ?`;
        conx.query(sql, [datos.id_usuario, datos.telefono, datos.descripcion, datos.matricula ,datos.foto, datos.id], async (err, results) => {
            if(err){
                console.error(err);
                callback(null);
            }else{
                callback(results);
            }
        });
        }
    }

    //eliminar un médico de la base de datos
    async eliminarMedico(id, callback) {
        let sql = `DELETE FROM medicos WHERE id = ?`;
        conx.query(sql, [id], (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
            } else {
                callback(results);
            }
        });
    }

    //listado de todos los usuarios
    async listarUsuarios() {
        let sql = `SELECT usuarios.id, usuarios.nombre 
                    FROM usuarios
                    JOIN usuario_categorias ON usuarios.id_categoriaUsuario = usuario_categorias.id
                    WHERE usuarios.id_categoriaUsuario = 2`;
        return new Promise((resolve, reject) => {
            conx.query(sql, [], (err, results) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    //listado de médicos
    async obtenerMedicosConTurnosPorFiltros(filtros, callback) {
        let sql = `
            SELECT 
                medicos.*, 
                usuarios.nombre AS nombre_medico
            FROM medicos
            JOIN usuarios ON medicos.id_usuario = usuarios.id
            WHERE EXISTS(SELECT T.* FROM turnos T WHERE T.id_medico = medicos.id AND fecha_hora LIKE ?)
        `;

        let paramsSql = [`%${filtros.fecha}%`];

        conx.query(sql, paramsSql, async (err, results) => {
            if (err) {
                console.error(err);
                return callback([]);
            }

            // Agregamos los turnos y las prácticas a cada médico
            for (const medico of results) {
                medico.turnos = await turnoModel.obtenerTurnoPorMedicoYFecha(medico.id, filtros.fecha);

                // ACA SE LLAMA A obtenerPracticasPorMedico Y SE GUARDA EN medico.practicas
                await new Promise((resolve) => {
                    this.obtenerPracticasPorMedico(medico.id, (practicas) => {
                        medico.practicas = practicas;
                        resolve();
                    });
                });
            }

            callback(results);
        });
    }


    // Obtener prácticas de un médico específico
    async obtenerPracticasPorMedico(idMedico, callback) {
        let sql = `
            SELECT practicas.id, practicas.nombre 
            FROM medicos_practicas 
            JOIN practicas ON medicos_practicas.id_practica = practicas.id 
            WHERE medicos_practicas.id_medico = ?
        `;

        conx.query(sql, [idMedico], (err, results) => {
            if (err) {
                console.error('Error al obtener las prácticas del médico:', err);
                return callback([]);
            }
            callback(results);
        });
    }

    async listarPracticas (callback){
        let sql = `
            SELECT 
                practicas.id, 
                practicas.nombre AS practica  
            FROM practicas
        `;
        conx.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                return callback([]);
            }
            callback(results);
        });
    }

}

module.exports = MedicoModel;