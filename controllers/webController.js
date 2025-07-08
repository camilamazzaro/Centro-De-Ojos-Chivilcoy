const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const HorarioModel = require('../models/horarioModel');
const horarioModel = new HorarioModel();


class WebController{

    //Mostrar homepage
    async mostrarHome(req,res){
        medicoModel.listarMedicos((medicos) => {
            res.render('web/home', {
                title: 'Centro de Ojos Chivilcoy - Home',
                medicos: medicos // Pasamos los médicos a la vista
            });
        })
    }

    //Mostrar pagina nosotros
    mostrarNosotros(req,res){
        res.render('web/nosotros', {title: 'Sobre Nosotros'});
    }

    //Mostrar pagina profesionales
    mostrarProfesionales(req,res){
        medicoModel.listarMedicos((medicos) =>{
            res.render('web/profesionales', {
                title: 'Profesionales',
                medicos: medicos
            });
        })

    }

    //Mostrar pagina coberturas
    async mostrarCoberturas(req, res) {
        try {
            // Llamar a listarMedicos y obtenerObrasSociales en paralelo
            medicoModel.listarMedicos((medicos) => {
                pacienteModel.obtenerObrasSociales((obrasSociales) => {
                    // Renderizar la vista de coberturas, pasando los médicos y las obras sociales
                    res.render('web/coberturas', {
                        title: 'Coberturas Médicas',
                        medicos: medicos,
                        obrasSociales: obrasSociales
                    });
                });
            });

        } catch (error) {
            console.error('Error al obtener datos para la página de coberturas:', error);
            res.status(500).send('Error al cargar la página de coberturas');
        }
    }

    //Mostrar pagina contacto
    mostrarContacto(req,res){
        res.render('web/contacto', {title: 'Contacto'});
    }

    //Mostrar pagina "Pedir Turno"
    async mostrarPedirTurno(req, res) {
        // Como no se sabe que datos va a elegir el usuario, obligatoriamente tenemos que crear la web
        // Sin ningun dato, e ir cargandolo de a poco a medida de que el usuario seleccione datos

        pacienteModel.obtenerObrasSociales((obrasSociales) => {
            res.render('web/pedir-turno', {
                title: 'Pedir Turno',
                obras_sociales: obrasSociales
            });
        });
    }

    mostrarDiagramaAyuda(req, res) {
        res.render('web/diagrama-ayuda', {
            title: 'Diagrama de Ayuda'
        });
    }

    //Devuelve los medicos, obra sociales y especialidades disponibles con los filtros elegidos
    async cargarDatosTurno(req, res) {
        try {
            medicoModel.obtenerMedicosConTurnosPorFiltros(req.body, (medicos) => {
                res.json(medicos); // Enviamos también las prácticas asociadas a cada médico
            });
        } catch (error) {
            console.error('Error al obtener datos para la página de turnos:', error);
            res.status(500).send('Error al cargar los datos del turno');
        }
    }

    // para abrir una ruta aparte en "ver más" de profesionales
    async mostrarInfoMedico(req, res) {
        const medicoId = req.params.medicoId;
        try {
            // Obtener información del médico
            const medico = await new Promise((resolve, reject) => {
                medicoModel.obtenerMedico(medicoId, (result) => {
                    if (result) resolve(result);
                    else reject('Error al obtener el médico');
                });
            });
    
            // Obtener especialidad del médico
            const especialidades = await new Promise((resolve, reject) => {
                medicoModel.obtenerEspecialidad(medicoId, (result) => {
                    if (result) resolve(result);
                    else reject('Error al obtener especialidad');
                });
            });
    
            // Obtener horarios del médico
            const horariosMedico = await new Promise((resolve, reject) => {
                horarioModel.listarHorarios(medicoId, (result) => {
                    if (result) resolve(result);
                    else reject('Error al listar horarios');
                });
            });
    
            // Obtener prácticas del médico
            const practicasMedico = await new Promise((resolve, reject) => {
                medicoModel.obtenerPracticasPorMedico(medicoId, (result) => {
                    if (result) resolve(result);
                    else reject('Error al obtener prácticas del médico');
                });
            });
    
            // Obtener obras sociales asociadas al médico
            const coberturasMedico = await new Promise((resolve, reject) => {
                medicoModel.obtenerObrasSocialesPorMedico(medicoId, (result) => {
                    if (result) resolve(result);
                    else reject('Error al obtener obras sociales del médico');
                });
            });
    
            // Renderizar la vista con todos los datos
            res.render('web/infoMedico', {
                title: 'Información del médico',
                medico: medico,
                especialidades: especialidades,
                horarios: horariosMedico,
                practicas: practicasMedico,
                coberturas: coberturasMedico
            });
        } catch (error) {
            console.error('Error al obtener datos para la página de mostrar información del médico:', error);
            res.status(500).send('Error al cargar la página para mostrar información');
        }
    }

}

module.exports = WebController;