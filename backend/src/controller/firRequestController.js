import FirRequest from '../models/FirRequest.js';

// Create a new FIR request
export const createFirRequest = async (req, res) => {
  try {
    const fir = await FirRequest.create(req.body);
    res.status(201).json({ message: 'FIR request created successfully!', fir });
  } catch (error) {
    res.status(500).json({ message: 'Server Error!', error: error.toString() });
  }
};

// Get all FIR requests
export const getFirRequests = async (req, res) => {
  try {
    const firs = await FirRequest.find().sort({ createdAt: -1 });
    res.json(firs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error!', error: error.toString() });
  }
}; 