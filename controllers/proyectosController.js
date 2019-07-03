const Proyectos = require('./../models/Proyectos');
const Tareas = require('./../models/Tareas');


exports.proyectosHome = async (req, res) => {
    const proyectos = await Proyectos.findAll();

    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos
    })
}

exports.formularioProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    // validacion
    const { nombre } = req.body;
    console.log(nombre);
    let errores = [];
    if(!nombre){
        errores.push({'texto': 'Agregar un nombre de proyecto'});
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        await Proyectos.create({ nombre });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise = Proyectos.findAll();
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    const [ proyectos, proyecto ] = await Promise.all([proyectosPromise, proyectoPromise]);
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
/*         include: [{
            Proyectos
        }] */
    });

    if(!proyecto) return next();
    
    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const proyectosPromise = Proyectos.findAll();
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [ proyectos, proyecto ] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina : 'Editar proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    // validacion
    const { nombre } = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto': 'Agregar un nombre de proyecto'});
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        const proyectos = await Proyectos.findAll();
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id }}
            );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const {urlProyecto} = req.query;
    
    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    })
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado correctamente')
} 