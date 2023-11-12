import Joi from "joi";
import Reservation from "../models/reservation.js"
import mongoose from "mongoose";
export const getReservations=async(req,res)=>{
    try{
    const reservations=await Reservation.find({});
    res.status(500).json(reservations)
    } catch(error){
        res.status(500).json({message:error.message})
    }
    }
    const reservationValidationSchema = Joi.object({
        name : Joi.string().required(),
        location:Joi.string().required(),
        gender:Joi.string().required(),
        check_in_date: Joi.date().required(),
        check_out_date: Joi.date().required(),
        number_of_roomates: Joi.number().required(),
        contact_phone:Joi.string().required().length(8),
        total_price: Joi.number().required(),
    });

    export const postReservation = async (req, res) => {
        try {
          // Validate the request data against the Joi schema
          const { error, value } = reservationValidationSchema.validate(req.body);
      
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
      
          const reservation= await Reservation.create(value);
          res.status(200).json(reservation);
        } catch (error) {
          console.log(error.message);
          res.status(500).json({ message: error.message });
        }
      }

    export const putReservation=async(req,res)=>{
        try{
            const {id}=req.params;
            const reservation= await Reservation.findByIdAndUpdate(id,req.body);
            if(!reservation){
                return res.status(404).json ({message:'cannot find any reservation with ID ${id}'})
            }
            const updatedReservation=await Reservation.findById(id);
            res.status(200).json(updatedReservation);
        }catch(error){
            res.status(500).json({message:error.message})
        }
        }
        export const deleteReservation=async(req,res)=>{
            try{
                const {id}=req.params;
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'Invalid reservation ID' });
                }
                const reservation= await Reservation.findByIdAndDelete(id,req.body);
                if(!reservation){
                    return res.status(404).json ({message:'cannot find any reservation with ID ${id}'})
                }
                res.status(200).json(reservation);
            }catch(error){
                res.status(500).json({message:error.message})
            }
        
            }