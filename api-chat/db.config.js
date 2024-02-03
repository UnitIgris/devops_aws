/** Import des modules nécessaires */
const { Sequelize } = require("sequelize");

/** Connexion à la DB */
let sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_port,
	dialect: "mysql",
	logging: false,
});

const db = {};
db.sequelize = sequelize;
db.User = require("./models/user")(sequelize);
db.Chat = require("./models/chat")(sequelize);
db.Message = require("./models/message")(sequelize);

/** Relations Chat*/
db.User.belongsToMany(db.Chat, { through: "Userchat", foreignKey: "UserId" });
db.Chat.belongsToMany(db.User, { through: "Userchat", foreignKey: "ChatId" });

/** Relations Message */
db.Message.belongsTo(db.User);
db.User.hasMany(db.Message);
db.Chat.hasMany(db.Message);
db.Message.belongsTo(db.Chat);

/** Synchronisation à la DB */
sequelize.sync();
//sequelize.sync({ force: true })
//sequelize.sync({ alter: true })

module.exports = db;
