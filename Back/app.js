// APP.JS gère TOUTES les requêtes envoyées à notre serveur

// Import d'express
const express = require('express');

// Import du package helmet pour la sécurisation de notre application Express
const helmet = require("helmet");

// Notre application express
const app = express();

// Utilisation de tous les middlewares d'helmet (15)
app.use(helmet());


// Middleware qui intercepte les requete en json et met a disposition le contenu de la requete est dans req.body
app.use(express.json());


// // Donne accés au chemin de notre systeme de fichier
const path = require('path');


// Import des router des sauces
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');



// Import package interaction avec BDD
const mongoose = require('mongoose');
// Connexion à la BDD
mongoose.connect('mongodb+srv://User1:User1@cluster0.kovdb5k.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Gestion erreur CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));




//******************************************************* */
// Route des sauces
app.use('/api/sauces', sauceRoutes);
//Route user
app.use('/api/auth/', userRoutes);
//******************************************************* */



// Export de l'application express
module.exports = app;