import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminSecret from "./pages/auth/AdminSecret";
import AdminRegister from "./pages/auth/AdminRegister";

import UserDashboard from "./pages/user/UserDashboard";
import UserResume from "./pages/user/UserResume";
import JobAlerts from "./pages/user/JobAlerts";
import SavedJobs from "./pages/user/SavedJobs";
import UserAccount from "./pages/user/UserAccount";
import UploadResume from "./pages/user/UploadResume";

import AdminDashboard from "./pages/admin/AdminDashboard";
import JobVacancies from "./pages/admin/JobVacancies";
import AdminResumeScans from "./pages/admin/AdminResumeScans";
import AdminEmailLogs from "./pages/admin/AdminEmailLogs";
import AdminPreferences from "./pages/admin/AdminPreferences";
import PostJob from "./pages/admin/PostJob";

function App() {
  return (
    <div className="bg-mesh-app">
      <BrowserRouter>
        <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin-secret" element={<AdminSecret />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/resume" element={<UserResume />} />
        <Route path="/user/alerts" element={<JobAlerts />} />
        <Route path="/user/saved-jobs" element={<SavedJobs />} />
        <Route path="/user/account" element={<UserAccount />} />
        <Route path="/user/upload-resume" element={<UploadResume />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<JobVacancies />} />
        <Route path="/admin/scans" element={<AdminResumeScans />} />
        <Route path="/admin/emails" element={<AdminEmailLogs />} />
        <Route path="/admin/preferences" element={<AdminPreferences />} />
        <Route path="/admin/post-job" element={<PostJob />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;