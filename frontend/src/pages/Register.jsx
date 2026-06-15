import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const registerUser = async (e) => {
    e.preventDefault();

    const name = user.name.trim();
    const email = user.email.trim().toLowerCase();
    const password = user.password.trim();

    if (!name || !email || !password) {
      alert("Please enter name, email and password");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        ...user,
        name,
        email,
        password,
      });

      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-blob-1 animate-float-slow"></div>
        <div className="ambient-blob-2 animate-float-medium"></div>
      </div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl animate-fade-in-up relative overflow-hidden group">
        {/* Decorative top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-cyan to-primary-blue"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan mb-4 animate-pulse-slow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Join us to search, find, and apply for top careers
          </p>
        </div>

        <form onSubmit={registerUser} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
              placeholder="John Doe"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
              type="email"
              placeholder="john@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
              type="password"
              placeholder="••••••••"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-slate-950 font-bold bg-gradient-to-r from-primary-cyan to-primary-blue hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/5 pt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-primary-cyan hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
