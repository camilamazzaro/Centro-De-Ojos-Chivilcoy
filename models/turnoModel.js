//importo la conexión a la base de datos y la guardo en la constante "conx" para poder conusltar
const conx = require('../database/db');
const moment = require('moment');

class TurnoModel{

    obtenerTurnoBase(){
        return {
            id: 0,
            id_medico: '',
            id_paciente: '',
            id_practica: '',
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
            practicas.nombre AS practica,
            turnos.fecha_hora AS fecha_hora, 
            turnos.id_estado_turno,
            turno_estados.nombre AS estado_nombre
        FROM turnos 
        LEFT JOIN medicos ON turnos.id_medico = medicos.id 
        LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id 
        LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
        LEFT JOIN obras_sociales ON pacientes.id_obra_social = obras_sociales.id
        LEFT JOIN practicas ON turnos.id_practica = practicas.id
        JOIN turno_estados ON turnos.id_estado_turno = turno_estados.id
        ${filtro}
        ORDER BY 
            CASE 
                WHEN turno_estados.nombre = 'Reservado' THEN 0
                WHEN turno_estados.nombre = 'Confirmado' THEN 1
                WHEN turno_estados.nombre = 'Libre' THEN 2
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
            LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
            LEFT JOIN obras_sociales ON pacientes.id_obra_social = obras_sociales.id
            LEFT JOIN practicas ON turnos.id_practica = practicas.id
            JOIN turno_estados ON turnos.id_estado_turno = turno_estados.id
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

    async obtenerTurno(id, callback) {
        let sql = `SELECT * FROM turnos WHERE id = ?`;
        conx.query(sql, [id], async (err, results) => {
            if (err) {
                console.error("Error en obtenerTurno:", err);
                return callback(null); 
            }
            if (!results || results.length === 0) {
                return callback(null);
            } else {
                return callback(results[0]);
            }
        });
    }

    async guardarTurno(datos, callback){
        if(datos.id == 0){
            let sql = `INSERT INTO turnos (id_medico, id_paciente, id_practica, fecha_hora, id_estado_turno)`;
            sql += `VALUES (?,?,?,?,?)`;
            conx.query(sql, [datos.id_medico, datos.id_paciente, datos.id_practica, datos.fecha_hora, datos.id_estadoTurno], async (err, results)=>{
                if (err) {
                    console.error("Error en la consulta de guardarTurno:", err);
                    callback(null);
                } else {
                    console.log("Resultado de guardarTurno:", results);
                    callback(results);
                }
        });
        } else {
            let sql = `UPDATE turnos SET id_medico= ?, id_paciente= ?, id_practica=?, fecha_hora= ?, id_estado_turno= ? WHERE id = ?`;
            conx.query(sql, [datos.id_medico, datos.id_paciente, datos.id_practica, datos.fecha_hora, datos.id_estadoTurno, datos.id], async (err, results)=>{
                if (err) {
                    console.error("Error en la consulta de guardarTurno:", err);
                    callback(null);
                } else {
                    console.log("Resultado de guardarTurno:", results);
                    callback(results);
                }
        });
        }
    }

    async cancelarTurno(id, callback) {
        let sql = `UPDATE turnos SET id_estado_turno=1, id_paciente=NULL WHERE id = ?`;
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

    async reservarTurno(id_turno, id_paciente, id_practica, callback) { 
        console.log("Datos recibidos en el model para reservar el turno: ", id_turno, id_paciente, id_practica)
        const ID_ESTADO_RESERVADO = 2;
    
        let sql = `UPDATE turnos SET id_paciente = ?, id_estado_turno = ?, id_practica = ? WHERE id = ?`;
    
        conx.query(sql, [id_paciente, ID_ESTADO_RESERVADO, id_practica, id_turno], async (err, results) => {
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

        let sql = `UPDATE turnos SET id_estado_turno = ? WHERE id = ?`;

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
    
        // Antes de listar, actualizo los turnos cuya fecha ya pasó y les cambio el estado a "completado"
        conx.query(
            `UPDATE turnos SET id_estado_turno = 4 WHERE fecha_hora <= NOW() AND id_estado_turno != 4`,
            (err) => {
                if (err) {
                    console.error("Error al actualizar turnos pasados:", err);
                    return callback([], 0);
                }
    
                // Consulta principal para obtener los turnos
                let sql = `
                    SELECT 
                        turnos.id AS turno_id, 
                        CONCAT(usuarios.nombre) AS medico_nombre,
                        pacientes.nombre AS paciente_nombre, 
                        practicas.nombre AS practica,
                        turnos.fecha_hora AS fecha_hora, 
                        turnos.id_estado_turno,
                        turno_estados.nombre AS estado_nombre
                    FROM turnos 
                    LEFT JOIN medicos ON turnos.id_medico = medicos.id 
                    LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id  
                    LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
                    LEFT JOIN obras_sociales ON pacientes.id_obra_social = obras_sociales.id
                    LEFT JOIN practicas ON turnos.id_practica = practicas.id
                    JOIN turno_estados ON turnos.id_estado_turno = turno_estados.id
                    WHERE turnos.id_medico = ? 
                    ${filtro ? `AND (${filtro})` : ''}
                    ORDER BY 
                        CASE 
                            WHEN turno_estados.nombre = 'Confirmado' THEN 0
                            WHEN turno_estados.nombre = 'Reservado' THEN 1
                            WHEN turno_estados.nombre = 'Libre' THEN 2
                            ELSE 3
                        END,
                        turnos.fecha_hora ASC
                    LIMIT ? OFFSET ?;
                `;
    
                // Consulta para obtener el conteo total de turnos
                let sqlCount = `
                    SELECT COUNT(*) AS total
                    FROM turnos 
                    LEFT JOIN medicos ON turnos.id_medico = medicos.id 
                    LEFT JOIN usuarios ON medicos.id_usuario = usuarios.id 
                    LEFT JOIN pacientes ON turnos.id_paciente = pacientes.id
                    LEFT JOIN obras_sociales ON pacientes.id_obra_social = obras_sociales.id
                    LEFT JOIN practicas ON turnos.id_practica = practicas.id
                    JOIN turno_estados ON turnos.id_estado_turno = turno_estados.id
                    WHERE turnos.id_medico = ? 
                    ${filtro ? `AND (${filtro})` : ''};
                `;
    
                // Validación para asegurarse de que callback sea una función
                if (typeof callback !== 'function') {
                    console.error("Error: El parámetro callback no es una función.");
                    return;
                }
    
                // Ejecutar la consulta principal para obtener los turnos
                conx.query(sql, [medicoId, limit, offset], (err, results) => {
                    if (err) {
                        console.error("Error al obtener los turnos:", err);
                        return callback([], 0);
                    }
    
                    // Ejecutar la consulta de conteo para obtener el total de turnos
                    conx.query(sqlCount, [medicoId], (errCount, resultCount) => {
                        if (errCount) {
                            console.error("Error al contar los turnos:", errCount);
                            return callback([], 0);
                        }
                        const total = resultCount[0].total;
                        callback(results, total);
                    });
                });
            }
        );
    }
    

    //Obtenemos datos de turnos para mostrar en el Calendario de Turnos, tanto de panel secretarias como de médicos

    seleccionarTurnosCalendario(medicos, estado, fechaInicio, fechaFin, callback) { //idUsuario, categoriaUsuario, 
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
        // if (categoriaUsuario != 3) {
        //     sql += " AND T.id_medico = ?";
        //     parametros.push(idUsuario);
        // }

        //filtrar por calendarios por médicos
        if (medicos.length > 0) {
            const placeholders = medicos.map(() => '?').join(',');
            sql += ` AND T.id_medico IN (${placeholders})`;
            parametros.push(...medicos);
        }

        //filtrar por estado si se ha seleccionado un estado específico
        if (estado !== 'todos') {
            sql += " AND T.id_estado_turno = ?";
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
                        estadoTurno: elemento.id_estado_turno,
                        nombreMedico: nombreMedico
                    }
                };
            });

            callback(elementos);
        });
    }

    async listarTurnosPaciente(id_paciente) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT 
                t.fecha_hora,
                u.nombre AS medico,
                p.nombre AS practica,
                e.nombre AS estado
            FROM turnos t
            INNER JOIN medicos m ON t.id_medico = m.id
            INNER JOIN usuarios u ON m.id_usuario = u.id
            LEFT JOIN practicas p ON t.id_practica = p.id
            LEFT JOIN turno_estados e ON t.id_estado_turno = e.id
            WHERE t.id_paciente = ?
            ORDER BY t.fecha_hora DESC
            `;

            conx.query(sql, [id_paciente], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(results);
            });
        });
    }

    // PACIENTES
    async obtenerPorPaciente(idPaciente) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    t.id, 
                    DATE_FORMAT(t.fecha_hora, '%Y-%m-%d') as fecha,
                    DATE_FORMAT(t.fecha_hora, '%H:%i') as hora,
                    u.nombre as nombre_medico,
                    p.nombre as nombre_practica,
                    te.nombre as estado,
                    
                    -- DATOS AGREGADOS:
                    os.nombre as nombre_obra_social,
                    pac.nro_afiliado

                FROM turnos t
                INNER JOIN medicos m ON t.id_medico = m.id
                INNER JOIN usuarios u ON m.id_usuario = u.id
                LEFT JOIN practicas p ON t.id_practica = p.id
                LEFT JOIN turno_estados te ON t.id_estado_turno = te.id
                
                -- JOINS NUEVOS PARA DATOS DEL PACIENTE:
                INNER JOIN pacientes pac ON t.id_paciente = pac.id
                LEFT JOIN obras_sociales os ON pac.id_obra_social = os.id
                
                WHERE t.id_paciente = ?
                ORDER BY t.fecha_hora DESC
            `;

            conx.query(query, [idPaciente], (err, results) => {
                if (err) {
                    console.error("Error en obtenerPorPaciente:", err);
                    reject(err);
                } else {
                    resolve(results); 
                }
            });
        });
    }

    listarTurnosPorPaciente(idPaciente, callback) {
        const sql = `
            SELECT 
                t.id, t.fecha_hora, t.id_estado_turno,
                COALESCE(u.nombre, 'Médico no disponible') as medico_nombre,
                COALESCE(et.nombre, 'Desconocido') as estado_nombre,
                COALESCE(pr.nombre, 'Consulta General') as practica
            FROM turnos t
            LEFT JOIN medicos m ON t.id_medico = m.id
            LEFT JOIN usuarios u ON m.id_usuario = u.id
            LEFT JOIN turno_estados et ON t.id_estado_turno = et.id
            LEFT JOIN practicas pr ON t.id_practica = pr.id
            WHERE t.id_paciente = ?
            ORDER BY t.fecha_hora ASC
        `;
        
        conx.query(sql, [idPaciente], (err, results) => {
            if (err) {
                console.error("Error SQL:", err);
                return callback([]);
            }
            callback(results);
        });
    }
    
    obtenerPerfil(idPaciente, callback) {
    const query = `
        SELECT 
            p.*, 
            os.nombre as nombre_obra_social 
        FROM pacientes p
        LEFT JOIN obras_sociales os ON p.id_obra_social = os.id
        WHERE p.id = ?
    `;

    conx.query(query, [idPaciente], (err, results) => {
        if (err) {
            console.error("Error obteniendo perfil paciente:", err);
            return callback(null);
        }
        return callback(results[0]); 
    });
}

// Obtener turnos que están reservados (estado 2) para confirmar
    obtenerTurnosReservados(callback) {
        const sql = `
            SELECT 
                t.id, 
                t.fecha_hora, 
                u.nombre as nombre_medico,  
                p.nombre as nombre_paciente 
            FROM turnos t
            JOIN medicos m ON t.id_medico = m.id
            JOIN usuarios u ON m.id_usuario = u.id  
            JOIN pacientes p ON t.id_paciente = p.id
            WHERE t.id_estado_turno = 2 
            ORDER BY t.fecha_hora ASC
        `;
        
        conx.query(sql, (err, results) => {
            if (err) {
                console.error("Error en obtenerTurnosReservados:", err); 
                throw err;
            }
            callback(results);
        });
    }

    // Cambiar estado de un turno (usado para confirmar)
    cambiarEstado(idTurno, idNuevoEstado, callback) {
        const sql = "UPDATE turnos SET id_estado_turno = ? WHERE id = ?";
        console.log("💾 [MODEL] Ejecutando SQL:", sql);
        console.log("💾 [MODEL] Datos: Estado =", idNuevoEstado, ", ID =", idTurno);
        
        conx.query(sql, [idNuevoEstado, idTurno], (err, result) => {
            if (err) {
                console.error("🔥 [MODEL] Error SQL FATAL:", err); // <--- AQUÍ VEREMOS EL ERROR REAL
                return callback(err, null);
            }
            console.log("💾 [MODEL] SQL ejecutado correctamente. Filas afectadas:", result.affectedRows);
            callback(null, result);
        });
    }

    obtenerDetalleTurno(idTurno, callback) {
        const sql = `
            SELECT 
                t.id, 
                t.fecha_hora, 
                u.nombre as nombre_medico,   
                p.nombre as nombre_paciente, 
                p.email as email_paciente    
            FROM turnos t
            LEFT JOIN medicos m ON t.id_medico = m.id
            LEFT JOIN usuarios u ON m.id_usuario = u.id
            LEFT JOIN pacientes p ON t.id_paciente = p.id
            WHERE t.id = ?
        `;
        
        conx.query(sql, [idTurno], (err, results) => {
            if (err) {
                console.error("Error SQL en obtenerDetalleTurno:", err);
                return callback(err, null);
            }
            callback(null, results[0] || null);
        });
    }
}

module.exports = TurnoModel;