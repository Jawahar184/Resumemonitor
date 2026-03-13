import { Link } from "react-router-dom";
import "./css/AdminDashboard.css"; 

function AdminPreferences() {
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
          <Link to="/admin/emails" className="nav-link">📧 Email Logs</Link>
          <Link to="/admin/preferences" className="nav-link active">⚙️ Preferences</Link>
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
            <h1>System Preferences ⚙️</h1>
            <p>Global configurations for algorithm matching and notifications 🛠️</p>
          </div>
        </header>

         <div className="candidates-card">
           <div className="grid-2-cols" style={{marginBottom: '2rem'}}>
             <div>
               <h3 style={{marginBottom: '1rem'}}>AI Matching Threshold 🤖</h3>
               <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem'}}>
                 Set the minimum system average match required before an alert is triggered automatically.
               </p>
               <input type="range" min="50" max="100" defaultValue="80" style={{width: '100%'}} />
               <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 600, color: '#3b82f6'}}>
                 <span>50%</span>
                 <span>Current: 80%</span>
                 <span>100%</span>
               </div>
             </div>
             
             <div>
               <h3 style={{marginBottom: '1rem'}}>Notification Rate Limits ⏱️</h3>
                <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem'}}>
                 Maximum emails allowed to be sent per candidate per day.
               </p>
               <select className="admin-input">
                 <option>1 Email / Day</option>
                 <option>3 Emails / Day</option>
                 <option selected>Unlimited</option>
               </select>
             </div>
           </div>

           <button className="form-submit-dark" style={{width: 'auto'}}>Save Preferences 💾</button>
         </div>
      </main>
    </div>
  );
}

export default AdminPreferences;
