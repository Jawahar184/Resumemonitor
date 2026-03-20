import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

function CompanySecret() {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if(secretKey === "COMP123") {
      navigate("/company-register");
    } else {
      alert("Invalid Company Secret Key");
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
          <svg style={{width:'36px', height:'36px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>

        <div className="auth-header-modern">
          <h1 style={{color: 'var(--text-primary)'}}>Partner Access</h1>
          <p>Enter the Company Secret Key to proceed</p>
        </div>
        
        <form onSubmit={handleVerify}>
          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Secret Key (Try: COMP123)"
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
    </div>
  );
}

export default CompanySecret;
