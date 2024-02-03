/** Import des module nécessaires */
const express = require('express')

const User = require('../models/user')

/** Récupération du routeur express */
let router = express.Router()

/** Routage de la ressource User */
router.get('',(req, res) => {
    User.findAll()
        .then( users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})

router.get('/:id')

router.put('')

router.patch('/:id')

router.delete('/:id')