// Commençons par importer notre configuration
const config = require('../config.json');

// On importe le paquet bluebird pour des promesses performantes
const Promise = require('bluebird');

// On importe le paquet bcrypt
const bcrypt = require('bcrypt');

// On importe le paquet jsonwebtoken
const jwt = require('jsonwebtoken');

const security = {
  // Méthode pour hasher un password, nous avons besoin de ce password
  hashPassword:  password => {
    // Nous allons hasher de manière synchrone le mot de passe
    // En n'oubliant pas de l'encapsuler avec notre sel et notre poivre
    return bcrypt.hashSync(config.security.salt + password + config.security.pepper, 10);
  },
  // Méthode qui permet de vérifier qu'un mot de passe est le bon
  comparePassword: (passOriginal, candidat) => {
    // Nous devons encapsuler le candidat de la même manière que nous l'avons fait avec le mot de passe 
    return bcrypt.compareSync(config.security.salt + candidat + config.security.pepper, passOriginal);
  },
  // Méthode de connexion (génère un token)
  signIn: user => {
    // Nous allons retourner une promesse
    return new Promise((resolve, reject) => {
      // On génère un token pour le user passé en paramètre
      jwt.sign({
        _id: user.id,
        utilisateur: user.utilisateur,
        email: user.email,
        date_inscription: user.date_inscription,
        nom: user.nom,
        prenom: user.prenom
      }, config.security.secret, { expiresIn: config.security.duree_validite }, (err, token) => {
        // Si la méthode renvoie une erreur
        if(err) {
          return reject(err);
        }

        return resolve(token);
      })
    })
  },
  // Méthode qui permet de vérifier qu'un token est toujours valide
  checkToken: token => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.security.secret, (err, user) => {
        // Si la méthode renvoie une erreur
        if(err) {
          return reject(err);
        }

        // Sinon on renvoie l'utilisateur
        return resolve(user);
      })
    })
  }
};


module.exports = security;