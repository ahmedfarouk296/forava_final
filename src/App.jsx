import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelectionPage from './Project/pages/RoleSelectionPage';
import CustomerLandingPage from './Project/pages/CustomerLandingPage';
import FlowersCatalogPage from './Project/pages/FlowersCatalogPage';
import AdminLoginPage from './Project/pages/AdminLoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/customer-home" element={<CustomerLandingPage />} />
        <Route path="/flowers" element={<FlowersCatalogPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<div style={{ padding: '2rem' }}>Admin Dashboard (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}



export default App;
