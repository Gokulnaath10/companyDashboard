import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import PasswordInput from "../components/PasswordInput";
import { register } from "../api/authApi";

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

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailValid = emailRegex.test(email);

  const emailError =
    emailTouched && email && !emailValid
      ? "Enter a valid email (e.g. user@company.com)"
      : "";

  // Password validation rules
  const pwRules = {
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    length: password.length >= 8,
  };

  const pwAllValid = Object.values(pwRules).every(Boolean);
  const pwError = pwTouched && password && !pwAllValid;

  // Confirm password
  const pwMatch = password === confirmPw && confirmPw.length > 0;
  const confirmError = confirmTouched && confirmPw && !pwMatch;

  // Form validity
  const formValid = name.trim() && emailValid && pwAllValid && pwMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    setLoading(true);
    setError("");

    let result;

    try {
      result = await register({
        name: name.trim(),
        email,
        password,
      });
    } catch (apiError) {
      setLoading(false);
      setError(apiError.response?.data?.message || "Failed to create account.");
      return;
    }

    setLoading(false);

    if (result.user) {
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="subtitle">Join your team workspace</p>

        {success && <div className="alert-box success">✓ {success}</div>}
        {error && <div className="alert-box error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={
                  emailTouched && email
                    ? emailValid
                      ? "input-success"
                      : "input-error"
                    : ""
                }
                required
              />
            </div>

            {emailError && (
              <div className="validation-msg error">{emailError}</div>
            )}

            {emailTouched && emailValid && (
              <div className="validation-msg success">Valid email</div>
            )}
          </div>

          {/* Password */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPwTouched(true);
            }}
            placeholder="Create a strong password"
            error={pwError}
            success={pwTouched && pwAllValid}
          />

          {pwTouched && password && (
            <div className="pw-checklist">
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

          {/* Confirm Password */}
          <div style={{ marginTop: pwTouched && password ? 12 : 0 }}>
            <PasswordInput
              label="Confirm Password"
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                setConfirmTouched(true);
              }}
              placeholder="Re-enter password"
              error={confirmError}
              success={confirmTouched && pwMatch}
            />
          </div>

          {confirmError && (
            <div className="validation-msg error">
              Passwords do not match
            </div>
          )}

          {confirmTouched && pwMatch && (
            <div className="validation-msg success">
              Passwords match
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!formValid || loading}
            style={{ marginTop: 16 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <div className="auth-link">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
