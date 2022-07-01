// Package cryptage mdp
const bcrypt = require('bcrypt');
// Import du package qui permet de créer des token
const jwt = require('jsonwebtoken');
// Import de notre BDD user
const User = require('../models/User');


// user : enregistrement 
exports.signup = (req,res,next) => {
    // Hash le mdp 
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        // Creation du nouveau user
        const user = new User({
            email : req.body.email,
            password : hash
        })
        // Enregistre le user avec le mdp crypté dans la BDD
        user.save()
            .then(() => res.status(201).json({message : "Utilisateur crée !"}))
            .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

// user : connexion
exports.login = (req,res,next) => {
    //Trouve le user qui correspond à l'email (unique donc on est sur que c'est le bon user)
    User.findOne({email : req.body.email})
        .then( user => {
            if(!user){
                return res.status(401).json({error: "Utilisateur non trouvé"})
            }
            // Compare le mdp du user qui essaye de se connecter avec le hash du user qu'on a recu dans la BDD
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error: "Mot de passe incorrect"})
                    }
                    // Le token contient le token + userId (pour pas pouvoir modifier l'objet des autres utilisateurs)
                    res.status(200).json({
                        userId : user._id,
                        token : jwt.sign(
                            {userId : user._id},
                            "RANDOM_TOKEN_SECRET",
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}