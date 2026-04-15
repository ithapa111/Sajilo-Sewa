const crypto = require("crypto");

function createPasswordRecord(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, passwordRecord) {
  const candidate = crypto.scryptSync(password, passwordRecord.salt, 64);
  const expected = Buffer.from(passwordRecord.hash, "hex");

  if (candidate.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidate, expected);
}

function createAccessToken() {
  return crypto.randomBytes(24).toString("hex");
}

module.exports = {
  createAccessToken,
  createPasswordRecord,
  verifyPassword
};
