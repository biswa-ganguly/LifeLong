import express from 'express';
import { submitEmergencyFIR,updateFIRStatus } from '../controller/emergencyFIRController.js';
import { getEmergencyFIRsByUser,getEmergencyFIRsByPolice } from '../controller/emergencyFirFetchController.js';

const router = express.Router();

// POST /api/emergency-fir
router.post('/emergency-fir', submitEmergencyFIR);
router.get('/emergency/mine/:userId',getEmergencyFIRsByUser);
router.get('/emergency-firs/:policeId',getEmergencyFIRsByPolice);
router.post('/emergency-firs/status/:firId',updateFIRStatus)

export default router;
