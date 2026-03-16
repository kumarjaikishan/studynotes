import React, { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import SimpleHighlighter from "./SimpleHighlighter";

export default function CodeWindow({ code, onFormat }) {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl bg-[#0d1117] border border-slate-800 w-full">

      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800">

        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        <div className="flex gap-3">

          <button
            onClick={onFormat}
            className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
          >
            <Sparkles size={14} />
            Format
          </button>

          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>

        </div>

      </div>

      <div className="p-4 overflow-x-auto text-sm font-mono bg-[#0d1117]">
        <SimpleHighlighter code={code} />
      </div>

    </div>
  );
}