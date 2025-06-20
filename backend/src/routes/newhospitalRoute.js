import express from "express";
import { createHospital, hospitalLogin, getAllHospitals } from "../controller/newhospitalController.js";

const router = express.Router();

router.post('/register', createHospital);
router.post('/login', hospitalLogin);
router.get('/all', getAllHospitals);


export default router;
