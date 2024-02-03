/** */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')

/** */
module.exports = (sequelize) => {
    const Chat = DB.define('Chat', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        }
    },{ paranoid: true }) // Soft Delete
    return Chat;
}
