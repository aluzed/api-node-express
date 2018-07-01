const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'PostsCategories' },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  date_creation: { type: Date, default: Date.now },
  date_modification: { type: Date, default: Date.now }    
});

function updateModified(next) {
  if(!this.isNew) {
    this.date_modification = Date.now();
  }

  next();
}

PostsSchema.pre('save', updateModified);
PostsSchema.pre('findByIdAndUpdate', updateModified);

module.exports = mongoose.model('Posts', PostsSchema);