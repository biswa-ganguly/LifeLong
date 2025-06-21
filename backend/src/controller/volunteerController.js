import Volunteer from "../models/Volunteer.js";

// Register a new volunteer
export const registerVolunteer = async (req, res) => {
  try {
    const { userId, name, phone, deviceToken, location } = req.body;

    if (!name || !phone || !location || !userId || !deviceToken) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existingVolunteer = await Volunteer.findOne({ $or: [{ userId }, { phone }] });

    if (existingVolunteer) {
      if (existingVolunteer.userId === userId) {
        return res.status(409).json({ message: 'This user is already registered as a volunteer.' });
      }
      if (existingVolunteer.phone === phone) {
        return res.status(409).json({ message: 'This phone number is already in use.' });
      }
    }

    const volunteer = await Volunteer.create({
      userId,
      name,
      phone,
      deviceToken,
      location,
    });

    res.status(201).json({ success: true, volunteer });
  } catch (error) {
     if (error.code === 11000) {
      return res.status(409).json({ message: 'A user with this ID or phone number already exists.' });
    }
    console.error('Volunteer Registration Error:', error);
    res.status(500).json({ success: false, error: 'An unexpected error occurred during registration.' });
  }
};

// Update a volunteer's active status (e.g., "Go Online" / "Go Offline")
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { isActive } = req.body; // Expecting { isActive: true } or { isActive: false }

    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { isActive },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    res.status(200).json({ success: true, volunteer });
  } catch (error) {
    console.error('Update Volunteer Status Error:', error);
    res.status(500).json({ success: false, error: 'An unexpected error occurred.' });
  }
};

// Update a volunteer's live location
export const updateVolunteerLocation = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { location } = req.body; // Expecting { location: { type: 'Point', coordinates: [lng, lat] } }

    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'Invalid location data.' });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { location },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    res.status(200).json({ success: true, message: 'Location updated.' });
  } catch (error) {
    console.error('Update Volunteer Location Error:', error);
    res.status(500).json({ success: false, error: 'An unexpected error occurred.' });
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