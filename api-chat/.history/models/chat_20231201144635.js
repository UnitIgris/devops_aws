/** */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')

/** */
const Chat = DB.define('Chat', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    user_id2:{
        type: DataTypes.INTEGER(10),
        allowNull: false
    }
},{ paranoid: true }) // Soft Delete

module.exports = Chat