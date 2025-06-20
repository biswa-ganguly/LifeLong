import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Define the Hospital Schema
const hospitalSchema = new mongoose.Schema({
  name: String,
  beds: Number,
  oxygen: Boolean,
  lat: Number,
  lng: Number,
  address: String
});

// Create the Hospital model
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Connect to MongoDB and fetch hospitals
const fetchHospitals = async (req,res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // Fetch all hospitals
    const hospitals = await Hospital.find({});
    res.status(200).json(hospitals);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Execute the function
export default fetchHospitals;
