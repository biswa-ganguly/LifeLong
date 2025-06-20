import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({ 
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  nabhNumber: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  emergencyContact: { type: String },
  address: {
    line: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  admin: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  facilities: [{ type: String }],
  departments: [{ type: String }],
  documents: {
    registrationCertUrl: { type: String },
    nabhCertUrl: { type: String }
  },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('NewHospitals', hospitalSchema);
