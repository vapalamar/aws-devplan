const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

function createUserToken(id, email, password) {
  const token = JWT.sign({ id, email, password }, process.env.AUTH_KEY, {
    expiresIn: "2h"
  });

  return token;
}

async function encodeUserPass(raw) {
  return await hashAsync(raw, process.env.PASS_SALT);
}

async function comparePassword(raw, hashed) {
  return await compareAsync(raw, hashed);
}

module.exports = {
  createUserToken,
  encodeUserPass,
  comparePassword
};
