module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        // Verificamos si hay usuario
        if (req.session && req.session.idUsuario) {
            const categoriaUsuario = req.session.categoria;


            const rolesNumericos = rolesPermitidos.map(r => parseInt(r));
            const categoriaNumerica = parseInt(categoriaUsuario);

            if (rolesNumericos.includes(categoriaNumerica)) {
                return next(); 
            } else {
                return res.status(403).send(`Acceso denegado. Tu rol (${categoriaUsuario}) no tiene permiso.`); 
            }
            
        } else {
            console.log('Rechazado: No hay sesión activa');
            res.redirect('/login'); 
        }
    };
};