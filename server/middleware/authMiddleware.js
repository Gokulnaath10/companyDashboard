const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User session is invalid" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}

module.exports = {
  protect,
};
