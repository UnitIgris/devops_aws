/** */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')

/** */
const Chat = DB.define('Chat', {
    id: {
        type: DataTypes.INTEGER(10),
        primarykey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true
    },
    chat_id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    }
},{ paranoid: true }) // Soft Delete

module.exports = Chat