import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./css/Login.css";
import { useToast } from "../../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter an email first to receive OTP.");
      return;
    }
    setSendingOtp(true);
    try {
      await API.post("/auth/send-otp", { email });
      toast.success("OTP sent! Please check your inbox.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        toast.error("Failed: " + err.response.data.detail);
      } else {
        toast.error("Failed to send OTP. Check backend configuration.");
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "User",
        otp
      });

      localStorage.setItem("user_name",  name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role",  "User");
      toast.success("Registration Successful. Please Sign In.");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        toast.error("Registration Failed: " + err.response.data.detail);
      } else {
        toast.error("Registration Failed.");
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

          <div className="form-group-modern" style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="form-input"
              placeholder="Email Address ✉️"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              onClick={sendOtp} 
              disabled={sendingOtp}
              style={{ padding: '0 1rem', background: 'var(--primary-light)', color: 'var(--primary-color)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              {sendingOtp ? "..." : "Get OTP"}
            </button>
          </div>

          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Enter 6-Digit OTP"
              type="text"
              required
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              style={{ letterSpacing: '2px', textAlign: 'center', fontWeight: 'bold' }}
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
