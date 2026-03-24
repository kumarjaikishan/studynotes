import React, { useEffect } from "react";
import { Search, Edit3, Trash2, Code, FileText, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({
  isLoading,
  search,
  setIsItemModalOpen,
  setSearch,
  user,
  categoryName,
  activeCategory,
  filteredSections,
  filteredItems,
  selectedItemId,
  setSelectedItemId,
  setEditingSection,
  setIsSectionModalOpen,
  handleDeleteSection,
  isSidebarOpen,
  setIsSidebarOpen
}) => {

  const handleItemClick = (id) => {
    setSelectedItemId(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      <aside className={`fixed md:static top-16 md:top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

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
              placeholder={`Search in ${categoryName?.[0].name}...`}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Empty Sections */}
          {filteredSections?.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-10 text-slate-400">

              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                <FileText size={18} />
              </div>

              <p className="text-xs font-semibold">
                No sections yet
              </p>

              <span className="text-[11px] text-slate-400">
                Create a section to start adding items
              </span>

            </div>
          )}

          {/* Sections */}
          {filteredSections?.map((section) => {

            const sectionItems = filteredItems?.filter(
              (i) => i.sectionId === section._id
            );

            return (
              <div key={section._id} className="space-y-1">

                {/* Section Header */}
                <div className="flex items-center justify-between px-3 py-1 group">

                  <span className="text-[12px]  font-black uppercase text-slate-400 tracking-widest">
                    {section.name}
                  </span>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                    <button
                      onClick={() => {
                      setIsItemModalOpen(true)
                      }}
                        title='Add new Section'
                      className="p-1 cursor-pointer hover:text-green-500 text-slate-400"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingSection(section);
                        setIsSectionModalOpen(true);
                      }}
                      title='Edit Section'
                      className="p-1 cursor-pointer hover:text-indigo-500 text-slate-400"
                    >
                      <Edit3 size={12} />
                    </button>

                    <button
                      onClick={() => handleDeleteSection(section._id)}
                        title='Delete this Section'
                      className="p-1 cursor-pointer hover:text-rose-500 text-slate-400"
                    >
                      <Trash2 size={12} />
                    </button>

                  </div>
                </div>

                {/* Empty Items */}
                {sectionItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-2 text-slate-400">

                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1">
                      <FileText size={13} />
                    </div>

                    <p className="text-[11px] font-semibold">
                      No Topic yet
                    </p>

                  </div>
                )}

                {/* Items */}
                {sectionItems.map((item) => (

                  <button
                    key={item._id}
                    title={item.title}
                    onClick={() => handleItemClick(item._id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${
                      selectedItemId === item._id
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >

                    {item.type === "dsa"
                      ? <Code size={14} />
                      : <FileText size={14} />}

                    <span className="text-xs capitalize font-semibold truncate flex-1">
                      {item.title}
                    </span>

                    {selectedItemId === item._id && (
                      <motion.div
                        layoutId="pill"
                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                      />
                    )}

                  </button>

                ))}

              </div>
            );

          })}

          {/* Add Section */}
          {user?.userId && (
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
          )}

        </div>
      )}
      </aside>
    </>
  );
};

export default Sidebar;