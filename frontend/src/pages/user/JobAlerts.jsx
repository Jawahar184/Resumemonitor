import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/UserDashboard.css";

function JobAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/user/alerts");
      setAlerts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">RA</div>
          ResumeAlert
        </div>

        <nav className="nav-menu">
          <Link to="/user/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/user/resume" className="nav-link">📄 My Resume</Link>
          <Link to="/user/alerts" className="nav-link active">🔔 Job Alerts</Link>
          <Link to="/user/saved-jobs" className="nav-link">⭐ Saved Jobs</Link>
          <Link to="/user/account" className="nav-link">⚙️ Account</Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" style={{textDecoration: 'none'}}>
            <button className="sign-out-btn">
              🚪 Sign Out
            </button>
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header-flex">
          <div className="header-titles">
            <h1>Job Alerts 🔔</h1>
            <p>System notifications regarding new job matches for your profile. 📥</p>
          </div>
        </header>

        <div style={{maxWidth: '800px'}}>
           {alerts.map((alert) => (
             <div key={alert.id} className="hover-lift glass-panel" style={{
                borderLeft: `4px solid ${alert.type === 'Match' ? 'var(--success-color)': 'var(--secondary-color)'}`,
                padding: '1.25rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
             }}>
                <div>
                   <h3 style={{color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.125rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                     {alert.type === 'Match' ? 'High Match Alert' : 'System Notice'}
                   </h3>
                   <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{alert.message}</p>
                </div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600}}>
                  {alert.date}
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}

export default JobAlerts;
