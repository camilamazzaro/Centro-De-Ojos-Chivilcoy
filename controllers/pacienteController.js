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

// Para manejar el pdf de recetas digitales
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

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

            const archivos = req.files || {};

            if (!datosReceta.id_paciente || !datosReceta.medico || !datosReceta.tratamiento) {
                return res.status(400).json({ 
                    success: false, 
                    mensaje: "Faltan datos obligatorios (Paciente, Médico o Tratamiento)." 
                });
            }

            await recetaModel.crearReceta(datosReceta, archivos);

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
            
            const archivos = req.files || {};

            if (!idReceta) {
                return res.status(400).json({ success: false, mensaje: "ID de receta no válido." });
            }

            await recetaModel.editarReceta(idReceta, datos, archivos);

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

    async generarPdfReceta(req, res) {
        try {
            const idReceta = req.params.id;
            
            const receta = await recetaModel.obtenerPorIdCompleto(idReceta);

            if (!receta) {
                return res.status(404).send("Receta no encontrada");
            }

            // ---------------------------------------------------------
            // FUNCIÓN AUXILIAR: Convertir archivo local a Base64
            // ---------------------------------------------------------
            const convertirABase64 = (nombreArchivo) => {
                if (!nombreArchivo) return null;


                const ruta = path.join(process.cwd(), 'public', 'uploads', nombreArchivo);
                
                if (fs.existsSync(ruta)) {
                    const ext = path.extname(nombreArchivo).toLowerCase();
                    let mime = 'image/png'; 
                    if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
                    if (ext === '.svg') mime = 'image/svg+xml';

                    const bitmap = fs.readFileSync(ruta);
                    return `data:${mime};base64,${bitmap.toString('base64')}`; 
                } else {
                    console.error("ERROR: No se encontró el archivo:", ruta);
                    return null;
                }
            };

            // ---------------------------------------------------------
            // 2. PROCESAR FIRMAS (MANUSCRITA Y DIGITAL)
            // ---------------------------------------------------------
            let imgManuscrita = null;
            let imgDigital = null;
            

            if (receta.firma_manuscrita && receta.archivo_firma_manuscrita) {
                imgManuscrita = convertirABase64(receta.archivo_firma_manuscrita);
            }
            
            if (receta.firma_digital && receta.archivo_firma_digital) {
                imgDigital = convertirABase64(receta.archivo_firma_digital);
            }


            // ---------------------------------------------------------
            // 3. PROCESAR IMAGEN DE FONDO (LOGO)
            // ---------------------------------------------------------
            let fondoBase64 = '';
            const rutaFondo = path.join(__dirname, '../public/img/COCH - ISOLOGO.svg'); 
            
            if (fs.existsSync(rutaFondo)) {
                const img = fs.readFileSync(rutaFondo);
                // Asumiendo que el logo es SVG. Si es PNG, cambia a 'image/png'
                fondoBase64 = `data:image/svg+xml;base64,${img.toString('base64')}`;
            }

            // ---------------------------------------------------------
            // 4. DEFINIR COPIAS
            // ---------------------------------------------------------
            let etiquetasCopias = ['ORIGINAL']; 
            
            if (receta.copias === 'duplicado') {
                etiquetasCopias.push('DUPLICADO');
            } else if (receta.copias === 'triplicado') {
                etiquetasCopias.push('DUPLICADO', 'TRIPLICADO');
            }

            // ---------------------------------------------------------
            // 5. RENDERIZAR EJS -> HTML
            // ---------------------------------------------------------
            const rutaPlantilla = path.join(__dirname, '../views/recetas/plantillaReceta.ejs');
            
            const htmlContent = await ejs.renderFile(rutaPlantilla, {
                receta: receta,
                copias: etiquetasCopias,
                firmaManuscrita: imgManuscrita,
                firmaDigital: imgDigital,      
                fondo: fondoBase64             
            });

            // ---------------------------------------------------------
            // 6. GENERAR PDF CON PUPPETEER
            // ---------------------------------------------------------
            const browser = await puppeteer.launch({ 
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            });
            
            const page = await browser.newPage();

            await page.setContent(htmlContent, { 
                waitUntil: 'networkidle0' 
            });

            const pdfBuffer = await page.pdf({
                format: receta.formato_pdf || 'A4',
                printBackground: true, // para que salga el fondo gris
                margin: { 
                    top: '10mm', 
                    bottom: '10mm', 
                    left: '10mm', 
                    right: '10mm' 
                }
            });

            await browser.close();

            // ---------------------------------------------------------
            // 7. ENVIAR RESPUESTA AL NAVEGADOR
            // ---------------------------------------------------------
            res.setHeader('Content-Type', 'application/pdf');
            
            const nombreArchivo = `Receta-${receta.paciente_nombre.replace(/\s+/g, '_')}-${receta.id}.pdf`;
            
            // 'inline' abre el visor del navegador. 'attachment' fuerza la descarga.
            res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
            
            res.send(pdfBuffer);

        } catch (error) {
            console.error("Error grave generando PDF:", error);
            res.status(500).send("Error interno al generar el PDF. Revise la consola del servidor.");
        }
    }
}

module.exports = PacienteController;