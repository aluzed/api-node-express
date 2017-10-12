const Express = require('express');
const Cfg = require('./configs'); // utilisation du path relatif pour importer depuis le même dossier que le script

// On instancie notre Objet Express
const app = Express();

// Lorsque l'on va recevoir une requête de type GET sur le path / on verra s'afficher le message
app.get('/', (req, res) => {
  res.send('Hello world from API !');
})

app.post('/', (req, res) => {
  res.send('Methode POST utilisée');
})

// On écoute sur le port défini dans notre fichier de configuration
app.listen(Cfg.httpPort);
