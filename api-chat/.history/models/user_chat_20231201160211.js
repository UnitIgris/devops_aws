/* Import des modules nécessaires */
const { DataTypes } = require("sequelize");

/* Définition du modèle */
module.exports = (sequelize) => {
  const User_chat = sequelize.define(
    "User_chat",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
    },
  );
  return User_chat;
};
