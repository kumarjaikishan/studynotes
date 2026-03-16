import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Type, Edit3, Trash2, BookOpen, CloudCog } from "lucide-react";
import CodeWindow from "./CodeWindow";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";

export default function ContentArea({
    currentItem,
    sections,
    activeSolutionId,
    setActiveSolutionId,
    user,
    handleDeleteItem,
    setEditingItem,
    setIsItemModalOpen
}) {


    if (!currentItem) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center text-center max-w-sm px-6">

                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                        <BookOpen className="text-indigo-500" size={28} />
                    </div>

                    <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                        No Topic Selected
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Choose a section from the sidebar to view the topic and start learning.
                    </p>

                </div>
            </div>
        );
    }

    const [fontSize, setfontSize] = useState(20)

    const handleFormat = async () => {
        if (!currentItem || currentItem.type !== "dsa") return;

        const currentCode = currentItem.solutions.find(
            s => s._id === activeSolutionId
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
                sol._id === activeSolutionId
                    ? { ...sol, code: formattedCode }
                    : sol
            );

            const updatedItem = { ...currentItem, solutions: newSolutions };

            await mockApi.saveItem(updatedItem);

            setItems(prev =>
                prev.map(i => i._id === currentItem._id ? updatedItem : i)
            );

        } catch (err) {
            console.error("Formatting error:", err);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-2 lg:p-4 custom-scrollbar">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentItem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    //   className="max-w-4xl mx-auto space-y-8"
                    className="max-w-6xl mr-auto space-y-8"
                >

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div className="space-y-1 w-full text-left ">

                            <div className="flex items-center gap-1 ">

                                <span className="px-2 py-[2px] rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-wide">
                                    {sections.find(s => s._id === currentItem.sectionId)?.name}
                                </span>

                                {currentItem.difficulty && (
                                    <span
                                        className={`px-2 py-[2px] rounded-md text-[12px] font-bold uppercase tracking-wide ${currentItem.difficulty === "Easy"
                                            ? "text-emerald-500"
                                            : currentItem.difficulty === "Medium"
                                                ? "text-amber-500"
                                                : "text-rose-500"
                                            }`}
                                    >
                                        {currentItem.difficulty}
                                    </span>
                                )}

                            </div>

                            <div className="text-2xl capitalize font-semibold dark:text-white">
                                {currentItem.title}
                            </div>

                            <div className="text-slate-500 dark:text-slate-400 text-sm whitespace-pre-wrap">
                                {currentItem.description}
                            </div>

                        </div>

                        <div className="flex gap-2">
                            {user?.userId &&
                                <>
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
                                        onClick={() => handleDeleteItem(currentItem._id)}
                                        className="p-3 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </>
                            }
                        </div>

                    </div>

                    {/* Body */}
                    {currentItem.type === "dsa" ? (

                        <div className="space-y-4">
                            {/* Solution Tabs */}
                            <div className="flex gap-1.5 p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl w-fit">

                                {currentItem.solutions.map(sol => (
                                    <button
                                        key={sol._id}
                                        onClick={() => {
                                            setActiveSolutionId(sol._id)
                                        }}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold ${activeSolutionId === sol._id
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
                                    code={currentItem.solutions.find(s => s._id === activeSolutionId)?.code || ''}
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

                            <div className={`p-4 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[${fontSize}px] leading-relaxed dark:text-slate-300 shadow-sm whitespace-pre-wrap`}>
                                {currentItem.answer}
                            </div>

                        </div>

                    )}

                </motion.div>

            </AnimatePresence>

        </main>
    );
}