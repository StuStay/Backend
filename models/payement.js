import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    get: function () {
      return moment(this.date).format('YYYY-MM-DD');
    },
  },
  method: {
    type: String,
    required: true,
  },
  numberOfRoommates: {
    type: Number,
    required: true,
  },

  paymentType: {
    type: [String], // Change the type to an array of strings
    enum: ['water', 'light', 'rent', 'wifi'],
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;