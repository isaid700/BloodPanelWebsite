const express = require('express');
const { getPatientJson, getSummary, getAllPatients, askQuestion } = require('../controller/controllers');
const router = express.Router();

router.get('/patients', getAllPatients); // Fetch all patients
router.get('/patient/:name', getPatientJson); // Fetch single patient by name
router.post('/summary', getSummary); // Generate AI summary
router.post('/ask-question', askQuestion); // handles questions

module.exports = router;