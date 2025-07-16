const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const HorarioModel = require('../models/horarioModel');
const horarioModel = new HorarioModel();

const UsuarioModel = require('../models/usuariosModel');
const usuarioModel = new UsuarioModel();

const bcrypt = require('bcrypt');

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
        res.render('web/ayuda-pedir-turno', {
            title: 'Cómo pedir un turno'
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
            res.render('web/info-medico', {
                title: 'Información del médico',
                medico: medico,
                horarios: horariosMedico,
                practicas: practicasMedico,
                coberturas: coberturasMedico
            });
        } catch (error) {
            console.error('Error al obtener datos para la página de mostrar información del médico:', error);
            res.status(500).send('Error al cargar la página para mostrar información');
        }
    }

    async mostrarPanelPacientes(req,res){
        res.render('web/panel-pacientes', {
            title: 'Centro de Ojos Chivilcoy - Panel de Pacientes',
        });
    }
    async mostrarRegistroPacientes(req,res){
        try {
            // Obtener las obras sociales para el formulario
            const obrasSociales = await new Promise((resolve, reject) => {
                pacienteModel.obtenerObrasSociales((result) => {
                    if (!result) reject(new Error("No se encontraron obras sociales"));
                    resolve(result);
                });
            });

            // Renderizar la vista de agregar paciente
            res.render("../views/pacientes/registroPaciente", {
                paciente: pacienteModel.obtenerPacienteBase(), obrasSociales
            });
        } catch (error) {
            console.error("Error al mostrar el formulario de agregar paciente:", error);
            res.status(500).send("Error al cargar el formulario de agregar paciente.");
        }
    }

    async mostrarLoginPacientes(req, res){
        res.render('pacientes/loginPacientes', {
            title: 'Centro de Ojos Chivilcoy - Login Pacientes',
        });
    }

    async loginPaciente (req, res) {
        const { email, password } = req.body;

        try {
            const usuario = await usuarioModel.buscarPorEmail(email);

            console.log("Usuario encontrado: ", usuario);
            if (!usuario || usuario.id_categoriaUsuario !== 4) {
                return res.status(401).json({ error: 1, message: 'Usuario no encontrado o sin permisos.' });
            }

            const passwordValido = await bcrypt.compare(password, usuario.password);

            if (!passwordValido) {
                return res.status(401).json({ error: 1, message: 'Contraseña incorrecta.' });
            }

            // Podés guardar info en sesión si estás usando express-session:
            req.session.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                id_categoriaUsuario: usuario.id_categoriaUsuario,
                id_paciente: usuario.id_paciente
            };

            return res.json({ error: 0, message: 'Login exitoso.', usuario: req.session.usuario });

        } catch (err) {
            console.error('Error en login:', err);
            return res.status(500).json({ error: 1, message: 'Error interno del servidor.' });
        }
    }

}

module.exports = WebController;