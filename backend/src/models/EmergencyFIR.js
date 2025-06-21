import mongoose from 'mongoose';

const EmergencyFIRSchema = new mongoose.Schema({
  incidentType: { type: String, required: true },

  deceasedDetails: {
    name: { type: String, default: 'Unknown' },
    gender: String,
    approximateAge: Number
  },

  incidentLocation: {
    address: String,
    latitude: String,
    longitude: String
  },

  initialObservations: String,

  photoUrl: { type: String },

  reporter: {
    isAnonymous: { type: Boolean, default: true },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    userId: { type: String, required: true }
  },

  isApprovedByPolice: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('EmergencyFIR', EmergencyFIRSchema);
