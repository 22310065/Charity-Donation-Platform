const express = require('express');
const router = express.Router();
router.get('/test', (req, res) => res.json({ message: 'admin works' }));
module.exports = router;