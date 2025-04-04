const express = require('express');
const session = require('express-session');  // <-- Importar express-session

const app = express();


// Rutas y middleware de la aplicación


app.set('port', 3000);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));