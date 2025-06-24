const conx = require('../database/db');

class HistoriaClinicaModel{

    listarHistoriasClinicas(idPaciente, callback){
        const query = `
            SELECT * FROM historias_clinicas
            WHERE id_paciente = ?
            ORDER BY fecha DESC
        `;

        conx.query(query, [idPaciente], (error, resultados) => {
            if (error) {
            return callback(error, null);
            }
            callback(null, resultados);
        });
    }

}

module.exports = HistoriaClinicaModel;