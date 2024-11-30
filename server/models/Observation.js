const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema({
  resourceType: { type: String, default: 'Observation' },
  id: { type: String, required: true, unique: true },
  status: String,
  category: [
    {
      coding: [
        {
          system: String,
          code: String,
          display: String,
        },
      ],
    },
  ],
  code: {
    coding: [
      {
        system: String,
        code: String,
        display: String,
      },
    ],
  },
  subject: {
    reference: String, // Reference like "Patient/john-doe"
    patient_name: String, // Store patient name directly
  },
  effectiveDateTime: Date,
  component: [
    {
      code: {
        coding: [
          {
            system: String,
            code: String,
            display: String,
          },
        ],
      },
      valueQuantity: {
        value: Number,
        unit: String,
        system: String,
        code: String,
      },
    },
  ],
},
{
  collection: 'pateint', // Explicitly specify the collection name
}
);

module.exports = mongoose.model('Observation', ObservationSchema);