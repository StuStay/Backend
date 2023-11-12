import express from 'express';
import mongoose from 'mongoose';
import logementRoutes from './routes/logement.js';

const app = express();
const port = process.env.PORT || 3000;

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const databaseName = 'stustay-db';


mongoose
  .connect(`mongodb://localhost:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to MongoDB: ${databaseName}`);
  })
  .catch(err => {
    console.error(err);
  });
app.use('/logements', logementRoutes);
app.use(express.json());
app.use('/logements', logementRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});


app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});