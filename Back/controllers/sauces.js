// Import du modele Sauce
const SauceModel = require("../models/SauceModel");

// Import de fs pour avoir acces aux opération relatif au systeme de fichier
const fs = require("fs");

// Enregistre une nouvelle sauce dans la BDD
exports.saveSauceInBDD = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new SauceModel({
    userId: sauceObject.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    heat: sauceObject.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "La sauce a bien été ajouté" }))
    .catch((error) => res.status(400).json({ error }));
};

// Mise à jour de la sauce
exports.updateSauce = (req, res, next) => {
  const sauceObjet = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  SauceModel.updateOne(
    { _id: req.params.id },
    { ...sauceObjet, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: "La sauce a bien été modifié" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Suppression de la sauce
exports.removeSauce = (req, res, next) => {
  // Extraction du nom du fichier
  SauceModel.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Cherche l'objet dans la BDD
      const filename = sauce.imageUrl.split("/images/")[1];
      // Supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        // Supprimer l'objet dans la BDD
        SauceModel.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "La sauce a bien été supprimé" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Affiche toutes les sauces crées
exports.getAllSauce = (req, res, next) => {
  SauceModel.find()
    .then((modelsSauceSchema) => res.status(200).json(modelsSauceSchema))
    .catch((error) => res.status(400).json({ error }));
};

// Recuperation d'une sauce avec son id
exports.getSauceWithId = (req, res, next) => {
  // Le ':' dit a Express que c'est un parametre de route dynamique
  SauceModel.findOne({ _id: req.params.id })
    .then((modelsSauceSchema) => res.status(200).json(modelsSauceSchema))
    .catch((error) => res.status(404).json({ error }));
};

// Gestion des likes/dislike
exports.likeOrDislikeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  // 3 cas => (1,0,-1) utilisation d'un switch pour spécifier les 3 cas

  switch (like) {
    // Like
    case 1:
      SauceModel.updateOne(
        { _id: sauceId }, // Recupere l'id de la sauce dans la requete (présente dans les paramètres de l'url)
        {
          $push: { usersLiked: userId }, // $push => ajout de l'id à l'array d'id de notre bdd pour les users qui like
          $inc: { likes: 1 }, // $inc => Incrémentation du champ avec la nouvelle valeure (ici 1 car c'est un like) dans la BDD
        }
      )
        .then(() =>
          res.status(200).json({ message: "L'utilisateur à like la sauce" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

    //Dislike
    case -1:
      SauceModel.updateOne(
        { _id: sauceId },
        {
          $push: { usersDisliked: userId },
          $inc: { dislikes: 1 },
        }
      )
        .then(() =>
          res.status(200).json({ message: "L'utilisateur à dislike la sauce" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

    case 0:
      SauceModel.findOne({ _id: sauceId }) // Recuperation de l'id dans les paramètres de l'url
        .then((sauce) => {
          let data;
          let typeCompteur;
          // Si l'id du user est présent dans le tableau des likes (avec la méthode include qui renvoit true si c'est le cas)
          if (sauce.usersLiked.includes(userId)) {
            data = { usersLiked: userId };
            typeCompteur = { likes: -1 };
          }
          // Si l'id du user est présent dans le tableau des dislikes
          if (sauce.usersDisliked.includes(userId)) {
            data = { usersDisliked: userId };
            typeCompteur = { dislikes: -1 };
          }
          SauceModel.updateOne(
            { _id: sauceId },
            {
              $pull: data,
              $inc: typeCompteur,
            }
          )
            .then(() => res.status(200).json({ message: "Annulation du vote" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    default:
      console.log(error);
  }
};
