const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/campaigns',     require('./routes/campaigns'));
app.use('/api/donations',     require('./routes/donations'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.json({ message: 'Charity Platform API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});