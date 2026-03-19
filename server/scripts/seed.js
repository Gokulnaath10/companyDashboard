const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const AuditLog = require("../models/AuditLog");
const Employee = require("../models/Employee");
const User = require("../models/User");

dotenv.config();

async function seed() {
  await connectDB();

  const adminEmail = "admin@company.com";
  const employeeEmail = "employee@company.com";
  const defaultPassword = "Admin@123";

  let employeeRecord = await Employee.findOne({ email: employeeEmail });

  if (!employeeRecord) {
    employeeRecord = await Employee.create({
      name: "Demo Employee",
      email: employeeEmail,
      role: "Software Engineer",
      department: "Technology",
      status: "Active",
    });
  }

  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const adminUser = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: "System Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
      isActive: true,
      preferences: { theme: "dark" },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const employeeUser = await User.findOneAndUpdate(
    { email: employeeEmail },
    {
      name: "Demo Employee",
      email: employeeEmail,
      passwordHash,
      role: "employee",
      employeeId: employeeRecord._id,
      isActive: true,
      preferences: { theme: "dark" },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  employeeRecord.userId = employeeUser._id;
  await employeeRecord.save();

  await AuditLog.deleteMany({});
  await AuditLog.create({
    action: "SEED",
    detail: "Seeded default admin and employee accounts",
    actorId: adminUser._id,
    actorEmail: adminUser.email,
  });

  console.log("Seed complete");
  console.log(`Admin login: ${adminEmail} / ${defaultPassword}`);
  console.log(`Employee login: ${employeeEmail} / ${defaultPassword}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
