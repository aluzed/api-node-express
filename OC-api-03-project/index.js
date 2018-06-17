// On importe les paquets
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017');

// On instancie notre router
const app = express();

// Attacher body parser à notre objet router
app.use(bodyParser.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello World');
})

// Chargement de nos routes 
const usersRouter = require('./routers/users');
const postsCategoriesRouter = require('./routers/post_categories');
const postsRouter = require('./routers/posts');

// On attache les routes users au point d'entrée /users
app.use('/users', usersRouter);
// On attache les routes catégories au point d'entrée /posts_categories
app.use('/posts_categories', postsCategoriesRouter);
// On attache les routes articles au point d'entrée /posts
app.use('/posts', postsRouter);

// Lancement du serveur API
app.listen(3000, () => {
  console.log('server opened on 3000');
})