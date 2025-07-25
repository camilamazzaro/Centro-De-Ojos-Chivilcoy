const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

class PanelPacientesController{

    async mostrarPanelPacientes(req, res) {
        try {
            const idPaciente = req.session.usuario.id_paciente;

            const turnos = await turnoModel.listarTurnosPaciente(idPaciente);

            res.render('panel/panelPacientes', {
                title: 'Panel del Paciente',
                turnos, // se pasa a la vista
            });
        } catch (error) {
            console.error('Error al listar los turnos:', error);
            res.render('panel/panelPacientes', {
                title: 'Panel del Paciente',
                turnos: [],
                error: 'No se pudieron cargar los turnos',
            });
        }
    }
}

module.exports = PanelPacientesController;