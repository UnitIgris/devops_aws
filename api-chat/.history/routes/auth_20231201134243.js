/** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource Auth */

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validation des données reçues
    if(!email || !password){
        return res.status(400).json({ message: 'Email ou mot de passe erroné' })
    }

    User.findOne({ where: {email: email}, raw: true})
        .then(user => {
            // Vérification de l'existance de l'Utilisateur
            if(user === null){
                return res.status(401).json({ message: `Ce compte n'existe pas !`})
            }

            // Vérification du mot de passe
            bcrypt.compare(password, user.password)
                .then(test => {
                    if(!test){
                        return res.status(401).json({ message: 'Mot de passe érroné'})
                    }

                    // Génération du token
                    const token = jwt.sign({
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email
                    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING})

                    return res.json({access_token: token})
                })
                .catch(err => res.status(500).json({message: 'Login process failed', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

module.exports = router