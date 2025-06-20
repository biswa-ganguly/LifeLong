import NewHospitals from "../models/NewHospitals.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Hospital
export const createHospital = async (req, res) => {
  try {
    const { name, address, phone, email, username, password } = req.body;

    if (!name || !address || !phone || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
  
    const existingUsername = await NewHospitals.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken!' });
    }
  
    const existingEmail = await NewHospitals.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered!' });
    }
  
    const hashed = await bcrypt.hash(password, 10);
    const hospital = await NewHospitals.create({ 
      name, 
      address, 
      phone, 
      email, 
      username, 
      password: hashed 
    });

    res.status(201).json({ message: 'Hospital registered successfully!', hospital });
  } catch (error) {
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

    res.json({ message: "Login successful!", token });
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