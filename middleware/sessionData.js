module.exports = (req, res, next) => {
    if (req.session && req.session.usuario) {
        res.locals.nombreUsuario = req.session.usuario.nombre;
        res.locals.emailUsuario = req.session.usuario.email;
        res.locals.idCategoriaUsuario = req.session.usuario.id_categoriaUsuario;
        res.locals.id_paciente = req.session.usuario.id_paciente;
    }
    next();
};
