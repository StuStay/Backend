import express from 'express';
import { body } from 'express-validator';
import { createZoneDeDanger, getZoneDeDangers, updateZoneDeDanger, deleteZoneDeDanger ,getZoneDeDangerById} from '../controllers/zoneDeDangerController.js';

const router = express.Router();

router
    .route('/')
    .get(getZoneDeDangers)
    .post(
        body('iduser').isMongoId(),
        body('idCatastrophe').isMongoId(),
        body('etat').isBoolean(),
        createZoneDeDanger);

router.route('/:id')
    .put(updateZoneDeDanger)
    .delete(deleteZoneDeDanger)
    .get(getZoneDeDangerById);

export default router;