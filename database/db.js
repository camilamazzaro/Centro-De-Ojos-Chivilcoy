const mysql = require('mysql');

// Uso createPool en lugar de createConnection
const pool = mysql.createPool({
    connectionLimit: 10, // Máximo 10 conexiones simultáneas (evita que XAMPP explote)
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'centrodeojoschivilcoy',
    port: 3306 
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión con la base de datos se cerró.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene demasiadas conexiones.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión con la base de datos fue rechazada (¿Está prendido XAMPP?).');
        }

        return; // <--- ESTO DETIENE LA EJECUCIÓN AQUÍ si hay error
    }

    if (connection) connection.release();
    console.log('Conexión a BD establecida correctamente (Pool).');
});

module.exports = pool;