const conx = require('../database/db');

class HistoriaClinicaModel{

    listarHistoriasClinicas(idPaciente, callback){
        const query = `
            SELECT 
                hc.id AS historia_id,  
                hc.fecha,
                hc.motivo,
                hc.antecedentes_personales,
                hc.medicacion_actual,
                hc.examen_clinico,
                hc.diagnostico,
                hc.tratamiento,
                p.id,
                p.nombre AS nombre_paciente,
                p.dni,
                p.genero,
                p.fecha_nacimiento,
                p.nro_afiliado,
                TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad,
                p.direccion,
                os.nombre AS cobertura
            FROM historias_clinicas hc
            JOIN pacientes p ON hc.id_paciente = p.id
            JOIN obras_sociales os ON p.id_obra_social = os.id
            WHERE p.id = ?
            ORDER BY hc.fecha DESC
        `;

        conx.query(query, [idPaciente], (error, resultados) => {
            if (error) {
            return callback(error, null);
            }
            callback(null, resultados);

            console.log(resultados);
        });
        
    }

    agregarHistoriaClinica(datos, callback) {
        const query = `
            INSERT INTO historias_clinicas 
            (fecha, id_paciente, motivo, antecedentes_personales, medicacion_actual, examen_clinico, diagnostico, tratamiento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            datos.fecha,                
            datos.id_paciente,          
            datos.motivo,
            datos.antecedentes_personales,
            datos.medicacion_actual,
            datos.examen_clinico,
            datos.diagnostico,
            datos.tratamiento
        ];

        conx.query(query, valores, (error, resultado) => {
            if (error) return callback(error, null);
            callback(null, resultado);
        });
    }

    actualizarHistoriaClinica(idHistoria, datos, callback) {
        const query = `
            UPDATE historias_clinicas
            SET motivo = ?, 
                antecedentes_personales = ?, 
                medicacion_actual = ?, 
                examen_clinico = ?, 
                diagnostico = ?, 
                tratamiento = ?
            WHERE id = ?
        `;

        const valores = [
            datos.motivo,
            datos.antecedentes_personales,
            datos.medicacion_actual,
            datos.examen_clinico,
            datos.diagnostico,
            datos.tratamiento,
            idHistoria
        ];

        conx.query(query, valores, (err, resultado) => {
            if (err) return callback(err, null);
            callback(null, resultado);
        });

    }

    
    obtenerHistoriaClinica(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM historias_clinicas WHERE id = ?';
            conx.query(query, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });
    }
}

module.exports = HistoriaClinicaModel;