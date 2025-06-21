import Emergency from "../models/Emergency.js";
import Volunteer from "../models/Volunteer.js";
import { sendPushNotification } from "../utils/sendNotification.js";

export const triggerPanicTap = async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    // 1. Create emergency record
    const emergency = await Emergency.create({
      userId,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    // 2. Find volunteers within 1 km (1000 meters)
    const volunteers = await Volunteer.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 1000, // 1 km in meters
        },
      },
      isActive: true,
    });

    // 3. Send push notifications
    const messages = volunteers.map((volunteer) => ({
      token: volunteer.deviceToken,
      notification: {
        title: "Emergency Alert!",
        body: `A person needs help nearby (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      },
      data: {
        emergencyId: emergency._id.toString(),
        userId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    }));

    await sendPushNotification(messages);

    res.status(200).json({
      success: true,
      message: "Emergency alert sent to nearby volunteers!",
      volunteersNotified: volunteers.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};