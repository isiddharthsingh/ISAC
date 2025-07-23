const express = require('express');
const router = express.Router();
const whatsappGroupsController = require('../controllers/whatsappGroupsController');
const { generalLimiter, strictLimiter } = require('../middleware/rateLimiter');

// Get all universities
router.get('/universities', generalLimiter, whatsappGroupsController.getUniversities);

// Get WhatsApp groups for a specific university
router.get('/universities/:universityId/groups', generalLimiter, whatsappGroupsController.getUniversityGroups);

// Start verification process
router.post('/verify/start', strictLimiter, whatsappGroupsController.startVerification);

// Confirm email verification
router.get('/verify/confirm/:token', generalLimiter, whatsappGroupsController.confirmVerification);

// Get user verification status
router.post('/verify/status', generalLimiter, whatsappGroupsController.getVerificationStatus);

// Resend verification email
router.post('/verify/resend', strictLimiter, whatsappGroupsController.resendVerification);

module.exports = router; 