import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Type, Edit3, Trash2 } from "lucide-react";
import CodeWindow from "./CodeWindow";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";

export default function ContentArea({
    currentItem,
    sections,
    activeSolutionId,
    setActiveSolutionId,

    handleDeleteItem,
    setEditingItem,
    setIsItemModalOpen
}) {

    if (!currentItem) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400">
                Select a topic to start
            </div>
        );
    }

    const handleFormat = async () => {
        if (!currentItem || currentItem.type !== "dsa") return;

        const currentCode = currentItem.solutions.find(
            s => s.id === activeSolutionId
        )?.code || "";

        try {

            const formattedCode = await prettier.format(currentCode, {
                parser: "babel",
                plugins: [parserBabel],
                semi: true,
                singleQuote: true,
                tabWidth: 2
            });

            const newSolutions = currentItem.solutions.map(sol =>
                sol.id === activeSolutionId
                    ? { ...sol, code: formattedCode }
                    : sol
            );

            const updatedItem = { ...currentItem, solutions: newSolutions };

            await mockApi.saveItem(updatedItem);

            setItems(prev =>
                prev.map(i => i.id === currentItem.id ? updatedItem : i)
            );

        } catch (err) {
            console.error("Formatting error:", err);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 lg:p-12 custom-scrollbar">

            <AnimatePresence mode="wait">

                <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    //   className="max-w-4xl mx-auto space-y-8"
                    className="max-w-6xl mr-auto space-y-8"
                >

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                        <div className="space-y-3">

                            <div className="flex items-center gap-3">

                                <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                    {sections.find(s => s.id === currentItem.sectionId)?.name}
                                </span>

                                {currentItem.difficulty && (
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${currentItem.difficulty === "Easy"
                                        ? "text-emerald-500"
                                        : currentItem.difficulty === "Medium"
                                            ? "text-amber-500"
                                            : "text-rose-500"
                                        }`}>
                                        {currentItem.difficulty}
                                    </span>
                                )}

                            </div>

                            <h1 className="text-4xl font-black dark:text-white">
                                {currentItem.title}
                            </h1>

                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                {currentItem.description}
                            </p>

                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={() => {
                                    setEditingItem(currentItem);
                                    setIsItemModalOpen(true);
                                }}
                                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Edit3 size={20} />
                            </button>

                            <button
                                onClick={() => handleDeleteItem(currentItem.id)}
                                className="p-3 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                            >
                                <Trash2 size={20} />
                            </button>

                        </div>

                    </div>

                    {/* Body */}
                    {currentItem.type === "dsa" ? (

                        <div className="space-y-6">

                            {/* Solution Tabs */}
                            <div className="flex gap-1.5 p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl w-fit">

                                {currentItem.solutions.map(sol => (

                                    <button
                                        key={sol.id}
                                        onClick={() => setActiveSolutionId(sol.id)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold ${activeSolutionId === sol.id
                                            ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            }`}
                                    >
                                        {sol.label}
                                    </button>

                                ))}

                            </div>

                            {/* Code */}
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

                        <div className="space-y-4">

                            <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest">
                                <Type size={16} className="text-indigo-500" />
                                Explanation
                            </div>

                            <div className="p-4 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-lg leading-relaxed dark:text-slate-300 shadow-sm whitespace-pre-wrap">
                                {currentItem.answer}
                            </div>
                           
                        </div>

                    )}

                </motion.div>

            </AnimatePresence>

        </main>
    );
}