//importo la conexión a la base de datos y la guardo en la constante "conx" para poder conusltar
// const { off } = require('pdfkit');
const conx = require('../database/db');

class PacienteModel{

    obtenerPacienteBase(){
        return {
            id: 0,
            nombre: '',
            email: '',
            telefono: '',
            id_obrasocial: ''
        }
    }

    async listarPacientes(limit, offset, filtros = {}, callback){

        limit = parseInt(limit) || 10;
        offset = parseInt(offset) || 0;

        let params = [];

        let sqlFiltros = "";
        if (filtros.id_obrasocial && filtros.id_obrasocial != 0) {
            sqlFiltros += "AND pacientes.id_obrasocial = ? ";
            params.push(filtros.id_obrasocial);
        }

        if (filtros.buscador && filtros.buscador != '') {
            sqlFiltros += `AND pacientes.nombre LIKE ? `;
            params.push(`%${filtros.buscador}%`);
        }

        let paginatorParams = [limit, offset];

        console.log(params)

        let sql = `
            SELECT 
                pacientes.id AS id, 
                pacientes.nombre AS nombre, 
                pacientes.dni AS dni,
                pacientes.email AS email, 
                pacientes.telefono AS telefono,
                obras_sociales.nombre AS obra_social
            FROM pacientes
            LEFT JOIN obras_sociales ON pacientes.id_obrasocial = obras_sociales.id
            WHERE 1 = 1
            ${sqlFiltros}
            LIMIT ? OFFSET ?;
        `;

        let sqlCount = `
            SELECT COUNT(*) AS total
            FROM pacientes
            LEFT JOIN obras_sociales ON pacientes.id_obrasocial = obras_sociales.id
            WHERE 1 = 1
            ${sqlFiltros}
        `;

        //Validación para asegurarse de que callback sea una función
        console.log("Tipo de callback:", typeof callback); // Verifica el tipo
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

    async obtenerPaciente(id, callback){
        let sql = `
            SELECT 
                pacientes.id, 
                pacientes.nombre, 
                pacientes.dni,
                pacientes.email, 
                pacientes.telefono, 
                pacientes.id_obrasocial
            FROM pacientes
            WHERE pacientes.id = ?`;
        conx.query(sql, [id], async (err, results) => {
            if (results.length === 0) {
                callback(this.obtenerPacienteBase());
            } else {
            callback(results[0]);
            }
        });
    }

    async obtenerPacientePorDNI(dni, callback){
        let sql = `SELECT * FROM pacientes WHERE dni = ?`;
        conx.query(sql, [dni], async (err, results) => {
            console.log(err);
            console.log(results);
            if (results.length === 0) {
                callback(null);
            } else {
                callback(results[0]);
            }
        });
    }

    async guardarPaciente(datos, callback) {
        if(datos.id == 0){
            let sql = `INSERT INTO pacientes (nombre, dni, email, telefono, id_obrasocial)`;
            sql += `VALUES (?,?,?,?,?)`;
            conx.query(sql, [datos.nombre, datos.dni, datos.email, datos.telefono, datos.id_obrasocial], async (err, results)=>{
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    callback(results);
                }
        });
        } else {
            let sql = `UPDATE pacientes SET nombre= ?, dni= ?, email= ?, telefono= ?, id_obrasocial= ? WHERE id = ?`;
            conx.query(sql, [datos.nombre, datos.dni, datos.email, datos.telefono, datos.id_obrasocial, datos.id], async (err, results)=>{
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    callback(results);
                }
        });
        }
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
        console.log("Datos a ingresar: ", nuevoPaciente);
        return new Promise((resolve, reject) => {

            const sql = `INSERT INTO pacientes (nombre, dni, fecha_nacimiento, genero, direccion, email, telefono, id_obra_social, nro_afiliado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            conx.query(sql, [nuevoPaciente.nombre_apellido, nuevoPaciente.dni, nuevoPaciente.fecha_nacimiento, nuevoPaciente.genero, nuevoPaciente.direccion, nuevoPaciente.email ,nuevoPaciente.telefono, nuevoPaciente.cobertura, nuevoPaciente.nro_afiliado], (err, results) => {
                if(err){
                    reject(`Error al crear paciente: ${err.message} `);
                }else{
                    resolve(results);
                }
            });
        });
    }
}

//exporto la función/es para poder ser utilizada/s desde el controlador
module.exports = PacienteModel;