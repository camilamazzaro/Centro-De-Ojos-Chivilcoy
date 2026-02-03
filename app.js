const express = require('express');
const session = require('express-session'); 
const app = express();
const port = 3000; 

require('dotenv').config();

//importo middleware para guardar los datos de inicio de sesión
const sessionData = require('./middleware/sessionData');

// 1. PRIMERO: Archivos Estáticos (CSS, JS, IMG)
app.use('/public', express.static('public'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesión
app.use(session({
    "secret": 'Emilia', //se va a configurar una cookie en el navegador para q no se metan en el programa
    "resave": true,
    "saveUninitialized": true,
    "rolling": true, //renovar expiración
    "cookie": {
        maxAge: 1000 * 60 * 30 //expira después de 30 minutos
    }
}));

// Middleware para hacer disponibles los datos de sesión en todas las vistas
app.use((req, res, next) => {
    // Si hay un usuario en sesión, pasamos sus datos a locals
    if (req.session && req.session.idUsuario) {
        res.locals.isLogged = true;
        res.locals.nombreUsuario = req.session.nombreUsuario;
        res.locals.categoria = req.session.categoria;
        res.locals.idUsuario = req.session.idUsuario;
        res.locals.nombreUsuario = req.session.nombreUsuario; 
        res.locals.emailUsuario = req.session.emailUsuario;
    } else {
        // Si no hay sesión, definimos valores por defecto para que EJS no falle
        res.locals.isLogged = false;
        res.locals.nombreUsuario = null;
        res.locals.categoria = null;
        res.locals.emailUsuario = '';
        res.locals.idUsuario = null;
    }
    next();
});


// app.use(sessionData);

// Rutas y middleware de la aplicación
const rutasUsuarios = require('./routes/usuariosRoute.js');
const rutasMedicos = require('./routes/medicosRoute');
const rutasTurnos = require('./routes/turnosRoute'); 
const rutasPacientes = require('./routes/pacientesRoute');
const rutasHorarios = require('./routes/horariosRoute');
const rutasPanelAdmin = require('./routes/panelAdminRoute');
const rutasWeb = require('./routes/webRoute'); 
const rutasPanelPacientes = require('./routes/panelPacientesRoute.js');
const rutasLogin = require('./routes/loginRoute.js');
const rutasPanelSecretaria = require('./routes/panelSecretariasRoute');
const rutasPanelMedico = require('./routes/panelMedicosRoute');


// rutas públicas
app.use('/', rutasWeb);
app.use('/', rutasLogin);

// rutas privadas
app.use('/', rutasUsuarios);
app.use('/', rutasMedicos);
app.use('/', rutasTurnos);
app.use('/', rutasPacientes);
app.use('/', rutasHorarios);
app.use('/', rutasPanelAdmin);
app.use('/', rutasPanelPacientes);
app.use('/', rutasPanelSecretaria);
app.use('/', rutasPanelMedico);

app.set('views', './views');
app.set('view engine', 'ejs');

//muestra el puerto que escucha el server
app.listen(port, () => { 
    console.log(`El servidor corre en el puerto ${port}`);
});