import express from 'express'
import mongoose from 'mongoose'
import reservationRoute from './routes/reservationRoute.js'
const app = express()
app.use(express.json())
app.use('/api/reservations',reservationRoute)

mongoose.connect('mongodb+srv://ahmedmaadi19:Ahmedmaadimido19@ahmed.uiec5dx.mongodb.net/ahmed?retryWrites=true&w=majority&appName=AtlasApp')
.then(()=>{
    console.log('connected to MongoDB')
}).catch((error)=>{
console.log(error)
})
app.listen(3000,()=>{
    console.log('node app is running on port 3000')
    })