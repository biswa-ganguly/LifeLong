import PoliceStation from "../models/PoliceStation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register
export const createPoliceStation = async (req, res) => {
  try {
    const {
      stationName,
      registrationNumber,
      zone,
      email,
      phone,
      emergencyContact,
      address,
      admin,
      jurisdiction,
      documents,
      username,
      password
    } = req.body;

    // Validate required fields
    if (!stationName || !registrationNumber || !zone || !email || !phone || !emergencyContact || !address || !admin || !jurisdiction || !documents || !username || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    // Validate nested address
    const addressFields = ["line", "city", "district", "state", "pincode"];
    for (const field of addressFields) {
      if (!address[field]) {
        return res.status(400).json({ message: `Address field '${field}' is required!` });
      }
    }
    // Validate nested admin
    const adminFields = ["name", "designation", "phone", "email"];
    for (const field of adminFields) {
      if (!admin[field]) {
        return res.status(400).json({ message: `Admin field '${field}' is required!` });
      }
    }
    // Validate nested documents
    const docFields = ["registrationCertUrl", "officerIdUrl"];
    for (const field of docFields) {
      if (!documents[field]) {
        return res.status(400).json({ message: `Document field '${field}' is required!` });
      }
    }

    const existingUsername = await PoliceStation.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken!' });
    }

    const existingEmail = await PoliceStation.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const existingRegNum = await PoliceStation.findOne({ registrationNumber });
    if (existingRegNum) {
      return res.status(400).json({ message: 'Registration number already registered!' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const policeStation = await PoliceStation.create({
      stationName,
      registrationNumber,
      zone,
      email,
      phone,
      emergencyContact,
      address,
      admin,
      jurisdiction,
      documents,
      username,
      password: hashed
    });

    res.status(201).json({ message: 'Police registered successfully!', policeStation });
  } catch (error) {
    res.status(500).json({ message: 'Server Error!', error: error.toString() });
  }
};

export const policeLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required!" });
    }
  
    const police = await PoliceStation.findOne({ username });
    if (!police) {
      return res.status(400).json({ message: "No Police Station Found!" });
    }
  
    const match = await bcrypt.compare(password, police.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
  
    const token = jwt.sign({ id: police._id, role:'police' }, process.env.POLICE_SECRET_KEY, { expiresIn:'1h' });

    res.json({ message: "Login successful!", token , policeinfo:police });
  } catch (error) {
    res.status(500).json({ message: "Server Error!", error: error.toString() });
  } 
};

