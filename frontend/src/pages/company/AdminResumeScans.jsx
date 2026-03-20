import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/AdminDashboard.css"; 

function AdminResumeScans() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await API.get("/company/scans");
      setScans(res.data);
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
          <Link to="/company/dashboard" className="nav-link">📊 Dashboard</Link>
          <Link to="/company/post-job" className="nav-link">➕ Post Job</Link>
          <Link to="/company/jobs" className="nav-link">💼 Job Vacancies</Link>
          <Link to="/company/scans" className="nav-link active">🔍 Resume Scans</Link>
          <Link to="/company/emails" className="nav-link">📧 Email Logs</Link>
          <Link to="/company/preferences" className="nav-link">⚙️ Preferences</Link>
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
        <header className="admin-header-flex">
           <div className="admin-title-area">
            <h1>Candidate Resume Scans 🔍</h1>
            <p>Database of all registered users and their average match score 📊</p>
          </div>
        </header>

         <div className="candidates-card">
          <table className="table-layout">
            <thead>
              <tr>
                <th>CANDIDATE</th>
                <th>EMAIL</th>
                <th>SYS AVG MATCH</th>
                <th>LAST SCANNED</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan, i) => (
                <tr key={scan.id}>
                  <td>
                    <div style={{fontWeight: 700, color: 'var(--text-primary)'}}>{scan.name}</div>
                  </td>
                  <td>
                    <div style={{color: 'var(--text-secondary)'}}>{scan.email}</div>
                  </td>
                  <td>
                    <div className="skill-bar-container">
                      <div className="skill-bar-bg">
                        <div 
                          className="skill-bar-fill" 
                          style={{width: `${scan.avg_match}%`, backgroundColor: scan.avg_match > 70 ? 'var(--success-color)' : '#f59e0b'}}
                        ></div>
                      </div>
                      <div className="skill-text" style={{color: scan.avg_match > 70 ? 'var(--success-color)' : '#f59e0b'}}>{scan.avg_match}% Avg</div>
                    </div>
                  </td>
                  <td>
                    <div className="stat-metric-pill pill-green">{scan.scanned_date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
      </main>
    </div>
  );
}

export default AdminResumeScans;
