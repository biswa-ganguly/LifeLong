// controllers/donationController.js
import DonationRequest from "../models/DonationRequest.js";

export const getDonationRequestsByHospital = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const requests = await DonationRequest.find({ hospitalId });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No donation requests found for this hospital.' });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching donation requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
