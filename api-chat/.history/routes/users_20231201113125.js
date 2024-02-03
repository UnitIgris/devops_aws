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
        })

        // Utilisateur trouvé
        return res.json({data: user})
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
        })
})

router.patch('/:id')

router.delete('/:id')