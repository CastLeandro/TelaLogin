const { DataTypes } = require('sequelize');
const cursor = require('../db/database');
const User = require('./userModel');

const Cliente = cursor.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    endereco: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    foto_caminho: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data_cadastro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'clientes',
    freezeTableName: true,
    timestamps: false,
    schema: 'public'
});

Cliente.belongsTo(User, { foreignKey: 'id_usuario' });

module.exports = Cliente; 