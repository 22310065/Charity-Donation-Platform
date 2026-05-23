import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function CampaignDetail() {
  const id = window.location.pathname.split('/').pop();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (!campaign) return <div className="container mt-5"><p>Campaign not found.</p></div>;

  const percent = Math.min((campaign.raised / campaign.goal) * 100, 100).toFixed(0);

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <a href="/" className="btn btn-outline-secondary mb-3">Back</a>
      <h2>{campaign.title}</h2>
      <p className="text-muted mt-2">{campaign.description}</p>
      <div className="progress mb-2" style={{ height: '25px' }}>
        <div className="progress-bar bg-success" style={{ width: `${percent}%` }}>
          {percent}%
        </div>
      </div>
      <p>${campaign.raised} raised of ${campaign.goal} goal</p>
      <a href={`/donate/${campaign.id}`} className="btn btn-success w-100 mt-3">
        Donate Now
      </a>
    </div>
  );
}

export default CampaignDetail;