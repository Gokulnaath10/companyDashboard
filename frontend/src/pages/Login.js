import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";

function Login({ onLoginSuccess }) {
const navigate = useNavigate();
const { login } = useAuth();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setError("");

setLoading(true);
try {
  await login(email, password);
  setLoading(false);

  if (onLoginSuccess) {
    onLoginSuccess();
  } else {
    navigate("/dashboard");
  }
} catch (apiError) {
  setLoading(false);
  setError(apiError.response?.data?.message || "Incorrect email or password.");
}
};

return ( <div className="auth-page"> <div className="auth-card"> <h2>Welcome back</h2> <p className="subtitle">Sign in to your account</p>

    {error && <div className="alert-box error">⚠ {error}</div>}

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email</label>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>

    <div className="auth-link">
      Don’t have an account? <Link to="/register">Create one</Link>
    </div>
  </div>
</div>
);
}
export default Login;
