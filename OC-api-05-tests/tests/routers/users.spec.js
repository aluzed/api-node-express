const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(chaiHttp);

if(process.env.NODE_ENV !== 'tests')
throw new Error('Bad environment');

let Users = null;
let token = null;

describe('Tests Users Routes', () => {
  
  before(done => {
    const Engine = require('../../index');
    Users = mongoose.model('Users');

    // On laisse le serveur Express.js démarrer avant de commencer les tests
    Engine.on('ready', () => {

      // Clean our user database an recreate a new one
      Users.remove({})
        .then(() => {
          Users.create({
            utilisateur: 'admin',
            pass: 'qwerty',
            date_inscription: Date.now(),
            nom: 'doe',
            prenom: 'john',
            email: 'john.doe@domain.tld'
          })
          .then(() => {
            done();
          })
          .catch(err => {
            throw err;
          })
        })
        .catch(err => {
          throw err;
        })
    })
  })

  // On va essayer un accès à la liste des utilisateurs, et on est sensé recevoir un code 403
  it('Should be rejected', done => {
    chai.request('http://localhost:3000')
      .get('/users')
      .end((err, res) => {
        if(err) 
          throw err;

        expect(res).to.have.status(403);
        done();
      });
  });

  it('Should connect our user', done => {
    chai.request('http://localhost:3000')
      .post('/users/login')
      .send({ username: 'admin', password: 'qwerty' })
      .end((err, res) => {
        if(err)
          throw err;

        expect(res).to.have.status(200);
        let content = JSON.parse(res);
        token = content.token;

        done();
      })
  })

});