/** */
const { DataTypes } = require('sequelize')

/** */
module.exports = (sequelize) => {
    const Chat = sequelize.define('Chat', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        }
    },{ paranoid: true }) // Soft Delete
    return Chat;
}
