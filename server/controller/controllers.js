const Patient = require('../models/Patient');
const { getChatGPTResponse } = require('../services/openaiService');

exports.getPatientJson = async (req, res) => {
  try {
    const patient = await Patient.findOne({ 'identifier.value': req.params.id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    } 
    res.json(patient); // Return the entire patient object
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
    console.error('Error generating summary:', error.message);
    res.status(500).json({ error: 'Failed to get summary' });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    const formattedData = {};
    
    patients.forEach(patient => {
      const patientId = patient.identifier.find(id => id.system === 'http://example.com/patient-id').value;
      formattedData[patientId] = {
        patient_name: `${patient.name[0].given[0]} ${patient.name[0].family}`,
        CBC_blood_panel_results: {}
      };
      
      patient.observation.forEach(obs => {
        if (obs.code.coding[0].system === 'http://loinc.org') {
          const date = obs.effectiveDateTime.split('T')[0];
          if (!formattedData[patientId].CBC_blood_panel_results[date]) {
            formattedData[patientId].CBC_blood_panel_results[date] = {};
          }
          formattedData[patientId].CBC_blood_panel_results[date][obs.code.coding[0].display] = [
            obs.valueQuantity.value,
            obs.valueQuantity.unit
          ];
        }
      });
    });
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching all patients:', error);
    res.status(500).json({ error: 'Error fetching all patients' });
  }
};