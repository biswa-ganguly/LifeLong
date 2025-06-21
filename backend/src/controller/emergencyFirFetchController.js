// controllers/emergencyFIRController.js
import EmergencyFIR from "../models/EmergencyFIR.js";

export const getEmergencyFIRsByPolice = async (req, res) => {
  const { policeId } = req.params;

  try {
    // Since your model doesn't have policeId field, we'll fetch all FIRs
    // You might want to add policeId field to your model or use a different filtering approach
    const firs = await EmergencyFIR.find({}).sort({ createdAt: -1 }); // Sort by newest first

    if (!firs || firs.length === 0) {
      return res.status(404).json({ message: 'No emergency FIRs found.' });
    }

    res.status(200).json(firs);
  } catch (error) {
    console.error('Error fetching emergency FIRs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmergencyFIRApproval = async (req, res) => {
  const { id } = req.params;
  const { isApprovedByPolice } = req.body;

  try {
    const updatedFIR = await EmergencyFIR.findByIdAndUpdate(
      id,
      { isApprovedByPolice },
      { new: true }
    );

    if (!updatedFIR) {
      return res.status(404).json({ message: 'Emergency FIR not found' });
    }

    res.status(200).json(updatedFIR);
  } catch (error) {
    console.error('Error updating emergency FIR approval:', error);
    res.status(500).json({ message: 'Server error' });
  }
};