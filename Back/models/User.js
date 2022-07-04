const mongoose = require('mongoose');

// Ajout du pluggin uniqueValidator à notre schéma
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true},           // Une adresse email UNIQUE (package + unique: true)
    password : {type : String, required : true}                        // Un mot de passe HACHE
})

// Application du pluggin à notre schéma de donnée User + Renvoit un message d'erreur si la condition 'unique : true' n'est pas remplie
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);