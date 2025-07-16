//importo la conexión a la base de datos y la guardo en la constante "conx" para poder conusltar
// const { off } = require('pdfkit');
const conx = require('../database/db');

class PacienteModel{

    obtenerPacienteBase(){
        return {
            id: 0,
            nombre: '',
            dni: '',
            fecha_nacimiento: '',
            genero: '',
            direccion: '',
            email: '',
            telefono: '',
            id_obra_social: '',
            nro_afiliado: '',
        }
    }

    async listarPacientes(limit, offset, filtros = {}, callback){

        limit = parseInt(limit) || 10;
        offset = parseInt(offset) || 0;

        let params = [];

        let sqlFiltros = "";
        if (filtros.id_obra_social && filtros.id_obra_social != 0) {
            sqlFiltros += "AND pacientes.id_obra_social = ? ";
            params.push(filtros.id_obra_social);
        }

        if (filtros.buscador && filtros.buscador !== '') {
            sqlFiltros += `AND (
                pacientes.nombre LIKE ? 
                OR pacientes.dni LIKE ? 
                OR pacientes.email LIKE ?
            ) `;
            params.push(`%${filtros.buscador}%`, `%${filtros.buscador}%`, `%${filtros.buscador}%`);
        }

        let paginatorParams = [limit, offset];

        let sql = `
            SELECT 
                pacientes.id AS id, 
                pacientes.nombre AS nombre, 
                pacientes.dni AS dni,
                pacientes.fecha_nacimiento AS fecha_nacimiento,
                pacientes.email AS email, 
                pacientes.telefono AS telefono,
                pacientes.genero AS genero,
                pacientes.direccion AS direccion,
                pacientes.nro_afiliado AS nro_afiliado,
                obras_sociales.nombre AS obra_social
            FROM pacientes
            LEFT JOIN obras_sociales ON pacientes.id_obra_social = obras_sociales.id
            WHERE 1 = 1
            ${sqlFiltros}
            LIMIT ? OFFSET ?;
        `;

        let sqlCount = `
            SELECT COUNT(*) AS total
            FROM pacientes
            LEFT JOIN obras_sociales ON pacientes.id_obra_social = obras_sociales.id
            WHERE 1 = 1
            ${sqlFiltros}
        `;

        //Validación para asegurarse de que callback sea una función
        if (typeof callback !== 'function') {
            // jajajajajajaajaja, buen console.error
            console.error("Error: Acá está el error papu(pacienteModel).");
            return;
        }
        
        conx.query(sql, params.concat(paginatorParams), (err, results) => {
            if (err) {
                console.error(err);
                return callback([]);
            }
            conx.query(sqlCount, params, (errCount, resultCount) => {
                if (errCount) {
                    console.error(errCount);
                    return callback([], 0);
                }
                const total = resultCount[0].total;
                callback(results, total);
            });
        });
    }

    obtenerPaciente(id) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT p.*, os.nombre AS nombre_obra_social
            FROM pacientes p
            JOIN obras_sociales os ON p.id_obra_social = os.id
            WHERE p.id = ?
            `;
            conx.query(query, [id], (err, resultados) => {
            if (err) return reject(err);
            if (resultados.length === 0) return resolve(null);
            resolve(resultados[0]);
            });
        });
    }

    async obtenerPacientePorDNI(dni, callback){
        let sql = `SELECT * FROM pacientes WHERE dni = ?`;
        conx.query(sql, [dni], async (err, results) => {
            console.log("Error en obtener paciente por dni", err);
            console.log(results);
            if (results.length === 0) {
                callback(null);
            } else {
                callback(results[0]);
            }
        });
    }

    async editarPaciente(id, datos) {
        let sql = `
            UPDATE pacientes
            SET nombre = ?, dni = ?, fecha_nacimiento = ?, genero = ?, direccion = ?, telefono = ?, email = ?, id_obra_social = ?, nro_afiliado = ?
            WHERE id = ?;
        `;

        const params = [
            datos.nombre_apellido,
            datos.dni,
            datos.fecha_nacimiento,
            datos.genero,
            datos.direccion,
            datos.telefono,
            datos.email,
            datos.cobertura,
            datos.nro_afiliado,
            id
        ];

        return new Promise((resolve, reject) => {
            conx.query(sql, params, (err, result) => {
                if (err) {
                    console.error("Error al actualizar paciente:", err);
                    reject(err);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });

    }     

    async eliminarPaciente(id, callback) {
        let sql = `DELETE FROM pacientes WHERE id = ?`;
        conx.query(sql, [id], (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
            } else {
                callback(results);
            }
        });
    }

    //Función para traerme las obras sociales en editarPaciente.ejs
    async obtenerObrasSociales(callback) {
        let sql = `SELECT id, nombre FROM obras_sociales
        ORDER BY nombre asc;
        `;
        conx.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                return callback([]);
            }
            callback(results);
        });
    }

    //Función para traerme las ciudades en editarPaciente.ejs
    async obtenerCiudades(callback) {
        let sql = `SELECT id, nombre FROM ciudades`;
        conx.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                return callback([]);
            }
            callback(results);
        });
    }

    async crearPaciente(nuevoPaciente){
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO pacientes (nombre, dni, fecha_nacimiento, genero, direccion, email, telefono, id_obra_social, nro_afiliado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            conx.query(sql, [
                nuevoPaciente.nombre_apellido,
                nuevoPaciente.dni,
                nuevoPaciente.fecha_nacimiento,
                nuevoPaciente.genero,
                nuevoPaciente.direccion,
                nuevoPaciente.email,
                nuevoPaciente.telefono,
                nuevoPaciente.cobertura,
                nuevoPaciente.nro_afiliado
            ], (err, results) => {
                if(err){
                    reject(`Error al crear paciente: ${err.message}`);
                } else {
                    // Devuelvo un objeto para obtener el id del paciente recién creado
                    resolve({ id: results.insertId });
                }
            });
        });
    }

    buscarPacientePorDni(dni) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM pacientes WHERE dni = ?";
            conx.query(sql, [dni], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                if (rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

}

//exporto la función/es para poder ser utilizada/s desde el controlador
module.exports = PacienteModel;