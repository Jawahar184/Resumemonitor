import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/AdminDashboard.css"; 

function JobVacancies() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/admin/jobs");
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">RA</div>
          ResumeAlert
        </div>

        <nav className="nav-menu">
          <Link to="/admin/dashboard" className="nav-link">
            📊 Dashboard
          </Link>
          <Link to="/admin/post-job" className="nav-link">
            ➕ Post Job
          </Link>
          <Link to="/admin/jobs" className="nav-link active">
            💼 Job Vacancies
          </Link>
          <Link to="/admin/scans" className="nav-link">
            🔍 Resume Scans
          </Link>
          <Link to="/admin/emails" className="nav-link">
            📧 Email Logs
          </Link>
          <Link to="/admin/preferences" className="nav-link">
            ⚙️ Preferences
          </Link>
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
            <h1>Job Vacancies 💼</h1>
            <p>All active job posts looking for candidates 🔎</p>
          </div>
          <div className="header-tools">
             <Link to="/admin/dashboard" style={{textDecoration: 'none'}}>
               <button className="admin-post-btn">
                 <span>+</span> Post New
               </button>
             </Link>
          </div>
        </header>

        <div className="candidates-card">
          <table className="table-layout">
            <thead>
              <tr>
                <th>JOB TITLE</th>
                <th>REQUIRED SKILLS</th>
                <th>TYPE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{fontWeight: 700, color: 'var(--text-primary)'}}>{job.title}</div>
                  </td>
                  <td>
                    <div className="badges-row">
                      {job.skills ? job.skills.split(',').slice(0, 3).map((s, i) => (
                         <span key={i} className="tech-badge" style={{background: 'var(--primary-light)', color: 'var(--primary-hover)'}}>{s.trim()}</span>
                      )) : "None"}
                    </div>
                  </td>
                  <td>
                    <div className="stat-metric-pill pill-blue">{job.job_type || "Full Time"}</div>
                  </td>
                  <td>
                    <button style={{padding: '0.25rem 0.5rem', background: '#fee2e2', color: 'var(--danger-color)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600}}>
                      Remove 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No vacancies posted yet.</div>}
        </div>
      </main>
    </div>
  );
}

export default JobVacancies;
