import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const fetchData = async () => {
      try {
        const [usersRes, campaignsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/campaigns')
        ]);
        setUsers(usersRes.data);
        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${id}`);
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete campaign');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <a href="/" className="btn btn-outline-secondary">Home</a>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaigns ({campaigns.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'users' ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'nonprofit' ? 'bg-primary' : 'bg-secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Goal</th>
                <th>Raised</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>${c.goal}</td>
                  <td>${c.raised}</td>
                  <td>
                    <span className={`badge ${c.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCampaign(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;