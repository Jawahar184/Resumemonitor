import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/AdminDashboard.css"; 

function AdminEmailLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/admin/emails");
      setLogs(res.data);
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
          <Link to="/admin/dashboard" className="nav-link">📊 Dashboard</Link>
          <Link to="/admin/post-job" className="nav-link">➕ Post Job</Link>
          <Link to="/admin/jobs" className="nav-link">💼 Job Vacancies</Link>
          <Link to="/admin/scans" className="nav-link">🔍 Resume Scans</Link>
          <Link to="/admin/emails" className="nav-link active">📧 Email Logs</Link>
          <Link to="/admin/preferences" className="nav-link">⚙️ Preferences</Link>
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
            <h1>System Email Logs 📧</h1>
            <p>History of automated job match alerts sent to candidates 📜</p>
          </div>
        </header>

         <div className="candidates-card">
          <table className="table-layout">
            <thead>
              <tr>
                <th>RECIPIENT</th>
                <th>SUBJECT</th>
                <th>TIMESTAMP</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{log.recipient}</div>
                  </td>
                  <td>
                    <div style={{color: 'var(--text-secondary)'}}>{log.subject}</div>
                  </td>
                  <td>
                    <div style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{log.timestamp}</div>
                  </td>
                  <td>
                    <div className={`status-badge ${log.status === 'Delivered' ? 'badge-green' : 'badge-red'}`}>
                      {log.status === 'Delivered' ? 'DELIVERED' : 'FAILED'}
                    </div>
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

export default AdminEmailLogs;
