/** Import des modules nécessaires */
const { Sequelize } = require('sequelize')

/** Connexion à la DB */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

const db = {};
db.sequelize = sequelize;
db.User = require("./models/user")(sequelize);
db.Chat = require("./models/chat")(sequelize);
db.Messages = require("./models/message")(sequelize);

/** ManyToMany User Chat*/
db.User.belongsToMany(db.Chat, {through: db.User_chat});
db.Chat.belongsToMany(db.User, { through: db.User_ingredient });
db.User_ingredient.belongsTo(db.Chat);
db.User_ingredient.belongsTo(db.User);
db.Chat.hasMany(db.User_ingredient);
db.User.hasMany(db.User_ingredient);

/** Synchronisation à la DB */
sequelize.sync()
//sequelize.sync({ force: true })
//sequelize.sync({ alter: true })

module.exports = sequelize