// src/openaiService.js
import axios from 'axios';

const OPENAI_API_KEY = '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';

export async function getCbcSummary(patientName, patientData) {
  const prompt = `Below are some CBC blood panel results for a patient named ${patientName}. Please summarize and explain what the results mean in very simple terms. Please highlight any measurement that is outside the normal range. If any measurements are outside the normal range, please give some suggestions on what could be done to improve these results. Give your response as if you were talking to the patient directly. Make sure to begin with a greeting directed to the patient. Here is the CBC blood panel data:\n${JSON.stringify(
    patientData,
    null,
    2
  )}`;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      'Error calling OpenAI API:',
      error.response ? error.response.data : error.message
    );
    return 'An error occurred while generating the summary.';
  }
}
