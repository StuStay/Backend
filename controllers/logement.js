
import Logement from '../models/logement.js';

export const getAllLogements = async (req, res) => {
  try {
    const logements = await Logement.find();
    return res.status(200).json(logements);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des logements' });
  }
};

export const createLogement = async (req, res) => {
  try {
    const logement = await Logement.create(req.body);
    return res.status(201).json(logement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la création du logement' });
  }
};

export const getLogementDetails = async (req, res) => {
  try {
    const logement = await Logement.findById(req.params.id);
    if (!logement) {
      return res.status(404).json({ message: 'Logement non trouvé' });
    }
    return res.status(200).json(logement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des détails du logement' });
  }
};

export const updateLogement = async (req, res) => {
  try {
    const logement = await Logement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!logement) {
      return res.status(404).json({ message: 'Logement non trouvé' });
    }
    return res.status(200).json(logement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du logement' });
  }
};

export const deleteLogement = async (req, res) => {
  try {
    const logement = await Logement.findByIdAndDelete(req.params.id);
    if (!logement) {
      return res.status(404).json({ message: 'Logement non trouvé' });
    }
    return res.status(200).json({ message: 'Logement supprimé avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du logement' });
  }
};
