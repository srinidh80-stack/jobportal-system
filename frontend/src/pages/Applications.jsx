import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

// Status badge configuration
const STATUS_CONFIG = {
  applied:      { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/25",     dot: "bg-sky-400",     label: "Applied" },
  selected:     { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400", label: "Selected" },
  hired:        { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400", label: "Hired" },
  approved:     { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400", label: "Approved" },
  interviewing: { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/25",  dot: "bg-violet-400",  label: "Interviewing" },
  interview:    { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/25",  dot: "bg-violet-400",  label: "Interview" },
  rejected:     { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/25",    dot: "bg-rose-400",    label: "Rejected" },
  declined:     { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/25",    dot: "bg-rose-400",    label: "Declined" },
  default:      { bg: "bg-slate-500/10",   text: "text-slate-300",   border: "border-slate-500/20",   dot: "bg-slate-400",   label: "Pending" },
};

function getStatusConfig(status) {
  const key = (status || "").toLowerCase();
  return STATUS_CONFIG[key] || STATUS_CONFIG.default;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return null;
  }
}

// ── Single Withdraw Confirm Modal ──────────────────────────────────────────────
function ConfirmModal({ jobTitle, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative glass-panel rounded-2xl p-7 max-w-sm w-full border border-rose-500/20 shadow-2xl animate-fade-in-up">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 to-orange-500 rounded-t-2xl" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Withdraw Application?</h3>
            <p className="text-slate-400 text-xs mt-0.5">This cannot be undone</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Remove your application for <span className="text-white font-semibold">"{jobTitle}"</span> permanently from the system.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer">
            Keep It
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-500/80 hover:bg-rose-500 border border-rose-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-200 cursor-pointer">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Withdraw ALL Confirm Modal ─────────────────────────────────────────────────
function ConfirmWithdrawAllModal({ count, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!isLoading ? onCancel : undefined} />
      <div className="relative glass-panel rounded-2xl p-7 max-w-sm w-full border border-rose-500/20 shadow-2xl animate-fade-in-up">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 to-orange-500 rounded-t-2xl" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Withdraw All Applications?</h3>
            <p className="text-slate-400 text-xs mt-0.5">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          You are about to permanently withdraw{" "}
          <span className="text-rose-400 font-bold">{count} application{count !== 1 ? "s" : ""}</span>.
          All records will be removed from the system.
        </p>
        {isLoading && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/15">
            <div className="w-4 h-4 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin flex-shrink-0" />
            <p className="text-rose-300 text-xs font-medium">Withdrawing all applications...</p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-500/80 hover:bg-rose-500 border border-rose-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? "Withdrawing..." : "Withdraw All"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);       // { app, jobTitle }
  const [showWithdrawAll, setShowWithdrawAll] = useState(false);
  const [withdrawingAll, setWithdrawingAll] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, jobsRes] = await Promise.all([
        API.get("/applications/user/1"),
        API.get("/jobs").catch(() => ({ data: [] })),
      ]);
      setApplications(appsRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load applications. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Single withdraw ──────────────────────────────────────────────────────────
  const openWithdrawConfirm = (app) => {
    const job = jobs.find((j) => j.id === app.jobId);
    const jobTitle = job ? job.title : `Application #${app.id}`;
    setConfirmModal({ app, jobTitle });
  };

  const confirmWithdraw = async () => {
    if (!confirmModal) return;
    const { app } = confirmModal;
    setConfirmModal(null);
    setDeletingId(app.id);
    try {
      await API.delete(`/applications/${app.id}`);
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      showToast("Application withdrawn successfully.", "success");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to withdraw. Please try again.";
      showToast(msg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Withdraw ALL ─────────────────────────────────────────────────────────────
  const handleWithdrawAll = async () => {
    setWithdrawingAll(true);
    try {
      await Promise.all(applications.map((app) => API.delete(`/applications/${app.id}`)));
      setApplications([]);
      setShowWithdrawAll(false);
      showToast(`All ${applications.length} applications have been withdrawn.`, "success");
    } catch (error) {
      showToast("Some applications could not be withdrawn. Please try again.", "error");
    } finally {
      setWithdrawingAll(false);
    }
  };

  const getJobDetails = (jobId) => jobs.find((j) => j.id === jobId) || null;

  const statusCounts = {
    total:        applications.length,
    applied:      applications.filter((a) => (a.status || "").toLowerCase() === "applied").length,
    interviewing: applications.filter((a) => ["interviewing", "interview"].includes((a.status || "").toLowerCase())).length,
    selected:     applications.filter((a) => ["selected", "hired", "approved"].includes((a.status || "").toLowerCase())).length,
    rejected:     applications.filter((a) => ["rejected", "declined"].includes((a.status || "").toLowerCase())).length,
  };

  return (
    <div className="min-h-screen page-container">
      {/* Ambient Background */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-blob-1 animate-float-slow" />
        <div className="ambient-blob-2 animate-float-medium" />
      </div>

      <Navbar />

      {/* Single Withdraw Modal */}
      {confirmModal && (
        <ConfirmModal
          jobTitle={confirmModal.jobTitle}
          onConfirm={confirmWithdraw}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Withdraw All Modal */}
      {showWithdrawAll && (
        <ConfirmWithdrawAllModal
          count={applications.length}
          isLoading={withdrawingAll}
          onConfirm={handleWithdrawAll}
          onCancel={() => { if (!withdrawingAll) setShowWithdrawAll(false); }}
        />
      )}

      {/* Toast */}
      {toast && (
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
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan text-xs font-bold tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-cyan animate-pulse-slow" />
              My Journey
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">My Applications</h1>
            <p className="text-slate-400 mt-2 text-sm max-w-md">
              Roles you've manually applied to. Withdraw individual applications or clear all at once.
            </p>
          </div>

          {/* Right side: stats + Withdraw All button */}
          {!loading && applications.length > 0 && (
            <div className="flex flex-col items-end gap-4">
              {/* Stat pills */}
              <div className="flex gap-3 flex-wrap justify-end">
                {[
                  { label: "Total",        count: statusCounts.total,        color: "text-slate-200" },
                  { label: "Applied",      count: statusCounts.applied,      color: "text-sky-400" },
                  { label: "Interviewing", count: statusCounts.interviewing, color: "text-violet-400" },
                  { label: "Selected",     count: statusCounts.selected,     color: "text-emerald-400" },
                  { label: "Rejected",     count: statusCounts.rejected,     color: "text-rose-400" },
                ]
                  .filter((s) => s.label === "Total" || s.count > 0)
                  .map((stat) => (
                    <div key={stat.label} className="glass-panel px-4 py-2.5 rounded-xl border border-white/5 text-center min-w-[64px]">
                      <p className={`text-xl font-extrabold ${stat.color}`}>{stat.count}</p>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">{stat.label}</p>
                    </div>
                  ))}
              </div>

              {/* Withdraw All button */}
              <button
                onClick={() => setShowWithdrawAll(true)}
                id="withdraw-all-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-rose-400 border border-rose-500/25 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Withdraw All ({applications.length})
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 border-4 border-primary-cyan/20 border-t-primary-cyan rounded-full animate-spin" />
            <p className="text-slate-400 text-sm animate-pulse-slow">Loading your applications...</p>
          </div>

        ) : applications.length === 0 ? (
          /* ── Empty state ── */
          <div className="glass-panel rounded-3xl p-16 text-center max-w-xl mx-auto border border-white/5 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-10 h-10 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-200 mb-2">No applications yet</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              You haven't applied to any roles yet. Browse open positions and submit your first application!
            </p>
            <a
              href="/jobs"
              id="browse-jobs-link"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-slate-950 text-sm font-bold bg-gradient-to-r from-primary-cyan to-primary-blue hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse Jobs
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

        ) : (
          /* ── Applications Grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applications.map((app, index) => {
              const jobDetails = getJobDetails(app.jobId);
              const statusCfg = getStatusConfig(app.status);
              const isDeleting = deletingId === app.id;
              const appliedDate = formatDate(app.appliedAt || app.createdAt || app.date);

              return (
                <div
                  key={app.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`group glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/5 hover:border-white/10 transition-all duration-400 animate-fade-in-up ${
                    isDeleting ? "opacity-40 scale-95 pointer-events-none" : "hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  <div>
                    {/* Status + ID row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse-slow`} />
                        {statusCfg.label}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">#{app.id}</span>
                    </div>

                    {/* Company avatar + role */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 border border-white/10 flex items-center justify-center text-base font-bold text-primary-cyan flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {(jobDetails?.company || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base font-bold text-white leading-snug truncate">
                          {jobDetails ? jobDetails.title : `Job #${app.jobId}`}
                        </h2>
                        <p className="text-slate-400 text-sm truncate">
                          {jobDetails ? jobDetails.company : "Details unavailable"}
                        </p>
                      </div>
                    </div>

                    {/* Description snippet */}
                    {jobDetails?.description && (
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
                        {jobDetails.description}
                      </p>
                    )}

                    {/* Location + Date */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {jobDetails?.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-primary-cyan">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {jobDetails.location}
                        </div>
                      )}
                      {appliedDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          Applied {appliedDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Withdraw button */}
                  <div className="border-t border-white/5 pt-4 mt-5">
                    <button
                      id={`withdraw-btn-${app.id}`}
                      onClick={() => openWithdrawConfirm(app)}
                      disabled={isDeleting}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-300 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin" />
                          Withdrawing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Withdraw Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Applications;