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
    creator_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    }
},{ paranoid: true }) // Soft Delete

module.exports = Chat