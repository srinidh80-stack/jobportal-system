import { useState } from "react";

function ApplicationFormModal({ job, onSubmit, onClose, isSubmitting }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative glass-panel rounded-3xl w-full max-w-lg border border-white/10 shadow-2xl animate-fade-in-up overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-cyan via-primary-blue to-primary-purple rounded-t-3xl" />

        {/* Header */}
        <div className="p-7 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 border border-white/10 flex items-center justify-center text-xl font-bold text-primary-cyan flex-shrink-0">
                {(job?.company || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white leading-tight">Apply for Position</h2>
                <p className="text-primary-cyan text-sm font-semibold truncate max-w-[220px]">{job?.title}</p>
                <p className="text-slate-400 text-xs">{job?.company}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mx-7" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 pt-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Name & Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 tracking-wide uppercase">
                Full Name <span className="text-primary-cyan">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2.5 rounded-xl text-sm text-white glass-input placeholder-slate-500 transition-all duration-200 ${
                  errors.name ? "border-rose-500/60 bg-rose-950/20" : ""
                }`}
              />
              {errors.name && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 tracking-wide uppercase">
                Email <span className="text-primary-cyan">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@email.com"
                className={`w-full px-4 py-2.5 rounded-xl text-sm text-white glass-input placeholder-slate-500 transition-all duration-200 ${
                  errors.email ? "border-rose-500/60 bg-rose-950/20" : ""
                }`}
              />
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 tracking-wide uppercase">
              Phone Number <span className="text-slate-500 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white glass-input placeholder-slate-500"
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 tracking-wide uppercase">
              Cover Letter <span className="text-primary-cyan">*</span>
            </label>
            <textarea
              name="coverLetter"
              value={form.coverLetter}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us why you're a great fit for this role. Describe your experience, passion, and what you'd bring to the team..."
              className={`w-full px-4 py-3 rounded-xl text-sm text-white glass-input placeholder-slate-500 resize-none leading-relaxed transition-all duration-200 ${
                errors.coverLetter ? "border-rose-500/60 bg-rose-950/20" : ""
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.coverLetter ? (
                <p className="text-rose-400 text-xs flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.coverLetter}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-slate-500 text-right">{form.coverLetter.length} chars</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-application-btn"
              className="flex-2 flex-[2] py-3 px-6 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-primary-cyan to-primary-blue hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationFormModal;
