require('dotenv').config();

const app = require('./app');

const port = 3000;

app.listen(port, () =>{
    console.log(`Servidor rodando em http://localhost:${port}`)
});