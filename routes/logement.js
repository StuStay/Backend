// routes/logement.js

import express from 'express';
import { createLogement, getAllLogements, getLogementDetails, updateLogement, deleteLogement } from '../controllers/logement.js';

const router = express.Router();

router.post('/logements', createLogement);
router.get('/logements', getAllLogements);
router.get('/logements/:id', getLogementDetails);
router.put('/logements/:id', updateLogement); 
router.delete('/logements/:id', deleteLogement); 

export default router;
