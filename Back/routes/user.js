// Import d'Express pour créer le router
const express = require('express');
// Création du router avec Express
const router = express.Router();

// Import du controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');


// **************************************************************************************************
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// **************************************************************************************************


// Export du router pour pouvoir l'importer dans app.js
module.exports = router;