import DonationRequest from '../models/DonationRequest.js';

// ✅ Create new donation request (userId comes from body)
export const createDonations = async (req, res) => {
  try {
    const {
      userId,
      type,
      bloodGroup,
      hasDisease,
      diseaseDetails,
        hospitalId,
  hospitalName,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. No user ID provided.' });
    }

    if (!type) {
      return res.status(400).json({ error: 'type is required.' });
    }

    if (type === 'blood') {
      const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

      if (!validBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({ error: 'Invalid or missing blood group.' });
      }

      if (typeof hasDisease !== 'boolean') {
        return res.status(400).json({ error: 'hasDisease must be a boolean value.' });
      }

      if (hasDisease && !diseaseDetails) {
        return res.status(400).json({ error: 'Please provide disease details.' });
      }
    }

    if (!hospitalId || !hospitalName) {
  return res.status(400).json({ error: 'Hospital ID and name are required.' });
}

    const donation = await DonationRequest.create(req.body);

    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Admin fetch: Get all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await DonationRequest.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get donations for a specific user (read from query param)
export const getUserDonations = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const donations = await DonationRequest.find({ userId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Admin: Update donation request status (accept/reject)
export const updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;

  try {
    const donation = await DonationRequest.findByIdAndUpdate(
      id,
      { status, adminRemarks },
      { new: true }
    );
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ User confirms the hospital's response
export const confirmDonationResponse = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await DonationRequest.findByIdAndUpdate(
      id,
      { confirmedByUser: true },
      { new: true }
    );
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
