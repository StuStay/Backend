
  import Logement from '../models/logement.js';


  const createLogement = async (req, res) => {
    try {
      const logement = new Logement(req.body);
      const savedLogement = await logement.save();
      res.status(201).json(savedLogement);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du logement' });
    }
  };

  const getAllLogements = async (req, res) => {
    try {
      const logements = await Logement.find();
      res.json(logements);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la liste des logements' });
    }
  };

  const getLogementById = async (req, res) => {
    try {
      const logement = await Logement.findById(req.params.id);
      if (!logement) {
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      res.json(logement);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du logement' });
    }
  };

  const updateLogement = async (req, res) => {
    try {
      const updatedLogement = await Logement.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedLogement) {
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      res.json(updatedLogement);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du logement' });
    }
  };

  const deleteLogement = async (req, res) => {
    try {
      const deletedLogement = await Logement.findByIdAndRemove(req.params.id);
      if (!deletedLogement) {
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      res.json({ message: 'Logement supprimé' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du logement' });
    }
  };


  const logementController = {
    createLogement,
    getAllLogements,
    getLogementById,
    updateLogement,
    deleteLogement,
  };

  export default logementController;