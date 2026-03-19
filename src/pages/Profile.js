import { useState } from "react";
import { getCurrentUser } from "../utils/auth";

// Profile is a nested route inside Dashboard 
function Profile() {
  const user = getCurrentUser();

  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmedName = name.trim();// to remove space from the begin and end
    if (!trimmedName) return;

    const updatedUser = {
      ...user,
      name: trimmedName,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("user_" + user.email, JSON.stringify(updatedUser));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);//to set setsaved as false after 2sec
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account details</p>
      </div>

      <div className="settings-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            className="user-avatar"
            style={{ width: 72, height: 72, fontSize: 26 }}
          >
            {initials}
          </div>

          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {user?.name}
            </div>

            <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {user?.email}
            </div>

            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>

        {saved && (
          <div className="alert-box success">
            ✓ Profile updated
          </div>
        )}

        <h3>Edit Profile</h3>

        <div className="profile-form-row">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="profile-form-row">
          <label>Email</label>
          <input
            value={user?.email || ""}
            disabled
            style={{ opacity: 0.5 }}
          />
        </div>

        <button className="btn-save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </>
  );
}

export default Profile;