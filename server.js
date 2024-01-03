import express from 'express';
import mongoose from 'mongoose';
import payementsRoute from './routes/payementRoute.js'; 
import reservationRoute from './routes/reservationRoute.js'
import logementRoutes from './routes/logement.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.json());
app.use(morgan("dev"))
app.use('/api/payments', payementsRoute); 
app.use('/api/reservations',reservationRoute);
app.use('/logements', logementRoutes);
mongoose.connect('mongodb+srv://ahmedmaadi19:Ahmedmaadimido19@ahmed.uiec5dx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log('Node app is running on port 3000');
});
