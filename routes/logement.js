import logementController from '../controllers/logement.js';

import express from 'express';

const router = express.Router();


router.post('/logements', logementController.createLogement);
router.get('/logements', logementController.getAllLogements);
router.get('/logements/:id', logementController.getLogementById);
router.put('/logements/:id', logementController.updateLogement);
router.delete('/logements/:id', logementController.deleteLogement);


export default router;
