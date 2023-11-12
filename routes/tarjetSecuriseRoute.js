import express from 'express';
import { body } from 'express-validator';
import { createTarjetSecurise, getTarjetSecurises, updateTrajetSecurise, deleteTrajetSecurise ,getCatastropheRadius} from '../controllers/tarjetSecuriseControllers.js';

const router = express.Router();

router
    .route('/')
    .get(getTarjetSecurises)
    .post(
        body('iduser').isMongoId(),
        body('idCatastrophe').isMongoId(),
        body('etat').isBoolean(),
        createTarjetSecurise);

router.route('/:id')
    .put(updateTrajetSecurise)
    .delete(deleteTrajetSecurise);

router.route('/radius/:id')
    .get(getCatastropheRadius);

export default router;