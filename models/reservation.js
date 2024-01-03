import mongoose from 'mongoose';



const reservationSchema = mongoose.Schema(
  {
    location: {
      type: String,
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
    bedrooms: {
      type: Number, 
      required: true,
    },
    features: [{
      type: String,
      enum: ['PARKING', 'DISHWASHER', 'ELEVATOR'],
    }],
    
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;