import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/userApi";

// Profile is a nested route inside Dashboard 
function Profile() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  const handleSave = async () => {
    const trimmedName = name.trim();// to remove space from the begin and end
    if (!trimmedName) return;

    try {
      await updateProfile({ name: trimmedName });
      await refreshUser();
      setError("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);//to set setsaved as false after 2sec
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to update profile");
    }
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

        {error && (
          <div className="alert-box error">
            {error}
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
