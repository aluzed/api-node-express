// Importer le package mongoose
const mongoose = require('mongoose');

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

// Enfin nous allons exporter notre Schéma utilisateur en tant que modèle 
// Ici nous utiliserons le nom de modèle : Users 
module.exports = mongoose.model('Users', UsersSchema);