const createError = require('http-errors');
const Sequelize = require("sequelize");
const {models} = require("../models");

// Esta función hace una búsqueda de todos los post en la base de datos mediante la función findAll.
// Utiliza el argumento findOptions para añadir el attachment asociado a cada post.
exports.findAllPosts = async (req, res , next ) => {
    try {
        const findOptions = {
            include: [
                {model: models.Attachment, as: 'Attachment'}
            ]
        };
        const Post = await models.Post.findAll(findOptions);
        res.render("posts.ejs", {Post});
    } catch(error){
        next(error);
    }
};

// Esta función hace una búsqueda de un post en la base de datos por su id y lo guarda como parámetro.
// Utiliza una sintaxis de try/catch para manejar los errores que puedan surgir.
exports.load = async (req, res, next, postId) => {
    try {
    const post = await models.Post.findByPk(postId, {
        include: [
            {model: models.Attachment, as: 'Attachment'}
        ]
    });
    
    if (post) {
        req.load = {...req.load, post};
        next();
    } else {
    throw createError(404,'There is no post with id =' + postId);
    }
    } catch (error) {
    next(error);
    }
};

// Esta función utiliza el parámetro generado por la función anterior para llamar a la vista que muestra la información del post.
exports.findPostbyPk = (req, res , next) => {
    const {post} = req.load;
    res.render('posts/show.ejs', {post});
};

// Esta función utiliza también la función .load para acceder al attachment asociado a dicho post.
exports.attachment = (req, res , next) => {

    const {post} = req.load;
    const {attachment} = post;

    if (!attachment){
        res.redirect("/images/none.jpg");
    }
    else if(attachment.image){
        res.type(attachment.mime);
        res.send(attachment.image);
    }
    else if(attachment.url){
        res.redirect(attachment.url);
    } else {
        res.redirect("/images/none.jpg");
    }
}

// Esta función genera un post vacío y llama a la vista que contiene el formulario de creación del post.
exports.new = (req, res, next) => {
    
    const post = {
    title: "",
    body: ""
    };

    res.render('posts/new.ejs', {post});
};

// Esta función es llamada cuando se intenta crear un post nuevo.
// Tiene una estructura de try/catch para manejar los errores que pueden derivar de no haber rellenado correctamente el formulario.
exports.create = async (req, res, next) => {
    const {title, body} = req.body;
    let post;
   
    try { 
       post = models.Post.build({title, body});
       post = await post.save({fields: ["title", "body"]});
       try{
           if (!req.file) {
               console.log('There is no attachment.');
           return;
           }
           const attachment = await models.Attachment.create({
               mime: req.file.mimetype,
               image: req.file.buffer,
               url: null
           });
           await post.setAttachment(attachment);
       } catch(error){
            console.log("Attachment couldn't be created.");
       } finally {
           res.redirect('/posts/' + post.id);
       }
       } catch (error) {
       if (error instanceof (Sequelize.ValidationError)) {
       console.log('There are errors in the form:');
       error.errors.forEach(({message}) => console.log(message));
       res.render('posts/new', {post});
       } else {
       next(error);
       }
   }
};

// Esta función carga el post que se quiere editar y llama a la vista que contiene el formulario.
exports.edit = (req, res, next) => {
    const {post} = req.load;
    res.render('posts/edit.ejs', {post});

};

// Esta función es llamada cuando se quiere editar el post deseado.
// Maneja una estructura similar a la función .create.
exports.update = async (req, res, next) => {
    const {post} = req.load;
    post.title = req.body.title;
    post.body = req.body.body;

    try {
        await post.save({fields: ["title", "body"]});
        try{

            if (!req.file) {
                console.log('No attachment has been changed.');
                return;
            }
            await post.attachment?.delete();
            const attachment = await models.Attachment.create({
                mime: req.file.mimetype,
                image: req.file.buffer,
                url: null
                });
            await post.setAttachment(attachment);
        } catch (error) {
            console.log("New attachment couldn't be saved.")
        }finally{res.redirect('/posts/' + post.id)}
    } catch (error) {
    if (error instanceof (Sequelize.ValidationError)) {
    console.log('There are errors in the form:');
    error.errors.forEach(({message}) => console.log(message));
    res.render('posts/edit.ejs', {post});
    } else {
    next(error);
    }
    }
};

// Esta función se encarga de borrar el post indicado y su attachment asociado (en caso de que lo tenga).
exports.destroy = async (req, res, next) => {
    const attachment = req.load.post.attachment;

    if (attachment) {
        try {
            attHelper.deleteResource(attachment.resource);
        } catch (error) {
        }
    }
    try {
        await req.load.post.destroy();
        attachment && await attachment.destroy();
        res.redirect('/posts');
    }  catch(error) {
        console.log("Post couldn't be deleted.");
        next(error);
    }
};