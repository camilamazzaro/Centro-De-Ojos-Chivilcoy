const conx = require('../database/db');

class RecetaModel{
    crearReceta(datos, archivos) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO recetas 
                (id_paciente, id_medico, fecha, tratamiento, diagnostico, indicaciones, comentarios, firma_manuscrita, firma_digital, archivo_firma_manuscrita, archivo_firma_digital, copias, formato_pdf) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const rutaManuscrita = archivos['archivo_manuscrita'] ? archivos['archivo_manuscrita'][0].filename : null;
            const rutaDigital = archivos['archivo_digital'] ? archivos['archivo_digital'][0].filename : null;

            const params = [
                datos.id_paciente,
                datos.medico,
                datos.fecha,
                datos.tratamiento,
                datos.diagnostico || null,
                datos.indicaciones || null,
                datos.comentarios || null,
                datos.firma_manuscrita === 'true' ? 1 : 0, 
                datos.firma_digital === 'true' ? 1 : 0,
                rutaManuscrita, 
                rutaDigital,    
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
                SELECT r.*, u.nombre as medico_nombre 
                FROM recetas r
                INNER JOIN medicos m ON r.id_medico = m.id
                INNER JOIN usuarios u ON m.id_usuario = u.id
                WHERE r.id_paciente = ?
                ORDER BY r.fecha DESC
            `;
            // Asegúrate que aquí diga 'conx' o 'pool' según corresponda a tu archivo
            conx.query(sql, [idPaciente], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    editarReceta(idReceta, datos, archivos) {
        return new Promise((resolve, reject) => {
            
            const nuevaManuscrita = archivos['archivo_manuscrita'] ? archivos['archivo_manuscrita'][0].filename : null;
            const nuevaDigital = archivos['archivo_digital'] ? archivos['archivo_digital'][0].filename : null;

            const esManuscrita = (datos.firma_manuscrita === 'true' || datos.firma_manuscrita === 'on' || datos.firma_manuscrita == 1) ? 1 : 0;
            const esDigital = (datos.firma_digital === 'true' || datos.firma_digital === 'on' || datos.firma_digital == 1) ? 1 : 0;

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
                    copias = ?,
                    -- Si nuevaManuscrita es NULL, deja el valor que estaba. Si tiene valor, lo actualiza.
                    archivo_firma_manuscrita = COALESCE(?, archivo_firma_manuscrita),
                    archivo_firma_digital = COALESCE(?, archivo_firma_digital)
                WHERE id = ?
            `;
            
            const params = [
                datos.fecha,
                datos.medico, 
                datos.tratamiento,
                datos.diagnostico || null,
                datos.indicaciones || null,
                datos.comentarios || null,
                esManuscrita,
                esDigital,
                datos.copias,
                nuevaManuscrita, 
                nuevaDigital,    
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

    // Método para obtener TODOS los datos de la receta + Paciente + Médico
    obtenerPorIdCompleto(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    r.*, 
                    
                    -- DATOS DEL PACIENTE
                    p.nombre AS paciente_nombre, 
                    p.dni AS paciente_dni, 
                    os.nombre AS obra_social,  -- AQUI ESTABA EL ERROR: Sacamos el nombre de la tabla os
                    p.nro_afiliado,

                    -- DATOS DEL MÉDICO
                    -- Nota: Tu tabla 'medicos' no tiene columna nombre, tiene 'id_usuario'. 
                    -- Hago JOIN con 'usuarios' para sacar el nombre real.
                    u.nombre AS medico_nombre, 
                    m.matricula AS medico_matricula,
                    
                    -- Nota: Tu tabla 'medicos' no tiene columna 'especialidad', tiene 'descripcion'.
                    -- Si 'descripcion' es la especialidad, usa m.descripcion. Si no, ajusta esto.
                    m.descripcion AS especialidad

                FROM recetas r
                -- Unimos con Pacientes
                JOIN pacientes p ON r.id_paciente = p.id
                -- Unimos con Obras Sociales (PARA ARREGLAR TU ERROR ACTUAL)
                JOIN obras_sociales os ON p.id_obra_social = os.id
                -- Unimos con Médicos
                JOIN medicos m ON r.id_medico = m.id
                -- Unimos con Usuarios (PARA OBTENER EL NOMBRE DEL MÉDICO)
                JOIN usuarios u ON m.id_usuario = u.id
                
                WHERE r.id = ?
            `;

            conx.query(sql, [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });
    }
}


module.exports = RecetaModel;