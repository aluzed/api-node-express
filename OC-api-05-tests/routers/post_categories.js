const express = require('express');
const router = express.Router();

const PostCategories = require('../models/post_categories');

// Lister les catégories 
router.get('/', access.isLoggedIn, (req, res) => {
  PostCategories.find({}, (err, results) => {
    // Traitement du cas d'erreur
    if(err) {
      // On renvoie un code erreur en tant que réponse
      // Le code 500 en HTTP correspond à Internal Error
      return res.status(500).send(err.message);
    }

    return res.json(results);
  })
});

// Récupérer une catégorie par son ID
router.get('/:id', access.isLoggedIn, (req, res) => {
  let id = req.params.id;

  // Si l'id n'existe pasU
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
router.post('/', access.isLoggedIn, (req, res) => {
  let tmpPostCategory = req.body;
  
  PostCategories.create(tmpPostCategory, (err, category) => {
    // Traitement du cas d'erreur
    if(err) {
      return res.status(500).send(err.message);
    } 

    return res.json(category);
  });
});


// Modifier une catégorie
router.put('/:id', access.isLoggedIn, (req, res) => {
  let id = req.params.id;
  
  // Si l'id n'est pas défini
  if(!id) {
      // Envoyer un code : Mauvais paramètre
      return res.status(400).send('Id missing');
  }
  
  let data = req.body;
  
  PostCategories.findByIdAndUpdate(id, {
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
router.delete('/:id', access.isLoggedIn, (req, res) => {
  let id = req.params.id;
  
  // Si id n'est pas défini
  if(!id) {
      // Envoyer un code : Mauvais paramètre
      return res.status(400).send('Id missing');
  }
  
  PostCategories.findByIdAndRemove(id, (err) => {
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