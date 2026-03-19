import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser, changePassword } from "../utils/auth";
import PasswordInput from "../components/PasswordInput";
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
function Settings({ theme, onToggleTheme, onLogout }) {
  const user = getCurrentUser();
  const isDark = theme === "dark";
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwTouched, setPwTouched] = useState(false);//used to avoid showing validation early
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });//to store the msg like success,password changed successfully
  const [loading, setLoading] = useState(false);
  const pwRules = {
    upper: /[A-Z]/.test(newPw),
    lower: /[a-z]/.test(newPw),
    number: /[0-9]/.test(newPw),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPw),
    length: newPw.length >= 8,
  };
  const pwAllValid = Object.values(pwRules).every(Boolean);
  const pwMatch = newPw === confirmPw && confirmPw.length > 0;
  const formValid = oldPw.length > 0 && pwAllValid && pwMatch;
  const handleChangePassword = async () => {
    if (!formValid) return;

    setLoading(true);
    setPwMsg({ type: "", text: "" });//to clr previous msg

    const result = await changePassword(oldPw, newPw);

    setLoading(false);

    if (result.success) {
      setPwMsg({ type: "success", text: "Password changed successfully!" });
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
      setPwTouched(false);
      setConfirmTouched(false);
    } 
    else if (result.reason === "wrong_password") {
      setPwMsg({ type: "error", text: "Current password is incorrect." });
    } 
    else if (result.reason === "weak_password") {
      setPwMsg({ type: "error", text: "New password does not meet security rules." });
    } 
    else {
      setPwMsg({ type: "error", text: "Something went wrong." });
    }
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your preferences & security</p>
        </div>

        <div className="settings-card">
          <h3>Profile</h3>

          <div className="setting-row">
            <span className="setting-label">Name</span>
            <span style={{ fontWeight: 600 }}>{user?.name || "—"}</span>
          </div>

          <div className="setting-row">
            <span className="setting-label">Email</span>
            <span style={{ fontWeight: 600 }}>{user?.email || "—"}</span>
          </div>
        </div>

        <div className="settings-card">
          <h3>Appearance</h3>

          <div className="setting-row">
            <span className="setting-label">Dark Mode</span>

            <button
              className={`toggle-switch ${isDark ? "on" : ""}`}
              onClick={onToggleTheme}
            />
          </div>
        </div>

        <div className="settings-card">
          <h3>Change Password</h3>

          {pwMsg.text && (
            <div className={`alert-box ${pwMsg.type}`} style={{ marginBottom: 16 }}>
              {pwMsg.type === "success" ? "✓" : "⚠"} {pwMsg.text}
            </div>
          )}

          <div style={{ maxWidth: 400 }}>

            <PasswordInput
              label="Current Password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              placeholder="Enter your current password"
            />

            <PasswordInput
              label="New Password"
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                setPwTouched(true);
              }}
              placeholder="Enter new password"
              error={pwTouched && newPw && !pwAllValid}
              success={pwTouched && pwAllValid}
            />

            {pwTouched && newPw && (
              <div className="pw-checklist" style={{ marginBottom: 12 }}>
                <span className={pwRules.upper ? "met" : ""}>
                  {pwRules.upper ? <CheckIcon /> : <XIcon />} Uppercase
                </span>

                <span className={pwRules.lower ? "met" : ""}>
                  {pwRules.lower ? <CheckIcon /> : <XIcon />} Lowercase
                </span>

                <span className={pwRules.number ? "met" : ""}>
                  {pwRules.number ? <CheckIcon /> : <XIcon />} Number
                </span>

                <span className={pwRules.special ? "met" : ""}>
                  {pwRules.special ? <CheckIcon /> : <XIcon />} Special char
                </span>

                <span className={pwRules.length ? "met" : ""}>
                  {pwRules.length ? <CheckIcon /> : <XIcon />} 8+ chars
                </span>
              </div>
            )}

            <PasswordInput
              label="Confirm New Password"
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                setConfirmTouched(true);
              }}
              placeholder="Re-enter new password"
              error={confirmTouched && confirmPw && !pwMatch}
              success={confirmTouched && pwMatch}
            />

            {confirmTouched && confirmPw && !pwMatch && (
              <div className="validation-msg error">Passwords do not match</div>
            )}

            {confirmTouched && pwMatch && (
              <div className="validation-msg success">Passwords match</div>
            )}

            <button
              className="btn-save"
              onClick={handleChangePassword}
              disabled={!formValid || loading}
              style={{ marginTop: 12 }}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;