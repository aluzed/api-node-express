const mongoose = require('mongoose');

const PostCategoriesSchema = new mongoose.Schema({
  libelle: { type: String, required: true },
  cree_par: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  date_creation: { type: Date, default: Date.now },
  date_modification: { type: Date, default: Date.now }    
});

function updateModified(next) {
  if(!this.isNew) {
    this.date_modification = Date.now();
  }

  next();
}

PostCategoriesSchema.pre('save', updateModified);
PostCategoriesSchema.pre('findByIdAndUpdate', updateModified);

module.exports = mongoose.model('PostCategories', PostCategoriesSchema);