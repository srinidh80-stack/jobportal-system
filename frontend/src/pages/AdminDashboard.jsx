import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  applied:      { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/25",     dot: "bg-sky-400"     },
  selected:     { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  approved:     { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  hired:        { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  interviewing: { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/25",  dot: "bg-violet-400"  },
  rejected:     { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/25",    dot: "bg-rose-400"    },
  declined:     { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/25",    dot: "bg-rose-400"    },
  default:      { bg: "bg-slate-500/10",   text: "text-slate-400",   border: "border-slate-500/20",   dot: "bg-slate-400"   },
};
function getStatus(status) {
  return STATUS_CONFIG[(status || "").toLowerCase()] || STATUS_CONFIG.default;
}

// Hardcoded users (extend as more users register)
const KNOWN_USERS = [
  { id: 1, name: "User #1", email: "user@jobportal.com" },
];

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, subtext }) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-start gap-4 hover:border-white/10 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-3xl font-extrabold text-white">{value}</p>
        <p className="text-slate-400 text-sm font-medium mt-0.5">{label}</p>
        {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className={`px-5 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-sm ${
        toast.type === "success"
          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
          : "bg-rose-950/90 text-rose-300 border-rose-500/30"
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
          {toast.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-emerald-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-rose-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <p className="text-sm font-semibold leading-tight">{toast.message}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [userApplications, setUserApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState(1);
  const [updatingId, setUpdatingId] = useState(null); // tracks which app is being updated
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, ...appResults] = await Promise.all([
        API.get("/jobs"),
        ...KNOWN_USERS.map((u) =>
          API.get(`/applications/user/${u.id}`).catch(() => ({ data: [] }))
        ),
      ]);
      setJobs(jobsRes.data || []);
      const appsMap = {};
      KNOWN_USERS.forEach((u, i) => { appsMap[u.id] = appResults[i]?.data || []; });
      setUserApplications(appsMap);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("role");
    navigate("/");
  };

  // ── Approve / Reject ────────────────────────────────────────────────────────
  const updateStatus = async (app, newStatus) => {
    setUpdatingId(app.id);
    try {
      await API.put(`/applications/status/${app.id}?status=${newStatus}`);

      // Optimistically update local state for instant UI feedback
      setUserApplications((prev) => {
        const updated = { ...prev };
        updated[app.userId] = (updated[app.userId] || []).map((a) =>
          a.id === app.id ? { ...a, status: newStatus } : a
        );
        return updated;
      });

      showToast(
        `Application #${app.id} ${newStatus === "Selected" ? "approved ✅" : "rejected ❌"} successfully.`,
        newStatus === "Selected" ? "success" : "error"
      );
    } catch (err) {
      showToast("Failed to update status. Please try again.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const getJobById = (jobId) => jobs.find((j) => j.id === jobId);

  const allApps       = Object.values(userApplications).flat();
  const totalApplied  = allApps.length;
  const totalSelected = allApps.filter((a) => ["selected","hired","approved"].includes((a.status||"").toLowerCase())).length;
  const totalRejected = allApps.filter((a) => ["rejected","declined"].includes((a.status||"").toLowerCase())).length;
  const totalPending  = allApps.filter((a) => (a.status||"").toLowerCase() === "applied").length;

  const activeUserApps = userApplications[activeUserId] || [];
  const activeUser     = KNOWN_USERS.find((u) => u.id === activeUserId);

  return (
    <div className="min-h-screen page-container">
      <div className="ambient-glow-wrapper">
        <div className="ambient-blob-1 animate-float-slow" />
        <div className="ambient-blob-2 animate-float-medium" />
      </div>

      <Toast toast={toast} />

      {/* ── Admin Navbar ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-primary-purple flex items-center justify-center shadow-md shadow-violet-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-extrabold text-white">Admin Dashboard</span>
              <p className="text-xs text-violet-400 font-medium">JobPortal Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-300 text-xs font-bold">admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-sm font-semibold transition-all duration-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
        {/* Page title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-slow" />
            Admin Panel
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Portal Overview</h1>
          <p className="text-slate-400 mt-2 text-sm">Approve or reject user applications. Changes are reflected instantly for the user.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm animate-pulse-slow">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* ── Stats ──────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total Jobs" value={jobs.length} color="bg-primary-cyan/10 text-primary-cyan" subtext="Active listings"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.224-1.007-2.25-2.25-2.25H5.625c-1.243 0-2.25 1.026-2.25 2.25m16.5 0V9.697a2.25 2.25 0 0 0-.705-1.623l-2.79-2.648a2.25 2.25 0 0 0-1.59-.652H8.72a2.25 2.25 0 0 0-1.59.652l-2.79 2.648a2.25 2.25 0 0 0-.705 1.623V14.15" /></svg>}
              />
              <StatCard label="Pending Review" value={totalPending} color="bg-sky-500/10 text-sky-400" subtext="Awaiting decision"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
              />
              <StatCard label="Approved" value={totalSelected} color="bg-emerald-500/10 text-emerald-400" subtext="Selected candidates"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
              />
              <StatCard label="Rejected" value={totalRejected} color="bg-rose-500/10 text-rose-400" subtext="Declined applications"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
              />
            </div>

            {/* ── Two-column layout ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT — Users + Jobs ──────────────────────────────────────────── */}
              <div className="lg:col-span-1 flex flex-col gap-5">

                {/* Users */}
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-violet-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <h2 className="text-sm font-bold text-white">Registered Users</h2>
                    <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{KNOWN_USERS.length}</span>
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    {KNOWN_USERS.map((user) => {
                      const appCount = (userApplications[user.id] || []).length;
                      const isActive = activeUserId === user.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => setActiveUserId(user.id)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                            isActive ? "bg-violet-500/15 border border-violet-500/30" : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isActive ? "bg-gradient-to-br from-violet-500 to-primary-purple text-white" : "bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 text-primary-cyan"
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-bold truncate ${isActive ? "text-violet-300" : "text-white"}`}>{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${appCount > 0 ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-slate-500/10 text-slate-500"}`}>
                            {appCount} app{appCount !== 1 ? "s" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Jobs list */}
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary-cyan">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.224-1.007-2.25-2.25-2.25H5.625c-1.243 0-2.25 1.026-2.25 2.25m16.5 0V9.697a2.25 2.25 0 0 0-.705-1.623l-2.79-2.648a2.25 2.25 0 0 0-1.59-.652H8.72a2.25 2.25 0 0 0-1.59.652l-2.79 2.648a2.25 2.25 0 0 0-.705 1.623V14.15" />
                    </svg>
                    <h2 className="text-sm font-bold text-white">All Job Listings</h2>
                    <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{jobs.length}</span>
                  </div>
                  <div className="p-3 flex flex-col gap-1 max-h-64 overflow-y-auto">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all duration-200">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 flex items-center justify-center text-xs font-bold text-primary-cyan flex-shrink-0">
                          {(job.company || "?").charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                          <p className="text-xs text-slate-500 truncate">{job.company}</p>
                        </div>
                        <span className="text-xs text-slate-600 font-mono flex-shrink-0">#{job.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT — Applications with approve/reject ─────────────────────── */}
              <div className="lg:col-span-2">
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">

                  {/* Header */}
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-primary-purple flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {activeUser?.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">{activeUser?.name}</h2>
                      <p className="text-xs text-slate-500">{activeUser?.email}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {activeUserApps.length} Application{activeUserApps.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {activeUserApps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-semibold mb-1">No applications yet</p>
                      <p className="text-slate-500 text-sm">This user hasn't applied to any roles.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {activeUserApps.map((app, idx) => {
                        const job       = getJobById(app.jobId);
                        const sc        = getStatus(app.status);
                        const isUpdating = updatingId === app.id;
                        const isPending  = (app.status || "").toLowerCase() === "applied";
                        const isApproved = ["selected","hired","approved"].includes((app.status || "").toLowerCase());
                        const isRejected = ["rejected","declined"].includes((app.status || "").toLowerCase());

                        return (
                          <div
                            key={app.id}
                            style={{ animationDelay: `${idx * 40}ms` }}
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-all duration-200 animate-fade-in-up ${
                              isUpdating ? "opacity-60 pointer-events-none" : ""
                            }`}
                          >
                            {/* Company avatar + job info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-cyan/15 to-primary-blue/15 border border-white/8 flex items-center justify-center text-sm font-bold text-primary-cyan flex-shrink-0">
                                {(job?.company || "?").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">
                                  {job ? job.title : `Job #${app.jobId}`}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {job ? job.company : "Unknown"}
                                  {job?.description && <span className="text-slate-600"> · {job.description}</span>}
                                </p>
                              </div>
                            </div>

                            {/* Status + action buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                              {/* Status badge */}
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse-slow`} />
                                {app.status || "Applied"}
                              </span>

                              {/* Approve / Reject buttons */}
                              {isUpdating ? (
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 px-2">
                                  <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                                  Updating...
                                </div>
                              ) : (
                                <>
                                  {/* Approve button — hidden if already approved */}
                                  {!isApproved && (
                                    <button
                                      id={`approve-btn-${app.id}`}
                                      onClick={() => updateStatus(app, "Selected")}
                                      title="Approve this application"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_10px_rgba(52,211,153,0.2)] transition-all duration-200 cursor-pointer"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                      </svg>
                                      Approve
                                    </button>
                                  )}

                                  {/* Reject button — hidden if already rejected */}
                                  {!isRejected && (
                                    <button
                                      id={`reject-btn-${app.id}`}
                                      onClick={() => updateStatus(app, "Rejected")}
                                      title="Reject this application"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all duration-200 cursor-pointer"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                      </svg>
                                      Reject
                                    </button>
                                  )}

                                  {/* Revert to Pending — only when already decided */}
                                  {(isApproved || isRejected) && (
                                    <button
                                      id={`reset-btn-${app.id}`}
                                      onClick={() => updateStatus(app, "Applied")}
                                      title="Reset to pending"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-all duration-200 cursor-pointer"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                      </svg>
                                      Reset
                                    </button>
                                  )}
                                </>
                              )}

                              <span className="text-xs text-slate-600 font-mono">#{app.id}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Per-user mini stats */}
                {activeUserApps.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {[
                      { label: "Pending",  count: activeUserApps.filter((a) => (a.status||"").toLowerCase() === "applied").length, color: "text-sky-400" },
                      { label: "Interviewing", count: activeUserApps.filter((a) => ["interviewing","interview"].includes((a.status||"").toLowerCase())).length, color: "text-violet-400" },
                      { label: "Approved", count: activeUserApps.filter((a) => ["selected","hired","approved"].includes((a.status||"").toLowerCase())).length, color: "text-emerald-400" },
                      { label: "Rejected", count: activeUserApps.filter((a) => ["rejected","declined"].includes((a.status||"").toLowerCase())).length, color: "text-rose-400" },
                    ].map((s) => (
                      <div key={s.label} className="glass-panel rounded-xl p-4 border border-white/5 text-center">
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.count}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
