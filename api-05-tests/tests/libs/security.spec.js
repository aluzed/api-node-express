// On importe le paquet chai pour les tests
const chai = require('chai');
const expect = chai.expect;

// On charge la librairie security
const security = require('../../libs/security');

let passwordHashed = null;
let token = null;
const fakeUser = {
  id: '123456',
  utilisateur: 'admin',
  email: 'admin@domain.tld',
  date_inscription: new Date(),
  nom: 'admin',
  prenom: 'admin'
};

// Début des tests Mocha
describe('Security Lib', () => {

  // Test de la fonction hashPassword
  it('Should hash a password', () => {
    passwordHashed = security.hashPassword('azerty');
    expect(passwordHashed === 'azerty').to.be.false;
    expect(passwordHashed).to.not.be.null;
  });

  // Test de la fonction comparePassword : true
  it('Should succeed when comparing a password', () => {
    const passwordOk = security.comparePassword(passwordHashed, 'azerty');
    expect(passwordOk).to.be.true;
  })

  // Test de la fonction comparePassword : false
  it('Should fail when comparing a password', () => {
    const passwordOk = security.comparePassword(passwordHashed, 'qwerty');
    expect(passwordOk).to.be.false;
  })

  // Test de la fonction de connexion
  it('Should get a token', done => {
    security.signIn(fakeUser).then(t => {
      token = t;
      expect(token).to.not.be.null;
      done();
    });
  })

  // Test de la fonction checkToken et récupération de l'utilisateur en payload
  it('Should succeed when checking token', done => {
    security.checkToken(token)
      .then(user => {
        // On teste chaque champs un à un
        expect(user._id).to.equal(fakeUser.id);
        expect(user.utilisateur).to.equal(fakeUser.utilisateur);
        expect(user.email).to.equal(fakeUser.email);
        expect(new Date(user.date_inscription).toString()).to.equal(fakeUser.date_inscription.toString());
        expect(user.nom).to.equal(fakeUser.nom);
        expect(user.prenom).to.equal(fakeUser.prenom);
        done();
      })
      .catch(err => {
        throw err;
      })
  })

  // Test checkToken qui n'est pas sensé fonctionner
  it('Should fail when validating token', done => {
    security.checkToken("fakeToken")
      .then(user => {
        // Aucun user n'est sensé être trouvé donc on génère une erreur
        throw new Error('Utilisateur existe');
      })
      .catch(err => {
        expect(err).to.not.be.null;
        done();
      })
  })

});