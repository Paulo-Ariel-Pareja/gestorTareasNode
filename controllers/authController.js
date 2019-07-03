const passport = require('passport');
const Usuarios = require('./../models/Usuarios')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Correo y contraseña son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('USUARIO FUE AUTENTICADO CORRECTAMENTE')
        return next();
    }
    console.log('USUARIO NO VALIDADO')
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

exports.enviarToken = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });
    if(!usuario){
        req.flash('error', 'Cuenta no encontrada')
        res.render('reestablecer', {
            nombrePagina: 'Restablecer contraseña',
            mensajes: req.flash()
        })
    }
}