import express from "express";
import {
  registerVolunteer,
  getVolunteers,
} from "../controller/volunteerController.js";

const router = express.Router();

// POST /api/volunteers - Register a volunteer
router.post("/", registerVolunteer);

// GET /api/volunteers - List all volunteers
router.get("/", getVolunteers);

export default router;