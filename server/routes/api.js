const express = require('express');
const { getPatientJson, getSummary, getAllPatients } = require('../controller/controllers');
const router = express.Router();

router.get('/patient/:name', getPatientJson);
router.post('/summary', getSummary);
router.get('/patients', getAllPatients);

module.exports = router;