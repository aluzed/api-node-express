const mongoose = require('mongoose');
const Promise = require('bluebird');

// Ce fichier database.js renverra une promesse qui se connectera à notre base de données de tests
module.exports = function() {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost:27017/mabasetest_tdd', (err) => {
      if(err) 
        return reject(err);
      
      return resolve();
    })
  })
}
