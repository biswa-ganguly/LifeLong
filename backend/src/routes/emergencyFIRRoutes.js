import express from 'express';
import { submitEmergencyFIR } from '../controller/emergencyFIRController.js';

const router = express.Router();

// POST /api/emergency-fir
router.post('/emergency-fir', submitEmergencyFIR);

export default router;
