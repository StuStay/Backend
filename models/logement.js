
import mongoose from 'mongoose';

const logementSchema = new mongoose.Schema({
  images: [String], 
  titre: String,
  description: String,
  nom: String,
  nombreChambre: Number,
  prix: Number,
  contact: String,
  lieu: String, 
});

export default mongoose.model('Logement', logementSchema);
