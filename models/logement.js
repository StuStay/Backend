import mongoose from 'mongoose';

const logementSchema = new mongoose.Schema({
  images: String,
  titre: String,
  description: String,
  nom: String,
  nombreChambre: Number,
  prix: Number,
  contact: String,
  lieu: String
});


const Logement = mongoose.model('Logement', logementSchema);

export default Logement;
