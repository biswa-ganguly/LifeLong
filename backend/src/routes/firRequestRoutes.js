import express from 'express';
import { createFirRequest, getFirRequests } from '../controller/firRequestController.js';

const router = express.Router();

// Create FIR
router.post('/', createFirRequest);
// Get all FIRs
router.get('/', getFirRequests);

export default router; 