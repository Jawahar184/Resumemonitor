import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/UserDashboard.css";
import "./css/UploadResume.css";


function UserDashboard() {
  const userName  = localStorage.getItem("user_name")  || "";
  const initials  = userName ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "👤";
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const validateFile = (f) => {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (![".pdf", ".docx", ".doc"].includes(ext))
      return "Only PDF and DOCX files are allowed.";
    if (f.size > 5 * 1024 * 1024) return "File exceeds 5 MB limit.";
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) { setError(err); setFile(null); return; }
    setError(""); setResult(null); setFile(f);
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setProgress(0); setError("");
    const ticker = setInterval(() => setProgress((p) => p < 80 ? p + 10 : p), 200);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/user/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      clearInterval(ticker); setProgress(100);
      setResult(res.data.parsed);
      showToast("✅ Resume parsed and saved!");
    } catch (e) {
      clearInterval(ticker); setProgress(0);
      setError(e.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Toast */}
      {toast && <div className="ur-toast">{toast}</div>}

      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">UP</div>
          UserPortal
        </div>

        <nav className="nav-menu">
          <Link to="/user/dashboard" className="nav-link active">🏠 Dashboard</Link>
          <Link to="/user/resume" className="nav-link">📄 My Resume</Link>
          <Link to="/user/alerts" className="nav-link">🔔 Job Alerts</Link>
          <Link to="/user/saved-jobs" className="nav-link">⭐ Saved Jobs</Link>
          <Link to="/user/account" className="nav-link">⚙️ Account</Link>
        </nav>

        <div className="profile-status">
          <div className="status-header">PROFILE STATUS</div>
          <div className="status-text">
            <span>Scan Ready</span>
            <span className="status-dot"></span>
          </div>
          <div className="status-bar">
            <div className="status-fill"></div>
          </div>
        </div>

        <div className="sidebar-footer">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="sign-out-btn">🚪 Sign Out</button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header-flex">
          <div className="header-titles">
            <h1>Welcome, {userName}! 👋</h1>
            <p>Find your dream job matching your expertise.</p>
          </div>

          <div className="header-tools">
            <div className="notification-bell">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="notification-badge">2</span>
            </div>
            <div className="user-profile-btn">
              <div className="user-avatar">{initials}</div>
              <div>
                <div className="user-name">{userName}</div>
                <div className="user-status">ACTIVE</div>
              </div>
            </div>
          </div>
        </header>

        {/* Top Stat Cards */}
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-header">
              <div className="stat-icon stat-icon-pink">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div className="stat-title">RESUMES<br />UPLOADED</div>
            </div>
            <div className="stat-number">1</div>
          </div>

          <div className="stat-box">
            <div className="stat-header">
              <div className="stat-icon stat-icon-blue">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="stat-title">JOB MATCHES</div>
            </div>
            <div className="stat-number">12</div>
          </div>

          <div className="stat-box">
            <div className="stat-header">
              <div className="stat-icon stat-icon-yellow">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="stat-title">ALERTS RECEIVED</div>
            </div>
            <div className="stat-number">8</div>
          </div>
        </div>

        {/* ── Inline Upload Resume Card ─────────────────────────────────── */}
        <div className="update-resume-card">
          <div className="card-title">📝 Upload Resume</div>

          {/* Drop Zone */}
          <div
            className={`drop-zone${dragActive ? " drag-active" : ""}`}
            style={{ cursor: "pointer", position: "relative" }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
            />

            {file ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <span style={{ fontSize: "1.75rem" }}>
                  {file.name.endsWith(".pdf") ? "📄" : "📝"}
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{file.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  className="ur-remove-btn"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); setProgress(0); }}
                >✕</button>
              </div>
            ) : (
              <>
                <div className="drop-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="drop-text">Drag & Drop or Click to Browse</div>
                <div className="drop-subtext">PDF, DOCX &bull; Max 5 MB</div>
              </>
            )}
          </div>

          {/* Error */}
          {error && <div className="ur-error" style={{ marginTop: "0.75rem" }}>⚠️ {error}</div>}

          {/* Progress */}
          {uploading && (
            <div className="ur-progress-wrap" style={{ marginTop: "0.75rem" }}>
              <div className="ur-progress-bar">
                <div className="ur-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="ur-progress-label">Parsing… {progress}%</span>
            </div>
          )}

          {/* Upload Button */}
          {file && !result && (
            <button
              className="ur-upload-btn"
              style={{ marginTop: "0.75rem" }}
              disabled={uploading}
              onClick={handleUpload}
            >
              {uploading ? "⏳ Uploading & Parsing…" : "🚀 Upload & Extract Data"}
            </button>
          )}

          {/* Parsed Results */}
          {result ? (
            <>
              <div className="extracted-profile" style={{ marginTop: "1rem" }}>
                <div className="ep-title">🧠 EXTRACTED PROFILE</div>

                {/* Contact row */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {result.name && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      👤 <strong>{result.name}</strong>
                    </span>
                  )}
                  {result.email && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      ✉️ {result.email}
                    </span>
                  )}
                  {result.phone && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      📞 {result.phone}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {result.skills && result.skills.length > 0 && (
                  <div className="badges-row">
                    {result.skills.map((s, i) => (
                      <span key={i} className="tech-badge">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* CGPA */}
              {result.cgpa && (
                <div className="cgpa-row">
                  <div className="cgpa-label">🎓 System Verified CGPA:</div>
                  <div className="cgpa-value">{result.cgpa}</div>
                </div>
              )}

              {/* Education & Experience (compact) */}
              {result.education && result.education.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>
                    🏫 Education
                  </div>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                    {result.education.slice(0, 3).map((e, i) => (
                      <li key={i} style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="ur-saved-note" style={{ marginTop: "0.75rem" }}>
                ✅ All data saved to database. <Link to="/user/resume" style={{ color: "var(--primary-color)" }}>View Full Resume →</Link>
              </div>
            </>
          ) : !file && (
            /* Placeholder when no file yet */
            <>
              <div className="extracted-profile">
                <div className="ep-title">EXTRACTED PROFILE</div>
                <div className="badges-row">
                  <span className="tech-badge">React.js</span>
                  <span className="tech-badge">Tailwind CSS</span>
                  <span className="tech-badge">FastAPI</span>
                  <span className="tech-badge">MongoDB</span>
                </div>
              </div>
              <div className="cgpa-row">
                <div className="cgpa-label">System Verified CGPA:</div>
                <div className="cgpa-value">3.85</div>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}

export default UserDashboard;