import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h2 className="mb-4">Create Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">I am a</label>
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="donor">Donor</option>
            <option value="nonprofit">Non-Profit Organization</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;