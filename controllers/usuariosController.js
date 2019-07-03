const Usuarios = require('./../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear una cuenta en task manager'
    })
}

exports.crearCuenta = async (req, res) => {
    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email,
            password
        })
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crea tu cuenta en TaskManager',
            email,
            password
        })
    }

}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia tu sesion en TaskManager',
        error
    })
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Restablecer contraseña',
    })
}