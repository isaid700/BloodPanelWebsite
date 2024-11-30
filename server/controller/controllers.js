const Observation = require('../models/Observation');
const { getChatGPTResponse } = require('../services/openaiService');

exports.getPatientJson = async (req, res) => {
  try 
  {
    const patient = await Observation.findOne({ 'subject.reference': `Patient/${req.params.name}` });

    if (!patient) 
    {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } 
  catch (error) 
  {
    console.error('Error retrieving patient data:', error.message);
    res.status(500).json({ error: 'Error retrieving patient data' });
  }
};

exports.getSummary = async (req, res) => {
  const { fhirData } = req.body;

  if (!fhirData) 
  {
    return res.status(400).json({ error: 'FHIR data is required' });
  }

  try 
  {
    const summary = await getChatGPTResponse(fhirData);
    res.json({ summary });
  } 
  catch (error) 
  {
    console.error('Error generating summary:', error.message);
    res.status(500).json({ error: 'Failed to get summary' });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const observations = await Observation.find({});
    console.log('Observations from DB:', observations); // Log query results

    const groupedPatients = observations.reduce((acc, obs) => {
      const patientRef = obs.subject.reference || 'Patient/unknown';
      const patientId = patientRef.split('/')[1] || 'unknown-id';

      if (!acc[patientId]) {
        acc[patientId] = {
          id: patientId,
          name: obs.subject.patient_name || 'Unknown Patient',
          observations: [],
        };
      }

      acc[patientId].observations.push({
        id: obs.id,
        date: obs.effectiveDateTime,
        components: obs.component.map((comp) => ({
          code: comp.code.coding[0]?.display || 'Unknown Code',
          value: comp.valueQuantity?.value || 'N/A',
          unit: comp.valueQuantity?.unit || 'N/A',
        })),
      });

      return acc;
    }, {});

    console.log('Grouped Patients:', groupedPatients); // Log processed data
    res.json(Object.values(groupedPatients));
  } catch (error) {
    console.error('Error retrieving patients:', error);
    res.status(500).json({ error: 'Error retrieving patients', details: error.message });
  }
};

//handles questions from frontend to chatgpt
exports.askQuestion = async (req, res) => {
  const { question, fhirData } = req.body;

  if (!question || !fhirData) {
    return res.status(400).json({ error: 'Question and FHIR data are required' });
  }

  try {
    const answer = await getChatGPTResponse(question, fhirData);
    res.json({ answer });
  } catch (error) {
    console.error('Error generating answer:', error.message);
    res.status(500).json({ error: 'Failed to get answer' });
  }
};