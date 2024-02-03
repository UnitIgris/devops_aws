/** Import des module nécessaires */
const { DataTypes } = require("sequelize");

/** Définition du modèle */
module.exports = (sequelize) => {
	const Chat = sequelize.define("Chat");
	return Chat;
};
