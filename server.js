import express from 'express';
import mongoose from 'mongoose';
import payementsRoute from './routes/payementRoute.js'; 
import reservationRoute from './routes/reservationRoute.js'
import logementRoutes from './routes/logement.js';
import bodyParser from 'body-parser';
import authRoute from './routes/AuthRoute.js';
import userRoute from './routes/UserRoute.js';

const app = express();
app.use(express.json());
app.use('/api/payments', payementsRoute); 
app.use('/api/reservations',reservationRoute);
app.use('/logements', logementRoutes);

mongoose.connect('mongodb+srv://mahmouddriss:mahmoud31@cluster0.rqsg3gu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Your code here
});

// Configure Express to parse JSON
app.use(bodyParser.json());
app.use('/user', authRoute)
app.use('/user', userRoute)

app.use(express.static('public'));  
app.use('/user/avatar', express.static('uploads/avatar'));


app.listen(3000, () => {
  console.log('Node app is running on port 3000');
});
