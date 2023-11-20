// middlewares/multer-config.js
const multer = require('multer');

// Configuration pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Répertoire de stockage des fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nom de fichier unique
  },
});

// Configuration de multer
const upload = multer({ storage });

module.exports = upload;