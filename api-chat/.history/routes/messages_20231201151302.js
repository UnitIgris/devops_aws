/** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcryptjs')
const checkTokenMiddleware = require('../jsonwebtoken/check')

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

router.put('',(req,res) => {

    const { content, chatId  } = req.body
    req.body.user_id = req.decodedToken.id
    // Validation des données    
    if(!content || !chatId){
        return res.status(400).json({ message: 'Missing Data'})
    }
})

module.exports = router