const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

// POST request to handle GitHub OAuth callback
router.post('/oauth/callback', githubController.githubCallback);

module.exports = router;
