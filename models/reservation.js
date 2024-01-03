import mongoose from 'mongoose'
const reservationSchema=mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  selectedgender: {
    type: String,
    enum: ['homme', 'femme'],
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  phone: String, //phone
  numberOfRoommates: {
    type: String,
    required: true,
  },
 
  minPrice: {
    type: String,
    required: true,
  },
  maxPrice: {
    type: String,
    required: true,
  },
},
      {
        timestamps:true
      }

      
  )
  const Reservation = mongoose.model('Reservation',reservationSchema);
  export default Reservation;
