const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('../utils/validation.utils');

// MFA setup (protected route)
router.post('/setup-mfa', authMiddleware, authController.setupMfa);
// MFA verification (protected route)
router.post('/verify-mfa', authMiddleware, authController.verifyMfa);

// Register
router.post('/register', validateBody(registerSchema), authController.register);
// Login
router.post('/login', validateBody(loginSchema), authController.login);

module.exports = router;
