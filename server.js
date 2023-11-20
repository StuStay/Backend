import express from 'express';
import mongoose from 'mongoose';
import logementRoutes from './routes/logement.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', logementRoutes);

mongoose.connect('mongodb+srv://hama:sZKLggJMv5aSYQCI@cluster0.xsxxjn5.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log('Node app is running on port 3000');
});