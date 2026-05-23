import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async (searchTerm) => {
    try {
      const res = await api.get(`/campaigns${searchTerm ? '?search=' + searchTerm : ''}`);
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampaigns(search);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Charity Platform</h1>
        <div>
          {user ? (
            <>
              <span className="me-3">Hello, {user.name}</span>
              {user.role === 'nonprofit' && (
                <a href="/org/dashboard" className="btn btn-success me-2">
                  My Campaigns
                </a>
              )}
              {user.role === 'donor' && (
                <a href="/dashboard" className="btn btn-primary me-2">
                  My Donations
                </a>
              )}
              {user.role === 'admin' && (
                <a href="/admin" className="btn btn-danger me-2">
                  Admin Panel
                </a>
              )}
              <button onClick={handleLogout} className="btn btn-outline-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn-primary me-2">Login</a>
              <a href="/register" className="btn btn-outline-primary">Register</a>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="row">
          {campaigns.map(campaign => {
            const percent = Math.min((campaign.raised / campaign.goal) * 100, 100).toFixed(0);
            return (
              <div key={campaign.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{campaign.title}</h5>
                    <p className="card-text text-muted">
                      {campaign.description?.substring(0, 100)}...
                    </p>
                    <div className="progress mb-2">
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${percent}%` }}
                      >
                        {percent}%
                      </div>
                    </div>
                    <p className="small">
                      ${campaign.raised} raised of ${campaign.goal} goal
                    </p>
                    <a href={`/campaigns/${campaign.id}`} className="btn btn-primary w-100">
                      View Campaign
                    </a>
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

export default Home;