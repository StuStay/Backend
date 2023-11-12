import Payement from "../models/payement.js"
import mongoose from "mongoose";
import Joi from 'joi'; 
export const getPayements =async(req,res)=>{
    try{
    const payements =await Payement.find({});
    res.status(200).json(payements)
    } catch(error){
        res.status(500).json({message:error.message})
    }
    }
    
   
    
    
    const paymentValidationSchema = Joi.object({
      Payment_Amount: Joi.number().required(),
      Payement_date: Joi.date().required(),
      Payment_method: Joi.string().required(),
      Number_roomates: Joi.number().required(),
      Recurring_payment: Joi.string().required(),
    });
    
    export const postPayement = async (req, res) => {
      try {
        
        const { error, value } = paymentValidationSchema.validate(req.body);
    
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
    
        const payement = await Payement.create(value);
        res.status(200).json(payement);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
      }
    }
    

    export const putPayement=async(req,res)=>{
        try{
            const {id}=req.params;
            const payement= await Payement.findByIdAndUpdate(id,req.body);
            if(!payement){
                return res.status(404).json ({message:'cannot find any payement with ID ${id}'})
            }
            const updatedPayement=await Payement.findById(id);
            res.status(200).json(updatedPayement);
        }catch(error){
            res.status(500).json({message:error.message})
        }
        }
        export const deletePayement=async(req,res)=>{
            try{
                const {id}=req.params;
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'Invalid payement ID' });
                }
                const payement= await Payement.findByIdAndDelete(id,req.body);
                if(!payement){
                    return res.status(404).json ({message:'cannot find any payement with ID ${id}'})
                }
                res.status(200).json(payement);
            }catch(error){
                res.status(500).json({message:error.message})
            }
        
            }