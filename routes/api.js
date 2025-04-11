/**
 * API routes for the email generator application
 */

const express = require('express');
const router = express.Router();
const { validateEmails } = require('../middleware/emailValidator');
const emailService = require('../services/emailService');
const aiService = require('../services/aiService');

/**
 * Generate email content based on prompt
 * POST /api/generate-email
 */
router.post('/generate-email', async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const generatedEmail = await aiService.generateEmail(prompt);
    res.json({ generatedEmail });
  } catch (error) {
    console.error('Error generating email:', error);
    next(error);
  }
});

/**
 * Send email to recipients
 * POST /api/send-email
 */
router.post('/send-email', validateEmails, async (req, res, next) => {
  try {
    const { emailContent } = req.body;
    const recipients = req.validRecipients;

    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    const result = await emailService.sendEmail(recipients, emailContent);
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending email:', error);
    next(error);
  }
});

module.exports = router;