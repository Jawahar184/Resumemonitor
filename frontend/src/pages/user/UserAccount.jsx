import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./css/UserDashboard.css";

function UserAccount() {
  const [account, setAccount] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const res = await API.get("/user/account");
      setAccount(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
     navigate("/");
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">RA</div>
          ResumeAlert
        </div>

        <nav className="nav-menu">
          <Link to="/user/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/user/resume" className="nav-link">My Resume</Link>
          <Link to="/user/alerts" className="nav-link">Job Alerts</Link>
          <Link to="/user/saved-jobs" className="nav-link">Saved Jobs</Link>
          <Link to="/user/account" className="nav-link active">Account</Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" style={{textDecoration: 'none'}}>
            <button className="sign-out-btn">
              Sign Out
            </button>
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header-flex">
          <div className="header-titles">
            <h1>Account Settings</h1>
            <p>Manage your login details and platform preferences.</p>
          </div>
        </header>

         <div className="update-resume-card hover-lift" style={{maxWidth: '600px'}}>
             <div style={{marginBottom: '1.5rem'}}>
               <p style={{color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'}}>Display Name</p>
               <input className="admin-input" style={{marginTop: '0.5rem', width: '100%', marginBottom: 0}} value={account.name || ""} readOnly />
             </div>

             <div style={{marginBottom: '2rem'}}>
               <p style={{color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'}}>Email Address</p>
               <input className="admin-input" style={{marginTop: '0.5rem', width: '100%', marginBottom: 0}} value={account.email || ""} readOnly />
             </div>
             
             <div className="grid-2-cols" style={{marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                 <div className="hover-lift glass-panel" style={{padding: '1.25rem'}}>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'}}>Status</p>
                  <p style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-color)', marginTop: '0.25rem'}}>{account.status}</p>
                </div>
                <div className="hover-lift glass-panel" style={{padding: '1.25rem'}}>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'}}>Member Since</p>
                  <p style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem'}}>{account.member_since}</p>
                </div>
             </div>

             <button onClick={logout} className="sign-out-btn" style={{padding: '0.75rem'}}>
                Logout
             </button>
         </div>
      </main>
    </div>
  );
}

export default UserAccount;
