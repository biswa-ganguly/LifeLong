import mongoose from 'mongoose';

const donationRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['blood', 'organ'],
    required: true
  },

  userId: {
    type: String,
    required: true // Clerk user.id
  },

  // Hospital details
  hospitalId: {
    type: String,
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },

  // Common details
  details: {
    type: String
  },

  // Blood donation specific fields
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function () {
      return this.type === 'blood';
    }
  },
  hasDisease: {
    type: Boolean,
    required: function () {
      return this.type === 'blood';
    }
  },
  diseaseDetails: {
    type: String,
    required: function () {
      return this.type === 'blood' && this.hasDisease === true;
    }
  },

  // Organ donation specific fields
  organType: {
    type: String,
    enum: ['kidney', 'liver', 'heart', 'lungs', 'pancreas', 'intestine', 'other'],
    required: function () {
      return this.type === 'organ';
    }
  },
  isLivingDonor: {
    type: Boolean,
    required: function () {
      return this.type === 'organ';
    }
  },
  relationToRecipient: {
    type: String,
    required: function () {
      return this.type === 'organ' && this.isLivingDonor === true;
    }
  },

  // Admin section
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  adminRemarks: {
    type: String
  },
  confirmedByUser: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const DonationRequest = mongoose.model('DonationRequest', donationRequestSchema);

export default DonationRequest;
