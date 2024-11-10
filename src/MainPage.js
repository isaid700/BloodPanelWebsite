// src/MainPage.js
import React, { useState, useEffect } from 'react';
import { getCbcSummary } from './openaiService';
import './App.css';

function MainPage({ currentUser, handleLogout }) {
  const patientsData = require('./patients_data.json');
  const patientData = patientsData[currentUser];

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [bloodPanelResults, setBloodPanelResults] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [measurements, setMeasurements] = useState({});

  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    if (question.trim() !== '') {
      setQuestionsList([...questionsList, question]);
      setQuestion('');
      // TODO: Send the question to your API here
    }
  };

  useEffect(() => {
    if (patientData) {
      const results = patientData.CBC_blood_panel_results;
      setBloodPanelResults(results);
      const dates = Object.keys(results).sort((a, b) => b.localeCompare(a));
      setSortedDates(dates);
      setSelectedDate(dates[0]); // Set the most recent date
    }
  }, [patientData]);

  useEffect(() => {
    if (bloodPanelResults && selectedDate) {
      const panel = bloodPanelResults[selectedDate];
      if (panel) {
        const measurements = panel;
        setMeasurements(measurements);
      }
    }
  }, [bloodPanelResults, selectedDate]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (patientData && measurements) {
        setIsLoadingSummary(true);
        setSummaryError('');
        try {
          const summaryText = await getCbcSummary(
            patientData.patient_name,
            measurements
          );
          setSummary(summaryText);
        } catch (error) {
          setSummaryError('Failed to generate summary.');
        } finally {
          setIsLoadingSummary(false);
        }
      }
    };
    fetchSummary();
  }, [measurements, patientData]);

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
                {measurements &&
                  Object.entries(measurements).map(
                    ([measurement, [value, unit]]) => (
                      <tr key={measurement}>
                        <td>{measurement}</td>
                        <td>
                          {value}
                          <span className="unit"> {unit}</span>
                        </td>
                      </tr>
                    )
                  )}
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
              <div className="questions-list">
                <h3>Your Questions:</h3>
                <ul>
                  {questionsList.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
