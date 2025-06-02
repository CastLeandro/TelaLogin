const { Sequelize} = require('sequelize');
require('dotenv').config();

const cursor = new Sequelize(process.env.BANCO_URL,{
    logging: console.log,
})

async function testarConexao() {
    try {
        await cursor.authenticate();
        console.log('Conexao com o banco realizada com sucesso')
    }catch(error){
        console.error('Não foi possível conectar ao banco:', error);
    }
}

testarConexao();

module.exports = cursor