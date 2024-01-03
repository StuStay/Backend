import Reservation from "../models/reservation.js"
import mongoose from "mongoose";
export const getReservations=async(req,res)=>{
    try{
    const reservations=await Reservation.find({});
    res.status(200).json(reservations)
    } catch(error){
        console.log("error",error)
        res.status(500).json({message:error.message})
    }
    }
export const postReservation = async (req, res) => {
    try {
      const reservation = await Reservation.create(req.body);
      res.status(200).json(reservation);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: validationErrors.join(', ') });
      }
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  };
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