const express = require('express');
const { getPatientJson, getSummary } = require('../controller/controllers');
const router = express.Router();

router.get('/patient/:name', getPatientJson);
router.post('/summary', getSummary);

module.exports = router;