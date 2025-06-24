const HistoriaClinicaModel = require('../models/historiaClinicaModel');
const historiaClinicaModel = new HistoriaClinicaModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

class HistoriaClinicaController{

    async mostrarListadoHCE(req, res){
        const pacienteId = req.params.pacienteId;
        const fechaFiltro = req.query.fecha || null;
        const pagina = parseInt(req.query.pagina) || 1;
        const porPagina = 5;

        historiaClinicaModel.listarHistoriasClinicas(pacienteId, (err, datos) => {
            if (err) {
            return res.status(500).send('Error al obtener los datos del paciente');
            }

            if (datos.length === 0) {
                return res.render('historias_clinicas/listarHistoriasClinicas', {
                    paciente: {},
                    historias: [],
                    pagina: 1,
                    totalPaginas: 1,
                    fecha: fechaFiltro
                });
            }

            // separo datos del cliente
            const paciente = {
            id: datos[0].id,
            nombre: datos[0].nombre_paciente,
            dni: datos[0].dni,
            genero: datos[0].genero,
            fecha_nacimiento: datos[0].fecha_nacimiento,
            edad: datos[0].edad,
            direccion: datos[0].direccion,
            nro_afiliado: datos[0].nro_afiliado,
            cobertura: datos[0].cobertura
            };

            let historias = datos.map(row => ({
            historia_id: row.historia_id,
            fecha: row.fecha,
            motivo: row.motivo,
            antecedentes_personales: row.antecedentes_personales,
            medicacion_actual: row.medicacion_actual,
            examen_clinico: row.examen_clinico,
            diagnostico: row.diagnostico,
            tratamiento: row.tratamiento
            }));

            if(fechaFiltro){
                historias = historias.filter(h => {
                    const fecha = new Date(h.fecha).toISOString().slice(0,10);
                    return fecha === fechaFiltro;
                });
            }

            const totalHistorias = historias.length;
            const totalPaginas = Math.ceil(totalHistorias / porPagina);
            const desde = (pagina - 1) * porPagina;
            const historiasPaginadas = historias.slice(desde, desde + porPagina);

            res.render('historias_clinicas/listarHistoriasClinicas', {
                paciente,
                historias: historiasPaginadas,
                pagina,
                totalPaginas, 
                fecha: fechaFiltro,
            });
        });
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