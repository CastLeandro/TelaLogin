const {DataTypes} = require('sequelize');
const cursor = require('../db/database');

const User = cursor.define('users', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  
},{
        tableName: 'users',
        freezeTableName: true,
        timestamps: false,
        schema: 'public',
})

module.exports = User;