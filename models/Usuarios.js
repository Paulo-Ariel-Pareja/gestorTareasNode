const Sequelize = require('sequelize');
const db = require('./../config/db');
const Proyectos = require('./Proyectos'); 
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Ingrese un correo electronico valido'
            },
            notEmpty: {
                msg: 'El correo no puede estar vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Email ya registrado, intenta con otro'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        llowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacia'
            }
        }
    },
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }        
    }
});

Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;