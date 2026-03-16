import React, { useState } from "react";
import {
  Plus,
  Sun,
  Moon,
  LogIn,
  LogOut,
  BookOpen,
  ChevronDown,
  Edit3,
  Trash2
} from "lucide-react";

export default function Navbar({
  theme,
  handleToggleTheme,
  setEditingItem,
  setShowLogin,
  logout,
  setIsItemModalOpen,
  categories,
  user,
  activeCategory,
  setActiveCategory,
  setSearch,
  setSelectedItemId,
  setIsCategoryModalOpen,
  setEditingCategory,
  handleDeleteCategory
}) {

  const [open, setOpen] = useState(false);

  const selectedCategory = categories?.find(
    (c) => c._id === activeCategory
  );

  return (
    <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 flex items-center px-6 justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <BookOpen size={18} />
          </div>

          <p className="text-lg font-black dark:text-white uppercase tracking-tight">
            Notes
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <div className="relative w-40">

          <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold dark:text-white hover:border-indigo-400 transition"
          >
            <span className="truncate">
              {selectedCategory?.name || "Select Category"}
            </span>

            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* CATEGORY DROPDOWN */}
          {open && (
            <div className="absolute mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden">

              {/* New Category */}
              {user?.userId &&
                <button
                  onClick={() => {
                    setIsCategoryModalOpen(true);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus size={14} />
                  New Category
                </button>
              }

              <div className="border-t border-slate-200 dark:border-slate-700" />

              {/* CATEGORY LIST */}
              {categories?.map((cat) => (

                <div
                  key={cat._id}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${activeCategory === cat._id
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                    : "text-slate-700 dark:text-slate-300"
                    }`}
                  onClick={() => {
                    setActiveCategory(cat._id);
                    setSearch("");
                    setSelectedItemId(null);
                    setOpen(false);
                  }}
                >

                  <span className="truncate font-medium">{cat.name}</span>

                  <div className="flex gap-2">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-indigo-500"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat._id);
                      }}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                </div>

              ))}

              {categories?.length === 0 && (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                  No categories found
                </div>
              )}

            </div>
          )}

        </div>

        {user?.userId ? (
          <button
            onClick={logout}
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

        {/* {user?.userId && (
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
        )} */}


        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

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