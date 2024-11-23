const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  resourceType: { type: String, default: 'Patient' },
  id: { type: String, required: true, unique: true },
  name: [{
    use: String,
    family: String,
    given: [String]
  }],
  gender: String,
  birthDate: Date,
  identifier: [{
    system: String,
    value: String
  }],
  observation: [{
    resourceType: { type: String, default: 'Observation' },
    id: String,
    status: String,
    code: {
      coding: [{
        system: String,
        code: String,
        display: String
      }]
    },
    effectiveDateTime: Date,
    valueQuantity: {
      value: Number,
      unit: String,
      system: String,
      code: String
    }
  }]
});

module.exports = mongoose.model('Patient', PatientSchema);