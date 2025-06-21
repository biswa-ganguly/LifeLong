import express from 'express';
import { launchEmergencyFIR } from '../controller/emergencyFIRController.js';

const router = express.Router();

// POST /api/emergency-fir
router.post('/emergency-fir', launchEmergencyFIR);

export default router;
