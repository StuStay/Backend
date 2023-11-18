import Payment from "../models/payement.js";
import mongoose from "mongoose";
import Joi from 'joi';
import Stripe from 'stripe';

export const getPayments = async (req, res) => {
    try {
      const payments = await Payment.find({});
      res.status(200).json(payments);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const stripe = new Stripe('sk_test_51ODc5pHJY0lWcgfJxmtmQLlunNUWBY80ZHGW2zW6GgpC2JGlU07xSRu1AvxxWRURNNFf5jqaIvYPjmpT5AVFk70q0004BNnwY4')
export const postPayment = async (req, res) => {
  const paymentValidationSchema = Joi.object({
      amount: Joi.number().required(),
      date: Joi.date().required(),
      method: Joi.string().required(),
      numberOfRoommates: Joi.number().required(),
      isRecurringPayment: Joi.boolean().required(),
      recurringPaymentFrequency: Joi.string(),
  });

  try {
      const { error, value } = paymentValidationSchema.validate(req.body);

      if (error) {
          return res.status(400).json({ message: error.details[0].message });
      }

      const paymentIntent = await stripe.paymentIntents.create({
          amount: value.amount * 100, // Convert amount to cents
          currency: 'usd', // Set the currency to Tunisian Dinar
      });

      value.stripePaymentIntentId = paymentIntent.id;

      const formattedDate = new Date(value.date).toISOString();

      value.date = formattedDate;

      const payment = await Payment.create(value);

      res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          payment,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const putPayment = async (req, res) => {
    const paymentValidationSchema = Joi.object({
        amount: Joi.number(),
        date: Joi.date(),
        method: Joi.string(),
        numberOfRoommates: Joi.number(),
        isRecurringPayment: Joi.string(),
        recurringPaymentFrequency: Joi.string(), 
    });
    

  try {
    const { id } = req.params;

    const { error, value } = paymentValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid payment ID' });
    }

    if (value.date) {
      const formattedDate = new Date(value.date).toISOString();
      value.date = formattedDate;
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, value, { new: true });

    if (!updatedPayment) {
      return res.status(404).json({ message: `Cannot find any payment with ID ${id}` });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid payment ID ${id}` });
    }

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: `Cannot find any payment with ID ${id}` });
    }

    res.status(200).json(deletedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
