import NewHospitals from "../models/NewHospitals.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Hospital
export const createHospital = async (req, res) => {
  try {
    const {
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
    if (!name || !type || !registrationNumber || !email || !phone || !address || !admin) {
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
    // Check for unique registrationNumber and email
    const existingRegNum = await NewHospitals.findOne({ registrationNumber });
    if (existingRegNum) {
      return res.status(400).json({ message: 'Registration number already registered!' });
    }
    const existingEmail = await NewHospitals.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered!' });
    }
    // Create hospital
    const hospital = await NewHospitals.create({
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
    res.status(500).json({ message: 'Server Error!', error: error.toString() });
  }
};

//Login Hospital
export const hospitalLogin = async (req, res) => {
  try {
    const { registrationNumber } = req.body;
    // For demo, login by registrationNumber (or you can use email/other field)
    if (!registrationNumber) {
      return res.status(400).json({ message: "Registration number is required!" });
    }
    const hospital = await NewHospitals.findOne({ registrationNumber });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    // You can add password check if you add password field
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