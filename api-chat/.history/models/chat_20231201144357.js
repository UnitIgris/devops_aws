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
        
    }
},{ paranoid: true }) // Soft Delete

module.exports = Chat