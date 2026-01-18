const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// User profile routes
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

// Delete account
router.delete('/account', deleteAccount);

module.exports = router;
