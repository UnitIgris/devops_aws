/** Import des modules nécessaires */
const { Sequelize } = requize('sequelize')

/** Connexion à la DB */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

/** Synchronisation à la DB */
//sequelize.sync()

module.exports = sequelize