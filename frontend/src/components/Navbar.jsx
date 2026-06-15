import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <Link to="/jobs" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-cyan to-primary-blue flex items-center justify-center text-slate-950 font-bold shadow-md shadow-primary-cyan/20 group-hover:scale-105 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.224-1.007-2.25-2.25-2.25H5.625c-1.243 0-2.25 1.026-2.25 2.25m16.5 0V9.697a2.25 2.25 0 0 0-.705-1.623l-2.79-2.648a2.25 2.25 0 0 0-1.59-.652H8.72a2.25 2.25 0 0 0-1.59.652l-2.79 2.648a2.25 2.25 0 0 0-.705 1.623V14.15" />
            </svg>
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:text-primary-cyan transition-colors duration-300">
            JobPortal
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/jobs"
            className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-1.5 ${
              isActive("/jobs")
                ? "text-primary-cyan"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Jobs
            {isActive("/jobs") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-cyan rounded-full animate-fade-in"></span>
            )}
          </Link>

          <Link
            to="/applications"
            className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-1.5 ${
              isActive("/applications")
                ? "text-primary-cyan"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Applications
            {isActive("/applications") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-cyan rounded-full animate-fade-in"></span>
            )}
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Hamburger Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-3 animate-fade-in-down">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide ${
              isActive("/jobs")
                ? "bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Jobs
          </Link>

          <Link
            to="/applications"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide ${
              isActive("/applications")
                ? "bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            My Applications
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-sm font-bold transition-all duration-300 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
