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

    if(!email || !password){
        return res.status(400).json({ message: 'Email ou mot de passe erroné' })
    }
})