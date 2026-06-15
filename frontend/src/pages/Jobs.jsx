import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingJobId, setApplyingJobId] = useState(null); // tracks which job is being submitted

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        API.get("/jobs"),
        API.get("/applications/user/1").catch(() => ({ data: [] })),
      ]);
      setJobs(jobsRes.data);
      // Build set of already-applied jobIds so the UI reflects the real DB state
      const applied = new Set((appsRes.data || []).map((a) => a.jobId));
      setAppliedJobIds(applied);
    } catch (error) {
      console.error("Error loading jobs:", error);
      showToast("Failed to load jobs. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // One-click apply — no form, just userId + jobId
  const applyJob = async (job) => {
    setApplyingJobId(job.id);
    try {
      await API.post("/applications/apply", {
        userId: 1,
        jobId: job.id,
      });
      // Optimistically update UI so the card switches to "Applied" immediately
      setAppliedJobIds((prev) => new Set([...prev, job.id]));
      showToast(`✅ Applied to "${job.title}" successfully!`, "success");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to apply. Please try again.";
      showToast(msg, "error");
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen page-container">
      {/* Ambient Background */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-blob-1 animate-float-slow" />
        <div className="ambient-blob-2 animate-float-medium" />
      </div>

      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`px-5 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30 shadow-emerald-900/20"
              : "bg-rose-950/90 text-rose-300 border-rose-500/30 shadow-rose-900/20"
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
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan text-xs font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-cyan animate-pulse-slow" />
            Live Opportunities
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-none">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-primary-cyan via-primary-blue to-primary-purple bg-clip-text text-transparent">
              Big Opportunity
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Browse top roles and apply in one click. Track every application in My Applications.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-8 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-cyan transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, company, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl text-white glass-input text-base shadow-xl placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Stats strip */}
        {!loading && (
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up">
            <span className="text-slate-400 text-sm">
              Showing{" "}
              <span className="text-primary-cyan font-bold">{filteredJobs.length}</span>{" "}
              {filteredJobs.length === 1 ? "role" : "roles"}
              {searchQuery && (
                <span> for "<span className="text-white">{searchQuery}</span>"</span>
              )}
            </span>
            {appliedJobIds.size > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-slate-400 text-sm">
                  <span className="text-emerald-400 font-bold">{appliedJobIds.size}</span> applied
                </span>
              </>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 border-4 border-primary-cyan/20 border-t-primary-cyan rounded-full animate-spin" />
            <p className="text-slate-400 text-sm animate-pulse-slow">Loading opportunities...</p>
          </div>

        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/5 max-w-lg mx-auto animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1">No results found</h3>
            <p className="text-slate-500 text-sm">Try different keywords or clear your search.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-5 px-5 py-2 rounded-xl text-sm font-semibold text-primary-cyan border border-primary-cyan/30 hover:bg-primary-cyan/10 transition-all duration-200"
            >
              Clear Search
            </button>
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job, index) => {
              const isAlreadyApplied = appliedJobIds.has(job.id);
              const isApplyingThis   = applyingJobId === job.id;

              return (
                <div
                  key={job.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`group glass-panel rounded-2xl p-6 flex flex-col justify-between border transition-all duration-400 animate-fade-in-up ${
                    isAlreadyApplied
                      ? "border-emerald-500/15 hover:border-emerald-500/25"
                      : "border-white/5 hover:border-primary-cyan/25 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,242,254,0.08)]"
                  }`}
                >
                  <div>
                    {/* Applied badge */}
                    {isAlreadyApplied && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          Applied
                        </span>
                      </div>
                    )}

                    {/* Company + Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 border border-white/10 flex items-center justify-center text-lg font-bold text-primary-cyan flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {(job.company || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-white leading-snug truncate group-hover:text-primary-cyan transition-colors duration-300">
                          {job.title}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium truncate">{job.company}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300/80 text-sm leading-relaxed mb-5 line-clamp-3">
                      {job.description || "Join a world-class team and contribute to exciting projects."}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-primary-cyan">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {job.location}
                        </span>
                      )}
                      <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20 font-medium">
                        Full Time
                      </span>
                    </div>
                  </div>

                  {/* Apply / Applied button */}
                  <div className="border-t border-white/5 pt-4">
                    {isAlreadyApplied ? (
                      <div className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Applied — View in My Applications
                      </div>
                    ) : (
                      <button
                        id={`apply-btn-${job.id}`}
                        onClick={() => applyJob(job)}
                        disabled={isApplyingThis}
                        className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-primary-cyan to-primary-blue text-slate-950 hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
                      >
                        {isApplyingThis ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            Apply Now
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
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

export default Jobs;