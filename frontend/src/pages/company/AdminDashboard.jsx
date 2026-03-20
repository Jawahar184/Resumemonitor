import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/AdminDashboard.css";


function AdminDashboard() {
  const adminName = localStorage.getItem("user_name") || "";
  const initials  = adminName ? adminName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "👤";

  const [stats, setStats] = useState({
    open_vacancies: 0,
    resumes_scanned: 0,
    top_matches: 0,
    alerts_sent: 0
  });
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchCandidates();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/company/dashboard-stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await API.get("/company/eligible-candidates");
      setCandidates(res.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#10b981";
    if (score >= 50) return "#3b82f6";
    return "#f59e0b";
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
          <Link to="/company/dashboard" className="nav-link active">
            📊 Dashboard
          </Link>
          <Link to="/company/post-job" className="nav-link">
            ➕ Post Job
          </Link>
          <Link to="/company/jobs" className="nav-link">
            💼 Job Vacancies
          </Link>
          <Link to="/company/scans" className="nav-link">
            🔍 Resume Scans
          </Link>
          <Link to="/company/emails" className="nav-link">
            📧 Email Logs
          </Link>
          <Link to="/company/preferences" className="nav-link">
            ⚙️ Preferences
          </Link>
        </nav>

        <div className="profile-status">
          <div className="status-header">AUTOMATED SYSTEM</div>
          <div className="status-text">
            <span>Auto-Matching</span>
            <span className="status-dot"></span>
          </div>
        </div>

        <div className="sidebar-footer">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="sign-out-btn">
              🚪 Sign Out
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="admin-header-flex">
          <div className="admin-title-area">
            <h1>Welcome, {adminName}! 🚀</h1>
            <p>Matching job criteria with user resumes in real-time. ⏱️</p>
          </div>

          <div className="header-tools">
            <Link to="/company/post-job" style={{ textDecoration: 'none' }}>
              <button className="admin-post-btn">
                <span>➕</span> Post Job Vacancy
              </button>
            </Link>
            <div className="notification-bell">
              🔔
              <span className="notification-badge">3</span>
            </div>
            <div className="user-profile-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="user-avatar" style={{ width: '36px', height: '36px', background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{initials}</div>
              <div>
                <div className="user-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{adminName}</div>
                <div className="user-status" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>ACTIVE</div>
              </div>
            </div>
          </div>
        </header>

        {/* Top Stat Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-label-row">OPEN VACANCIES</div>
            <div className="stat-value-large">{stats.open_vacancies}</div>
            <div className="stat-metric-pill pill-blue">3 added today</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label-row">RESUMES SCANNED</div>
            <div className="stat-value-large">{stats.resumes_scanned}</div>
            <div className="stat-metric-pill pill-green">Real-time Sync</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label-row">TOP MATCHES</div>
            <div className="stat-value-large">{stats.top_matches}</div>
            <div className="stat-metric-pill pill-yellow">High CGPA + Skills</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label-row">ALERTS SENT</div>
            <div className="stat-value-large">{stats.alerts_sent}</div>
            <div className="stat-metric-pill pill-purple">Auto-triggered</div>
          </div>
        </div>



        {/* Smart Tips Box */}
        <div className="auth-card-modern" style={{ width: '100%', maxWidth: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', color: 'var(--text-primary)', marginBottom: '2.5rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>System Information ℹ️</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            The algorithm matches keywords in resumes and verifies CGPA before sending an alert. Accuracy is currently at 98%. 🎯
          </p>
          <button style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem' }}>LEARN MORE</button>
        </div>

        {/* Live Eligible Candidates Table */}
        <div className="candidates-card">
          <div className="candidates-header">
            <div className="candidates-title">
              <h2>Live Eligible Candidates ⚡</h2>
              <p>Matched from real resume data against your posted jobs</p>
            </div>
            <button className="refresh-btn" onClick={() => { fetchStats(); fetchCandidates(); }}>🔄 Refresh</button>
          </div>

          {loadingCandidates ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading matched candidates…</div>
          ) : candidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No eligible candidates yet</div>
              <div style={{ fontSize: '0.85rem' }}>Post a job vacancy — the system will automatically match it against uploaded resumes.</div>
            </div>
          ) : (
            <table className="table-layout">
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>SKILL MATCH</th>
                  <th>CGPA</th>
                  <th>MATCHED SKILLS</th>
                  <th>ALERT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, index) => (
                  <tr key={index}>
                    <td>
                      <div className="candidate-profile">
                        <div className="candidate-avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                          {c.name ? c.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?"}
                        </div>
                        <div className="candidate-info">
                          <h4>{c.name || "Unknown"}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="skill-bar-container">
                        <div className="skill-bar-bg">
                          <div
                            className="skill-bar-fill"
                            style={{ width: `${c.match_score}%`, backgroundColor: getScoreColor(c.match_score) }}
                          />
                        </div>
                        <div className="skill-text" style={{ color: getScoreColor(c.match_score) }}>
                          {c.match_score}% Match
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cgpa-display">{c.cgpa || "N/A"}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(c.skills || []).slice(0, 4).map((s, i) => (
                          <span key={i} style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {c.status === "Email Sent" ? (
                        <div className="status-badge badge-green">EMAIL SENT</div>
                      ) : (
                        <div className="status-badge badge-red">PENDING</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;
