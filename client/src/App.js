import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import Donate from './pages/Donate';
import DonorDashboard from './pages/DonorDashboard';
import OrgDashboard from './pages/OrgDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/campaign/create" element={<CreateCampaign />} />
        <Route path="/donate/:id" element={<Donate />} />
        <Route path="/dashboard" element={<DonorDashboard />} />
        <Route path="/org/dashboard" element={<OrgDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;