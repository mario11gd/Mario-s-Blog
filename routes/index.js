var express = require('express');
var router = express.Router();
const postController = require('../controllers/post.js')
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({
 storage: storage,
 limits: {fileSize: 20 * 1024 * 1024}});

// Redirige a la vista de inicio.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blog' });
});

// Redirige a la vista de información sobre el autor.
router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Author' });
});

// Llama a la función que muestra todos los posts.
router.get('/posts', postController.findAllPosts);

// Llama a la función que genera un parámetro de referencia para un determinado post.
router.param('postId', postController.load);

// Llama a la función que utiliza el parámetro anterior para mostrar la información de un determinado post.
router.get('/posts/:postId(\\d+)', postController.findPostbyPk);

// Llama a la función que muestra el attachment de un determinado post.
router.get('/posts/:postId(\\d+)/attachment', postController.attachment);

// Llama a la función que redirige a la página con el formulario de creación de posts.
router.get('/posts/new', postController.new);

// Utiliza la información recogida en el formulario para llamar a la función que crea posts.
router.post('/create', upload.single('image'),  postController.create);

// Igual que en el caso anterior pero guardando la información ya existente del post que se quiere editar.
router.get('/posts/:postId(\\d+)/edit', postController.edit);

// Igual que en /create pero actualizando en vez de creando.
router.put('/posts/:postId(\\d+)', upload.single('image'), postController.update);

// Llama a la función que destruye un determinado post.
router.delete('/posts/:postId(\\d+)', postController.destroy);

module.exports = router;
