const HistoriaClinicaModel = require('../models/historiaClinicaModel');
const historiaClinicaModel = new HistoriaClinicaModel();

class HistoriaClinicaController{

    async mostrarListadoHCE(req, res){
        const pacienteId = req.params.pacienteId;

        historiaClinicaModel.listarHistoriasClinicas(pacienteId, (err, historias_clinicas) => {
            if (err) {
            return res.status(500).send('Error al obtener las historias clínicas');
            }

            res.render('historias_clinicas/listarHistoriasClinicas', {
                historias_clinicas
            }); 

        });
    }
}

module.exports = HistoriaClinicaController;