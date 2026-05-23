const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPaymentIntent, confirmDonation, getMyDonations } = require('../controllers/donationController');

router.post('/create-intent', auth, createPaymentIntent);
router.post('/confirm', auth, confirmDonation);
router.get('/my', auth, getMyDonations);

module.exports = router;