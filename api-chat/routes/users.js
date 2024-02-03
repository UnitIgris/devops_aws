/** Import des module nécessaires */
const express = require('express')

const userController = require('../controllers/user')

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource User */
router.get('', userController.getAllUsers )

router.get('/:id',userController.getUser )

router.patch('/me',userController.updateMyProfile )

module.exports = router