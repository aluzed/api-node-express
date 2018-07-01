const chai = require('chai');
const mongoose = require('mongoose');
const Promise = require('bluebird');
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

// Notre modèle Post Catégories
let PostCategories = null;

// Sauvegarde de notre utilisateur
let user = null;

// Sauvegarde de notre catégorie
let post_category = null;

describe('Tests Post Categories Routes', () => {
  
  // Ici on va ouvrir notre serveur Express.js
  // Puis on va nettoyer notre base utilisateur pour les tests
  before(done => {
    // Ici on récupère l'objet événement renvoyé par index
    const Engine = require('../../index');

    Users = mongoose.model('Users');
    PostCategories = mongoose.model('PostCategories');

    // On laisse le serveur Express.js démarrer avant de commencer les tests
    Engine.on('ready', () => {

      // Clean our database 
      Promise.each([
        new Promise((res, rej) => {
          return PostCategories.remove({})
            .then(() => {
              return res();
            })
            .catch(err => {
              return rej(err);
            })
        }),
        new Promise((res, rej) => {
          return Users.remove({})
            .then(() => {
              return res();
            })
            .catch(err => {
              return rej(err);
            })
        })
      ], d => d)
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

    })
  })

  // A la fin des tests on quitte pour éviter que le serveur reste ouvert 
  after(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  })  

  // On va essayer un accès à la liste des catégories, et on est sensé recevoir un code 403
  it('Should be rejected', done => {
    chai.request(host)
      .get('/posts')
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
        user = JSON.parse(res.text);

        done();
      })
  });

  // Test de notre route POST /post_categories
  it('Should add a new category', done => {
    chai.request(host)
      .post('/post_categories')
      .set('x-access-token', user.token)
      .send({
        libelle: 'news'
      })
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(200);
        post_category = JSON.parse(res.text);

        expect(post_category.libelle).to.equal('news');

        done();
      })
  });

  // Test de notre route GET /post_categories
  it('Should get one category', done => {
    chai.request(host)
      .get('/post_categories')
      .set('x-access-token', user.token)
      .end((err, res) => {
        if(err) throw err;

        let content = JSON.parse(res.text);
        expect(content).to.have.property('length').to.equal(1);

        done();
      })
  });

  // Test de notre route PUT /post_categories/:id
  it('Should update a category', done => {
    chai.request(host)
      .put('/post_categories/' + post_category._id)
      .set('x-access-token', user.token)
      .send({ libelle: "actu" })
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(200);
        let content = JSON.parse(res.text);
        
        expect(content.libelle).to.equal('actu');

        done();
      })
  });

  // Test de notre route DELETE /post_categories/:id
  it('Should delete a category', done => {
    chai.request(host)
      .delete('/post_categories/' + post_category._id)
      .set('x-access-token', user.token)
      .end((err, res) => {
        if(err) throw err;
        
        expect(res).to.have.status(200);
        
        // Now get users list to see if there is 1 item
        chai.request(host)
          .get('/post_categories')
          .set('x-access-token', user.token)
          .end((err, res) => {
            if(err) throw err;

            expect(res).to.have.status(200);
            let content = JSON.parse(res.text);
            
            expect(content).to.have.property('length').to.equal(0);

            done();
          }) 

      })
  });

});