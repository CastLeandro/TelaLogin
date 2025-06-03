const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Em produção, você deve especificar a origem exata
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/clientes', clienteRoutes);
module.exports = app;