const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

function generateMfaSecret(email) {
  const secret = speakeasy.generateSecret({
    name: `RickCooling Auth App (${email})`,
    length: 20
  });
  return secret;
}

async function generateQrCode(otpauthUrl) {
  try {
    return await qrcode.toDataURL(otpauthUrl);
  } catch (err) {
    throw new Error('Failed to generate QR code');
  }
}

function verifyMfaToken(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });
}

module.exports = {
  generateMfaSecret,
  generateQrCode,
  verifyMfaToken
};
