const axios = require('axios');

async function getChatGPTResponse(fhirData) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Your role will help people understand what their bloodwork means without giving diagnoses or interpretations. Instructions: You will receive the bloodwork of individuals as fhir standard data of a comprehensive metabolic panel. You will give them a couple sentences about  what each measurement from  the blood panel is measuring and what it means. You will then answer questions about the bloodwork. Goal: Your goal is to inform users about their bloodwork WITHOUT giving interpretations. If there is an abnormal result, do not extrapolate into its meaning too greatly. Do not make diagnoses. Give information then direct them to see a medical specialist for any abnormal results. Make sure to indicate all abnormal results and tell whether it is low or high. ' },
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
