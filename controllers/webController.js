const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const HorarioModel = require('../models/horarioModel');
const horarioModel = new HorarioModel();

const UsuarioModel = require('../models/usuariosModel');
const usuarioModel = new UsuarioModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken'); //pide la librería jwt
const nodemailer = require('nodemailer');
const JWT_SECRET = 'Emilia'; //token para la asegurar la contraseña

require('dotenv').config();


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

    mostrarEquipos(req,res){
        res.render('web/equipos', {title: 'Nuestros Equipos'});
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

            if (!usuario || usuario.id_categoriaUsuario !== 4) {
                return res.status(401).json({ error: 1, message: 'Usuario no encontrado o sin permisos.' });
            }

            const passwordValido = await bcrypt.compare(password, usuario.password);

            if (!passwordValido) {
                return res.status(401).json({ error: 1, message: 'Contraseña incorrecta.' });
            }

            // guardo las variables sueltas para que el middleware las detecte
            req.session.idUsuario = usuario.id;
            req.session.categoria = usuario.id_categoriaUsuario;
            req.session.idPaciente = usuario.id_paciente; 
            req.session.nombre = usuario.nombre;
            req.session.email = usuario.email;

            req.session.save(err => {
                if (err) {
                    return res.status(500).json({ error: 1, message: 'Error de sesión' });
                }
                return res.json({ error: 0, message: 'Login exitoso.' });
            });

        } catch (err) {
            console.error('Error en login:', err);
            return res.status(500).json({ error: 1, message: 'Error interno del servidor.' });
        }
    }

    //Cambiar contraseña
    async solicitarCambioPass(req, res) {
        const { email } = req.body;
        usuarioModel.encontrarUsuarioPorMail(email, async (err, usuario) => {
            if (err || !usuario) {
                return res.status(404).json({
                    message: "No se encontró al usuario"
                });
            }
    
            // Generar el token para el enlace
            const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1h' });
    
            // Configurar el transporte de Nodemailer (asegúrate de que tus credenciales son correctas)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            // Enlace para el cambio de contraseña
            const linkReseteo = `http://localhost:3000/loginPacientes/cambiarPassword?token=${token}`;
    
            const configurarMail = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: '🔐 Solicitud para cambiar tu contraseña',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 30px; background-color: #f9f9f9;">
                    <div style="text-align: center;">
                        <img src="http://localhost:3000/public/img/logo-oscuro-coch.png" alt="Centro de Ojos Logo" style="max-width: 150px; margin-bottom: 20px;">
                    </div>
                    <h2 style="color: #005b6f; text-align: center;">Solicitud de cambio de contraseña</h2>
                    <p>Hola <strong>${usuario.nombre}</strong>,</p>
                    <p>Hemos recibido una solicitud para cambiar tu contraseña en el <strong>Panel</strong> del Centro de Ojos Chivilcoy. Si fuiste vos quien hizo esta solicitud, podés establecer una nueva contraseña haciendo clic en el botón a continuación:</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${linkReseteo}" style="background-color: #005b6f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Cambiar contraseña</a>
                    </div>

                    <p>Este enlace estará disponible por 1 hora. Si no solicitaste este cambio, simplemente ignorá este correo.</p>
                    
                    <hr style="margin: 40px 0;">
                    <p style="font-size: 12px; color: #888; text-align: center;">Centro de Ojos Chivilcoy - Todos los derechos reservados</p>
                </div>
                `,
            }; // CORREGIR: cuando tenga el dominio y hosting, cambiar localhost por la direccion correcta. 
    
            // Enviar el correo
            transporter.sendMail(configurarMail, (error) => {
                if (error) {
                    console.error("Error al enviar el correo:", error);
                    return res.status(500).json({
                        message: "Error al enviar el correo de recuperación de contraseña",
                    });
                }
                res.json({
                    message: "Correo enviado con éxito. Revisa tu bandeja de entrada.",
                });
            });
        });
    }


    async resetearPassword(req, res) {
        const { token, nuevaPassword } = req.body;

        console.log("Token recibido:", token);
        console.log("Nueva contraseña recibida:", nuevaPassword);
    
        if (!token || !nuevaPassword) {
            return res.status(400).json({
                message: "El token o la nueva contraseña no fueron proporcionados.",
            });
        }
    
        try {
            // Verificar el token
            const decoded = jwt.verify(token, JWT_SECRET);
    
            // Hashear la nueva contraseña
            const hashPassword = bcrypt.hashSync(nuevaPassword, 10);
    
            // Actualizar la contraseña en la base de datos
            usuarioModel.actualizarPassword(decoded.id, hashPassword, (err) => {
                if (err) {
                    console.error("Error al actualizar la contraseña:", err);
                    return res.status(500).json({
                        message: "Hubo un problema al actualizar la contraseña.",
                    });
                }
    
                res.json({
                    message: "La contraseña fue actualizada exitosamente.",
                });
            });
        } catch (error) {
            console.error("Error al procesar el token:", error);
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    message: "El token ha expirado. Por favor, solicite un nuevo enlace.",
                });
            }
            return res.status(400).json({
                message: "Token inválido.",
            });
        }
    }

}

module.exports = WebController;