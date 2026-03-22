const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function setAuthCookie(req, res, token) {
  const requestOrigin = req.headers.origin || "";
  const useCrossSiteCookie = requestOrigin.startsWith("https://");

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: useCrossSiteCookie ? "none" : "lax",
    secure: useCrossSiteCookie,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

module.exports = {
  generateToken,
  setAuthCookie,
};
