/** */
const express = require('express')
const cors = require('cors')

/** */
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

/** */
app.get('/',(req, res) => res.send("I'm online !"))
app.get('*',(req, res) => res.status(501).send('tf bro?'))

/** */
app.listen(8080,() => {
    console.log('server is running on 8080')
})