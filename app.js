const express = require('express');
const session = require('express-session'); 
const app = express();
const port = 3000; 

//importo middleware para guardar los datos de inicio de sesión
const sessionData = require('./middleware/sessionData');

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

app.use(sessionData);

// Rutas y middleware de la aplicación
const rutasUsuarios = require('./routes/usuariosRoute.js');
const rutasMedicos = require('./routes/medicosRoute');
const rutasTurnos = require('./routes/turnosRoute'); 
const rutasPacientes = require('./routes/pacientesRoute');
const rutasHorarios = require('./routes/horariosRoute');
const rutasPanelAdmin = require('./routes/panelAdminRoute');
const rutasWeb = require('./routes/webRoute'); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');


app.use('/', rutasUsuarios);
app.use('/', rutasMedicos);
app.use('/', rutasTurnos);
app.use('/', rutasPacientes);
app.use('/', rutasHorarios);
app.use('/', rutasPanelAdmin);
app.use('/', rutasWeb);

//muestra el puerto que escucha el server
app.listen(port, () => { 
    console.log(`El servidor corre en el puerto ${port}`);
});