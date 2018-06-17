const mongoose = require('mongoose');

const PostCategoriesSchema = new mongoose.Schema({
  libelle: { type: String, required: true },
  cree_par: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateurs' },
  date_creation: { type: Date, default: Date.now },
  date_modification: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('PostCategories', PostCategoriesSchema);