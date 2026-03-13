import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./css/Login.css";

function AdminRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role: "Admin"
      });

      localStorage.setItem("user_name",  name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role",  "Admin");
      alert("Admin Registration Successful. Please Sign In.");
      navigate("/");
    } catch (err) {
      alert("Registration Failed.");
    }
  };

  return (
    <div className="auth-page-bg">
      <div className="auth-card-modern" style={{ textAlign: "center", maxWidth: '480px' }}>
        
        <div style={{
          width: '76px',
          height: '76px',
          background: '#4f46e5',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)',
          color: '#ffffff',
          transform: 'none'
        }}>
          <svg style={{width:'40px', height:'40px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>

        <div className="auth-header-modern">
          <h1 style={{color: 'var(--text-primary)'}}>Admin Portal</h1>
          <div style={{ display: 'inline-block', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '4px', letterSpacing: '0.5px' }}>
            LEVEL 1 AUTHORIZED
          </div>
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="Admin Full Name"
              type="text"
              required
              style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', fontWeight: '500' }}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
             <input
              className="form-input"
              placeholder="Official Admin Email"
              type="email"
              required
              style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', fontWeight: '500' }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
            <input
              className="form-input"
              placeholder="System Password"
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
            Register Admin
          </button>
        </form>

      </div>

       <div className="auth-copyright" style={{color: '#94a3b8'}}>
        © 2024 SecurePortal Pro • Multi-layered Protection
      </div>
    </div>
  );
}

export default AdminRegister;
