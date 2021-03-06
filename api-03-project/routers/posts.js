const express = require('express');
const router = express.Router();

const Posts = require('../models/posts');

// Lister les articles 
router.get('/', (req, res) => {
  Posts.find({}, (err, results) => {
    // Traitement du cas d'erreur
    if(err) {
      // On renvoie un code erreur en tant que réponse
      // Le code 500 en HTTP correspond à Internal Error
      return res.status(500).send(err.message);
    }

    return res.json(results);
  })
});

// Récupérer un article par son ID
router.get('/:id', (req, res) => {
  let id = req.params.id;

  // Si l'id n'existe pas 
  if(!id)
    return res.status(400).send();

    PostCategories.findById(id, (err, result) => {
      // Si la requête renvoie une erreur
      if(err)
        return res.status(500).send(err.message);
  
      return res.json(result);
    })
})

// Ajouter une nouvelle catégorie
router.post('/', (req, res) => {
  let tmpPostCategory = req.body;
  
  Posts.create(tmpPostCategory, (err, category) => {
    // Traitement du cas d'erreur
    if(err) {
      return res.status(500).send(err.message);
    } 

    return res.json(category);
  });
});


// Modifier une catégorie
router.put('/:id', (req, res) => {
  let id = req.params.id;
  
  // Si l'id n'est pas défini
  if(!id) {
      // Envoyer un code : Mauvais paramètre
      return res.status(400).send('Id missing');
  }
  
  let data = req.body;
  
  Posts.findByIdAndUpdate(id, {
      $set: data
  }, { new: true }, (err, category) => {
      // Erreur lors de l'update
      if(err) {
          // On renvoie un code erreur interne accompagné du message d'erreur
          return res.status(500).send(err.message);
      }
      
      return res.json(category);
  }) 
});

// Supprimer une catégorie
router.delete('/:id', (req, res) => {
  let id = req.params.id;
  
  // Si id n'est pas défini
  if(!id) {
      // Envoyer un code : Mauvais paramètre
      return res.status(400).send('Id missing');
  }
  
  Posts.findByIdAndRemove(id, (err) => {
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