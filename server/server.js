const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const hasSendGrid = Boolean(process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL);
let sgMail = null;
if (hasSendGrid) {
  try {
    sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } catch (e) {
    console.warn('Warning: @sendgrid/mail is not installed. Emails will be logged instead of sent.');
  }
} else {
  console.warn('Warning: SENDGRID_API_KEY or FROM_EMAIL not set. Emails will be logged instead of sent.');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Allow cross-origin requests in dev (React dev server on :3000)
app.use(cors());

app.get('/ping', (req, res) => res.send('OK'));

app.post('/subscribe', async (req, res) => {
  try {
    const email = (req.body.email || '').trim();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL || 'no-reply@example.com',
      subject: 'Welcome to DEV@Deakin',
      // Use template literal for clear newlines
      text: `Hi,\n\nThanks for subscribing to DEV@Deakin!`,
      html: '<h1>Welcome to DEV@Deakin</h1><p>Thanks for subscribing — we are glad to have you!</p>',
    };

    if (hasSendGrid && sgMail) {
      await sgMail.send(msg);
      console.log(`Welcome email sent to ${email}`);
      return res.json({ success: true, message: 'Welcome email sent' });
    }

    // Fallback for local dev: log message and respond success without sending email
    console.log('DEV MODE - would send email:', msg);
    return res.json({ success: true, message: 'DEV: email logged (SENDGRID not configured)' });
  } catch (err) {
  console.error('Send error:', err);
    if (err.response && err.response.body) console.error(err.response.body);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});