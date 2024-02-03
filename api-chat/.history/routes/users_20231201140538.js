/** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const checkTokenMiddleware = require('../jsonwebtoken/check')

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource User */
router.get('',checkTokenMiddleware, (req, res) => {
    User.findAll()
        .then( users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})

router.get('/:id',(req, res) => {
    let userId = parseInt(req.params.id)
    
    //
    if(!userId){
        return res.json(400).json({ message: 'Missing Parameter'})
    }

    //
    User.findOne({ where: {id: userId}, raw: true})
        .then(user => {
            if((user === null)){
                return res.status(404).json({ message: 'This user does not exist'})
            }
            // Utilisateur trouvé
            return res.json({data: user})
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.put('',(req, res) => {
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
                        .then( user => res.json({ message: 'Utilisateur Crée', data: user }))
                        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
                })
                .catch(err => res.status(500).json({ message: 'Erreur du Hashage', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.patch('/:id',(req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification de la presence et cohérence du champ id
    if(!userId){
        return res.status(400).json({ message : "Missing parameter" })
    }

    // Recherche de l'utilisateur
    User.findOne({ where: {id: userId}, raw: true})
        .then(user => {
            // Vérification de l'existance de l'utilisateur
            if(user === null){
                return res.status(404).json({ message: 'This user does not exist'})
            }

            User.update(req.body, { where: {id: userId}})
                .then(user => res.json({ message: "l'utilisateur à été mis à jour"}))
                .catch(err => res.status(500).json({message: 'Database Error', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.delete('/:id',(req, res) => {
    let userId = parseInt(req.params.id)
    
    // Vérification si le champ id est présent et cohérent
    if (!userId){
        return res.status(400).json({ message: 'Missing Parameter'})
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

module.exports = router