const Express = require('express');
const Cfg = require('./configs'); // utilisation du path relatif pour importer depuis le même dossier que le script

// On instancie notre Objet Express
const app = Express();

// Lorsque l'on va recevoir une requête de type GET sur le path / on verra s'afficher le message
app.get('/', (req, res) => {
  res.send('Hello world from API !');
})

// Exemple de l'utilisation de la méthode POST
app.post('/', (req, res) => {
  res.send('Methode POST utilisée');
})

// Exemple de l'utilisation d'un paramètre de route
app.get('/route_test/:test', (req, res) => {
  res.send('La variable test a pour valeur : ' + req.params.test);
})

// La route suivante a pour but de prendre un nombre en paramètre et d'ajouter 1
// Cependant cet exemple ne fonctionne pas, il s'agit d'un test pour vous faire comprendre
app.get('/ajouter_1/:nombre', (req, res) => {
  let resultat = parseInt(req.params.nombre, 10) + 1;
  res.send(resultat.toString());
})

// Si la route en cours n'a pas été déclarée, il faut renvoyer un status 404 : NOT FOUND
app.all('*', (req, res) => {
  res.status(404).send('Cette page n\'existe pas.');
})

// On écoute sur le port défini dans notre fichier de configuration
app.listen(Cfg.httpPort);
