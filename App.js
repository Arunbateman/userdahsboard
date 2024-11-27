// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPassword from './components/ForgotPassword'; // Your ForgotPassword component
import DashBoard from './components/DashBoard';// Your dashboard component after login
import './assets/style.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashBoard/>} /> {/* Your dashboard page */}
      </Routes>
    </Router>
  );
};

export default App;
