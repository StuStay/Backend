
import mongoose from 'mongoose';

// Remove the 'id' field from the paymentSchema
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
  isRecurringPayment: {
    type: Boolean,
    required: true,
  },
  recurringPaymentFrequency: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;

