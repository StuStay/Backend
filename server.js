import express from 'express';
import mongoose from 'mongoose';
import payementsRoute from './routes/payementRoute.js'; 
import reservationRoute from './routes/reservationRoute.js'
import logementRoutes from './routes/logement.js';

const app = express();
app.use(express.json());
app.use('/api/payments', payementsRoute); 
app.use('/api/reservations',reservationRoute);
app.use('/logements', logementRoutes);
mongoose.connect('mongodb+srv://hama:sZKLggJMv5aSYQCI@cluster0.xsxxjn5.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log('Node app is running on port 3000');
});
