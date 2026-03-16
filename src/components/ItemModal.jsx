import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Plus, X, Trash2 } from "lucide-react";

export const ItemModal = ({
  isOpen,
  onClose,
  onSave,
  sections,
  activeCategory,
  editingItem = null
}) => {

  const [data, setData] = useState({
    title: "",
    sectionId: "",
    category: activeCategory,
    description: "",
    difficulty: "Easy",
    type: "dsa",
    solutions: [{ id: "1", label: "Standard", code: "" }],
    answer: ""
  });

  // useEffect(() => {
  //   if (editingItem) {
  //     setData({ ...editingItem });
  //   } else {
  //     setData({
  //       title: "",
  //       sectionId: sections?.[0]?._id || "",
  //       category: activeCategory,
  //       description: "",
  //       difficulty: "Easy",
  //       type: sections?.[0]?.type || "dsa",
  //       solutions: [{ id: "1", label: "Standard", code: "" }],
  //       answer: ""
  //     });
  //   }
  // }, [editingItem, isOpen, sections, activeCategory]);

  useEffect(() => {
  if (!isOpen) return;
  console.log(sections)

  if (editingItem) {
    setData(editingItem);
  } else {
    setData({
      title: "",
      sectionId: sections?.[0]?._id || "",
      category: activeCategory,
      description: "",
      difficulty: "Easy",
      type: sections?.[0]?.type || "dsa",
      solutions: [{ _id: crypto.randomUUID(), label: "Standard", code: "" }],
      answer: ""
    });
  }
}, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSolutionChange = (id, field, value) => {
    // console.log(id, field, value)
    setData({
      ...data,
      solutions: data.solutions.map(s =>
        s._id === id ? { ...s, [field]: value } : s
      )
    });
  };

  const addSolution = () => {
    setData({
      ...data,
      solutions: [
        ...data.solutions,
        {
          id: Date.now().toString(),
          label: `Method ${data.solutions.length + 1}`,
          code: ""
        }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl"
      >

        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">

          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            {editingItem
              ? <Edit3 size={20} className="text-indigo-500" />
              : <Plus size={20} className="text-indigo-500" />}
            {/* {editingItem ? "Edit" : "Add"} to {activeCategory.toUpperCase()} */}
            {editingItem ? "Edit" : "Add"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="dark:text-white" />
          </button>

        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

          {/* Title + Section */}
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                Title
              </label>

              <input
                value={data.title}
                onChange={e =>
                  setData({ ...data, title: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="col-span-2 md:col-span-1">

              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                Section
              </label>

              <select
                value={data.sectionId}
                onChange={e => {
                  const sec = sections.find(s => s._id === e.target.value);
                  setData({
                    ...data,
                    sectionId: e.target.value,
                    type: sec?.type || "dsa"
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
              >

                {sections.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Description
            </label>

            <textarea
              value={data.description}
              onChange={e =>
                setData({ ...data, description: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* DSA Solutions */}
          {data.type === "dsa" ? (

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Solutions
                </label>

                <button
                  onClick={addSolution}
                  className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} />
                  Add Method
                </button>
              </div>

              {data.solutions.map(sol => (

                <div
                  key={sol._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                >

                  <div className="flex items-center gap-3">

                    <input
                      value={sol.label}
                      onChange={e =>
                        handleSolutionChange(sol._id, "label", e.target.value)
                      }
                      className="bg-transparent font-bold dark:text-white outline-none text-sm border-b border-indigo-500/20 focus:border-indigo-500"
                      placeholder="Label"
                    />

                    {data.solutions.length > 1 && (
                      <button
                        onClick={() =>
                          setData({
                            ...data,
                            solutions: data.solutions.filter(
                              s => s._id !== sol._id
                            )
                          })
                        }
                        className="text-rose-500 ml-auto"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                  </div>

                  <textarea
                    value={sol.code}
                    onChange={e =>
                      handleSolutionChange(sol._id, "code", e.target.value)
                    }
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="// Code goes here..."
                  />

                </div>

              ))}

            </div>

          ) : (

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                Explanation
              </label>

              <textarea
                value={data.answer}
                onChange={e =>
                  setData({ ...data, answer: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none leading-relaxed focus:ring-1 focus:ring-indigo-500"
                placeholder="Explanation..."
              />
            </div>

          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(data)}
            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            {editingItem ? "Update" : "Create"}
          </button>

        </div>

      </motion.div>

    </div>
  );
};