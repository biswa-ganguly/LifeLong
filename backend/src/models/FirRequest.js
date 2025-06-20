import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const firRequestSchema = new mongoose.Schema({
  firId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  policeStationId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  incidentType: { type: String, required: true },
  incidentDate: { type: String, required: true },
  incidentTime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  suspectDetails: { type: String },
  witnesses: { type: String },
  evidence: [evidenceSchema],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress'],
    default: 'pending'
  },
  policeRemarks: { type: String }
}, { timestamps: true });

const FirRequest = mongoose.model('FirRequest', firRequestSchema);

export default FirRequest; 