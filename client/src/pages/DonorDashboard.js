import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations/my');
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Donations</h2>
        <div>
          <span className="me-3">Hello, {user?.name}</span>
          <a href="/" className="btn btn-outline-secondary">Browse Campaigns</a>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : donations.length === 0 ? (
        <div className="alert alert-info">
          You have not made any donations yet.
          <a href="/" className="btn btn-primary ms-3">Browse Campaigns</a>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id}>
                  <td>{d.campaigns?.title || 'Unknown'}</td>
                  <td>${d.amount}</td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;