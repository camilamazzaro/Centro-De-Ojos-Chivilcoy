const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

const moment = require('moment');

class PanelAdminController {

    // Mostrar panel general
    // mostrarPanelGeneral(req, res) {

    //     try {
    //         // Llamar a listarMedicos, obtenerObrasSociales y listarTurnos en paralelo
    //         const listarMedicosPromise = new Promise((resolve, reject) => {
    //             medicoModel.listarMedicos((medicos) => {
    //                 if (medicos) {
    //                     resolve(medicos);
    //                 } else {
    //                     reject('Error al listar médicos');
    //                 }
    //             });
    //         });

    //         const obtenerObrasSocialesPromise = new Promise((resolve, reject) => {
    //             pacienteModel.obtenerObrasSociales((obrasSociales) => {
    //                 if (obrasSociales) {
    //                     resolve(obrasSociales);
    //                 } else {
    //                     reject('Error al obtener obras sociales');
    //                 }
    //             });
    //         });

    //         const listarTurnosPromise = new Promise((resolve, reject) => {
    //             turnoModel.listarTurnos('', 15, 0, (turnos, total) => {
    //                 if (turnos) {
    //                     resolve({turnos, total});
    //                 } else {
    //                     reject('Error al listar turnos');
    //                 }
    //             });
    //         });

    //         // Ejecutar todas las promesas en paralelo
    //         Promise.all([listarMedicosPromise, obtenerObrasSocialesPromise, listarTurnosPromise])
    //             .then(([medicos, obrasSociales, {turnos, total}]) => {
    //                 // Renderizar la vista de panel, pasando médicos, obras sociales, turnos y el nombre del usuario
    //                 res.render('panel/panelSecretarias', {
    //                     title: 'Panel General Secretarias',
    //                     medicos: medicos,
    //                     obrasSociales: obrasSociales,
    //                     turnos: turnos, // Pasar los turnos a la vista
    //                     totalTurnos: total,
    //                 });
    //             })
    //             .catch(error => {
    //                 console.error('Error al obtener datos para la página de panel secretarias:', error);
    //                 res.status(500).send('Error al cargar el panel de secretarias');
    //             });

    //     } catch (error) {
    //         console.error('Error al obtener datos para la página de panel secretarias:', error);
    //         res.status(500).send('Error al cargar el panel de secretarias');
    //     }
    // }

    mostrarCalendario (req, res){
        medicoModel.listarMedicos((medicos) =>{
            res.render('panel/calendarioAdmin', {
                title: 'Calendario de Médicos',
                medicos: medicos
            });
        });
    }


    obtenerTurnosCalendarioMedicos(req, res) {
        let fechaInicio = req.query.start;
        let fechaFin = req.query.end;
        // let idUsuario = req.session.idUsuario;
        // let categoriaUsuario = req.session.categoria;
        let medicos = req.query.medicos ? req.query.medicos.split(',') : [];
        let estado = req.query.estado || '3'; // Por defecto mostrar confirmados

        const filtroInicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm:ss");
        const filtroFin = moment(fechaFin).format("YYYY-MM-DD HH:mm:ss");

        turnoModel.seleccionarTurnosCalendario(medicos, estado, filtroInicio, filtroFin, (turnos) => { //al principio luego tengo que agregar idUsuario y categoriaUsuario
            if (turnos) {
                res.json(turnos);
            } else {
                res.status(500).json({ error: "Error al obtener los turnos" });
            }
        });
    }

}

module.exports = PanelAdminController;
