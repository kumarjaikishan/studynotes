import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ManageSectionModal = ({ isOpen, onClose, onSave, section = null,categoryName, category }) => {
  const [name, setName] = useState(section?.name || '');
  const [type, setType] = useState(section?.type || 'dsa');

  useEffect(() => {
    // console.log(section)
    // console.log(category)
    if (section) {
      setName(section.name);
      setType(section.type);
    } else {
      setName('');
      setType('dsa');
    }
  }, [section, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
        <h2 className="text-lg font-bold mb-4 dark:text-white">{section ? 'Edit Section' : 'Create Section'} in {categoryName?.[0].name}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Section Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Default Template</label>
            <div className="flex gap-2">
              {['dsa', 'theory'].map(t => (
                <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${type === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">Cancel</button>
            <button onClick={() => onSave({ name, type, category })} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">Save</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};