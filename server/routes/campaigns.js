const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  getMyCampaigns,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');

router.get('/', getAllCampaigns);
router.get('/my', auth, getMyCampaigns);
router.get('/:id', getCampaignById);
router.post('/', auth, createCampaign);
router.put('/:id', auth, updateCampaign);
router.delete('/:id', auth, deleteCampaign);

module.exports = router;