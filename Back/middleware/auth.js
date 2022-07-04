// Package jsonwebtoken pour vérifier les tokens
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw '403: unauthorized request'
        } else{
            next();
        }
    }
    catch{
        res.status(401).json({error : error | "Unauthorized request"})
    }
}