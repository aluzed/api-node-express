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

// Chaque middleware va incrémenter number
app.get('/chain_add/:number', (req, res, next) => {
    // On n'oublie surtout pas que les paramètres sont des string par défaut
    req.params.number = parseInt(req.params.number);
    next();
}, (req, res, next) => {
    // Middleware 1
    req.params.number++;
    next();
}, (req, res, next) => {
    // Middleware 2
    req.params.number++;
    next();
}, (req, res) => {
    res.send(req.params.number.toString());
})

app.use((req, res, next) => {
  // Mon middleware global
  if(!req.body.login || !req.body.password || req.body.login === "" || req.body.password === "") {
    // Bad Request
    res.status(400).send('Erreur, champs login ou password manquant.');
  }

}).get('/route', (req, res) => {
  // Traitement de la route
  res.send('Route 1');
}).get('/route2', (req, res) => {
  // Traitement de la route 2
  res.send('Route 2');
})

// On écoute sur le port défini dans notre fichier de configuration
app.listen(Cfg.httpPort);
