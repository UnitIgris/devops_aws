/** Import des module nécessaires */
const { DataTypes } = require("sequelize");

/** Définition du modèle */
module.exports = (sequelize) => {
	const Message = sequelize.define(
		"Message",
		{
			id: {
				type: DataTypes.INTEGER(10),
				primaryKey: true,
				autoIncrement: true,
			},
			content: {
				type: DataTypes.STRING(100),
				defaultValue: "",
				allowNull: false,
			},
		},
		{ paranoid: true }
	);
	return Message;
};
