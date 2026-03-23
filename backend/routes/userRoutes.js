const express = require("express");

const {
  updateCurrentUser,
  changeCurrentUserPassword,
} = require("../controllers/userController");
const {
  updateCurrentUserPreferences,
} = require("../controllers/userPreferencesController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/me", protect, updateCurrentUser);
router.put("/me/password", protect, changeCurrentUserPassword);
router.put("/me/preferences", protect, updateCurrentUserPreferences);

module.exports = router;
