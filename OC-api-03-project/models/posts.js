const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'PostsCategories' },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateurs' },
  date_creation: { type: Date, default: Date.now },
  date_modification: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('Posts', PostsSchema);