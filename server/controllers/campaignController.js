const supabase = require('../models/db');

const createCampaign = async (req, res) => {
  const { title, description, goal } = req.body;
  const org_id = req.user.id;
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ title, description, goal, org_id, status: 'active' }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllCampaigns = async (req, res) => {
  const { search } = req.query;
  try {
    let query = supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active');
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCampaignById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Campaign not found' });
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { title, description, goal, status } = req.body;
  try {
    const { data: existing, error: findError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    if (findError) throw findError;
    if (!existing) return res.status(404).json({ error: 'Campaign not found' });
    if (existing.org_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }
    const { data, error } = await supabase
      .from('campaigns')
      .update({ title, description, goal, status })
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyCampaigns = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('org_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createCampaign, getAllCampaigns, getCampaignById, getMyCampaigns, updateCampaign, deleteCampaign };