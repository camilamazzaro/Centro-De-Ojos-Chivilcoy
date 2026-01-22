const express = require('express');
const router = express.Router();

const WebController = require('../controllers/webController');
const webController = new WebController();

const MedicoController = require('../controllers/medicoController');
const medicoController = new MedicoController();

const TurnoController = require('../controllers/turnoController'); //importo el controller para poder utilizar sus funciones
const turnoController = new TurnoController();


//rutas redirección a home
router.get('/',webController.mostrarHome);

//ruta a nosotros
router.get('/nosotros', webController.mostrarNosotros);

//ruta a profesionales
router.get('/profesionales', webController.mostrarProfesionales);

//ruta a ver más desde profesionales 
router.get('/profesionales/infoMedico/:medicoId', webController.mostrarInfoMedico);

//ruta a equipos
router.get('/equipos', webController.mostrarEquipos);

//ruta a coberturas
router.get('/coberturas', webController.mostrarCoberturas);

//ruta a contacto
router.get('/contacto', webController.mostrarContacto);

//ruta a Pedir Turno
router.get('/pedirTurno', webController.mostrarPedirTurno);

//ruta a reservar turno
router.post('/turnos/reservar', turnoController.reservarTurno);

//ruta a Pedir Turno
router.post('/obtenerDatosDeTurnosPorFiltros', webController.cargarDatosTurno);

//Obtener médicos por obra social
router.get('/medicos/por-obra-social/:obraSocialId', medicoController.obtenerMedicosPorObraSocial);

// Ruta al diagrama de ayuda desde "Pedir Turno"
router.get('/pedirTurno/diagramaAyuda', webController.mostrarDiagramaAyuda);

// Rutas de PANEL PACIENTES
router.get('/registroPacientes', webController.mostrarRegistroPacientes);
router.get('/loginPacientes', webController.mostrarLoginPacientes);
router.post('/loginPacientes', webController.loginPaciente);


// Ruta para cambiar password
router.get('/loginPacientes/cambiarPassword', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).send("No se proporcionó un token");
    }
    res.render('usuarios/cambiarPassword', { token }); //renderiza tmb el token
});
router.post('/loginPacientes/solicitarCambioPass', webController.solicitarCambioPass);
router.post('/loginPacientes/cambiarPassword', webController.resetearPassword);

module.exports = router;