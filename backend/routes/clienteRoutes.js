const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const { upload, verificarFotoObrigatoria, handleUploadError } = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', ClienteController.listarTodos);
router.get('/:id', ClienteController.buscarPorId);
router.delete('/:id', ClienteController.deletar);

router.post('/', 
    upload.single('foto'), 
    handleUploadError,
    verificarFotoObrigatoria, 
    ClienteController.criar
);

router.put('/:id', 
    upload.single('foto'),
    handleUploadError,
    ClienteController.atualizar
);

module.exports = router; 