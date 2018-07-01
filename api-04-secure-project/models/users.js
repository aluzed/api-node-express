// Importer le package mongoose
const mongoose = require('mongoose');

// On importe notre librairie de sécurité
const security = require('../libs/security');

// Déclarer le schéma de notre modèle
const UsersSchema = new mongoose.Schema({
    utilisateur: { type: String, required: true },
    pass: { type: String, required: true, minlength: 6 },
    nom: { type: String },
    prenom: { type: String },
    date_naissance: { type: Date },
    email: { type: String, required: true },
    date_inscription: { type: Date, default: Date.now }
});

UsersSchema.path('email').validate((email) => {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return !!email.match(emailRegex);
}, 'Champs email invalide !')

// Hook pour chaque sauvegarde en base
UsersSchema.pre('save', function(next) {
  // On vérifie qu'il s'agit d'une nouvelle entrée
  if(this.isNew) {
    this.pass = security.hashPassword(this.pass);
  }

  // le traitement est terminé
  next();
});

// Méthode statique de modification du mot de passe utilisateur
UsersSchema.statics.updatePassword = function(userId, newPassword) {
  return new Promise((resolve, reject) => {
    mongoose.model('Users').findById(userId, (err, user) => {
      // Si on reçoit une erreur
      if(err) {
        return reject(err);
      }

      // Si la requête ne retourne pas d'utilisateur
      if(!user) {
        // On renvoie une erreur personnalisée
        return reject(new Error('User not found'));
      }

      // On met à jour le mot de passe
      user.pass = security.hashPassword(newPassword);

      // On sauvegarde l'utilisateur
      user.save(err => {
        if(err) {
          return reject(err);
        }

        return resolve(user);
      })
    })
  })
}

// Enfin nous allons exporter notre Schéma utilisateur en tant que modèle 
// Ici nous utiliserons le nom de modèle : Users 
module.exports = mongoose.model('Users', UsersSchema);