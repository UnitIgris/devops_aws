/** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcrypt')
const checkTokenMiddleware = require('./jsonwebtoken/check')

const Message = require('../models/message')

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource Message */
router.get('',(req, res) => {
    Message.findAll()
        .then( messages => res.json({ data: messages }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})

router.get('/:id',(req, res) => {
    let messageId = parseInt(req.params.id)
    
    //
    if(!messageId){
        return res.json(400).json({ message: 'Missing Parameter'})
    }

    //
    Message.findOne({ where: {id: messageId}, raw: true})
        .then(message => {
            if((message === null)){
                return res.status(404).json({ message: 'This message does not exist'})
            }
            // Utilisateur trouvé
            return res.json({data: message})
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.put('',checkTokenMiddleware,(req, res) => {
    const { firstname, lastname, email, password } = req.body

    // Validation des données reçues
    if(!firstname || !lastname || !email || !password ){
        return res.status(400).json({ message: 'Missing Data'})
    }

    Message.findOne({ where: { email: email }, raw: true })
        .then(message => {
            if( message !== null ){
                return res.status(409).json({ message: `The email ${email} is already being used` })
            }

            // Hashage du mot de passe utilisateur
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash

                    // Création de l'utilisateur
                    Message.create(req.body)
                        .then( message => res.json({ message: 'Utilisateur Crée', data: message }))
                        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
                })
                .catch(err => res.status(500).json({ message: 'Erreur du Hashage', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.patch('/:id',checkTokenMiddleware,(req, res) => {
    let messageId = parseInt(req.params.id)

    // Vérification de la presence et cohérence du champ id
    if(!messageId){
        return res.status(400).json({ message : "Missing parameter" })
    }

    // Recherche du message
    Message.findOne({ where: {id: messageId}, raw: true})
        .then(message => {
            // Vérification de l'existance du message
            if(message === null){
                return res.status(404).json({ message: 'This message does not exist'})
            }

            Message.update(req.body, { where: {id: messageId}})
                .then(message => res.json({ message: "le message à été mis à jour"}))
                .catch(err => res.status(500).json({message: 'Database Error', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.delete('/:id',checkTokenMiddleware,(req, res) => {
    let messageId = parseInt(req.params.id)
    
    // Vérification si le champ id est présent et cohérent
    if (!messageId){
        return res.status(400).json({ message: 'Missing Parameter'})
    }

    // Suppression de l'utilisateur
    Message.destroy({ where: {id: messageId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

module.exports = router