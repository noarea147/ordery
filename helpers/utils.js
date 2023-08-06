const jwt = require("./jwt");

function getTokens(user) {
  const payload = {
    id: user.id,
    role: user.role,
  };
  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);
  return { accessToken, refreshToken };
}

function handleResponse(message, code, data) {
  if (!data) return { Message: message, StatusCode: code };
  return {
    Message: message,
    StatusCode: code,
    Data: data,
  };
}
function generateRandomString(length) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

//generateRandom 5 digit number
function generateRandomNumber(length) {
  const chars = "0123456789";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function isBusinessOwner(arr, businessId) {
  return arr.includes(businessId);
}

module.exports = {
  getTokens,
  handleResponse,
  generateRandomString,
  isBusinessOwner,
  generateRandomNumber,
};
