const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");
const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");

async function getEmployees(req, res) {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
}

async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (
      req.user.role !== "admin" &&
      (!req.user.employeeId || req.user.employeeId.toString() !== employee._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch employee" });
  }
}

async function createEmployee(req, res) {
  try {
    const {
      name,
      email,
      role,
      department,
      status,
      password,
    } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "A password with at least 8 characters is required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const employee = await Employee.create({
      name,
      email,
      role,
      department,
      status,
    });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role: "employee",
      employeeId: employee._id,
    });

    employee.userId = user._id;
    await employee.save();

    await logAudit({
      action: "EMPLOYEE_CREATE",
      detail: `Employee created: ${employee.email}`,
      actor: req.user,
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(400).json({ message: "Failed to create employee" });
  }
}

async function updateEmployee(req, res) {
  try {
    const { password, ...employeeData } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const previousEmail = employee.email;

    Object.assign(employee, employeeData);
    await employee.save();

    if (employee.userId) {
      const user = await User.findById(employee.userId);

      if (user) {
        user.name = employee.name;
        user.email = employee.email.toLowerCase();

        if (password) {
          user.passwordHash = await bcrypt.hash(password, 10);
        }

        await user.save();
      }
    } else {
      const linkedUser = await User.findOne({ email: previousEmail.toLowerCase() });

      if (linkedUser) {
        linkedUser.name = employee.name;
        linkedUser.email = employee.email.toLowerCase();
        linkedUser.employeeId = employee._id;

        if (password) {
          linkedUser.passwordHash = await bcrypt.hash(password, 10);
        }

        await linkedUser.save();
        employee.userId = linkedUser._id;
        await employee.save();
      }
    }

    await logAudit({
      action: "EMPLOYEE_UPDATE",
      detail: `Employee updated: ${employee.email}`,
      actor: req.user,
    });

    return res.status(200).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(400).json({ message: "Failed to update employee" });
  }
}

async function deleteEmployee(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.userId) {
      await User.findByIdAndDelete(employee.userId);
    }

    await employee.deleteOne();

    await logAudit({
      action: "EMPLOYEE_DELETE",
      detail: `Employee deleted: ${employee.email}`,
      actor: req.user,
    });

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete employee" });
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
