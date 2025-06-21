import mongoose from 'mongoose';

const EmergencyFIRSchema = new mongoose.Schema({
  // Incident Information
  incidentType: { 
    type: String, 
    required: true,
    // enum: ['Accident', 'Assault', 'Missing Person', 'Theft','Hit and Run' ,'Other'],
    default: 'Accident'
  },

  // Deceased/Victim Details
  deceasedDetails: {
    name: { 
      type: String, 
      default: 'Unknown',
      trim: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Unknown'],
      default: 'Unknown'
    },
    approximateAge: {
      type: Number,
      min: 0,
      max: 120,
      default: null
    },
    identificationMarkers: {
      type: [String],
      default: []
    }
  },

  // Location Details
  incidentLocation: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number,
      required: function() {
        return this.incidentLocation.longitude !== undefined;
      }
    },
    longitude: {
      type: Number,
      required: function() {
        return this.incidentLocation.latitude !== undefined;
      }
    },
    mapUrl: {
      type: String,
      default: function() {
        if (this.incidentLocation.latitude && this.incidentLocation.longitude) {
          return `https://maps.google.com/?q=${this.incidentLocation.latitude},${this.incidentLocation.longitude}`;
        }
        return null;
      }
    },
    landmark: {
      type: String,
      trim: true
    }
  },

  // Incident Description
  initialObservations: {
    type: String,
    required: true,
    trim: true,
    minlength: 20
  },

  // Media Evidence
  photoUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  additionalMedia: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    description: String
  }],

  // Reporter Information
  reporter: {
    isAnonymous: { 
      type: Boolean, 
      default: true 
    },
    name: { 
      type: String, 
      default: '',
      trim: true
    },
    phone: { 
      type: String,
      validate: {
        validator: function(v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    relation: { 
      type: String, 
      default: 'Witness',
      enum: ['Witness', 'Relative', 'Friend', 'Officer', 'Other']
    },
    userId: { 
      type: String, 
      required: true 
    },
    ipAddress: String,
    deviceInfo: {
      type: Map,
      of: String
    }
  },

  // Police Station Information
  policeStation: {
    id: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    jurisdiction: String,
    contactNumber: String
  },

  // Status Tracking - Updated to only allow Pending or Approved
  status: {
    type: String,
    enum: ['Pending', 'Approved'],
    default: 'Pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['Pending', 'Approved']
    },
    changedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],

  // Administrative Fields
  assignedOfficer: {
    name: String,
    badgeNumber: String,
    contact: String
  },
  caseNumber: String,
  isApprovedByPolice: { 
    type: Boolean, 
    default: false 
  },
  approvalDate: Date,
  rejectionReason: String,

  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update virtual property for active status
EmergencyFIRSchema.virtual('isActive').get(function() {
  return this.status === 'Pending'; // Only pending FIRs are considered active
});

// Pre-save hook to update status history
EmergencyFIRSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory = this.statusHistory || [];
    this.statusHistory.push({
      status: this.status,
      changedBy: this.reporter.userId,
      notes: this.status === 'Approved' ? 'FIR approved by officer' : 'FIR submitted'
    });
  }
  next();
});

// Text index for searchable fields
EmergencyFIRSchema.index({
  'deceasedDetails.name': 'text',
  'incidentLocation.address': 'text',
  'initialObservations': 'text',
  'policeStation.name': 'text'
});

export default mongoose.model('EmergencyFIR', EmergencyFIRSchema);