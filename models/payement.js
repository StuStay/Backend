import mongoose from 'mongoose'
const paymentSchema =mongoose.Schema({
  
  Payment_Amount: {
    type: Number,
    required: true,
  },
  Payement_date: {
    type: Date,
    required: true,
  },
  Payment_method: {
    type: String,
    required: true,
  },
  Number_roomates: {
    type: Number,
    required: true,
  },

  Recurring_payment: {
    type: String,
    required: true,
  },
},
  {
    timestamps:true
  }

)

      
  
  const Payement = mongoose.model('Payement',paymentSchema );
  export default Payement;