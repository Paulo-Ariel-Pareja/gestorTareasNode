const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');

// conexion a db
const db = require('./config/db');

// importar modelo
require('./models/Proyectos');
require('./models/Tareas');

db.sync()
    .then(()=>console.log('conectado al servidor'))
    .catch(error => console.log(error));

// pug
app.set('view engine', 'pug')

// ubicacion archivos estaticos
app.use(express.static('public'));

// ubicacion de vistas
app.set('views', path.join(__dirname, './views'));

// paso metodo helper personalizado a toda la app
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    res.locals.vardump = helpers.vardump;
    next();
});

// bodyParser - leer datos de formulario
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes())
app.listen(3000);



