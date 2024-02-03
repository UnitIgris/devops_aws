/** Import des module nécessaires */
const express = require("express");
const authController = require("../controllers/auth");


/** Récupération du routeur express */
let router = express.Router();

/** Middleware pour logger dates de requete */
router.use((req, res, next) => {
    const event = new Date();
    console.log("Auth Time:", event.toString());
    next();
});

/** Routage de la ressource Auth */
router.post("/login", authController.login);

router.post("/register", authController.register);

module.exports = router;

