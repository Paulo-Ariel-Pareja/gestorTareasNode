const express = require('express');
const router = express.Router();
// validador
const { body } = require('express-validator/check');

// controladores
const proyectosControllers = require('./../controllers/proyectosController');
const tareasControllers = require('./../controllers/tareasController');
const usuariosControllers = require('./../controllers/usuariosController');
const authController = require('./../controllers/authController');

module.exports = function () {

        router.get('/',
                authController.usuarioAutenticado,
                proyectosControllers.proyectosHome);

        router.get('/nuevo-proyecto',
                authController.usuarioAutenticado,
                proyectosControllers.formularioProyecto);

        router.post('/nuevo-proyecto',
                authController.usuarioAutenticado,
                body('nombre').not().isEmpty().trim().escape(),
                proyectosControllers.nuevoProyecto);

        router.get('/proyectos/:url', 
                authController.usuarioAutenticado, 
                proyectosControllers.proyectoPorUrl);

        router.get('/proyecto/editar/:id', 
                authController.usuarioAutenticado, 
                proyectosControllers.formularioEditar);

        router.post('/nuevo-proyecto/:id', 
                authController.usuarioAutenticado,
                body('nombre').not().isEmpty().trim().escape(),
                proyectosControllers.actualizarProyecto);

        router.delete('/proyectos/:url', 
                authController.usuarioAutenticado,
                proyectosControllers.eliminarProyecto);

        router.post('/proyectos/:url', 
                authController.usuarioAutenticado,
                tareasControllers.agregarTarea);

        router.patch('/tareas/:id',
                authController.usuarioAutenticado, 
                tareasControllers.cambiarEstadoTarea);

        router.delete('/tareas/:id', 
                authController.usuarioAutenticado,
                tareasControllers.eliminarTarea);

        router.get('/crear-cuenta', usuariosControllers.formCrearCuenta);
        router.post('/crear-cuenta', usuariosControllers.crearCuenta);
        router.get('/confirmar/:correo', usuariosControllers.confirmarCuenta);
        router.get('/iniciar-sesion', usuariosControllers.formIniciarSesion);
        router.post('/iniciar-sesion', authController.autenticarUsuario);
        router.get('/cerrar-sesion', authController.cerrarSesion);
        router.get('/reestablecer', usuariosControllers.formRestablecerPassword);
        router.post('/reestablecer', authController.enviarToken);
        router.get('/reestablecer/:token', authController.validarToken);
        router.post('/reestablecer/:token', authController.resetPassword);
        return router;
}

