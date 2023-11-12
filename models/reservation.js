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
  gender: {
    type: String,
    enum: ['homme', 'femme'],
    required: true,
  },
  check_in_date: {
    type: Date,
    required: true,
  },
  check_out_date: {
    type: Date,
    required: true,
  },
  contact_phone: String, //phone
  number_of_roomates: {
    type: String,
    required: true,
  },
 
  total_price: {
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