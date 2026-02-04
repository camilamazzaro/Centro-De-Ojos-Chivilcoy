const express = require('express');
const router = express.Router();
const TurnoController = require('../controllers/turnoController'); //importo el controller para poder utilizar sus funciones
const turnoController = new TurnoController();

const autenticar = require('../middleware/autenticacion')([1, 3]);

// roles permitidos para este módulo
// const ROLES = [1, 3]; 
// router.use(auth(ROLES));

//Ruta para listar los turnos
router.get('/turnos',autenticar, turnoController.listarTurnos);

//Ruta para editar y agregar turnos
router.get('/turnos/editar/:id',autenticar, turnoController.editarTurno);
router.post('/turnos/editar/:id', turnoController.guardarTurno);

router.get('/turnos/agregar/:id',autenticar, turnoController.agregarTurno);
router.post('/turnos/agregar/:id', turnoController.guardarTurno);

//Ruta para eliminar turnos
router.post('/turnos/cancelar/:id', turnoController.cancelarTurno);

// router.post('/turnos/confirmar/:id', turnoController.confirmarTurno);

router.get('/turnos/desdeHorarios',autenticar, turnoController.crearTurnosDesdeHorarios);

//Ruta para listar los turnos de los médicos 
router.get('/turnos/turnosMedico/:idMedico',autenticar, turnoController.listarTurnosMedico);

//Ruta para listar las practicas de los médicos
router.get('/practicas/:id_medico',autenticar, turnoController.obtenerPracticasPorMedico);

module.exports = router; //exporto el módulo para que pueda ser incorporado en app.js