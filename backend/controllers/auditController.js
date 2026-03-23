const AuditLog = require("../models/AuditLog");

async function getAuditLogs(req, res) {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch audit logs" });
  }
}

module.exports = {
  getAuditLogs,
};
