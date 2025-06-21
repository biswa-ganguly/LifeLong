import mongoose from "mongoose";

const EmergencySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }, // pending, responded, resolved
});

EmergencySchema.index({ location: "2dsphere" });

export default mongoose.model("Emergency", EmergencySchema);