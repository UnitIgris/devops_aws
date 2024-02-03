/** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcryptjs')

const Chat = require('../models/chat')

const Message = require('../models/message')

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource Chat */
router.get('',(req, res) => {
    Chat.findAll()
        .then( chats => res.json({ data: chats }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})

router.get('/:id',(req, res) => {
    let chatId = parseInt(req.params.id)
    
    //
    if(!chatId){
        return res.json(400).json({ message: 'Missing Parameter'})
    }

    //
    Chat.findOne({ where: {id: chatId}, raw: true})
        .then(chat => {
            if((chat === null)){
                return res.status(404).json({ message: 'This chat does not exist'})
            }
            // Utilisateur trouvé
            return res.json({data: chat})
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

// user create chat with other user
router.put('',(req, res) => {
    const { userid2  } = req.body
    req.body.userid1 = req.decodedToken.id

    // Validation des données reçues
    if( !userid2 ){
        return res.status(400).json({ message: 'Missing Data'})
    }

    Chat.findOne({ where: { userid1: req.decodedToken.id, userid2: userid2 }, raw: true })
        .then(chat => {
            if( chat !== null ){
                return res.status(409).json({ message: `The chat already exists` })
            }

            // Création du chat
            Chat.create(req.body)
            .then( chat => res.json({ message: 'Chat Crée', data: chat }))
            .catch(err => res.status(500).json({message: 'Database Error', error: err}))
        })
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

router.delete('/:id',(req, res) => {
    let chatId = parseInt(req.params.id)
    
    // Vérification si le champ id est présent et cohérent
    if (!chatId){
        return res.status(400).json({ message: 'Missing Parameter'})
    }

    // Suppression de l'utilisateur
    Chat.destroy({ where: {id: chatId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({message: 'Database Error', error: err}))
})

module.exports = router