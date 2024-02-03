/** Import des modules nécessaires */
const express = require('express')

const messageController = require('../controllers/message');

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource Message */
router.get('', messageController.getMyMessages)

router.get('/:id', messageController.getMessage)

router.patch('/:id', messageController.updateMessage)

router.delete('/:id', messageController.deleteMessage)

router.put('', messageController.createMessage)

module.exports = router