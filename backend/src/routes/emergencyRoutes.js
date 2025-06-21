import express from "express";
import { triggerPanicTap } from "../controller/emergencyController.js";

const router = express.Router();

router.post("/panic-tap", triggerPanicTap);

export default router;