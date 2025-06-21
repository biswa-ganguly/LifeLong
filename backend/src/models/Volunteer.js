import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  deviceToken: { type: String, required: true }, // For FCM push notifications
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  isActive: { type: Boolean, default: true },
});

VolunteerSchema.index({ location: "2dsphere" });

export default mongoose.model("Volunteer", VolunteerSchema);