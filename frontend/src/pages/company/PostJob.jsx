import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/AdminDashboard.css"; 

function PostJob() {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [jobType, setJobType] = useState("");
  
  const [isPosting, setIsPosting] = useState(false);
  const [lastMatches, setLastMatches] = useState(null);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    setLastMatches(null);
    try {
      const res = await API.post("/company/post-job", {
        title: jobTitle,
        skills: skills,
        min_cgpa: minCgpa,
        job_type: jobType
      });
      
      if(res.data && res.data.matches) {
         setLastMatches(res.data.matches);
      }
      
      alert(res.data.message || "Job posted successfully!");
      setJobTitle("");
      setSkills("");
      setMinCgpa("");
      setJobType("");

    } catch (error) {
      console.error(error);
      alert("Failed to post job");
    } finally {
      setIsPosting(false);
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
          <Link to="/company/dashboard" className="nav-link">
            📊 Dashboard
          </Link>
          <Link to="/company/post-job" className="nav-link active">
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
          <Link to="/" style={{textDecoration: 'none'}}>
            <button className="sign-out-btn">
              🚪 Sign Out
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="admin-header-flex">
          <div className="admin-title-area">
            <h1>Create Vacancy 📢</h1>
            <p>Publish a new role to instantly trigger candidate matching 🎯</p>
          </div>
        </header>

        {/* Post Vacancy Form */}
        <div className="vacancy-form-card" style={{maxWidth: '800px', marginBottom: '2rem'}}>
          <div className="form-title">Job Details 📋</div>
          
          <form onSubmit={handlePostJob}>
            <input 
              className="admin-input" 
              placeholder="Job Title (e.g. React Developer)" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
            
            <textarea 
              className="admin-input admin-textarea" 
              placeholder="Required Skills (Comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            ></textarea>

            <div className="grid-2-cols">
              <input 
                className="admin-input" 
                placeholder="Min Check CGPA" 
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
              />
              <select 
                 className="admin-input" 
                 value={jobType} 
                 onChange={(e) => setJobType(e.target.value)}
              >
                  <option value="" disabled>Select Job Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
              </select>
            </div>

            <button type="submit" className="form-submit-dark" disabled={isPosting}>
              {isPosting ? "⏳ Matching in background..." : "✨ Upload & Trigger Matching"}
            </button>
          </form>
        </div>

        {lastMatches && (
           <div className="auth-card-modern bg-gradient-login hover-lift" style={{width: '100%', maxWidth: '800px', color: 'white', padding: '2rem'}}>
              <h3 style={{marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px'}}>Success: Job Posted</h3>
              <p style={{color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', fontSize: '0.95rem'}}>
                The system successfully indexed your job and scanned the database.
              </p>
              <div style={{background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontWeight: '800', fontSize: '1.25rem'}}>
                Found {lastMatches.length} Eligible Candidates instantly.
              </div>
              <p style={{marginTop: '1.5rem', fontSize: '0.875rem', fontWeight: 600}}>Head to Dashboard or Resume Scans to view matched user data.</p>
           </div>
        )}
      </main>
    </div>
  );
}

export default PostJob;
