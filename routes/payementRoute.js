import express from 'express'
import { getPayements, postPayement, putPayement, deletePayement } from '../controllers/payementController.js'
const router = express.Router();

router.get('/',getPayements);
router.post('/',postPayement);
router.put('/:id',putPayement);
router.delete('/:id',deletePayement);
export default router;