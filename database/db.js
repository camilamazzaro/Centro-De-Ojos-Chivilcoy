const mysql = require('mysql');

//Conexión
const conx = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'centrodeojoschivilcoy',
});

conx.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

module.exports = conx;