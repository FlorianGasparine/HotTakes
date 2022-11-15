// Import d'Express pour créer le router
const express = require("express");
// Création du router avec Express
const router = express.Router();

// Import du controller
const sauceController = require("../controllers/sauces");
// Import du controller pour vérifier qu'une route est sécurisée
const auth = require("../middleware/auth");
// Import du middleware multer
const multer = require("../middleware/multer-config");

// **************************************************************************************************
// Sauce : création
router.post("/", multer, sauceController.saveSauceInBDD);

// Sauce : gestion like/dislike
router.post("/:id/like", auth, sauceController.likeOrDislikeSauce);

// Sauce : mise à jour
router.put("/:id", auth, multer, sauceController.updateSauce);

// Sauce : suppression
router.delete("/:id", auth, sauceController.removeSauce);

// Sauce : affiche toutes les sauces
router.get("/", auth, sauceController.getAllSauce);

// Recuperation d'une sauce avec son id
router.get("/:id", auth, sauceController.getSauceWithId);
// **************************************************************************************************

// Export le router
module.exports = router;
