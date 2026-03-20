import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./css/Login.css";

function CompanyRegister() {
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
        role: "Company"
      });

      localStorage.setItem("user_name",  name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role",  "Company");
      alert("Company Registration Successful. Please Sign In.");
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
      <div className="auth-card-modern" style={{ textAlign: "center", maxWidth: '480px' }}>
        
        <div style={{
          width: '76px',
          height: '76px',
          background: '#059669',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.4)',
          color: '#ffffff'
        }}>
          <svg style={{width:'40px', height:'40px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>

        <div className="auth-header-modern">
          <h1 style={{color: 'var(--text-primary)'}}>Company Portal</h1>
          <div style={{ display: 'inline-block', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '4px', letterSpacing: '0.5px' }}>
            PARTNER AUTHORIZED
          </div>
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Company Name"
              type="text"
              required
              style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', fontWeight: '500' }}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
             <input
              className="form-input"
              placeholder="Corporate Email"
              type="email"
              required
              style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', fontWeight: '500' }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Account Password"
              type="password"
              required
              style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', fontWeight: '500' }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            className="auth-submit-btn" 
            type="submit" 
            style={{ backgroundColor: 'var(--primary-color)', padding: '0.75rem', marginTop: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
          >
            Register Company
          </button>
        </form>

      </div>
    </div>
  );
}

export default CompanyRegister;
