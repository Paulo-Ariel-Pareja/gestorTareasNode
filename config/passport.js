const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('./../models/Usuarios');

// login con user y pass de db
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                })
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Correo y/o contraseña incorrectos'
                    });
                }
                return done(null, usuario)
            } catch (error) {
                return done(null, false, {
                    message: 'Correo y/o contraseña incorrectos'
                });
            }
        }
    )
);

// serializar
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

// deserializar
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;