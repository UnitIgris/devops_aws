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
db.Message = require("./models/message")(sequelize);
db.User_chat = require("./models/user_chat")(sequelize);

/** ManyToMany User Chat*/
db.User.belongsToMany(db.Chat, {through: db.User_chat });
db.Chat.belongsToMany(db.User, { through: db.User_chat });
db.User_chat.belongsTo(db.Chat);
db.User_chat.belongsTo(db.User);
db.Chat.hasMany(db.User_chat);
db.User.hasMany(db.User_chat);

/** ManyToOne User Message */
db.User.hasMany(db.Message, {foreignKey: "user_id"})
db.Message.belongsTo(db.User, {foreignKey: "user_id"})

/** Synchronisation à la DB */
//sequelize.sync()
//sequelize.sync({ force: true })
sequelize.sync({ alter: true })

module.exports = db