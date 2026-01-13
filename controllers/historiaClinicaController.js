const HistoriaClinicaModel = require('../models/historiaClinicaModel');
const historiaClinicaModel = new HistoriaClinicaModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const RecetaModel = require('../models/recetaModel');
const recetaModel = new RecetaModel();

const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

class HistoriaClinicaController{

    async mostrarListadoHCE(req, res) {
        const pacienteId = req.params.pacienteId; 
        const fechaFiltro = req.query.fecha || null;
        const pagina = parseInt(req.query.pagina) || 1;
        const porPagina = 5;

        try {
            const paciente = await pacienteModel.obtenerPaciente(pacienteId);

            if (!paciente) {
                return res.status(404).send("Paciente no encontrado");
            }

            let recetas = [];
            try {
                recetas = await recetaModel.listarPorPaciente(pacienteId); 
            } catch (error) {
                console.error("Error buscando recetas:", error);
            }

            let medicos = [];
            try {

                medicos = await medicoModel.listarMedicosAsync(); 
            } catch (error) {
                console.error("Error buscando médicos:", error);
            }

            historiaClinicaModel.listarHistoriasClinicas(pacienteId, (err, datos) => {
                if (err) {
                    return res.status(500).send('Error al obtener historias clínicas');
                }

                let historias = datos.map(row => ({
                    historia_id: row.historia_id,
                    fecha: row.fecha,
                    motivo: row.motivo,
                    diagnostico: row.diagnostico,
                    tratamiento: row.tratamiento
                }));

                // Filtro por fecha
                if (fechaFiltro) {
                    historias = historias.filter(h => {
                        const fecha = new Date(h.fecha).toISOString().slice(0, 10);
                        return fecha === fechaFiltro;
                    });
                }

                // Paginación
                const totalHistorias = historias.length;
                const totalPaginas = Math.ceil(totalHistorias / porPagina);
                const desde = (pagina - 1) * porPagina;
                const historiasPaginadas = historias.slice(desde, desde + porPagina);

                res.render('historias_clinicas/listarHistoriasClinicas', {
                    paciente: paciente,
                    historias: historiasPaginadas,
                    recetas: recetas,
                    medicos: medicos, 
                    pagina: pagina,
                    totalPaginas: totalPaginas,
                    fecha: fechaFiltro
                });
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async mostrarAgregarHCE(req, res) {
        try {
            const pacienteId = req.params.pacienteId;

            const paciente = await pacienteModel.obtenerPaciente(pacienteId);

            if (!paciente) {
                return res.status(404).send('Paciente no encontrado');
            }

            res.render('historias_clinicas/agregarHistoriaClinica', {
                pacienteId,
                paciente
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los datos del paciente');
        }
    }

    async guardarHistoriaClinica(req, res) {
        const pacienteId = req.params.pacienteId;

        const nuevaHistoria = {
            fecha: new Date(),
            id_paciente: pacienteId,
            motivo: req.body.motivo,
            antecedentes_personales: req.body.antecedentes_personales,
            medicacion_actual: req.body.medicacion_actual,
            examen_clinico: req.body.examen_clinico,
            diagnostico: req.body.diagnostico,
            tratamiento: req.body.tratamiento
        };

        historiaClinicaModel.agregarHistoriaClinica(nuevaHistoria, (err, resultado) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al guardar historia clínica' });
            }

            res.status(200).json({ mensaje: 'Historia clínica guardada correctamente' });
        });
    }

    async mostrarEditarHCE(req, res) {
        try {
            const pacienteId = req.params.pacienteId;
            const historiaId = req.params.historiaId;

            const paciente = await pacienteModel.obtenerPaciente(pacienteId);
            if (!paciente) {
                return res.status(404).send('Paciente no encontrado');
            }

            const historiaClinica = await historiaClinicaModel.obtenerHistoriaClinica(historiaId);
            if (!historiaClinica) {
                return res.status(404).send('Historia clínica no encontrada');
            }

            res.render('historias_clinicas/editarHistoriaClinica', {
                pacienteId,
                paciente,
                historiaClinica
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los datos');
        }
    }

    editarHistoriaClinica(req, res) {
        const historiaId = req.params.historiaId;
        const pacienteId = req.params.pacienteId;

        const datosActualizados = {
            motivo: req.body.motivo,
            antecedentes_personales: req.body.antecedentes_personales,
            medicacion_actual: req.body.medicacion_actual,
            examen_clinico: req.body.examen_clinico,
            diagnostico: req.body.diagnostico,
            tratamiento: req.body.tratamiento
        };

        historiaClinicaModel.actualizarHistoriaClinica(historiaId, datosActualizados, (err, resultado) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al actualizar historia clínica' });
            }
            res.status(200).json({ mensaje: 'Historia clínica actualizada correctamente' });
        });
    }

}

module.exports = HistoriaClinicaController;