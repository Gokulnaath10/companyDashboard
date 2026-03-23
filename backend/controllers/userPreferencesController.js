const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");

async function updateCurrentUserPreferences(req, res) {
  try {
    const { theme } = req.body;

    if (!["dark", "light"].includes(theme)) {
      return res.status(400).json({ message: "Invalid theme value" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { "preferences.theme": theme },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    await logAudit({
      action: "PREFERENCE_UPDATE",
      detail: `Theme updated to ${theme} for ${user.email}`,
      actor: user,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update preferences" });
  }
}

module.exports = {
  updateCurrentUserPreferences,
};
