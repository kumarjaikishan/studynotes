import React, { useState, useMemo, useEffect } from 'react';
import {
  Sun, Moon, Plus, Search, Code2, Copy, Check,
  Trash2, ChevronRight, Terminal, BookOpen,
  Sparkles, Edit3, Type, Layers, MoreVertical, X,
  FileText, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlight, themes } from "prism-react-renderer";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";

// --- Default Data Structures ---
const INITIAL_SECTIONS = [
  { id: 'sec-1', name: 'Algorithms', type: 'dsa' },
  { id: 'sec-2', name: 'JavaScript', type: 'theory' },
  { id: 'sec-3', name: 'React', type: 'theory' },
];

const INITIAL_ITEMS = [
  {
    id: 'item-1',
    sectionId: 'sec-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Find two numbers that add up to a specific target.',
    solutions: [
      { id: 'sol-1', label: 'Brute Force', code: 'function twoSum(nums, target) {\n  for(let i=0; i<nums.length; i++) {\n    for(let j=i+1; j<nums.length; j++) {\n      if(nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n}' },
      { id: 'sol-2', label: 'Hash Map', code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const complement = target - nums[i];\n    if(map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}' }
    ],
    type: 'dsa'
  },
  {
    id: 'item-2',
    sectionId: 'sec-2',
    title: 'What is a Closure?',
    description: 'Explain the concept of closures in JavaScript.',
    answer: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives a function access to its outer scope.',
    type: 'theory'
  }
];

// --- Helper Functions ---
const formatCode = (code) => {
  let indent = 0;
  return code.split('\n').map(line => {
    line = line.trim();
    if (line.match(/[}\]]/)) indent = Math.max(0, indent - 1);
    const formatted = '  '.repeat(indent) + line;
    if (line.match(/[{[]/)) indent++;
    return formatted;
  }).join('\n');
};

// --- Sub-Components ---



const CodeWindow = ({ code, onFormat }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = (formattedCode) => {
    setItems(items.map(item => {
      if (item.id === selectedItemId && item.solutions) {
        return {
          ...item,
          solutions: item.solutions.map(sol =>
            sol.id === activeSolutionId
              ? { ...sol, code: formattedCode }
              : sol
          )
        };
      }
      return item;
    }));
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl bg-[#0d1117] border border-slate-800 w-full">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleFormat}
            className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
          >
            <Sparkles size={14} /> Format
          </button>

          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white"
          >
            {copied ? (
              <Check size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Code Area with Syntax Highlight */}
      <Highlight theme={themes.vsDark} code={code} language="javascript">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 overflow-x-auto text-sm font-mono"
            style={{ ...style, background: "#0d1117" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-10 text-slate-600 select-none">
                  {i + 1}
                </span>

                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

// --- Modals ---

const ManageSectionModal = ({ isOpen, onClose, onSave, section = null }) => {
  const [name, setName] = useState(section?.name || '');
  const [type, setType] = useState(section?.type || 'dsa');

  useEffect(() => {
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
        <h2 className="text-lg font-bold mb-4 dark:text-white">{section ? 'Edit Section' : 'Create New Section'}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Section Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Type</label>
            <div className="flex gap-2">
              {['dsa', 'theory'].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${type === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">Cancel</button>
            <button onClick={() => onSave({ name, type })} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">Save Section</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ItemModal = ({ isOpen, onClose, onSave, sections, editingItem = null }) => {
  const [data, setData] = useState({
    title: '',
    sectionId: '',
    description: '',
    difficulty: 'Easy',
    type: 'dsa',
    solutions: [{ id: '1', label: 'Method 1', code: '' }],
    answer: ''
  });

  useEffect(() => {
    if (editingItem) {
      setData({ ...editingItem });
    } else {
      setData({
        title: '',
        sectionId: sections[0]?.id || '',
        description: '',
        difficulty: 'Easy',
        type: sections[0]?.type || 'dsa',
        solutions: [{ id: '1', label: 'Method 1', code: '' }],
        answer: ''
      });
    }
  }, [editingItem, isOpen, sections]);

  if (!isOpen) return null;

  const handleSolutionChange = (id, field, value) => {
    setData({
      ...data,
      solutions: data.solutions.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const addSolution = () => {
    setData({
      ...data,
      solutions: [...data.solutions, { id: Date.now().toString(), label: `Method ${data.solutions.length + 1}`, code: '' }]
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            {editingItem ? <Edit3 size={20} className="text-indigo-500" /> : <Plus size={20} className="text-indigo-500" />}
            {editingItem ? 'Edit Content' : 'Add New Content'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} className="dark:text-white" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Title</label>
              <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none" placeholder="e.g. Binary Search" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Section</label>
              <select
                value={data.sectionId}
                onChange={e => {
                  const sec = sections.find(s => s.id === e.target.value);
                  setData({ ...data, sectionId: e.target.value, type: sec?.type || 'dsa' });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none"
              >
                {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Description</label>
            <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none" placeholder="Short summary of the topic..." />
          </div>

          {data.type === 'dsa' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase">Solutions</label>
                <button onClick={addSolution} className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline"><Plus size={14} /> Add Method</button>
              </div>
              {data.solutions.map((sol, idx) => (
                <div key={sol.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <input value={sol.label} onChange={e => handleSolutionChange(sol.id, 'label', e.target.value)} className="bg-transparent font-bold dark:text-white outline-none text-sm border-b border-indigo-500/20 focus:border-indigo-500 text-left" placeholder="Solution Label" />
                    {data.solutions.length > 1 && (
                      <button onClick={() => setData({ ...data, solutions: data.solutions.filter(s => s.id !== sol.id) })} className="text-rose-500 ml-auto"><Trash2 size={16} /></button>
                    )}
                  </div>
                  <textarea value={sol.code} onChange={e => handleSolutionChange(sol.id, 'code', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-mono text-sm outline-none text-left" placeholder="// Paste your solution code..." />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Answer Statement</label>
              <textarea value={data.answer} onChange={e => setData({ ...data, answer: e.target.value })} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none leading-relaxed text-left" placeholder="Write down the explanation here..." />
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={() => onSave(data)} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
            {editingItem ? 'Update Changes' : 'Create Entry'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState(INITIAL_ITEMS[0].id);
  const [activeSolutionId, setActiveSolutionId] = useState(INITIAL_ITEMS[0].solutions?.[0]?.id);
  const [search, setSearch] = useState('');

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const filteredItems = useMemo(() => {
    return items.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const currentItem = useMemo(() =>
    items.find(i => i.id === selectedItemId) || items[0]
    , [items, selectedItemId]);

  useEffect(() => {
    if (currentItem?.solutions?.length > 0 && !activeSolutionId) {
      setActiveSolutionId(currentItem.solutions[0].id);
    }
  }, [currentItem, activeSolutionId]);

  // Section Handlers
  const handleSaveSection = (data) => {
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection.id ? { ...s, ...data } : s));
    } else {
      setSections([...sections, { id: `sec-${Date.now()}`, ...data }]);
    }
    setEditingSection(null);
    setIsSectionModalOpen(false);
  };

  const handleDeleteSection = (id) => {
    if (confirm('Delete this section and all its contents?')) {
      setSections(sections.filter(s => s.id !== id));
      setItems(items.filter(i => i.sectionId !== id));
    }
  };

  // Item Handlers
  const handleSaveItem = (data) => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...data } : i));
    } else {
      const newItem = { ...data, id: `item-${Date.now()}` };
      setItems([...items, newItem]);
      setSelectedItemId(newItem.id);
    }
    setEditingItem(null);
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    if (next.length > 0) setSelectedItemId(next[0].id);
  };

  const handleFormat = () => {
    setItems(items.map(item => {
      if (item.id === selectedItemId && item.solutions) {
        return {
          ...item,
          solutions: item.solutions.map(sol =>
            sol.id === activeSolutionId ? { ...sol, code: formatCode(sol.code) } : sol
          )
        };
      }
      return item;
    }));
  };

  return (
    <div className={`${theme} min-h-screen transition-colors duration-500 selection:bg-indigo-500/30`}>
      <div className="flex border flex-col lg:flex-row h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">

        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Terminal size={18} />
              </div>
              <h1 className="text-base font-black tracking-tight dark:text-white uppercase">Vault</h1>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {theme === 'dark' ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-slate-600" />}
            </button>
          </div>

          <div className="px-4 mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pb-6">
            {sections.map(section => (
              <div key={section.id} className="space-y-1">
                <div className="flex items-center justify-between px-3 py-1 group">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{section.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingSection(section); setIsSectionModalOpen(true); }} className="p-1 hover:text-indigo-500 text-slate-400"><Edit3 size={12} /></button>
                    <button onClick={() => handleDeleteSection(section.id)} className="p-1 hover:text-rose-500 text-slate-400"><Trash2 size={12} /></button>
                  </div>
                </div>
                {filteredItems.filter(i => i.sectionId === section.id).map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedItemId(item.id); setActiveSolutionId(item.solutions?.[0]?.id); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 relative group ${selectedItemId === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    {item.type === 'dsa' ? <Code size={14} className="shrink-0" /> : <FileText size={14} className="shrink-0" />}
                    <span className="text-xs font-semibold truncate flex-1">{item.title}</span>
                    {selectedItemId === item.id && (
                      <motion.div layoutId="pill" className="absolute right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            ))}
            <button onClick={() => { setEditingSection(null); setIsSectionModalOpen(true); }} className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl transition-all">
              <Plus size={14} /> Add Section
            </button>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button onClick={() => { setEditingItem(null); setIsItemModalOpen(true); }} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
              <Plus size={18} /> New Entry
            </button>
          </div>
        </aside>


        {/* Content Area */}
       <main className=" flex-2  overflow-y-auto border  custom-scrollbar p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItemId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              // className="max-w-4xl mx-auto space-y-8 text-left"
              className="w-full space-y-8 text-left"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 justify-start">
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                      {sections.find(s => s.id === currentItem?.sectionId)?.name}
                    </span>
                    {currentItem?.difficulty && (
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${currentItem.difficulty === 'Easy' ? 'text-emerald-500' : currentItem.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                        {currentItem.difficulty}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-black dark:text-white leading-none text-left">{currentItem?.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm text-left">{currentItem?.description}</p>
                </div>

                <div className="flex gap-2 justify-start">
                  <button onClick={() => { setEditingItem(currentItem); setIsItemModalOpen(true); }} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDeleteItem(currentItem.id)} className="p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Body Content */}
              {currentItem?.type === 'dsa' ? (
                <div className="space-y-6 text-left">
                  <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit justify-start">
                    {currentItem.solutions.map(sol => (
                      <button
                        key={sol.id} onClick={() => setActiveSolutionId(sol.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSolutionId === sol.id ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                      >
                        {sol.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-400 tracking-widest justify-start">
                      <Code2 size={16} className="text-indigo-500" /> Implementation
                    </div>
                    <CodeWindow
                      code={currentItem.solutions.find(s => s.id === activeSolutionId)?.code || ''}
                      onFormat={handleFormat}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-400 tracking-widest justify-start">
                    <Type size={16} className="text-indigo-500" /> Explanation
                  </div>
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-lg leading-relaxed dark:text-slate-300 shadow-sm text-left whitespace-pre-wrap">
                    {currentItem?.answer}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        sections={sections}
        editingItem={editingItem}
      />

      <ManageSectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleSaveSection}
        section={editingSection}
      />
    </div>
  );
}