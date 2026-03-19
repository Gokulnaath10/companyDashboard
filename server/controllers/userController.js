const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");

async function updateCurrentUser(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    await logAudit({
      action: "PROFILE_UPDATE",
      detail: `Profile updated for ${user.email}`,
      actor: user,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
}

async function changeCurrentUserPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await logAudit({
      action: "PASSWORD_CHANGE",
      detail: `Password changed for ${user.email}`,
      actor: user,
    });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password" });
  }
}

module.exports = {
  updateCurrentUser,
  changeCurrentUserPassword,
};
