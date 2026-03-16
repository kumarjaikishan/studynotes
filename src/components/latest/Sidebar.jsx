import React from "react";
import { Search, Edit3, Trash2, Code, FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({
  isLoading,
  search,
  setSearch,
  activeCategory,
  filteredSections,
  filteredItems,
  selectedItemId,
  setSelectedItemId,
  setEditingSection,
  setIsSectionModalOpen,
  handleDeleteSection
}) => {

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (

        <div className="p-4 space-y-6">

          {/* Search */}
          <div className="relative group px-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search in ${activeCategory?.toUpperCase()}...`}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-1">

              <div className="flex items-center justify-between px-3 py-1 group">

                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {section.name}
                </span>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  <button
                    onClick={() => {
                      setEditingSection(section);
                      setIsSectionModalOpen(true);
                    }}
                    className="p-1 hover:text-indigo-500 text-slate-400"
                  >
                    <Edit3 size={12} />
                  </button>

                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-1 hover:text-rose-500 text-slate-400"
                  >
                    <Trash2 size={12} />
                  </button>

                </div>
              </div>

              {filteredItems
                .filter((i) => i.sectionId === section.id)
                .map((item) => (

                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${
                      selectedItemId === item.id
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >

                    {item.type === "dsa"
                      ? <Code size={14} />
                      : <FileText size={14} />}

                    <span className="text-xs font-semibold truncate flex-1">
                      {item.title}
                    </span>

                    {selectedItemId === item.id && (
                      <motion.div
                        layoutId="pill"
                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                      />
                    )}

                  </button>
                ))}

            </div>
          ))}

          <button
            onClick={() => {
              setEditingSection(null);
              setIsSectionModalOpen(true);
            }}
            className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <Plus size={14} />
            Add Section
          </button>

        </div>
      )}
    </aside>
  );
};

export default Sidebar;