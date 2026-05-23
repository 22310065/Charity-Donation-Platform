import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function OrgDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns/my');
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Campaigns</h2>
        <div>
          <span className="me-3">Hello, {user?.name}</span>
          <a href="/campaign/create" className="btn btn-success me-2">Create Campaign</a>
          <a href="/" className="btn btn-outline-secondary">Home</a>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : campaigns.length === 0 ? (
        <div className="alert alert-info">
          You have not created any campaigns yet.
          <a href="/campaign/create" className="btn btn-success ms-3">Create One</a>
        </div>
      ) : (
        <div className="row">
          {campaigns.map(campaign => {
            const percent = Math.min((campaign.raised / campaign.goal) * 100, 100).toFixed(0);
            return (
              <div key={campaign.id} className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{campaign.title}</h5>
                    <p className="text-muted">{campaign.description?.substring(0, 80)}...</p>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-success" style={{ width: `${percent}%` }}>
                        {percent}%
                      </div>
                    </div>
                    <p className="small">${campaign.raised} raised of ${campaign.goal}</p>
                    <p className="small">
                      Status: <span className={`badge ${campaign.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {campaign.status}
                      </span>
                    </p>
                    <a href={`/campaigns/${campaign.id}`} className="btn btn-primary btn-sm me-2">View</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrgDashboard;