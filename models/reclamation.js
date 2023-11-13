import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reclamationSchema = new Schema(
    {
        IdUser: {
            type: String,
            //required: true
        },
        title: {
            type: String,
            //required: true
        },
        description: {
            type: String,
            //required: true
        },
        type: {
            type: String,
            //required: true
        },
        state :
        {
            type:String,
           // required: true
        },
       
        severity: {
            type: String,
            //required: true
        }
    },
    {
        timestamps: true
    }
);

export default model("reclamation", reclamationSchema);

