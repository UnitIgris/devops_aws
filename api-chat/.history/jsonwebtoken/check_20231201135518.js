/** Import des module nécessaires */
const jwt = require('jsonwebtoken')

/** Extraction du token */
const extractBearer = authorization => {
    if(typeof authorization !== 'string'){
        return false
    }

    // Isolation du token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)
    
    return matches && matches[2]
}

/** Vérification de la présence du token */
const checkTokenMiddleware = (req, res, next) => {

    const token = req.headers.authorization && extractBearer(req.headers.authorization)
}
