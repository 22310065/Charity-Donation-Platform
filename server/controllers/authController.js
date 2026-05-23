const supabase = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'charityplatformsecretkey99887766';

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: hash, role: role || 'donor' }])
      .select('id, name, email, role');

    if (error) throw error;

    const user = data[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'Wrong email or password' });
    }

    const user = data[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Wrong email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', req.user.id);

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getMe };