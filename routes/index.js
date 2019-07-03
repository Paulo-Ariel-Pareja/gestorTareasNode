const express = require('express');
const router = express.Router();
// validador
const { body } = require('express-validator/check');

// controladores
const proyectosControllers = require('./../controllers/proyectosController');
const tareasControllers = require('./../controllers/tareasController');


module.exports = function(){
    router.get('/', proyectosControllers.proyectosHome);
    router.get('/nuevo-proyecto', proyectosControllers.formularioProyecto);
    router.post('/nuevo-proyecto',
            body('nombre').not().isEmpty().trim().escape(),
            proyectosControllers.nuevoProyecto);
    router.get('/proyectos/:url', proyectosControllers.proyectoPorUrl);
    router.get('/proyecto/editar/:id', proyectosControllers.formularioEditar)
    router.post('/nuevo-proyecto/:id',
            body('nombre').not().isEmpty().trim().escape(),
            proyectosControllers.actualizarProyecto);
    router.delete('/proyectos/:url', proyectosControllers.eliminarProyecto);
    router.post('/proyectos/:url', tareasControllers.agregarTarea);
    return router;
}

