import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./css/Login.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "User"
      });

      localStorage.setItem("user_name",  name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role",  "User");
      alert("Registration Successful. Please Sign In.");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        alert("Registration Failed: " + err.response.data.detail);
      } else {
        alert("Registration Failed.");
      }
    }
  };

  return (
    <div className="auth-page-bg">
      <div className="auth-card-modern" style={{ textAlign: "center" }}>

        <div style={{
          width: '64px',
          height: '64px',
          background: '#ffffff',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          fontSize: '2rem',
          color: 'var(--text-secondary)'
        }}>
          <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        </div>

        <div className="auth-header-modern">
          <h1 style={{ color: 'var(--text-primary)' }}>Create Account ✨</h1>
          <p>Register as a new candidate 📝</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Full Name 👤"
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Email Address ✉️"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Create Password 🔒"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="auth-submit-btn"
            type="submit"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Register 🚀
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account? <Link to="/" className="auth-footer-link" style={{ color: 'var(--secondary-color)' }}>Sign In</Link>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/company-secret" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              🏢 SECURE COMPANY REGISTRATION
            </Link>
            <Link to="/admin-secret" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              🛡️ SECURE ADMIN REGISTRATION
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
