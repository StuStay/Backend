import express from 'express';
import mongoose from 'mongoose';
import payementsRoute from './routes/payementRoute.js'; 

const app = express();
app.use(express.json());
app.use('/api/payments', payementsRoute); 
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
