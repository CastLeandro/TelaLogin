const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', UserController.listarTodos);
router.post('/', UserController.criar);
router.put('/', UserController.atualizar);
router.delete('/:id', UserController.deletar);

module.exports = router;