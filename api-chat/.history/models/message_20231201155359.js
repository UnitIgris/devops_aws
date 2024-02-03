/** */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')

/** */
module.exports = (sequelize) => {
const Message = DB.define('Message', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    chat_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    }
},{ paranoid: true }) // Soft Delete
    return Message;
}