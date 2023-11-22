import express from 'express';
import { getPayments, postPayment, putPayment, deletePayment } from '../controllers/payementController.js';

const router = express.Router();

router.get('/', getPayments);
router.post('/', postPayment);
router.put('/:id', putPayment);
router.delete('/:id', deletePayment); 

export default router;
