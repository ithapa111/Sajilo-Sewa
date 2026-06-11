import crypto from "crypto";

export function createPasswordRecord(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password, passwordRecord) {
  const candidate = crypto.scryptSync(password, passwordRecord.salt, 64);
  const expected = Buffer.from(passwordRecord.hash, "hex");

  if (candidate.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidate, expected);
}

export function createAccessToken() {
  return crypto.randomBytes(24).toString("hex");
}
