const axios = require('axios');

async function getChatGPTResponse(fhirData) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Provide a summary for the following FHIR data.' },
        { role: 'user', content: `FHIR Data: ${JSON.stringify(fhirData)}` }
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}

module.exports = { getChatGPTResponse };
