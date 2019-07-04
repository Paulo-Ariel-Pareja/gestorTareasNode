const Usuarios = require('./../models/Usuarios');
const enviarEmail = require('./../handlers/email');

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

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email
        }

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta en TaskManager',
            confirmarUrl,
            archivo: 'confirmarcuenta'
        });
        req.flash('correcto', 'Enviamos un mail a tu correo!')
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

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    })
    if(!usuario){
        req.flash('error', 'Cuenta inexistente!')
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta activada correctamente')
    res.redirect('/iniciar-sesion');
}