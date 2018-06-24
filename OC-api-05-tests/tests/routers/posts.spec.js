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
let Posts = null;

// Notre modèle Post Catégories
let PostCategories = null;

// Sauvegarde de notre utilisateur
let user = null;

// Sauvegarde de notre article
let post = null;

// Sauvegarde de notre catégorie
let post_category = null;

describe('Tests Users Routes', () => {
  
  // Ici on va ouvrir notre serveur Express.js
  // Puis on va nettoyer notre base utilisateur pour les tests
  before(done => {
    // Ici on récupère l'objet événement renvoyé par index
    const Engine = require('../../index');

    Users = mongoose.model('Users');
    PostCategories = mongoose.model('PostCategories');
    Posts = mongoose.model('Posts');

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
        }),
        new Promise((res, rej) => {
          Posts.remove({})
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
        .then(u => {
          PostCategories.create({
            libelle: 'news',
            cree_par: u._id
          })
          .then(pc => {
            post_category = pc;
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
  })

  // A la fin des tests on quitte pour éviter que le serveur reste ouvert 
  after(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  })  

  // On va essayer un accès à la liste des articles, et on est sensé recevoir un code 403
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

  // Test de notre route POST /posts
  it('Should add a new article', done => {
    chai.request(host)
      .post('/posts')
      .set('x-access-token', user.token)
      .send({
        titre: 'nouvel article',
        contenu: 'lorem ipsum 1...',
        category: post_category._id
      })
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(200);
        post = JSON.parse(res.text);

        expect(post.titre).to.equal('nouvel article');

        done();
      })
  });

  // Test de notre route GET /posts
  it('Should get one article', done => {
    chai.request(host)
      .get('/posts')
      .set('x-access-token', user.token)
      .end((err, res) => {
        if(err) throw err;

        let content = JSON.parse(res.text);
        expect(content).to.have.property('length').to.equal(1);

        done();
      })
  });

  // Test de notre route PUT /posts/:id
  it('Should update an article', done => {
    chai.request(host)
      .put('/posts/' + post._id)
      .set('x-access-token', user.token)
      .send({ 
        titre: "mon titre", 
        contenu: "lorem lorem ipsum pas ipsum 2..." 
      })
      .end((err, res) => {
        if(err) throw err;

        expect(res).to.have.status(200);
        let content = JSON.parse(res.text);
        
        expect(content.titre).to.equal('mon titre');

        done();
      })
  });

  // Test de notre route DELETE /posts/:id
  it('Should delete an article', done => {
    chai.request(host)
      .delete('/posts/' + post._id)
      .set('x-access-token', user.token)
      .end((err, res) => {
        if(err) throw err;
        
        expect(res).to.have.status(200);
        
        // Now get users list to see if there is 1 item
        chai.request(host)
          .get('/posts')
          .set('x-access-token', user.token)
          .end((err, res) => {
            if(err) throw err;

            expect(res).to.have.status(200);
            let content = JSON.parse(res.text);
            
            expect(content).to.have.property('length').to.equal(0);

            done();
          }) 

      })
  })

});