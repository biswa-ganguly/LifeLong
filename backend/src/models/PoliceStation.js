import mongoose from "mongoose";

const policeStationSchema = new mongoose.Schema({ 
  stationName: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  zone: { 
    type: String, 
    required: true,
    enum: ['North', 'South', 'West', 'East', 'Central']
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  address: {
    line: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  admin: {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  jurisdiction: { 
    type: String, 
    required: true,
    enum: [
      // North Kolkata Zone
      'Amherst Street', 'Bowbazar', 'Burrabazar', 'Chitpur', 'Cossipore',
      'Girish Park', 'Jorabagan', 'Jorasanko', 'Manicktala', 'Narkeldanga',
      'Shyampukur', 'Sinthee', 'Tala', 'Taltala', 'Ultadanga',
      'Posta', 'Muchipara', 'Phoolbagan',
      
      // South Kolkata Zone
      'Alipore', 'Ballygunge', 'Bhowanipore', 'Chetla', 'Gariahat',
      'Kalighat', 'Lake', 'New Alipore', 'Park Street', 'Shakespeare Sarani',
      'Tollygunge', 'Jadavpur', 'Charu Market', 'Parnasree', 'Rabindra Sarobar',
      
      // West Kolkata Zone
      'Garden Reach', 'Ekbalpur', 'Watgunge', 'West Port', 'South Port',
      'Metiabruz', 'Taratala', 'Hastings', 'Maidan', 'Topsia',
      'Entally', 'Tangra',
      
      // East Kolkata Zone
      'Beleghata',
      
      // Central Kolkata Zone
      'Lalbazar'
    ]
  },
  documents: {
    registrationCertUrl: { type: String, required: true },
    officerIdUrl: { type: String, required: true }
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('PoliceStation', policeStationSchema);
