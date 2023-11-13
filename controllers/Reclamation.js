import reclamation from '../models/reclamation.js';

export function createReclamation (req, res) {
  
    const r = new reclamation(req.body);
    
    r.save().then(newRec => {
      res.status(200).json(newRec);
    })
    .catch(err => {
      res.status(500).json({error :err});
    });
    
  
}

export function getAllReclamation (req, res) {
  reclamation.find({})
  
  .then(docs => {
      res.status(200).json(docs);
  })
  .catch(err => {
      res.status(500).json({ error: err });
  });
}

export function updateReclamation (req, res) {
  const id = req.params.id; 
  reclamation.findByIdAndUpdate(id, req.body, { new: true }) 
    .then(updatedReclamation => {
      if (!updatedReclamation) {
        return res.status(404).json({ error: "Reclamation not found" });
      }
      res.status(200).json(updatedReclamation);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });

}

export function deleteReclamation (req, res) {
  reclamation
    .findByIdAndDelete(req.params.id )
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });

};