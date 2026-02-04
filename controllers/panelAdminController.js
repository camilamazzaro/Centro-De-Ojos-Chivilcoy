const MedicoModel = require('../models/medicoModel');
const medicoModel = new MedicoModel();

const PacienteModel = require('../models/pacienteModel');
const pacienteModel = new PacienteModel();

const TurnoModel = require('../models/turnoModel');
const turnoModel = new TurnoModel();

const moment = require('moment');

class PanelAdminController {

    // Mostrar panel general
    mostrarPanelGeneral(req, res) {

        try {
            // Llamar a listarMedicos, obtenerObrasSociales y listarTurnos en paralelo
            const listarMedicosPromise = new Promise((resolve, reject) => {
                medicoModel.listarMedicos((medicos) => {
                    if (medicos) {
                        resolve(medicos);
                    } else {
                        reject('Error al listar médicos');
                    }
                });
            });

            const obtenerObrasSocialesPromise = new Promise((resolve, reject) => {
                pacienteModel.obtenerObrasSociales((obrasSociales) => {
                    if (obrasSociales) {
                        resolve(obrasSociales);
                    } else {
                        reject('Error al obtener obras sociales');
                    }
                });
            });

            const listarTurnosPromise = new Promise((resolve, reject) => {
                turnoModel.listarTurnos('', 15, 0, (turnos, total) => {
                    if (turnos) {
                        resolve({turnos, total});
                    } else {
                        reject('Error al listar turnos');
                    }
                });
            });

            // Ejecutar todas las promesas en paralelo
            Promise.all([listarMedicosPromise, obtenerObrasSocialesPromise, listarTurnosPromise])
                .then(([medicos, obrasSociales, {turnos, total}]) => {
                    // Renderizar la vista de panel, pasando médicos, obras sociales, turnos y el nombre del usuario
                    res.render('panel/panelAdmin', {
                        title: 'Panel General Administradores',
                        medicos: medicos,
                        obrasSociales: obrasSociales,
                        turnos: turnos, // Pasar los turnos a la vista
                        totalTurnos: total,
                    });
                })
                .catch(error => {
                    console.error('Error al obtener datos para la página de panel administradores:', error);
                    res.status(500).send('Error al cargar el panel de administradores');
                });

        } catch (error) {
            console.error('Error al obtener datos para la página de panel administradores:', error);
            res.status(500).send('Error al cargar el panel de administradores');
        }
    }

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
        
        let medicosRaw = req.query.medicos ? req.query.medicos.split(',') : [];
        let medicos = medicosRaw.includes('todos') ? [] : medicosRaw;

        let estado = req.query.estado || 'todos';

        const filtroInicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm:ss");
        const filtroFin = moment(fechaFin).format("YYYY-MM-DD HH:mm:ss");

        turnoModel.seleccionarTurnosCalendario(medicos, estado, filtroInicio, filtroFin, (turnos) => {
            if (turnos) {
                
                const eventos = turnos.map(turno => {
                    let colorFondo = '#3788d8'; // Azul por defecto
                    let colorTexto = '#ffffff';

                    const estadoID = parseInt(turno.id_estado_turno); 

                    switch (estadoID) {
                        case 1: // Disponible
                            colorFondo = '#198754'; 
                            break;
                        case 2: // Reservado
                            colorFondo = '#ffc107'; 
                            colorTexto = '#000000'; 
                            break;
                        case 3: // Confirmado
                            colorFondo = '#0d6efd'; 
                            break;
                        case 4: // Cancelado
                            colorFondo = '#6c757d'; 
                            break;
                    }

                    const apellidoMedico = turno.medico_nombre ? turno.medico_nombre.split(' ').pop() : 'Médico';

                    return {
                        id: turno.id,
                        title: apellidoMedico,
                        start: moment(turno.fecha_hora).format("YYYY-MM-DD HH:mm:ss"),
                        end: moment(turno.fecha_hora).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss"), // Duración 15 min
                        color: colorFondo,     
                        textColor: colorTexto, 
                        extendedProps: {       
                            pacienteNombre: turno.paciente_nombre || 'Sin paciente',
                            nombreMedico: turno.medico_nombre || 'Sin médico',
                            estadoTurno: estadoID,
                            medicoId: turno.id_medico || turno.medico_id 
                        }
                    };
                });

                res.json(eventos);
            } else {
                res.status(500).json({ error: "Error al obtener los turnos" });
            }
        });
    }
}

module.exports = PanelAdminController;
