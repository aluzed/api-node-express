const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;

// On importe le paquet chai-http
const chaiHttp = require('chai-http');

// On charge chaiHttp dans chai
chai.use(chaiHttp);

if(process.env.NODE_ENV !== 'tests')
  throw new Error('Bad environment');

// l'adresse de notre serveur
const host = 'http://localhost:3000';

// Notre modèle Users
let Users = null;

// Sauvegarde de notre token
let token = null;

// Pour stocker notre second utilisateur de tests 
let user2 = null;

describe('Tests Users Routes', () => {
  
  // Ici on va ouvrir notre serveur Express.js
  // Puis on va nettoyer notre base utilisateur pour les tests
  before(done => {
    // Ici on récupère l'objet événement renvoyé par index
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

  // A la fin des tests on quitte pour éviter que le serveur reste ouvert 
  after(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  })  

  // On va essayer un accès à la liste des utilisateurs, et on est sensé recevoir un code 403
  it('Should be rejected', done => {
    chai.request(host)
      .get('/users')
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(403);
        done();
      });
  });

  // Test de notre route POST /users/login
  it('Should connect our user', done => {
    chai.request(host)
      .post('/users/login')
      // On envoie les credentials
      .send({ username: 'admin', password: 'qwerty' })
      .end((err, res) => {
        if (err) throw err;

        expect(res).to.have.status(200);

        // Le contenu arrive sous forme de chaîne, il faut donc convertir en JSON
        let content = JSON.parse(res.text);

        // On stock le token dans notre variable globale pour plus tard
        token = content.token;

        done();
      })
  });

  // Test de notre route POST /users
  it('Should add a new user', done => {
    chai.request(host)
      .post('/users')
      .set('x-access-token', token)
      .send({
        utilisateur: 'user',
        pass: 'azerty',
        date_inscription: Date.now(),
        nom: 'test',
        prenom: 'user',
        email: 'user.test@domain.tld'
      })
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(200);
        user2 = JSON.parse(res.text);

        expect(user2.utilisateur).to.equal('user');
        expect(user2.nom).to.equal('test');
        expect(user2.prenom).to.equal('user');
        expect(user2.email).to.equal('user.test@domain.tld');

        done();
      })
  });

  // Test de notre route GET /users
  it('Should get 2 users', done => {
    chai.request(host)
      .get('/users')
      .set('x-access-token', token)
      .end((err, res) => {
        if(err) throw err;

        let content = JSON.parse(res.text);
        expect(content).to.have.property('length').to.equal(2);

        done();
      })
  });

  // Test de notre route PUT /users/:id
  it('Should update a user', done => {
    chai.request(host)
      .put('/users/' + user2._id)
      .set('x-access-token', token)
      .send({ utilisateur: "utilisateur", nom: "nom_test", prenom: "prenom_test" })
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(200);
        let updatedUser = JSON.parse(res.text);
        
        expect(updatedUser.utilisateur).to.equal('utilisateur');
        expect(updatedUser.nom).to.equal('nom_test');
        expect(updatedUser.prenom).to.equal('prenom_test');

        done();
      })
  });

  // Tests de notre route PUT /users/update_password/:id
  it('Should update the password', done => {
    chai.request(host)
      .put('/users/update_password/' + user2._id)
      .set('x-access-token', token)
      .send({ password: "new_password", confirm: "new_password" })
      .end((err, res) =>  {
        if (err) throw err;

        expect(res).to.have.status(200);
        let updatedUser = JSON.parse(res.text);

        // On vérifie que les deux mots de passes sont bien différents
        expect(updatedUser.pass === user2.pass).to.be.false;

        done();
      })
  }) 

  // Test de notre route DELETE /users/:id
  it('Should delete a user', done => {
    chai.request(host)
      .delete('/users/' + user2._id)
      .set('x-access-token', token)
      .end((err, res) => {
        if(err) throw err;
        
        expect(res).to.have.status(200);
        
        // Now get users list to see if there is 1 item
        chai.request(host)
          .get('/users')
          .set('x-access-token', token)
          .end((err, res) => {
            if(err) throw err;

            expect(res).to.have.status(200);
            let content = JSON.parse(res.text);
            
            expect(content).to.have.property('length').to.equal(1);

            done();
          }) 

      })
  })

});