// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authenticationData from './authentication_data.json';
import Login from './Login';
import MainPage from './MainPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username, password) => {
    if (
      authenticationData[username] &&
      authenticationData[username].password === password
    ) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      return true; // Indicate successful login
    } else {
      alert('Incorrect username or password');
      return false; // Indicate failed login
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage currentUser={currentUser} handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
