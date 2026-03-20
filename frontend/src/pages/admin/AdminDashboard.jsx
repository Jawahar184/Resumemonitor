import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "../../pages/company/css/AdminDashboard.css";

function GlobalAdminDashboard() {
  const adminName = localStorage.getItem("user_name") || "Admin";
  const initials  = adminName ? adminName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "👤";

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const statsRes = await API.get("/admin/dashboard-stats");
        setStats(statsRes.data);

        const usersRes = await API.get("/admin/all-users");
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      }
    };
    fetchGlobalStats();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">RA</div>
          ResumeAlert
        </div>

        <nav className="nav-menu">
          <Link to="/admin/dashboard" className="nav-link active">
            📊 Global Stats
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="sign-out-btn" onClick={() => localStorage.clear()}>
              🚪 Sign Out
            </button>
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="admin-header-flex">
          <div className="admin-title-area">
            <h1>Global Admin Dashboard 🌍</h1>
            <p>Platform wide statistics and users</p>
          </div>
          <div className="header-tools">
            <div className="user-profile-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="user-avatar" style={{ width: '36px', height: '36px', background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{initials}</div>
              <div>
                <div className="user-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{adminName}</div>
                <div className="user-status" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>GLOBAL ADMIN</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          {stats && (
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-label-row">TOTAL USERS</div>
                <div className="stat-value-large">{stats.total_users}</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-label-row">TOTAL COMPANIES</div>
                <div className="stat-value-large">{stats.total_companies}</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-label-row">TOTAL JOBS</div>
                <div className="stat-value-large">{stats.total_jobs}</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-label-row">RESUMES UPLOADED</div>
                <div className="stat-value-large">{stats.total_resumes}</div>
              </div>
            </div>
          )}
          
          <div className="candidates-card" style={{ marginTop: "2rem" }}>
            <div className="candidates-header">
              <div className="candidates-title">
                <h2>All Users</h2>
              </div>
            </div>
            <table className="table-layout">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="candidate-profile">
                        <div className="candidate-avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                          {u.name ? u.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?"}
                        </div>
                        <div className="candidate-info">
                          <h4>{u.name || "Unknown"}</h4>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`status-badge ${u.role === 'Admin' ? 'badge-green' : 'badge-yellow'}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GlobalAdminDashboard;
