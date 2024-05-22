const crypto = require('crypto');

function generateSessionSecret() {
  return crypto.randomBytes(32).toString('hex'); // Replace 32 with desired length
}

const sessionSecret = generateSessionSecret();
console.log(sessionSecret);
