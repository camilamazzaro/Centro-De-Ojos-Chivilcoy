const conx = require('../database/db');

class RecetaModel{
    crearReceta(datos) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO recetas 
                (id_paciente, id_medico, fecha, tratamiento, diagnostico, indicaciones, comentarios, firma_manuscrita, firma_digital, copias, formato_pdf) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                datos.id_paciente,
                datos.medico, 
                datos.fecha,
                datos.tratamiento,
                datos.diagnostico || null,
                datos.indicaciones || null,
                datos.comentarios || null,
                datos.firma_manuscrita ? 1 : 0, // Convertir checkbox 'on' a 1
                datos.firma_digital ? 1 : 0,    // Convertir checkbox 'on' a 1
                datos.copias,
                datos.formato_pdf
            ];

            conx.query(sql, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    listarPorPaciente(idPaciente) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, u.nombre as nombre_medico 
                FROM recetas r
                INNER JOIN medicos m ON r.id_medico = m.id
                INNER JOIN usuarios u ON m.id_usuario = u.id
                WHERE r.id_paciente = ?
                ORDER BY r.fecha DESC
            `;
            conx.query(sql, [idPaciente], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    editarReceta(idReceta, datos) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE recetas 
                SET 
                    fecha = ?, 
                    id_medico = ?, 
                    tratamiento = ?, 
                    diagnostico = ?, 
                    indicaciones = ?, 
                    comentarios = ?, 
                    firma_manuscrita = ?, 
                    firma_digital = ?, 
                    copias = ? 
                WHERE id = ?
            `;
            
            const params = [
                datos.fecha,
                datos.medico, 
                datos.tratamiento,
                datos.diagnostico || null,
                datos.indicaciones || null,
                datos.comentarios || null,
                datos.firma_manuscrita ? 1 : 0,
                datos.firma_digital ? 1 : 0,
                datos.copias,
                idReceta 
            ];

            conx.query(sql, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    eliminarReceta(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM recetas WHERE id = ?";
            conx.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}


module.exports = RecetaModel;