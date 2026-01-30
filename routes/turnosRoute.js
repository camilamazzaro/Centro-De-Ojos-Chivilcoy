const express = require('express');
const router = express.Router();
const TurnoController = require('../controllers/turnoController'); //importo el controller para poder utilizar sus funciones
const turnoController = new TurnoController();

const auth = require('../middleware/autenticacion');

// roles permitidos para este módulo
// const ROLES = [1, 3]; 
// router.use(auth(ROLES));

//Ruta para listar los turnos
router.get('/turnos', turnoController.listarTurnos);

//Ruta para editar y agregar turnos
router.get('/turnos/editar/:id', turnoController.editarTurno);
router.post('/turnos/editar/:id', turnoController.guardarTurno);

router.get('/turnos/agregar/0', turnoController.agregarTurno);
router.post('/turnos/agregar/0', turnoController.guardarTurno);

//Ruta para eliminar turnos
router.post('/turnos/cancelar/:id', turnoController.cancelarTurno);

router.post('/turnos/confirmar/:id', turnoController.confirmarTurno);

router.get('/turnos/desdeHorarios', turnoController.crearTurnosDesdeHorarios);

//Ruta para listar los turnos de los médicos 
router.get('/turnos/turnosMedico/:idMedico', turnoController.listarTurnosMedico);

//Ruta para listar las practicas de los médicos
router.get('/practicas/:id_medico', turnoController.obtenerPracticasPorMedico);

module.exports = router; //exporto el módulo para que pueda ser incorporado en app.js