import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user"); // "user" | "admin"

  // User login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin login state
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  // ── User Login ──────────────────────────────────────────────────────────────
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", "user");
        navigate("/jobs");
        return;
      }
      setError("Invalid credentials. Please try again.");
    } catch (err) {
      setError(err.response?.data?.message || "Wrong email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Admin Login ─────────────────────────────────────────────────────────────
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError("");
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminError("Please enter username and password.");
      return;
    }
    setAdminLoading(true);
    setTimeout(() => {
      if (
        adminUsername.trim() === ADMIN_USERNAME &&
        adminPassword === ADMIN_PASSWORD
      ) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("adminAuth", "true");
        navigate("/admin");
      } else {
        setAdminError("Invalid admin credentials.");
      }
      setAdminLoading(false);
    }, 600); // small delay for UX feel
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Glows */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-blob-1 animate-float-slow" />
        <div className="ambient-blob-2 animate-float-medium" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 border border-primary-cyan/30 text-primary-cyan mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.224-1.007-2.25-2.25-2.25H5.625c-1.243 0-2.25 1.026-2.25 2.25m16.5 0V9.697a2.25 2.25 0 0 0-.705-1.623l-2.79-2.648a2.25 2.25 0 0 0-1.59-.652H8.72a2.25 2.25 0 0 0-1.59.652l-2.79 2.648a2.25 2.25 0 0 0-.705 1.623V14.15" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to your portal account</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8 mb-6">
          <button
            onClick={() => { setActiveTab("user"); setError(""); setAdminError(""); }}
            id="tab-user"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "user"
                ? "bg-gradient-to-r from-primary-cyan to-primary-blue text-slate-950 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            User Login
          </button>
          <button
            onClick={() => { setActiveTab("admin"); setError(""); setAdminError(""); }}
            id="tab-admin"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "admin"
                ? "bg-gradient-to-r from-violet-500 to-primary-purple text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            Admin Login
          </button>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          {/* Accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
            activeTab === "admin" ? "from-violet-500 to-primary-purple" : "from-primary-cyan to-primary-blue"
          }`} />

          {/* ── USER LOGIN FORM ─────────────────────────────────── */}
          {activeTab === "user" && (
            <form onSubmit={handleUserLogin} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                id="user-login-btn"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-slate-950 font-bold bg-gradient-to-r from-primary-cyan to-primary-blue hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center text-sm text-slate-400 border-t border-white/5 pt-5">
                New to the portal?{" "}
                <Link to="/register" className="text-primary-cyan hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors">
                  Create an account
                </Link>
              </div>
            </form>
          )}

          {/* ── ADMIN LOGIN FORM ─────────────────────────────────── */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-violet-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                <p className="text-violet-300 text-xs font-medium">Restricted access — admins only</p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="admin-username">
                  Admin Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  placeholder="Enter your email"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="admin-password">
                  Admin Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                  required
                />
              </div>

              {adminError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {adminError}
                </div>
              )}

              <button
                type="submit"
                id="admin-login-btn"
                disabled={adminLoading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-primary-purple hover:from-violet-400 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(127,83,172,0.4)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {adminLoading ? "Verifying..." : "Access Admin Panel"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
