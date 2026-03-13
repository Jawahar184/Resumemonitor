import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/UserDashboard.css";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/user/saved-jobs");
      setJobs(res.data);
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
          <Link to="/user/alerts" className="nav-link">🔔 Job Alerts</Link>
          <Link to="/user/saved-jobs" className="nav-link active">⭐ Saved Jobs</Link>
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
            <h1>Saved Jobs ⭐</h1>
            <p>Vacancies you have bookmarked for later application. 📌</p>
          </div>
        </header>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
          {jobs.map((job) => (
             <div key={job.id} className="hover-lift glass-panel" style={{
                padding: '1.25rem'
             }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem'}}>
                   <div>
                     <h3 style={{fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.125rem'}}>{job.title}</h3>
                     <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500}}>{job.company}</p>
                   </div>
                   <div className="status-badge badge-green">
                     {job.match}% MATCH
                   </div>
                </div>
                <button className="form-submit-dark" style={{padding: '0.75rem', fontSize: '0.85rem'}}>
                  Apply Now 🚀
                </button>
             </div>
          ))}
          {jobs.length === 0 && <p style={{color: '#94a3b8'}}>No saved jobs.</p>}
        </div>
      </main>
    </div>
  );
}

export default SavedJobs;
