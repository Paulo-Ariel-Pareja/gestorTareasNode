const passport = require('passport');
const Usuarios = require('./../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('./../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Correo y contraseña son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
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
        res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: 'Resetear password',
        resetUrl,
        archivo: 'restablecerpassword'
    });
    req.flash('correcto', 'Enviamos un mail a tu correo!')
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token }});
    if(!usuario){
        req.flash('error', 'Cuenta no encontrada')
        res.redirect('/reestablecer');
    }

    res.render('resetpassword', {
        nombrePagina: 'Restablecer contraseña'
    });
}

exports.resetPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({ 
        where: { 
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!usuario){
        req.flash('error', 'Token no valido')
        res.redirect('/reestablecer');
    }
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    await usuario.save();

    req.flash('correcto','Contraseña cambiada');
    res.redirect('/iniciar-sesion')
}