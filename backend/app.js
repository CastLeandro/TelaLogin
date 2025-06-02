const express = require('express');
const userRoutes = require('./routes/userRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/clientes', clienteRoutes);
module.exports = app;