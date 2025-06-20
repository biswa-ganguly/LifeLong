import express from 'express';
import fetchHospitals from '../controller/fetchController.js';

const router = express.Router();

router.get('/fetch-hospitals', fetchHospitals);

export default router;