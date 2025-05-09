const express = require('express');
const session = require('express-session');  // <-- Importar express-session
const app = express();
const port = 3000; 


// Rutas y middleware de la aplicación
const rutasUsuarios = require('./routes/usuariosRoute.js');
const rutasMedicos = require('./routes/medicosRoute');
const rutasTurnos = require('./routes/turnosRoute'); 
const rutasPacientes = require('./routes/pacienteRoute');
const rutasHorarios = require('./routes/horariosRoute');

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

//muestra el puerto que escucha el server
app.listen(port, () => { 
    console.log(`El servidor corre en el puerto ${port}`);
});