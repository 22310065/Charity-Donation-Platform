import React, { useState } from 'react';
import api from '../api/axios';

function CreateCampaign() {
  const [form, setForm] = useState({ title: '', description: '', goal: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/campaigns', form);
      alert('Success: ' + JSON.stringify(res.data));
      window.location.href = '/';
    } catch (err) {
      alert('Error: ' + JSON.stringify(err.response?.data));
      setError(err.response?.data?.error || 'Failed to create campaign');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Create Campaign</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Campaign Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Donation Goal ($)</label>
          <input
            type="number"
            name="goal"
            className="form-control"
            value={form.goal}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
      <p className="mt-3 text-center">
        <a href="/">Back to Home</a>
      </p>
    </div>
  );
}

export default CreateCampaign;