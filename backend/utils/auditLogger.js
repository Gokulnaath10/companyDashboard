const AuditLog = require("../models/AuditLog");

async function logAudit({ action, detail = "", actor = null }) {
  try {
    await AuditLog.create({
      action,
      detail,
      actorId: actor?._id || null,
      actorEmail: actor?.email || "",
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
}

module.exports = {
  logAudit,
};
