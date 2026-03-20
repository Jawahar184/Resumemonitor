import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./css/Login.css";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if(!role) {
        alert("Please choose a role");
        return;
      }
      
      const res = await API.post("/auth/login", {
        email,
        password,
        role
      });

      // Check if the backend confirmed success
      if (res.data && res.data.message === "Login success") {
         localStorage.setItem("user_name",  res.data.name  || "");
         localStorage.setItem("user_email", res.data.email || "");
         const actualRole = res.data.role || role;
         localStorage.setItem("user_role", actualRole);
         
         if (actualRole === "Admin") {
           navigate("/admin/dashboard");
         } else if (actualRole === "Company") {
           navigate("/company/dashboard");
         } else {
           navigate("/user/dashboard");
         }
      } else if (res.data && res.data.message === "Invalid role") {
         alert(`Login Failed: This account is not registered as a ${role}.`);
      } else {
         alert("Login Failed: Incorrect email or password.");
      }

    } catch (err) {
      alert("Login Failed: Incorrect email or password.");
    }
  };

  return (
    <div
      className="auth-page-bg bg-gradient-login"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(30,41,59,0.60)), url(${process.env.PUBLIC_URL}/login-bg.png)`
      }}
    >
      <div className="auth-card-modern">
        <div className="auth-header-modern">
          <h1>Sign In 🔐</h1>
          <p>Please enter your details to sign in 📝</p>
        </div>
        
        <form onSubmit={handleLogin}>
          
          <div className="form-group-modern">
            <label className="form-label">
              Select Role 🎭
            </label>
            <select 
              className="form-input" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>Choose a role...</option>
              <option value="User">User</option>
              <option value="Company">Company</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-group-modern">
            <label className="form-label">
              Email Address ✉️
            </label>
            <input
              className="form-input"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-modern">
             <label className="form-label">
              Password 🔑
              <Link to="#" className="forgot-password-link">Forgot? ❓</Link>
            </label>
            <input
              className="form-input"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-submit-btn" type="submit">
            Sign In 🚀
          </button>
        </form>

        <div className="auth-footer-text">
          Don't have an account? <Link to="/register" className="auth-footer-link" style={{color: 'var(--secondary-color)'}}>Sign up</Link>
        </div>
      </div>
      
      <div className="auth-copyright">
        © 2024 SecurePortal Inc. All rights reserved.
      </div>
    </div>
  );
}

export default Login;