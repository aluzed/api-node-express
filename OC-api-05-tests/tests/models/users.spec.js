const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const database = require('./database');

let Users = null;
let userId = null;
let oldPassword = null;

// On décrit notre test
describe('Users Model', () => {

  // On va créer une fonction before qui signifie que nous souhaitons exécuter des opérations avant de commencer réellement les tests
  // Ce que nous allons faire dans cette partie, c'est se connecter à la base de données
  // le paramètre done est une fonction callback que l'on appelle lors que l'on aura fini nos opérations
  before(done => {
    database()
      .then(() => {
        Users = require('../../models/users');
        done();
      })
      .catch(err => {
        throw err;
      })
  });

  // Pour quitter proprement
  after(() => {
    mongoose.disconnect((err) => {
      // Si on reçoit une erreur
      if(err) throw err;

      // On force Node.js à s'arrêter
      process.exit(0);
    })
  });

  // Avant de faire nos tests, nous commençons par vider la base pour avoir une collection vide
  it('Should clean the database', done => {
    // Nous allons tout supprimer
    Users.remove({})
      .then(() => {
        // Et vérifié que tout est bien supprimé
        Users.find()
          .then(users => {
            // Si la base comporte toujours des éléments, on génère une erreur
            if(users.length > 0)
              throw new Error('La base n\'est pas vide');

            done();
          })
          .catch(err => {
            throw err;
          })
      })
  });

  // Nous allons tester l'ajout d'un nouvel utilisateur
  it('Should create a new user and hash the password', done => {
    Users.create({
      utilisateur: 'admin',
      pass: 'qwerty',
      date_inscription: Date.now(),
      nom: 'doe',
      prenom: 'john',
      email: 'john.doe@domain.tld'
    }, (err, user) => {
      // Si la méthode renvoie une erreur
      if(err)
        throw err;

      expect(user._id).to.not.be.null;
      // On stock l'id pour plus tard
      userId = user._id;

      expect(user.pass).to.not.equal('qwerty');
      // On stock le mot de passe pour plus tard
      oldPassword = user.pass;

      done();
    })
  });

  // On modifie son mot de passe
  it('Should update the password', done => {
    // On change le mot de passe
    Users.updatePassword(userId, 'rambo')
      .then(user => {
        // On vérifie que le nouveau mot de passe hashé est différent de l'ancien
        expect(user.pass === oldPassword).to.be.false;
        done();
      })
  });  
  
});