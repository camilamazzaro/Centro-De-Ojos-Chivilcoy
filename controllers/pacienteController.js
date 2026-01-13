//importo el model para poder acceder a las funciones que interactuan con la bbdd
const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

const UsuarioModel = require('../models/usuariosModel');
const usuarioModel = new UsuarioModel();

const RecetaModel = require('../models/recetaModel');
const recetaModel = new RecetaModel();

const bcrypt = require('bcrypt');

class PacienteController {

    //funcion para listar los pacientes
    async listarPacientes (req, res) {
        let { page, limit, id_obrasocial, buscador } = req.query;
        
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const filtros = {
            id_obrasocial: id_obrasocial || 0,
            buscador: buscador || '',
        };

        try {
            const obrasSociales = await new Promise((resolve, reject) => {
                pacienteModel.obtenerObrasSociales((result) => {
                    if (!result) return reject("No se encontraron obras sociales");
                    resolve(result);
                });
            });

            const medicos = await medicoModel.listarMedicosAsync(); 

            pacienteModel.listarPacientes(limit, offset, filtros, (pacientes, total) => {
                if (!pacientes) {
                    return res.render("pacientes/listarPacientes", {
                        pacientes: [],
                        currentPage: page,
                        totalPages: 1,
                        currentFilters: filtros,
                        limit,
                        obrasSociales,
                        medicos // <- se pasa a la vista
                    });
                }

                const totalPages = Math.ceil(total / limit);

                res.render("pacientes/listarPacientes", {
                    pacientes,
                    currentPage: page,
                    totalPages,
                    currentFilters: filtros,
                    limit,
                    obrasSociales,
                    medicos 
                });
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }


    //funcion para actualizar datos de los pacientes
    async editarPaciente(req, res) {
        const { id } = req.params;
        const datosActualizados = req.body;

        try {

            // Actualizar datos
            const actualizado = await pacienteModel.editarPaciente(id, datosActualizados);
            if(actualizado){
                res.json({ mensaje: "Paciente actualizado con éxito", paciente: datosActualizados });
            } else {
                res.status(500).json({ error: "Error al actualizar el paciente" });
            }

        } catch(error){
            console.error("Error al actualizar paciente:", error);
            res.status(500).json({ error: "Error al actualizar el cliente" });
        }
    }

    // Función para mostrar el formulario de agregar pacientes
    async mostrarAgregarPaciente(req, res) {
        try {
            // Obtener las obras sociales para el formulario
            const obrasSociales = await new Promise((resolve, reject) => {
                pacienteModel.obtenerObrasSociales((result) => {
                    if (!result) reject(new Error("No se encontraron obras sociales"));
                    resolve(result);
                });
            });

            // Renderizar la vista de agregar paciente
            res.render("../views/pacientes/agregarPaciente", {
                paciente: pacienteModel.obtenerPacienteBase(), obrasSociales
            });
        } catch (error) {
            console.error("Error al mostrar el formulario de agregar paciente:", error);
            res.status(500).send("Error al cargar el formulario de agregar paciente.");
        }
    }

    // AGREGAR PACIENTE POR PASOS

    // Guardar Paso 1
    guardarInfoPersonal(req, res){
        const { nombre_apellido, dni, fecha_nacimiento, genero, direccion, telefono, email} = req.body;

        res.json({ success: true, message: "Datos personales guardados temporalmente."});
    }

    // Guardar Paso 2
    guardarInfoMedica(req, res){
        const { cobertura, nro_afiliado } = req.body;

        res.json({ success: true, message: "Datos personales guardados temporalmente."});
    }

    // Crear paciente

    async crearPaciente(req, res) {
        try {
            const {
            nombre_apellido,
            dni,
            fecha_nacimiento,
            genero,
            direccion,
            telefono,
            email,
            cobertura,
            nro_afiliado,
            password       // viene sólo en el registro de paciente web
            } = req.body;


            // Verificar si paciente ya existe por DNI
            let paciente = await pacienteModel.buscarPacientePorDni(dni);

            if (paciente) {
            // Actualizar paciente existente (si es necesario)
            await pacienteModel.editarPaciente(paciente.id, {
                nombre_apellido,
                dni,
                fecha_nacimiento,
                genero,
                direccion,
                telefono,
                email,
                cobertura,
                nro_afiliado,
            });
            } else {
            // Crear nuevo paciente
            paciente = await pacienteModel.crearPaciente({
                nombre_apellido,
                dni,
                fecha_nacimiento,
                genero,
                direccion,
                telefono,
                email,
                cobertura,
                nro_afiliado,
            });
            }

            // Si viene password => crear usuario para paciente
            if (password) {
            // Hashear password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario con id_paciente vinculado
            await usuarioModel.registrarUsuario({
                nombre: nombre_apellido,
                email,
                password: hashedPassword,
                categoria: 4, 
                id_paciente: paciente.id,
            });
            }

            return res.status(201).json({ error: 0, message: 'Paciente registrado exitosamente.', paciente });
        } catch (err) {
            console.error('Error al registrar al paciente:', err);
            return res.status(500).json({ error: 1, message: 'Error al registrar al paciente.' });
        }
    }


    //funcion para eliminar pacientes
    async eliminarPaciente(req, res) {
        const id = req.params.id;
        pacienteModel.eliminarPaciente(id, (result) => {
            if (!result) {
                return res.status(500).send("Error al eliminar el paciente.");
            } else {
            res.redirect('/pacientes'); // Redirige a la lista de pacientes tras eliminar
            }
        });
    } 

    // RECETAS DIGITALES ---------------------------------------------------
    async crearReceta(req, res) {
        try {
            const datosReceta = req.body;

            if (!datosReceta.id_paciente || !datosReceta.medico || !datosReceta.tratamiento) {
                return res.status(400).json({ 
                    success: false, 
                    mensaje: "Faltan datos obligatorios (Paciente, Médico o Tratamiento)." 
                });
            }

            await recetaModel.crearReceta(datosReceta);

            res.json({ success: true, mensaje: "Receta creada exitosamente." });

        } catch (error) {
            console.error("Error al crear receta:", error);
            res.status(500).json({ success: false, mensaje: "Error interno al guardar la receta." });
        }
    }

    async editarReceta(req, res) {
        try {
            const datos = req.body;
            const idReceta = datos.id_receta; 

            if (!idReceta) {
                return res.status(400).json({ success: false, mensaje: "ID de receta no válido." });
            }

            await recetaModel.editarReceta(idReceta, datos);

            res.json({ success: true, mensaje: "Receta actualizada correctamente." });

        } catch (error) {
            console.error("Error al editar receta:", error);
            res.status(500).json({ success: false, mensaje: "Error interno al guardar los cambios." });
        }
    }

    async eliminarReceta(req, res) {
        try {
            const { id } = req.params;
            
            await recetaModel.eliminarReceta(id);

            res.json({ success: true, mensaje: "Receta eliminada correctamente." });

        } catch (error) {
            console.error("Error al eliminar receta:", error);
            res.status(500).json({ success: false, mensaje: "Error al eliminar la receta." });
        }
    }
}

module.exports = PacienteController;