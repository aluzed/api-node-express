const express = require('express');

// Nous allons créer un router depuis l'objet express
const router = express.Router();

// Commençons par importer notre modèle
const Users = require('../models/users');

// Lister les utilisateurs
router.get('/', (req, res) => {
  Users.find({}, (err, results) => {
    // Traitement du cas d'erreur
    if(err) {
      // On renvoie un code erreur en tant que réponse
      // Le code 500 en HTTP correspond à Internal Error
      return res.status(500).send(err.message);
    }

    return res.json(results);
  })
})

// Ajouter un nouvel utilisateur
router.post('/', (req, res) => {
  // Nous allons récupérer le contenu de la request pour créer un utilisateur temporaire
  let tmpUser = req.body;
  
  Users.create(tmpUser, (err, user) => {
    // Traitement du cas d'erreur
    if(err) {
      return res.status(500).send(err.message);
    } 

    return res.json(user);
  });
});


// Modifier un utilisateur
router.put('/:id', (req, res) => {
  let id = req.params.id;
  
  // Si l'id n'est pas défini
  if(!id) {
      // Envoyer un code : Mauvais paramètre
      return res.status(400).send('Id missing');
  }
  
  let data = req.body;
  
  Users.findByIdAndUpdate(id, {
      $set: data
  }, { new: true }, (err, users) => {
      // Erreur lors de l'update
      if(err) {
          // On renvoie un code erreur interne accompagné du message d'erreur
          return res.status(500).send(err.message);
      }
      
      return res.json(users);
  }) 
});

// Supprimer un utilisateur
router.delete('/:id', (req, res) => {
  let id = req.params.id;
  
  // Si id n'est pas défini
  if(!id) {
      // Envoyer un code : Mauvais paramètre
      return res.status(400).send('Id missing');
  }
  
  Users.findByIdAndRemove(id, (err) => {
      // Erreur lors de la suppression
      if(err) {
          // On renvoie un code erreur interne accompagné du message d'erreur
          return res.status(500).send(err.message);
      }
      
      // On renvoie un status 200 = OK
      return res.status(200).send();
  })
});


module.exports = router;