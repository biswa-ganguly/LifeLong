import express from "express";
import {
  registerVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  updateVolunteerLocation,
} from "../controller/volunteerController.js";

const router = express.Router();

// POST /api/volunteers - Register a volunteer
router.post("/", registerVolunteer);

// GET /api/volunteers - List all active volunteers
router.get("/", getVolunteers);

// PATCH /api/volunteers/:volunteerId/status - Update a volunteer's status (online/offline)
router.patch("/:volunteerId/status", updateVolunteerStatus);

// PATCH /api/volunteers/:volunteerId/location - Update a volunteer's live location
router.patch("/:volunteerId/location", updateVolunteerLocation);

export default router;