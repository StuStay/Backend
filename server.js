import express from 'express';
import mongoose from 'mongoose';
import logementRoutes from './routes/logement.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', logementRoutes);

mongoose.connect('mongodb://localhost:27017/nom-de-votre-base-de-donnees', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
