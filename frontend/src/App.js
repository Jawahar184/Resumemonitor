import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminSecret from "./pages/auth/AdminSecret";
import AdminRegister from "./pages/auth/AdminRegister";
import CompanySecret from "./pages/auth/CompanySecret";
import CompanyRegister from "./pages/auth/CompanyRegister";

import UserDashboard from "./pages/user/UserDashboard";
import UserResume from "./pages/user/UserResume";
import JobAlerts from "./pages/user/JobAlerts";
import SavedJobs from "./pages/user/SavedJobs";
import UserAccount from "./pages/user/UserAccount";
import UploadResume from "./pages/user/UploadResume";

import CompanyDashboard from "./pages/company/AdminDashboard";
import JobVacancies from "./pages/company/JobVacancies";
import CompanyResumeScans from "./pages/company/AdminResumeScans";
import CompanyEmailLogs from "./pages/company/AdminEmailLogs";
import CompanyPreferences from "./pages/company/AdminPreferences";
import PostJob from "./pages/company/PostJob";

import GlobalAdminDashboard from "./pages/admin/AdminDashboard";

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <div className="bg-mesh-app">
      <ToastProvider>
        <BrowserRouter>
          <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin-secret" element={<AdminSecret />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/company-secret" element={<CompanySecret />} />
          <Route path="/company-register" element={<CompanyRegister />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/resume" element={<UserResume />} />
          <Route path="/user/alerts" element={<JobAlerts />} />
          <Route path="/user/saved-jobs" element={<SavedJobs />} />
          <Route path="/user/account" element={<UserAccount />} />
          <Route path="/user/upload-resume" element={<UploadResume />} />

          {/* Company Routes */}
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/jobs" element={<JobVacancies />} />
          <Route path="/company/scans" element={<CompanyResumeScans />} />
          <Route path="/company/emails" element={<CompanyEmailLogs />} />
          <Route path="/company/preferences" element={<CompanyPreferences />} />
          <Route path="/company/post-job" element={<PostJob />} />

          {/* Global Admin Route */}
          <Route path="/admin/dashboard" element={<GlobalAdminDashboard />} />

          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;