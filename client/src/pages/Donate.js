import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';

const stripePromise = loadStripe('pk_test_51TZhMkQSPlakrhdFXm36fKJO2lGoVc9VUgPx8erPOKwldCrn7Mb42yMSB70vCq6IWrZ0X9LIThpfpf0RIUgT6IhN00Tib2QBa9');

function DonateForm({ campaignId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/donations/create-intent', {
        amount: parseFloat(amount),
        campaign_id: campaignId
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        await api.post('/donations/confirm', {
          campaign_id: campaignId,
          amount: parseFloat(amount),
          stripe_payment_id: result.paymentIntent.id
        });
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="alert alert-success">
        <h4>Thank you for your donation!</h4>
        <p>Your donation was processed successfully.</p>
        <a href="/" className="btn btn-primary mt-2">Back to Home</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Donation Amount ($)</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Card Details</label>
        <div className="form-control" style={{ paddingTop: '10px', height: '45px' }}>
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      <button type="submit" className="btn btn-success w-100" disabled={loading || !stripe}>
        {loading ? 'Processing...' : `Donate $${amount || '0'}`}
      </button>
    </form>
  );
}

function Donate() {
  const pathParts = window.location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  const [campaign, setCampaign] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRedirect(true);
      return;
    }
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaign();
  }, [id]);

  if (redirect) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <a href={`/campaigns/${id}`} className="btn btn-outline-secondary mb-3">Back</a>
      {campaign && (
        <>
          <h2 className="mb-1">Donate to</h2>
          <h4 className="text-success mb-4">{campaign.title}</h4>
          <p className="text-muted mb-4">{campaign.description}</p>
        </>
      )}
      <Elements stripe={stripePromise}>
        <DonateForm campaignId={id} />
      </Elements>
    </div>
  );
}

export default Donate;