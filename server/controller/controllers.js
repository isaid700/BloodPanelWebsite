const Patient = require('../models/Patient');
const { getChatGPTResponse } = require('../services/openaiService');

exports.getPatientJson = async (req, res) => {
  try {
    const patient = await Patient.findOne(req.params.name);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    } 
    res.json(patient.fhirData);
  } catch (error) {
    console.error('Error retrieving patient data:', error.message);
    res.status(500).json({ error: 'Error retrieving patient data' });
  }
};

exports.getSummary = async (req, res) => {
  const { fhirData } = req.body;
  if (!fhirData) {
    return res.status(400).json({ error: 'FHIR data is required' });
  }
  try {
    const summary = await getChatGPTResponse(fhirData);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get summary' });
  }
};