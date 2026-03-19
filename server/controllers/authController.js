const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generateToken, setAuthCookie } = require("../utils/generateToken");
const { logAudit } = require("../utils/auditLogger");

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    isActive: user.isActive,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "employee",
    });

    await logAudit({
      action: "REGISTER",
      detail: `User registered: ${user.email}`,
      actor: user,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    await logAudit({
      action: "LOGIN_SUCCESS",
      detail: `User logged in: ${user.email}`,
      actor: user,
    });

    return res.status(200).json({
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log in" });
  }
}

function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  logAudit({
    action: "LOGOUT",
    detail: `User logged out: ${req.user.email}`,
    actor: req.user,
  });

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  return res.status(200).json({ message: "Logged out successfully" });
}

function getCurrentUser(req, res) {
  return res.status(200).json(req.user);
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
