/** */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')

/** */
const User = DB.define('User', {
    id: {
        type: DataTypes.INTEGER(10),
        primarykey: true,
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
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(100),
        Is: /^[0-9a-f]{64}$/i
    }
})