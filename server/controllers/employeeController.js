const Employee = require("../models/Employee");

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

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch employee" });
  }
}

async function createEmployee(req, res) {
  try {
    const employee = await Employee.create(req.body);
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
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

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
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

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
