const { generateMfaSecret, generateQrCode, verifyMfaToken } = require('../utils/mfa.utils');
const db = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../utils/validation.utils');
const { validateBody } = require('../middleware/validation.middleware');
const nodemailer = require('nodemailer');

// MFA Setup: Generate secret and QR code for Google Authenticator
async function setupMfa(req, res) {
  const userId = req.user.id;
  const email = req.user.email;
  const secretObj = generateMfaSecret(email);
  const otpauthUrl = secretObj.otpauth_url;
  const qrCode = await generateQrCode(otpauthUrl);

  // Save secret to user in DB (not enabled yet)
  db.run('UPDATE users SET mfa_secret = ? WHERE id = ?', [secretObj.base32, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save MFA secret' });
    res.json({ qrCode, secret: secretObj.base32 });
  });
}

// MFA Verification: Verify TOTP token from Google Authenticator
function verifyMfa(req, res) {
  const userId = req.user.id;
  const { token } = req.body;
  db.get('SELECT mfa_secret FROM users WHERE id = ?', [userId], (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'User not found' });
    const valid = verifyMfaToken(row.mfa_secret, token);
    if (!valid) return res.status(401).json({ error: 'Invalid MFA token' });
    // Optionally enable MFA after first successful verification
    db.run('UPDATE users SET mfa_enabled = 1 WHERE id = ?', [userId]);
    res.json({ success: true });
  });
}

// Registration
async function register(req, res) {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, email, phone, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (user) return res.status(409).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, password_hash],
      function (err) {
        if (err) return res.status(500).json({ error: 'Registration failed' });
        // TODO: Send email verification (placeholder)
        res.status(201).json({ success: true, user_id: this.lastID });
      }
    );
  });
}

// Login
async function login(req, res) {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    // If MFA is enabled, require MFA verification step
    if (user.mfa_enabled) {
      // Issue a short-lived JWT for MFA verification step
      const mfaToken = jwt.sign({ id: user.id, email: user.email, mfa: true }, process.env.JWT_SECRET, { expiresIn: '5m' });
      return res.json({ mfa_required: true, mfaToken });
    }
    // Issue normal JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
}

module.exports = {
  setupMfa,
  verifyMfa,
  register,
  login
};
