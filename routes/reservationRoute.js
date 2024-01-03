import express from 'express'
import { getReservations,postReservation,putReservation,deleteReservation } from '../controllers/reservationController.js'
const router = express.Router();

router.get('/',getReservations)
router.post('/',postReservation)
router.put('/:id',putReservation)
router.delete('/:id',deleteReservation)
 export default router; 