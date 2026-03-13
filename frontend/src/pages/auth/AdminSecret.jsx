import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

function AdminSecret() {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if(secretKey === "ADMIN123") {
      navigate("/admin-register");
    } else {
      alert("Invalid Admin Secret Key");
    }
  };

  return (
    <div className="auth-page-bg">
      <div className="auth-card-modern" style={{ textAlign: "center" }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          background: '#0f172a',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
          color: '#fbbf24'
        }}>
          <svg style={{width:'36px', height:'36px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>

        <div className="auth-header-modern">
          <h1 style={{color: 'var(--text-primary)'}}>Restricted Access</h1>
          <p>Enter the Admin Secret Key to proceed</p>
        </div>
        
        <form onSubmit={handleVerify}>
          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Secret Key (Try: ADMIN123)"
              type="password"
              required
              style={{ textAlign: 'center', fontWeight: '600', letterSpacing: '1px', padding: '0.75rem 1rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <button 
            className="auth-submit-btn" 
            type="submit" 
            style={{ backgroundColor: 'var(--primary-color)', padding: '0.75rem', marginTop: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
          >
            Verify Identity
          </button>
        </form>

        <div className="auth-footer-text" style={{marginTop: '1.5rem'}}>
          <button 
            onClick={() => navigate("/")} 
            style={{background:'none', border:'none', color:'var(--text-secondary)', fontWeight:'600', cursor:'pointer'}}
          >
            Go Back
          </button>
        </div>
      </div>

       <div className="auth-copyright" style={{color: '#64748b'}}>
        © 2024 SecurePortal Pro • Multi-layered Protection
      </div>
    </div>
  );
}

export default AdminSecret;
