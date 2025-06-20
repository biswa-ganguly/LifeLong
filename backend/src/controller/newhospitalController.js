import NewHospitals from "../models/NewHospitals.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Hospital
export const createHospital = async (req, res) => {
  try {
    console.log('Received hospital registration:', JSON.stringify(req.body, null, 2));
    const {
      username,
      password,
      name,
      type,
      registrationNumber,
      nabhNumber,
      email,
      phone,
      emergencyContact,
      address,
      admin,
      facilities,
      departments,
      documents,
      description
    } = req.body;

    // Validate required fields
    if (!username || !password || !name || !type || !registrationNumber || !email || !phone || !address || !admin) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    // Validate nested address
    const addressFields = ["line", "city", "state", "pincode"];
    for (const field of addressFields) {
      if (!address[field]) {
        return res.status(400).json({ message: `Address field '${field}' is required!` });
      }
    }
    // Validate nested admin
    const adminFields = ["name", "email", "phone"];
    for (const field of adminFields) {
      if (!admin[field]) {
        return res.status(400).json({ message: `Admin field '${field}' is required!` });
      }
    }
    // Check for unique username, registrationNumber and email
    const existingUsername = await NewHospitals.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken!' });
    }
    const existingRegNum = await NewHospitals.findOne({ registrationNumber });
    if (existingRegNum) {
      return res.status(400).json({ message: 'Registration number already registered!' });
    }
    const existingEmail = await NewHospitals.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered!' });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Create hospital
    const hospital = await NewHospitals.create({
      username,
      password: hashed,
      name,
      type,
      registrationNumber,
      nabhNumber,
      email,
      phone,
      emergencyContact,
      address,
      admin,
      facilities,
      departments,
      documents,
      description
    });
    res.status(201).json({ message: 'Hospital registered successfully!', hospital });
  } catch (error) {
    console.error('Hospital registration error:', error);
    // If it's a Mongoose validation error, return the message
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error!', error: error.toString() });
  }
};

//Login Hospital
export const hospitalLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required!" });
    }
    const hospital = await NewHospitals.findOne({ username });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const match = await bcrypt.compare(password, hospital.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const token = jwt.sign({ id: hospital._id, role:'hospital' }, process.env.HOSPITAL_SECRET_KEY, { expiresIn:'1h' });
    res.json({ message: "Login successful!", token, hospitalId: hospital._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error!", error: error.toString() });
  }
};

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await NewHospitals.find({});
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};