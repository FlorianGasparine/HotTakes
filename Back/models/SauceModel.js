// Utilise mongoose pour ce shema donc on import mongoose
const mongoose = require('mongoose');

// Creation d'un schema de donnée
const modelsSauceSchema = mongoose.Schema( 
    {
        userId : {type: String, required : true},                       // Id de l'utilisateur
        name : {type : String, required : true},                        // Nom de la sauce
        manufacturer : {type : String, required : true},                // Fabricant de la sauce
        description : {type : String, required : true},                 // Description de la sauce
        mainPepper : {type : String, required : true},                  // Principal ingrédient
        imageUrl : {type : String, required : true},                    // L'url de l'image téléchargé par l'utilisateur
        heat : {type : Number, required : true},                        // Nombre entre 1 et 10 décrivant la sauce
        likes : {type : Number, required : true, default : 0},          // Nombre d'utilisateur qui aiment la sauce
        dislikes : {type : Number,required : true, default : 0},        // Nombre d'utilisateur qui n'aiment pas la sauce
        usersLiked : {type : [String], required : true},                // Array des userId qui ont aimé la sauce
        usersDisliked : {type : [String], required : true},             // Array des userId qui n'ont pas aimé la sauce
    }
)

// Export le model pour interragir avec la BDD mongoDB
module.exports = mongoose.model("SauceModel", modelsSauceSchema);