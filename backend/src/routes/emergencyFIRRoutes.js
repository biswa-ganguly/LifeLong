import express from 'express';
import { submitEmergencyFIR } from '../controller/emergencyFIRController.js';
import { getEmergencyFIRsByUser } from '../controller/emergencyFirFetchController.js';

const router = express.Router();

// POST /api/emergency-fir
router.post('/emergency-fir', submitEmergencyFIR);
router.get('/emergency/mine/:userId',getEmergencyFIRsByUser);

export default router;
