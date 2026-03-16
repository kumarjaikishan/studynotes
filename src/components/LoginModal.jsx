import { useState } from "react";
import { motion } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";

export const LoginModal = ({ isOpen, onClose, onLogin }) => {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onLogin(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
      >

        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">

          <h2 className="text-xl font-bold dark:text-white">
            Login
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="dark:text-white" />
          </button>

        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Login
          </button>

        </div>

      </motion.div>

    </div>
  );
};