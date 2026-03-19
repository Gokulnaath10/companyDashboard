function validatePassword(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(password);
  const longEnough = password.length >= 8;
  return hasUpper && hasLower && hasNumber && hasSpecial && longEnough;
}

//SHA-256 HASHING 
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");// converts numbers into hexadecimal
}

//SALT GENERATOR 
function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getAuditKey() {
  try {
    const data = localStorage.getItem("currentUser");
    if (data) {
      const user = JSON.parse(data);
      if (user?.email) return "auditLog_" + user.email;
    }
  } catch {}
  return null;
}

function loadAuditLog(email) {
  try {
    const key = email ? "auditLog_" + email : getAuditKey();
    if (!key) return [];

    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveAuditLog(entries, email) {
  const key = email ? "auditLog_" + email : getAuditKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(entries));
}

export function logAudit(action, detail = "", email = null) {
  let targetEmail = email;

  if (!targetEmail) {
    try {
      const data = localStorage.getItem("currentUser");
      if (data) targetEmail = JSON.parse(data)?.email;
    } catch {}
  }

  if (!targetEmail && detail) {
    const match = detail.match(/^([^\s]+@[^\s]+)/);
    if (match) targetEmail = match[1];
  }

  if (!targetEmail) return;

  const entries = loadAuditLog(targetEmail);

  entries.unshift({
    id: Date.now() + Math.random(),
    time: new Date().toISOString(),
    action,
    detail,
  });

  if (entries.length > 200) entries.length = 200;

  saveAuditLog(entries, targetEmail);
}

export function getAuditEntries() {
  return loadAuditLog();
}

export async function registerUser(name, email, password) {
  if (!validatePassword(password)) {
    return { success: false, reason: "weak_password" };
  }

  // Prevent overwriting an existing account with the same email
  const existing = localStorage.getItem("user_" + email);
  if (existing) {
    return { success: false, reason: "email_taken" };
  }

  const salt = generateSalt();
  const hash = await sha256(password + salt);

  const user = {
    name,
    email,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem("user_" + email, JSON.stringify(user));

  // Pass email explicitly so audit log is saved under the right key
  logAudit("REGISTER", `New account: ${email}`, email);

  return { success: true };
}

export async function loginUser(email, password) {
  const storedData = localStorage.getItem("user_" + email);

  if (!storedData) {
    return { success: false, reason: "not_found" };
  }

  const storedUser = JSON.parse(storedData);

  const hash = await sha256(password + storedUser.salt);

  if (hash !== storedUser.passwordHash) {
    return { success: false, reason: "wrong_password" };
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(storedUser));

  logAudit("LOGIN_SUCCESS", email);

  return { success: true };
}

export function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  const user = getCurrentUser();

  if (user?.email) {
    logAudit("LOGOUT", user.email);
  }

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
}

export async function changePassword(oldPassword, newPassword) {
  const user = getCurrentUser();

  if (!user) {
    return { success: false, reason: "not_logged_in" };
  }

  const storedData = localStorage.getItem("user_" + user.email);

  if (!storedData) {
    return { success: false, reason: "not_found" };
  }

  const storedUser = JSON.parse(storedData);

  const oldHash = await sha256(oldPassword + storedUser.salt);

  if (oldHash !== storedUser.passwordHash) {
    return { success: false, reason: "wrong_password" };
  }

  if (!validatePassword(newPassword)) {
    return { success: false, reason: "weak_password" };
  }

  const newSalt = generateSalt();
  const newHash = await sha256(newPassword + newSalt);

  const updatedUser = {
    ...storedUser,
    passwordHash: newHash,
    salt: newSalt,
  };

  localStorage.setItem("user_" + user.email, JSON.stringify(updatedUser));
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  logAudit("PASSWORD_CHANGE", user.email);

  return { success: true };
}