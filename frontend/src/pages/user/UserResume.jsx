import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./css/UserDashboard.css";
import "./css/UploadResume.css";

/* ── small inline helpers ── */
const Field = ({ label, value, editMode, onChange, type = "text" }) => (
  <div className="ur-result-item">
    <div className="ur-result-label">{label}</div>
    {editMode ? (
      <input
        type={type}
        className="re-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <div className="ur-result-value">{value || <span style={{ color: "var(--text-secondary)" }}>—</span>}</div>
    )}
  </div>
);

function UserResume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [noData, setNoData]       = useState(false);

  // Edit state
  const [editMode, setEditMode]   = useState(false);
  const [form, setForm]           = useState(null);  // working copy
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState("");
  const [newSkill, setNewSkill]   = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { fetchResume(); }, []);

  const fetchResume = async () => {
    try {
      const res = await API.get("/user/resume");
      if (res.data?.message) { setNoData(true); }
      else { setResumeData(res.data); }
    } catch { setNoData(true); }
    finally { setLoading(false); }
  };

  // Enter edit mode: clone data into form
  const startEdit = () => {
    setForm({
      name:       resumeData.name       || "",
      email:      resumeData.email      || "",
      phone:      resumeData.phone      || "",
      cgpa:       resumeData.cgpa       || "",
      skills:     [...(resumeData.skills     || [])],
      education:  [...(resumeData.education  || [])],
      experience: [...(resumeData.experience || [])],
    });
    setEditMode(true);
  };

  const cancelEdit = () => { setEditMode(false); setForm(null); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await API.put("/user/resume", form);
      setResumeData((prev) => ({ ...prev, ...form }));
      setEditMode(false);
      setForm(null);
      showToast("✅ Resume updated successfully!");
    } catch {
      showToast("❌ Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Skills helpers
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s)) {
      setField("skills", [...form.skills, s]);
    }
    setNewSkill("");
  };
  const removeSkill = (i) =>
    setField("skills", form.skills.filter((_, idx) => idx !== i));

  // List helpers (education / experience)
  const updateListItem = (key, i, val) => {
    const arr = [...form[key]];
    arr[i] = val;
    setField(key, arr);
  };
  const removeListItem = (key, i) =>
    setField(key, form[key].filter((_, idx) => idx !== i));
  const addListItem = (key) =>
    setField(key, [...form[key], ""]);

  const d = editMode ? form : resumeData;

  return (
    <div className="dashboard-layout">
      {toast && <div className="ur-toast">{toast}</div>}

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">RA</div>
          ResumeAlert
        </div>
        <nav className="nav-menu">
          <Link to="/user/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/user/resume"    className="nav-link active">📄 My Resume</Link>
          <Link to="/user/alerts"    className="nav-link">🔔 Job Alerts</Link>
          <Link to="/user/saved-jobs"className="nav-link">⭐ Saved Jobs</Link>
          <Link to="/user/account"   className="nav-link">⚙️ Account</Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="sign-out-btn">🚪 Sign Out</button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-header-flex">
          <div className="header-titles">
            <h1>My Resume 📄</h1>
            <p>Your uploaded profile and extracted skill tags. 📊</p>
          </div>

          {resumeData && !loading && (
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {editMode ? (
                <>
                  <button
                    className="re-btn-save"
                    onClick={saveEdit}
                    disabled={saving}
                  >
                    {saving ? "⏳ Saving…" : "💾 Save Changes"}
                  </button>
                  <button className="re-btn-cancel" onClick={cancelEdit}>
                    ✕ Cancel
                  </button>
                </>
              ) : (
                <button className="re-btn-edit" onClick={startEdit}>
                  ✏️ Edit Resume
                </button>
              )}
            </div>
          )}
        </header>

        {loading && <p style={{ color: "var(--text-secondary)" }}>Loading resume details…</p>}

        {noData && !loading && (
          <div className="ur-card" style={{ maxWidth: "480px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📂</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>No Resume Found</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Upload your first resume to see your extracted profile here.
            </p>
            <Link to="/user/dashboard">
              <button className="ur-upload-btn">⬆️ Go to Dashboard to Upload</button>
            </Link>
          </div>
        )}

        {d && !loading && (
          <div style={{ maxWidth: "820px" }}>

            {/* ── Header info card ── */}
            <div className="update-resume-card hover-lift" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.25rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "56px", height: "56px", background: "var(--primary-light)", color: "var(--primary-color)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
                  📄
                </div>
                <div>
                  <h2 style={{ color: "var(--text-primary)", fontSize: "1.15rem" }}>
                    {editMode
                      ? <input className="re-input re-input-name" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full Name" />
                      : (d.name ? `${d.name}'s Resume` : "Uploaded Resume")
                    }
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                    File: {resumeData?.filename || "—"} &bull; {resumeData?.uploaded_at ? new Date(resumeData.uploaded_at).toLocaleString() : ""}
                  </p>
                </div>
              </div>

              {/* Contact fields */}
              <div className="ur-result-grid">
                <Field label="✉️ Email"  value={d.email} editMode={editMode} onChange={(v) => setField("email", v)} />
                <Field label="📞 Phone"  value={d.phone} editMode={editMode} onChange={(v) => setField("phone", v)} />
                <Field label="🎓 CGPA"   value={d.cgpa}  editMode={editMode} onChange={(v) => setField("cgpa",  v)} />
              </div>

              {/* Skills */}
              <div className="extracted-profile" style={{ marginTop: "1.25rem" }}>
                <div className="ep-title">🛠 SKILLS</div>
                <div className="badges-row">
                  {(editMode ? form.skills : d.skills || []).map((s, i) => (
                    <span key={i} className="tech-badge re-skill-badge">
                      {s}
                      {editMode && (
                        <button className="re-skill-remove" onClick={() => removeSkill(i)}>✕</button>
                      )}
                    </span>
                  ))}
                  {editMode && (
                    <span className="re-add-skill-wrap">
                      <input
                        className="re-input re-skill-input"
                        placeholder="Add skill…"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      />
                      <button className="re-btn-add-skill" onClick={addSkill}>+ Add</button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Education & Experience cards ── */}
            <div className="ur-page-grid">

              {/* Education */}
              <div className="ur-card">
                <div className="ur-card-title">🏫 Education</div>
                <ul className="ur-list re-list">
                  {(editMode ? form.education : d.education || []).map((e, i) => (
                    <li key={i} className={editMode ? "re-list-edit-item" : ""}>
                      {editMode ? (
                        <>
                          <input
                            className="re-input re-list-input"
                            value={e}
                            onChange={(ev) => updateListItem("education", i, ev.target.value)}
                          />
                          <button className="re-remove-item" onClick={() => removeListItem("education", i)}>✕</button>
                        </>
                      ) : e}
                    </li>
                  ))}
                </ul>
                {editMode && (
                  <button className="re-btn-add-item" onClick={() => addListItem("education")}>
                    + Add Education
                  </button>
                )}
                {!editMode && (!d.education || d.education.length === 0) && (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>No education data.</p>
                )}
              </div>

              {/* Experience */}
              <div className="ur-card">
                <div className="ur-card-title">💼 Experience</div>
                <ul className="ur-list re-list">
                  {(editMode ? form.experience : d.experience || []).map((ex, i) => (
                    <li key={i} className={editMode ? "re-list-edit-item" : ""}>
                      {editMode ? (
                        <>
                          <textarea
                            className="re-textarea"
                            value={ex}
                            rows={2}
                            onChange={(ev) => updateListItem("experience", i, ev.target.value)}
                          />
                          <button className="re-remove-item" onClick={() => removeListItem("experience", i)}>✕</button>
                        </>
                      ) : ex}
                    </li>
                  ))}
                </ul>
                {editMode && (
                  <button className="re-btn-add-item" onClick={() => addListItem("experience")}>
                    + Add Experience
                  </button>
                )}
                {!editMode && (!d.experience || d.experience.length === 0) && (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>No experience data.</p>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserResume;
