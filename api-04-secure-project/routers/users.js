const express = require('express');

// Nous allons créer un router depuis l'objet express
const router = express.Router();

// Commençons par importer notre modèle
const Users = require('../models/users');

// On charge notre librairie de sécurité
const security = require('../libs/security');

// On charge notre librairie d'accès
const access = require('../libs/access');

// Lister les utilisateurs
router.get('/', access.isLoggedIn, (req, res) => {
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
router.post('/', access.isLoggedIn, (req, res) => {
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
router.put('/:id', access.isLoggedIn, (req, res) => {
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
router.delete('/:id', access.isLoggedIn, (req, res) => {
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


// Mettre à jour un mot de passe utilisateur
router.put('/update_password/:id', access.isLoggedIn, (req, res) => {
  // On récupère l'id dans la route
  let id = req.params.id;

  // Si l'id n'est pas dans la route
  if(!id) {
    // On renvoie un code erreur: mauvais paramètre
    return res.status(400).send();
  }

  // On récupère les valeurs envoyés en POST
  let form = req.body;

  // Si le mot de passe et la confirmation sont différents
  if(form.password !== form.confirm) {
    // On renvoie un code erreur: mauvais paramètre
    return res.status(400).send();
  }

  Users.updatePassword(id, form.password)
  .then(user => {
    // Si tout se passe bien on renvoie l'utilisateur en json
    return res.json(user);
  })
  .catch(err => {
    // Si on reçoit une erreur
    return res.status(500).send(err.message);
  })
})

// Connecter un utilisateur
router.post('/login', access.isNotLoggedIn, (req, res) => {
  let credentials = req.body;

  // On vérifie que l'on a bien un username et un password
  if (!credentials.username || !credentials.password) {
    // On renvoie un code de paramètre incorrect 
    return res.status(400).send();
  }

  // On récupère l'utilisateur qui possède ce username
  Users.findOne({ utilisateur: credentials.username }, (err, user) => {
    // Si la méthode nous retourne une erreur, on renvoie un code erreur interne
    if (err) {
      return res.status(500).send(err.message);
    }

    // Si user est null, on renvoie un code erreur : accès non autorisé
    if (!user) {
      return res.status(401).send();
    }

    // Si on a un utilisateur on doit vérifier que les mots de passes correspondent 
    let samePass = security.comparePassword(user.pass, credentials.password); 
    
    // Si le mot de passe est valide
    if(samePass) {
      // Si tout se passe bien, on connecte notre utilisateur
      security.signIn(user)
        // Si tout se passe bien, on récupère notre token
        .then(token => {
          // On renvoie notre token 
          return res.json({
            utilisateur: user.utilisateur,
            date_inscription: user.date_inscription,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            token
          })
        })
        .catch(err => {
          // Si on reçoit une erreur
          return res.status(500).send(err.message);
        })
    }
    // Si le mot de passe est invalide
    else {
      return res.status(401).send();
    }
  });



});


module.exports = router;