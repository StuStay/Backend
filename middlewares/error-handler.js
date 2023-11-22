// middlewares/error-handler.js

function errorHandler(err, req, res, next) {
    console.error(err); // Vous pouvez effectuer des opérations de journalisation avancées ici
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur interne du serveur';
  
    res.status(statusCode).json({ error: message });
  }
  
  module.exports = errorHandler;