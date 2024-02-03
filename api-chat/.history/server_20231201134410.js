/** Import des modules nécessaires */
const express = require('express')
const cors = require('cors')

/** Import de la connexion à la DB */
let DB = require('./db.config');

/** Initialisation de l'API */
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

/** Import des modules de routage */
const user_router = require('./routes/users')
const chat_router = require('./routes/chats')
const message_router = require('./routes/messages')

const auth_router = require('./routes/auth')

/** Mise en place du routage */
app.get('/',(req, res) => res.send("I'm online !"))

app.use('/users', user_router)
app.use('/chats', chat_router)
app.use('/messages', message_router)

app.use('/auth', auth_router)

app.get('*',(req, res) => res.status(501).send('Nothing here'))

/** Démarrage serveur avec test DB */
DB.authenticate()
    .then(() => console.log('Connexion à la base de données OK'))
    .then(() => {
        app.listen(process.env.SERVER_PORT,() => {
            console.log(`server is running on ${process.env.SERVER_PORT}`)
        })
    })
    .catch(err => console.log('Erreur de la connexion à la base de données',err))
