const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// conexion a db
const db = require('./config/db');

// importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(()=>console.log('conectado al servidor'))
    .catch(error => console.log(error));

// pug
app.set('view engine', 'pug')

// ubicacion archivos estaticos
app.use(express.static('public'));

// bodyParser - leer datos de formulario
app.use(bodyParser.urlencoded({extended: true}));

// app.use(expressValidator());

// ubicacion de vistas
app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser())

// manejo de sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// paso metodo helper personalizado a toda la app
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());
app.listen(3000);


