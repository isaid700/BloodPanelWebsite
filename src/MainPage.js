import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function MainPage({ currentUser, handleLogout }) {
  const patientsData = require('./patients_data.json');
  const patientData = patientsData[currentUser];

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [sortedDates, setSortedDates] = useState([]);
  const [measurements, setMeasurements] = useState({});
  const [bloodPanelResults, setBloodPanelResults] = useState({});

  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const [answers, setAnswers] = useState([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState(null);

  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [backendStatus, setBackendStatus] = useState('Checking connection...');

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    if (question.trim() !== '') {
      setQuestionsList([...questionsList, question]);
      setIsLoadingAnswer(true);
      setAnswerError(null);
      try {
        const response = await axios.post('/api/ask-question', {
          question: question,
          fhirData: patientData // Assuming you have the patient's FHIR data stored in state
        });
        setAnswers([...answers, response.data.answer]);
      } catch (error) {
        console.error('Error asking question:', error);
        setAnswerError('Failed to get an answer. Please try again.');
      }
      setIsLoadingAnswer(false);
      setQuestion('');
    }
  };

  useEffect(() => {
    if (patientData && patientData.CBC_blood_panel_results) {
      const dates = Object.keys(patientData.CBC_blood_panel_results);
      const sorted = dates.sort((a, b) => new Date(b) - new Date(a));
      setSortedDates(sorted);
      if (sorted.length > 0 && !selectedDate) {
        setSelectedDate(sorted[0]);
      }
    }
  }, [patientData]);
  
  useEffect(() => {
    const fetchSummary = async () => {
      if (patientData && measurements) {
        setIsLoadingSummary(true);
        setSummaryError('');
        try {
          const response = await axios.post('/api/summary', {
            fhirData: patientData // Ensure this matches the FHIR format expected by the backend
          });
          setSummary(response.data.summary);
        } catch (error) {
          console.error('Error fetching summary:', error);
          setSummaryError('Failed to generate summary.');
        } finally {
          setIsLoadingSummary(false);
        }
      }
    };
    fetchSummary();
  }, [patientData, measurements]);

  useEffect(() => {
    if (patientData && patientData.CBC_blood_panel_results && selectedDate) {
      const panel = patientData.CBC_blood_panel_results[selectedDate];
      if (panel) {
        setMeasurements(panel);
      }
    }
  }, [patientData, selectedDate]);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test');
        const data = await response.json();
        setBackendStatus(data.message);
      } catch (error) {
        console.error('Error:', error);
        setBackendStatus('Connection failed');
      }
    };
    testBackendConnection();
  }, []);

  return (
    <div>
      <header className="App-header">
        <div className="top-bar">
          <div className="left">
            <select value={selectedDate} onChange={handleDateChange}>
              {sortedDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <div className="center">
            <h1>Results for Blood Panel {selectedDate}</h1>
          </div>
          <div className="right">
            <button className="patient-name-button" onClick={toggleProfileMenu}>
              {patientData.patient_name}
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="content">
        <div className="table-container">
          <h2>Test Results</h2>
          <table>
            <tbody>
              {Object.entries(measurements).map(([measurement, [value, unit]]) => (
                <tr key={measurement}>
                  <td>{measurement}</td>
                  <td>
                    {value}
                    <span className="unit"> {unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className="summary-container">
            <h2>AI Summary</h2>
            <div className="summary-text">
              {isLoadingSummary ? (
                <p>Loading summary...</p>
              ) : summaryError ? (
                <p>{summaryError}</p>
              ) : (
                <p>{summary}</p>
              )}
            </div>
            <h3>Ask a question about your results:</h3>
            <form onSubmit={handleQuestionSubmit}>
              <textarea
                className="question-input"
                rows="4"
                placeholder="Type your question here..."
                value={question}
                onChange={handleQuestionChange}
              ></textarea>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
            {questionsList.length > 0 && (
              <div className="questions-and-answers">
                <h3>Your Questions and Answers:</h3>
                <ul>
                  {questionsList.map((q, index) => (
                    <li key={index}>
                      <strong>Q: {q}</strong>
                      <p>A: {isLoadingAnswer && index === questionsList.length - 1 ? 'Loading answer...' : 
                          answerError && index === questionsList.length - 1 ? answerError :
                          answers[index] || 'No answer yet'}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
       <footer>
      <div className="connection-status">
        <h3>Backend Connection Status:</h3>
        <p>{backendStatus}</p>
      </div>
    </footer>
    </div>
  );
}

export default MainPage;
