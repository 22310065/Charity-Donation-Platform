const supabase = require('../models/db');
const stripe = require('stripe')('STRIPE_KEY_PLACEHOLDER');
const createPaymentIntent = async (req, res) => {
  const { amount, campaign_id } = req.body;
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { campaign_id }
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Payment failed' });
  }
};

const confirmDonation = async (req, res) => {
  const { campaign_id, amount, stripe_payment_id } = req.body;
  const donor_id = req.user.id;
  try {
    const { error: donationError } = await supabase
      .from('donations')
      .insert([{ donor_id, campaign_id, amount, stripe_payment_id }]);
    if (donationError) throw donationError;

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('raised')
      .eq('id', campaign_id)
      .single();

    const newRaised = parseFloat(campaign.raised) + parseFloat(amount);

    await supabase
      .from('campaigns')
      .update({ raised: newRaised })
      .eq('id', campaign_id);

    await supabase
      .from('notifications')
      .insert([{
        user_id: donor_id,
        message: `Your donation of $${amount} was successful!`
      }]);

    res.json({ message: 'Donation confirmed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*, campaigns(title, goal)')
      .eq('donor_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createPaymentIntent, confirmDonation, getMyDonations };