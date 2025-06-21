import Volunteer from "../models/Volunteer.js";

// Register a new volunteer
export const registerVolunteer = async (req, res) => {
  try {
    const { userId, name, deviceToken, longitude, latitude } = req.body;

    const volunteer = await Volunteer.create({
      userId,
      name,
      deviceToken,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format
      },
    });

    res.status(201).json({ success: true, volunteer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all active volunteers
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ isActive: true });
    res.status(200).json({ success: true, volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};