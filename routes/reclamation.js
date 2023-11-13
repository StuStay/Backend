import express from 'express';
import {createReclamation,getAllReclamation,updateReclamation,deleteReclamation} from '../controllers/Reclamation.js';

const router = express.Router();

router.post('/', createReclamation);

router.get('/', getAllReclamation);

router.put('/:id', updateReclamation);

router.delete('/:id', deleteReclamation);

export default router;