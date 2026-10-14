# Blood Panel Explainer

A full-stack web app that helps patients understand their blood work. Patients sign in and see their blood panel results over time. An LLM then explains what each measurement means, flags results that are high or low, and answers follow-up questions, without giving a diagnosis.

## Features

- **Results dashboard:** each patient's blood panel measurements grouped by test date.
- **AI summary:** the panel is sent to GPT-4 as **FHIR** `Observation` data. The model explains each measurement and flags abnormal values as high or low.
- **Follow-up Q&A:** patients can ask questions about their results.
- **Guardrails:** the system prompt tells the model to inform, not interpret. It never diagnoses, and it points patients to a medical specialist for any abnormal result.
- **Synthetic data:** a Python script (`src/testDB.py`) generates realistic, fake patient records, so no real health data is used.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) storing FHIR `Observation` resources |
| AI | OpenAI Chat Completions (GPT-4) |

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/patients` | All patients with their observations, grouped by patient |
| `GET` | `/api/patient/:name` | One patient's FHIR record |
| `POST` | `/api/summary` | AI summary of a patient's FHIR data |
| `POST` | `/api/ask-question` | Answer a follow-up question |

## Run it locally

You need Node.js, a MongoDB database (for example a free MongoDB Atlas cluster) and an OpenAI API key.

```bash
# 1. Backend (port 5000)
cd server
npm install
cp .env.example .env      # then fill in MONGO_URI and OPENAI_API_KEY
npm start

# 2. Frontend (port 3000, requests to /api go to the backend)
cd ..
npm install
npm start
```

Demo logins are generated with the synthetic data (see `src/authentication_data.json`). They're for local testing only.
