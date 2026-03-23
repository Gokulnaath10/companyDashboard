const express = require("express");
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getEmployees);
router.get("/:id", protect, getEmployeeById);
router.post("/", protect, authorize("admin"), createEmployee);
router.put("/:id", protect, authorize("admin"), updateEmployee);
router.delete("/:id", protect, authorize("admin"), deleteEmployee);

module.exports = router;
