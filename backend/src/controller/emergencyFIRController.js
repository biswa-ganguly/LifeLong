import EmergencyFIR from '../models/EmergencyFIR.js';

export const submitEmergencyFIR = async (req, res) => {
  try {
    // Destructure the request body to match frontend structure
    const {
      incidentType,
      name,
      gender,
      approximateAge,
      address,
      latitude,
      longitude,
      initialObservations,
      photoUrl,
      isAnonymous,
      reporterName,
      reporterRelation,
      policeStationId,
      policeStationName,
      ipAddress,
      userId
    } = req.body;

    // Get user ID from authentication middleware
    const userID = userId || 'anonymous';

    // Validate required fields
    const requiredFields = {
      incidentType,
      address,
      initialObservations,
      policeStationId,
      policeStationName
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `${field.replace(/([A-Z])/g, ' $1').trim()} is required`,
          field
        });
      }
    }

    // Prepare deceased details (all optional)
    const deceasedDetails = {
      name: name || 'Unknown',
      gender: gender || 'Unknown',
      approximateAge: parseInt(approximateAge) || null
    };

    // Prepare incident location
    const incidentLocation = {
      address,
      coordinates: {
        latitude: parseFloat(latitude) || null,
        longitude: parseFloat(longitude) || null
      },
      mapUrl: latitude && longitude 
        ? `https://maps.google.com/?q=${latitude},${longitude}`
        : null
    };

    // Prepare reporter information
    const reporter = {
      isAnonymous: isAnonymous || false,
      name: isAnonymous ? 'Anonymous' : (reporterName || 'Unknown'),
      relation: isAnonymous ? 'Witness' : (reporterRelation || 'Witness'),
      userId:userID,
      ipAddress:ipAddress
    };

    // Create the FIR record with initial "Pending" status
    const fir = await EmergencyFIR.create({
      incidentType,
      deceasedDetails,
      incidentLocation,
      initialObservations,
      photoUrl: photoUrl || null,
      reporter,
      policeStation: {
        id: policeStationId,
        name: policeStationName
      },
      status: 'Pending', // Changed to "Pending" as initial status
      ipAddress: req.clientIp // From middleware
    });

    // Log submission
    console.log(`FIR submitted with status Pending: ${fir._id}`);
    if (!isAnonymous) {
      console.log(`Notification would be sent to: ${reporterName}`);
    }

    // Successful response
    res.status(201).json({
      success: true,
      message: 'Emergency FIR submitted successfully',
      firId: fir._id,
      currentStatus: 'Pending', // Include status in response
      submissionDate: fir.createdAt,
      nextSteps: [
        'Your FIR has been forwarded to the selected police station',
        'Status will be updated to Approved after review',
        'You will receive updates via SMS/email',
        'Keep your FIR ID for future reference'
      ]
    });

  } catch (error) {
    console.error('FIR submission error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Failed to submit FIR',
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Please try again later'
    });
  }
};

// Additional endpoint to update status to Approved
export const updateFIRStatus = async (req, res) => {
  const { firId } = req.params;
  const { action, note } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be "approve" or "reject".'
    });
  }

  const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
  const approvalFlag = action === 'approve';

  try {
    const fir = await EmergencyFIR.findById(firId);
    if (!fir) {
      return res.status(404).json({
        success: false,
        message: 'FIR not found'
      });
    }

    fir.status = newStatus;
    fir.isApprovedByPolice = approvalFlag;

    fir.statusHistory.push({
      status: newStatus,
      changedBy: 'police',
      notes: note || `${newStatus} by police`,
      timestamp: new Date()
    });

    await fir.save();

    res.status(200).json({
      success: true,
      message: `FIR ${newStatus.toLowerCase()} successfully`,
      fir
    });

  } catch (error) {
    console.error('Error updating FIR status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FIR status',
      error: error.message
    });
  }
};
