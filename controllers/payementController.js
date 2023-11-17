import Payment from "../models/payement.js";
import mongoose from "mongoose";
import Joi from 'joi';

export const getPayments = async (req, res) => {
    try {
      const payments = await Payment.find({});
      res.status(200).json(payments);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const postPayment = async (req, res) => {
    const paymentValidationSchema = Joi.object({
      amount: Joi.number().required(),
      date: Joi.date().required(),
      method: Joi.string().required(),
      numberOfRoommates: Joi.number().required(),
      isRecurringPayment: Joi.required(),
      recurringPaymentFrequency: Joi.string(), // Add this line
    });
  
    try {
      const { error, value } = paymentValidationSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      // Format the date as a string in the 'yyyy-MM-dd' format
      const formattedDate = new Date(value.date).toISOString();
  
      // Update the value with the formatted date
      value.date = formattedDate;
  
      // Let MongoDB generate the ID
      const payment = await Payment.create(value);
  
      // Send the newly created payment back to the client
      res.status(200).json(payment);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
export const putPayment = async (req, res) => {
    const paymentValidationSchema = Joi.object({
        amount: Joi.number(),
        date: Joi.date(),
        method: Joi.string(),
        numberOfRoommates: Joi.number(),
        isRecurringPayment: Joi.string(),
        recurringPaymentFrequency: Joi.string(), // Add this line
    });
    

  try {
    const { id } = req.params;

    // Validate the request body
    const { error, value } = paymentValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid payment ID' });
    }

    // Format the date as a string in the 'yyyy-MM-dd' format
    if (value.date) {
      const formattedDate = new Date(value.date).toISOString();
      // Update the value with the formatted date
      value.date = formattedDate;
    }

    // Use findByIdAndUpdate to update only the specified fields
    const updatedPayment = await Payment.findByIdAndUpdate(id, value, { new: true });

    if (!updatedPayment) {
      // If no payment is found with the given ID, return 404
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
