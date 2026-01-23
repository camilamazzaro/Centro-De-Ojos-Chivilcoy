// middleware/auth.js
module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        
        // 1. Verificar si hay sesión activa
        if (!req.session || !req.session.idUsuario) {
            console.log('Acceso denegado: No hay sesión activa.');
            return res.redirect('/login');
        }

        const rolUsuario = req.session.categoria; // Asumiendo que guardas el ID de categoría aquí (1, 2, 3, etc.)

        // 2. Si rolesPermitidos es un solo número, lo convertimos a array para usar .includes()
        const rolesArray = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

        // 3. Verificar si el rol del usuario está en la lista permitida
        if (rolesArray.includes(rolUsuario)) {
            return next(); // Tiene permiso, continúa
        } else {
            console.log(`Acceso denegado: El rol ${rolUsuario} no tiene permiso para esta ruta.`);
            // Opcional: Redirigir a una página de "No autorizado" o al home de su rol
            return res.status(403).render('errores/403', { mensaje: 'No tienes permiso para ver esta sección.' });
        }
    };
};