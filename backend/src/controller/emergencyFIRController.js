import EmergencyFIR from '../models/EmergencyFIR.js';

export const launchEmergencyFIR = async (req, res) => {
  try {
    const {
      incidentType,
      deceasedDetails,
      incidentLocation,
      initialObservations,
      photoUrl,
      reporter,
      policeStation
    } = req.body;

    const userId = reporter?.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing reporter userId' });
    }

    if (!incidentType || !deceasedDetails?.gender || !incidentLocation?.address) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }

    if (!policeStation?.id || !policeStation?.name) {
      return res.status(400).json({ message: 'Police station id and name are required.' });
    }

    const fir = await EmergencyFIR.create({
      incidentType,
      deceasedDetails,
      incidentLocation,
      initialObservations,
      photoUrl,
      reporter: {
        ...reporter,
        relation: reporter.relation || 'Witness',
        userId
      },
      policeStation: {
        id: policeStation.id,
        name: policeStation.name
      }
    });

    res.status(201).json({ message: 'FIR submitted successfully.', fir });
  } catch (error) {
    console.error('FIR error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
  }
};
