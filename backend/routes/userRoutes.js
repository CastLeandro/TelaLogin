const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', UserController.listar);
router.post('/', UserController.criar);

module.exports = router;