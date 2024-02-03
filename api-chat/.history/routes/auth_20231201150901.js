/** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

/** Récupération du routeur express */
let router = express.Router()

/** Middleware pour logger dates de requete */
router.use((req, res, next) => {
    const event = new Date()
    console.log('Auth Time:', event.toString())
    next()
})

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

// register
router.post('/register', (req, res) => {
    const { firstname, lastname, email, password } = req.body

    // Validation des données reçues
    if(!firstname || !lastname || !email || !password ){
        return res.status(400).json({ message: 'Missing Data'})
    }

    User.findOne({ where: { email: email }, raw: true })
        .then(user => {
            if( user !== null ){
                return res.status(409).json({ message: `The email ${email} is already being used` })
            }

            // Hashage du mot de passe utilisateur
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash

                    // Création de l'utilisateur
                    User.create(req.body)
                        .then( user => res.json({ message: 'Votre compte a bien été crée', data: user }))
                        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
                })
                .catch(err => res.status(500).json({ message: 'Erreur du Hashage', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})
module.exports = router