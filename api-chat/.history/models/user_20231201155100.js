/** */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')

/** */
module.exports = (sequelize) => {
const User = DB.define('User', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true   // Validation de données
        }
    },
    password: {
        type: DataTypes.STRING(100),
        Is: /^[0-9a-f]{64}$/i   // Contrainte
    }
},{ paranoid: true }) // Soft Delete

}
module.exports = User