import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/UploadResume.css";

function UploadResume() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);

  const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc"];
  const MAX_MB = 5;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const validateFile = (f) => {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return "Only PDF and DOCX files are allowed.";
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_MB} MB.`;
    }
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError("");
    setResult(null);
    setFile(f);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError("");

    // Simulate smooth progress
    const ticker = setInterval(() => {
      setProgress((p) => (p < 80 ? p + 8 : p));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/user/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      clearInterval(ticker);
      setProgress(100);
      setResult(res.data.parsed);
      showToast("✅ Resume parsed and saved to database!");
    } catch (e) {
      clearInterval(ticker);
      setProgress(0);
      const msg =
        e.response?.data?.detail || "Upload failed. Please try again.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    return ext === "pdf" ? "📄" : "📝";
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">RA</div>
          ResumeAlert
        </div>
        <nav className="nav-menu">
          <Link to="/user/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/user/resume" className="nav-link">📄 My Resume</Link>
          <Link to="/user/upload-resume" className="nav-link active">⬆️ Upload Resume</Link>
          <Link to="/user/alerts" className="nav-link">🔔 Job Alerts</Link>
          <Link to="/user/saved-jobs" className="nav-link">⭐ Saved Jobs</Link>
          <Link to="/user/account" className="nav-link">⚙️ Account</Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="sign-out-btn">🚪 Sign Out</button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* Toast */}
        {toast && <div className="ur-toast">{toast}</div>}

        <header className="dashboard-header-flex">
          <div className="header-titles">
            <h1>⬆️ Upload Resume</h1>
            <p>Upload your PDF or DOCX resume — we'll extract all the important details automatically.</p>
          </div>
        </header>

        <div className="ur-page-grid">
          {/* Upload Card */}
          <div className="ur-card">
            <div className="ur-card-title">📎 Select Your Resume</div>

            {/* Drop Zone */}
            <div
              className={`ur-dropzone${dragActive ? " drag-active" : ""}${file ? " ur-dropzone--has-file" : ""}`}
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
                onChange={handleInputChange}
              />
              {file ? (
                <div className="ur-file-preview">
                  <span className="ur-file-icon">{getFileIcon(file.name)}</span>
                  <div className="ur-file-info">
                    <div className="ur-file-name">{file.name}</div>
                    <div className="ur-file-size">
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
                  <div className="ur-drop-icon">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="ur-drop-title">Drag & Drop or Click to Browse</div>
                  <div className="ur-drop-subtitle">Supports PDF, DOCX &bull; Max 5 MB</div>
                </>
              )}
            </div>

            {/* Error */}
            {error && <div className="ur-error">⚠️ {error}</div>}

            {/* Progress Bar */}
            {uploading && (
              <div className="ur-progress-wrap">
                <div className="ur-progress-bar">
                  <div className="ur-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="ur-progress-label">Parsing… {progress}%</span>
              </div>
            )}

            {/* Upload Button */}
            <button
              className="ur-upload-btn"
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? "⏳ Uploading & Parsing…" : "🚀 Upload & Extract Data"}
            </button>

            <div className="ur-hints">
              <span>✔ PDF (text-based)</span>
              <span>✔ Word DOCX</span>
              <span>✔ Auto-stored in DB</span>
            </div>
          </div>

          {/* Results Card */}
          {result && (
            <div className="ur-card ur-result-card">
              <div className="ur-card-title">🧠 Extracted Profile</div>

              <div className="ur-result-grid">
                {result.name && (
                  <div className="ur-result-item">
                    <div className="ur-result-label">👤 Name</div>
                    <div className="ur-result-value">{result.name}</div>
                  </div>
                )}
                {result.email && (
                  <div className="ur-result-item">
                    <div className="ur-result-label">✉️ Email</div>
                    <div className="ur-result-value">{result.email}</div>
                  </div>
                )}
                {result.phone && (
                  <div className="ur-result-item">
                    <div className="ur-result-label">📞 Phone</div>
                    <div className="ur-result-value">{result.phone}</div>
                  </div>
                )}
                {result.cgpa && (
                  <div className="ur-result-item">
                    <div className="ur-result-label">🎓 CGPA / GPA</div>
                    <div className="ur-result-value ur-cgpa">{result.cgpa}</div>
                  </div>
                )}
              </div>

              {result.skills && result.skills.length > 0 && (
                <div className="ur-section">
                  <div className="ur-section-title">🛠 Skills Detected</div>
                  <div className="ur-badges">
                    {result.skills.map((s, i) => (
                      <span key={i} className="tech-badge">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.education && result.education.length > 0 && (
                <div className="ur-section">
                  <div className="ur-section-title">🏫 Education</div>
                  <ul className="ur-list">
                    {result.education.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.experience && result.experience.length > 0 && (
                <div className="ur-section">
                  <div className="ur-section-title">💼 Experience</div>
                  <ul className="ur-list">
                    {result.experience.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="ur-saved-note">
                ✅ All data has been saved to the database.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UploadResume;
