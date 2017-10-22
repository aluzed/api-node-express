const Express = require('express');
const Cfg = require('./configs'); // utilisation du path relatif pour importer depuis le même dossier que le script

// On instancie notre Objet Express
const app = Express();

// Lorsque l'on va recevoir une requête de type GET sur le path / on verra s'afficher le message
app.get('/', (req, res, next) => {

    // Nous sommes dans le middleware
    console.log('Middleware fait coucou !');
    next();

}, (req, res) => {

    // Nous sommes dans le callback
    res.send('Hello world from API !');

})

// Lorsque l'on va recevoir une requête de type GET sur le path / on verra s'afficher le message
app.get('/add/:number', (req, res, next) => {
    console.log(req.params.number);
    next();
}, (req, res) => {
    res.send(req.params.number + 1);
})

// On écoute sur le port défini dans notre fichier de configuration
app.listen(Cfg.httpPort);
