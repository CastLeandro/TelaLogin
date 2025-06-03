const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/', UserController.criar);
router.post('/login', UserController.login);

// Rotas protegidas
router.use(authMiddleware); // Aplica o middleware de autenticação para todas as rotas abaixo
router.get('/', UserController.listarTodos);
router.put('/', UserController.atualizar);
router.delete('/:id', UserController.deletar);

module.exports = router;