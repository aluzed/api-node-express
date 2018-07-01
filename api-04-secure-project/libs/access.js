// On importe la librairie de sécurité
const security = require('./security');

// Nous allons déclarer nos middleware Express.js ici
const access = {
  // On vérifie que l'utilisateur est connecté
  isLoggedIn: (req, res, next) => {
    // On récupère le token dans le body, dans les query parameters ou encore dans les haders
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // Si le token n'existe pas on renvoie un code : accès interdit
    if (!token)
      return res.status(403).send();

    // On vérifie la validité du token
    security.checkToken(token)
      .then(user => {
        // Une fois que l'on récupère le user, on le passe dans notre objet req ainsi que le token
        req.token = token;
        req.user = user;

        // On dit à express que l'exécution de notre middleware est terminé
        return next();
      })
      .catch(err => {
        // Si jamais on reçoit une erreurlors de la vérification du token
        return res.status(500).send("Internal error");
      });
  },
  // On vérifie que l'utilisateur n'est pas connecté
  isNotLoggedIn: (req, res, next) => {
    // On récupère le token dans le body, dans les query parameters ou encore dans les haders
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // Si le token n'existe pas (l'utilisateur n'est pas authentifié)
    if (!token)
      // On dit à express que l'exécution du middleware est terminé
      return next();

    // Sinon on renvoie un code accès interdit
    return res.status(403).send();
  }
}

module.exports = access;