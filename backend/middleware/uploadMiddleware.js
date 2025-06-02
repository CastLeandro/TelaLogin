const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const MIME_TYPES_PERMITIDOS = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
];

const fileFilter = (req, file, cb) => {
    if (MIME_TYPES_PERMITIDOS.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de arquivo não permitido. Tipos permitidos: ${MIME_TYPES_PERMITIDOS.join(', ')}`), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const verificarFotoObrigatoria = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ 
            error: 'A foto é obrigatória',
            detalhes: 'Envie uma imagem no campo "foto" do formulário'
        });
    }
    next();
};

const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Arquivo muito grande',
                detalhes: 'O tamanho máximo permitido é 5MB'
            });
        }
        return res.status(400).json({
            error: 'Erro no upload do arquivo',
            detalhes: err.message
        });
    }
    
    if (err) {
        return res.status(400).json({
            error: 'Erro no upload',
            detalhes: err.message
        });
    }
    next();
};

module.exports = {
    upload,
    verificarFotoObrigatoria,
    handleUploadError
}; 