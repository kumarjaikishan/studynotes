import React from "react";
import { Terminal, Plus, Sun, Moon, LogIn, LogOut } from "lucide-react";

export default function Navbar({
  theme,
  handleToggleTheme,
  setEditingItem,
  setShowLogin,
  setUser,
  setIsItemModalOpen,
  categories,
  user,
  activeCategory,
  setActiveCategory,
  setSearch,
  setSelectedItemId,
  setIsCategoryModalOpen
}) {

  return (
    <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 flex items-center px-6 justify-between">

      {/* Left */}
      <div className="flex items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Terminal size={18} />
          </div>

          <h1 className="text-lg font-black dark:text-white uppercase tracking-tighter">
            Vault
          </h1>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">

          <select
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              setSearch("");
              setSelectedItemId(null);
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold dark:text-white outline-none"
          >
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Add Category */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} />
          </button>

        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {user?.isadmin ? (
          <button
            onClick={() => setUser(null)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
          >
            <LogOut size={16} />
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <LogIn size={16} />
            Login
          </button>
        )}

        {/* New Entry */}
        <button
          onClick={() => {
            setEditingItem(null);
            setIsItemModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          New Entry
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === "dark"
            ? <Sun size={20} className="text-white" />
            : <Moon size={20} className="text-slate-600" />}
        </button>

      </div>

    </nav>
  );
}