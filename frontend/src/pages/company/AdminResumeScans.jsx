import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/AdminDashboard.css"; 

function AdminResumeScans() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [scans, setScans] = useState([]);
  const [minScore, setMinScore] = useState(50);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Job Match Notification");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchMatches(selectedJob);
      const jobObj = jobs.find(j => j.id === selectedJob);
      if (jobObj) {
        setEmailSubject(`Job Match Alert: ${jobObj.title}`);
        setEmailBody(`Congratulations! You are a strong match for our open position: ${jobObj.title}.\n\nPlease check our careers portal to proceed with your application.`);
      }
    } else {
      setScans([]);
    }
  }, [selectedJob, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/company/jobs");
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchMatches = async (jobId) => {
    try {
      const res = await API.get(`/company/job-matches/${jobId}`);
      setScans(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendEmails = async () => {
    setSending(true);
    try {
      const res = await API.post("/company/send-emails", {
        job_id: selectedJob,
        min_score: minScore,
        subject: emailSubject,
        body: emailBody
      });
      alert(res.data.message);
      setShowModal(false);
      // Refresh matches to update Status
      fetchMatches(selectedJob);
    } catch (e) {
      console.error(e);
      alert("Failed to send emails. Make sure your backend .env is properly configured.");
    } finally {
      setSending(false);
    }
  };

  const handleSendSingleEmail = async (candidateEmail) => {
    const jobObj = jobs.find(j => j.id === selectedJob);
    if (!jobObj) return;
    
    try {
      const res = await API.post("/company/send-emails", {
        job_id: selectedJob,
        min_score: 0, // sending specifically to them, ignore threshold guard
        specific_email: candidateEmail,
        subject: `Job Match Alert: ${jobObj.title}`,
        body: `Congratulations! You are a strong match for our open position: ${jobObj.title}.\n\nPlease check our careers portal to proceed with your application.`
      });
      alert(res.data.message);
      fetchMatches(selectedJob);
    } catch (e) {
      console.error(e);
      alert("Failed to send email. Make sure your backend .env is properly configured.");
    }
  };

  const filteredScans = scans.filter(s => s.match_score >= minScore);

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
            <p>Filter candidates matching your job requirements and dispatch emails 📊</p>
          </div>
          {selectedJob && (
             <div className="header-tools">
               <button 
                 className="admin-post-btn"
                 onClick={() => setShowModal(true)}
                 disabled={filteredScans.length === 0}
                 style={{ opacity: filteredScans.length === 0 ? 0.5 : 1 }}
               >
                 📧 Draft & Send Emails ({filteredScans.length})
               </button>
             </div>
          )}
        </header>

         <div className="candidates-card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Select Job Post</label>
                <select 
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }}
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">-- Choose a Job --</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
              
              {selectedJob && (
                 <div style={{ flex: 1, minWidth: "250px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Minimum Match Score ({minScore}%)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={minScore} 
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                 </div>
              )}
            </div>
         </div>

         {selectedJob && (
           <div className="candidates-card">
            <table className="table-layout">
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>EMAIL</th>
                  <th>MATCH SCORE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan, i) => (
                  <tr key={i}>
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
                            style={{width: `${scan.match_score}%`, backgroundColor: scan.match_score >= 70 ? 'var(--success-color)' : '#f59e0b'}}
                          ></div>
                        </div>
                        <div className="skill-text" style={{color: scan.match_score >= 70 ? 'var(--success-color)' : '#f59e0b'}}>{scan.match_score}% Match</div>
                      </div>
                    </td>
                    <td>
                      {scan.status === "Email Sent" ? (
                         <div className="stat-metric-pill pill-green">Sent ✅</div>
                      ) : (
                         <div className="stat-metric-pill" style={{background: '#f3f4f6', color: '#4b5563'}}>Pending</div>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleSendSingleEmail(scan.email)}
                        style={{
                          padding: '0.4rem 0.8rem', 
                          background: 'var(--primary-color)', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        Send Mail 📧
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredScans.length === 0 && <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No candidates found for this matching threshold.</div>}
           </div>
         )}
         
         {!selectedJob && (
            <div className="candidates-card" style={{textAlign: 'center', padding: '4rem', color: 'var(--text-muted)'}}>
              Please select a job from the dropdown above to view matched candidates.
            </div>
         )}
      </main>

      {/* Email Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
             background: "#fff", padding: "2rem", borderRadius: "12px", width: "90%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{marginTop: 0, marginBottom: "1.5rem"}}>Compose Email</h2>
            
            <div style={{marginBottom: "1rem"}}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Subject</label>
              <input 
                type="text" 
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            
            <div style={{marginBottom: "1.5rem"}}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Body</label>
              <textarea 
                rows={6}
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd", resize: "vertical" }}
              />
            </div>
            
            <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem"}}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #ddd", background: "#f9fafb", cursor: "pointer", fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendEmails}
                disabled={sending}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "var(--primary-color)", color: "#fff", cursor: "pointer", fontWeight: 600, opacity: sending ? 0.7 : 1 }}
              >
                {sending ? "Sending..." : `Send to ${filteredScans.length} Candidates`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResumeScans;
