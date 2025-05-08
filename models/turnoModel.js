//importo la conexión a la base de datos y la guardo en la constante "conx" para poder conusltar
const conx = require('../database/db');
const moment = require('moment');

class TurnoModel{

    obtenerTurnoBase(){
        return {
            id: 0,
            id_medico: '',
            id_paciente: '',
            fecha_hora: '',
            id_estadoTurno: ''
        }
    }

    listarTurnos(filtro, limit, offset, callback){

        limit = parseInt(limit) || 15;
        offset = parseInt(offset) || 0;

        let sql = `
        SELECT 
            turnos.id AS turno_id, 
            CONCAT(usuarios.nombre) AS medico_nombre,
            pacientes.nombre AS paciente_nombre, 
            turnos.fecha_hora AS fecha_hora, 
            turnos.id_estadoTurno,
            estado_turno.nombre AS estado_nombre
        FROM turnos 
        LEFT JOIN medicos ON turnos.id_medico = medicos.id 
        LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id 
        LEFT JOIN especialidades ON medicos.id_especialidad = especialidades.id 
        LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
        LEFT JOIN obras_sociales ON pacientes.id_obraSocial = obras_sociales.id
        JOIN estado_turno ON turnos.id_estadoTurno = estado_turno.id
        ${filtro}
        ORDER BY 
            CASE 
                WHEN estado_turno.nombre = 'Confirmado' THEN 0
                WHEN estado_turno.nombre = 'Reservado' THEN 1
                WHEN estado_turno.nombre = 'Libre' THEN 2
                ELSE 3
            END,
            turnos.fecha_hora ASC
        LIMIT ? OFFSET ?;
    `; //Con el THEN ordenamos el orden de prioridad con el que podemos listar, siedo 0 el de mayor prioridad.

        let sqlCount = `
            SELECT COUNT(*) AS total
            FROM turnos
            LEFT JOIN medicos ON turnos.id_medico = medicos.id 
            LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id 
            LEFT JOIN especialidades ON medicos.id_especialidad = especialidades.id 
            LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
            LEFT JOIN obras_sociales ON pacientes.id_obraSocial = obras_sociales.id
            JOIN estado_turno ON turnos.id_estadoTurno = estado_turno.id
            ${filtro};
        `;

        //Consultas para saber si limit u offset toman valores indefinidos
        if (typeof limit !== 'string' && typeof limit !== 'number') {
            console.log("Tipo de valor no soportado 1:", limit);
            return;
        }
        if (typeof offset !== 'string' && typeof offset !== 'number') {
            console.log("Tipo de valor no soportado 2:", offset);
            return;
        }

        // Validación para asegurarse de que callback sea una función
        if (typeof callback !== 'function') {
            console.error("Error: Acá está el error papu(turnoModel).");
            return;
        }

        conx.query(sql, [limit, offset], (err, results) => {
            if (err) {
                console.error(err);
                return callback([], 0);
            }

            conx.query(sqlCount, [], (errCount, resultCount) => {
                if (errCount) {
                    console.error(errCount);
                    return callback([], 0);
                }
                const total = resultCount[0].total;
                callback(results, total);
            });
        });
    }

    async obtenerTurno(id, callback){
        let sql = `SELECT * FROM turnos WHERE id = ?`;
        conx.query(sql, [id], async (err, results) => {
            if (results.length === 0) {
                callback(this.obtenerTurnoBase());
            } else {
            callback(results[0]);
            }
        });
    }

    async guardarTurno(datos, callback){
        if(datos.id == 0){
            let sql = `INSERT INTO turnos (id_medico, id_paciente, fecha_hora, id_estadoTurno)`;
            sql += `VALUES (?,?,?,?)`;
            conx.query(sql, [datos.id_medico, datos.id_paciente, datos.fecha_hora, datos.id_estadoTurno], async (err, results)=>{
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    callback(results);
                }
        });
        } else {
            let sql = `UPDATE turnos SET id_medico= ?, id_paciente= ?, fecha_hora= ?, id_estadoTurno= ? WHERE id = ?`;
            conx.query(sql, [datos.id_medico, datos.id_paciente, datos.fecha_hora, datos.id_estadoTurno, datos.id], async (err, results)=>{
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    callback(results);
                }
        });
        }
    }

    async eliminarTurno(id, callback) {
        let sql = `DELETE FROM turnos WHERE id = ?`;
        conx.query(sql, [id], (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
            } else {
                callback(results);
            }
        });
    }

    async obtenerTurnoPorMedicoYFecha(id_medico, fecha){
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM turnos WHERE id_medico = ? and fecha_hora LIKE ?`;
            conx.query(sql, [id_medico, `%${fecha}%`], async (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                resolve(results);
            });
        });
    }

    async reservarTurno(id_turno, id_cliente, callback){
        const ID_ESTADO_RESERVADO = 2;

        let sql = `UPDATE turnos SET id_paciente = ?, id_estadoTurno = ? WHERE id = ?`;

        conx.query(sql, [id_cliente, ID_ESTADO_RESERVADO, id_turno], async (err, results)=>{
            if (err) {
                console.error(err);
                callback(null);
            } else {
                callback(results);
            }
        });
    }

    async confirmarTurno(id_turno, callback){
        const ID_ESTADO_CONFIRMADO = 3;

        let sql = `UPDATE turnos SET id_estadoTurno = ? WHERE id = ?`;

        conx.query(sql, [ID_ESTADO_CONFIRMADO, id_turno], async (err, results)=>{
            if (err) {
                console.error(err);
                callback(null);
            } else {
                callback(results);
            }
        });
    }

    listarTurnosPorMedico(medicoId, filtro, limit, offset, callback) {
        // Conversión de limit y offset con valores predeterminados si no se especifican
        limit = parseInt(limit) || 15;
        offset = parseInt(offset) || 0;
    
        // Agregar el filtro de ID del médico en la consulta SQL
        filtro = `WHERE turnos.id_medico = ${medicoId} AND turnos.id_estadoTurno = 3` + (filtro ? ` AND (${filtro})` : '');
        
        let sql = `
            SELECT 
                turnos.id AS turno_id, 
                CONCAT(usuarios.nombre) AS medico_nombre,
                pacientes.nombre AS paciente_nombre, 
                turnos.fecha_hora AS fecha_hora, 
                estado_turno.nombre AS estado_nombre
            FROM turnos 
            LEFT JOIN medicos ON turnos.id_medico = medicos.id 
            LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id 
            LEFT JOIN especialidades ON medicos.id_especialidad = especialidades.id 
            LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
            LEFT JOIN obras_sociales ON pacientes.id_obraSocial = obras_sociales.id
            JOIN estado_turno ON turnos.id_estadoTurno = estado_turno.id
            ${filtro}
            ORDER BY turnos.id
            LIMIT ? OFFSET ?;
        `;
    
        let sqlCount = `
            SELECT COUNT(*) AS total
            FROM turnos
            LEFT JOIN medicos ON turnos.id_medico = medicos.id 
            LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id 
            LEFT JOIN especialidades ON medicos.id_especialidad = especialidades.id 
            LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
            LEFT JOIN obras_sociales ON pacientes.id_obraSocial = obras_sociales.id
            JOIN estado_turno ON turnos.id_estadoTurno = estado_turno.id
            ${filtro};
        `;
    
        // Validación de los tipos de datos de limit y offset
        if (typeof limit !== 'string' && typeof limit !== 'number') {
            console.log("Tipo de valor no soportado 1:", limit);
            return;
        }
        if (typeof offset !== 'string' && typeof offset !== 'number') {
            console.log("Tipo de valor no soportado 2:", offset);
            return;
        }
    
        // Validación para asegurarse de que callback sea una función
        if (typeof callback !== 'function') {
            console.error("Error: Acá está el error papu(turnoModel).");
            return;
        }
    
        // Ejecutar la consulta principal para obtener los turnos
        conx.query(sql, [limit, offset], (err, results) => {
            if (err) {
                console.error(err);
                return callback([], 0);
            }
    
            // Ejecutar la consulta de conteo para obtener el total de turnos
            conx.query(sqlCount, [], (errCount, resultCount) => {
                if (errCount) {
                    console.error(errCount);
                    return callback([], 0);
                }
                const total = resultCount[0].total;
                callback(results, total);
            });
        });
    }

    //Obtenemos datos de turnos para mostrar en el Calendario de Turnos, tanto de panel secretarias como de médicos

    seleccionarTurnosCalendario(idUsuario, categoriaUsuario, medicos, estado, fechaInicio, fechaFin, callback) {
        // Base de la consulta SQL
        let sql = `
        SELECT 
            T.*, 
            U.nombre AS medico_nombre, 
            P.nombre AS paciente_nombre 
        FROM turnos T 
        LEFT JOIN medicos M ON T.id_medico = M.id 
        LEFT JOIN usuarios U ON M.id_usuario = U.id 
        LEFT JOIN pacientes P ON T.id_paciente = P.id 
        WHERE T.fecha_hora >= ? AND T.fecha_hora <= ?`;
        
        let parametros = [fechaInicio, fechaFin];

        //para que un médico vea su propio calendario
        if (categoriaUsuario != 3) {
            sql += " AND T.id_medico = ?";
            parametros.push(idUsuario);
        }

        //filtrar por calendarios por médicos
        if (medicos.length > 0) {
            const placeholders = medicos.map(() => '?').join(',');
            sql += ` AND T.id_medico IN (${placeholders})`;
            parametros.push(...medicos);
        }

        //filtrar por estado si se ha seleccionado un estado específico
        if (estado !== 'todos') {
            sql += " AND T.id_estadoTurno = ?";
            parametros.push(estado);
        }

        conx.query(sql, parametros, (err, results) => {
            if (err) {
                console.log(err);
                callback(null);
                return;
            }

            // Mapear los resultados a un formato compatible con FullCalendar
            const elementos = results.map(elemento => {
                let color;
                switch (elemento.id_estadoTurno) {
                    case 1:
                        color = 'light-blue'; // disponible
                        break;
                    case 2:
                        color = 'orange'; // reservado
                        break;
                    case 3:
                        color = 'green'; // confirmado
                        break;
                    case 4:
                        color = 'gray';
                        break;
                    case 5:
                        color = 'red'; // cancelado
                        break;
                    default:
                        color = 'gray'; // otros
                        break;
                }

                //extraer el apellido del nombre completo del médico
                const apellido = elemento.medico_nombre ? elemento.medico_nombre.split(' ').pop() : 'Médico';

                //obtener el nombre del paciente; si no hay, es porque el turno está libre 
                const nombrePaciente = elemento.paciente_nombre ? elemento.paciente_nombre : 'Sin paciente asignado';

                //nombre completo del médico
                const nombreMedico = elemento.medico_nombre ? elemento.medico_nombre : 'Sin médico';

                //retorna el objeto de evento para mostrar en el FullCalendar
                return {
                    color: color,
                    title: `${apellido}`,
                    start: moment(elemento.fecha_hora).format("YYYY-MM-DD HH:mm:ss"),
                    end: moment(elemento.fecha_hora).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
                    extendedProps: {
                        pacienteNombre: nombrePaciente,
                        estadoTurno: elemento.id_estadoTurno,
                        nombreMedico: nombreMedico
                    }
                };
            });

            callback(elementos);
        });
    }

}

module.exports = TurnoModel;