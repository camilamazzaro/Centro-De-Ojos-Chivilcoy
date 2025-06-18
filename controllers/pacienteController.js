//importo el model para poder acceder a las funciones que interactuan con la bbdd
const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();
const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();
const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();


class PacienteController {

    //funcion para listar los pacientes
    async listarPacientes (req, res) {

        let {page, limit, id_obrasocial, buscador} = req.query;
        
        page = parseInt(page) || 1; // Me aseguro de darles un valor por defecto para que no se rompa el código.
        limit = parseInt(limit) || 10;
        
        const offset = (page - 1) * limit;

        const filtros = {
            id_obrasocial: id_obrasocial || 0,
            buscador: buscador || '',
        }

        const obrasSociales = await new Promise((resolve, reject) => {
                pacienteModel.obtenerObrasSociales((result) => {
                    if (!result) reject(new Error("No se encontraron obras sociales"));
                    resolve(result);
                });
            });

        pacienteModel.listarPacientes(limit, offset, filtros, (pacientes, total) => {
            if (!pacientes || pacientes.length === 0) {
                console.log("No se encontraron pacientes.");
            } 

            const totalPages = Math.ceil(total / limit);

            res.render("../views/pacientes/listarPacientes", {
                pacientes: pacientes,
                currentPage: parseInt(page),
                totalPages: totalPages,
                currentFilters: filtros,
                limit: limit,
                obrasSociales
            }); //Antes no me funcionaba por no pasar la variable pacientes como parametro en el render
        });
    };

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
    async crearPaciente(req, res){
        try{
            const { nombre_apellido, dni, fecha_nacimiento, genero, direccion, telefono, email, cobertura, nro_afiliado } = req.body;


            const nuevoPaciente = {
                nombre_apellido,
                dni,
                fecha_nacimiento,
                genero,
                direccion,
                telefono,
                email,
                cobertura,
                nro_afiliado,
            };

            const pacienteCreado = await pacienteModel.crearPaciente(nuevoPaciente);

            return res.status(201).json({error: 0, message: "Paciente registrado exitosamente.", pacienteCreado});
        }catch(err){
            console.error("Error al registrar al paciente:", err);
            return res.status(500).json({error: 1, message: "Error al registrar al paciente."});
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
}

//exporto el controller con la funcion de listar
module.exports = PacienteController;