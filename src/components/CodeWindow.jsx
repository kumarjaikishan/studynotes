import React, { useState, useEffect } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

const THEMES = {
  "Sunset": { syntax: themes.nightOwl, bg: "linear-gradient(140deg, rgb(255, 207, 115), rgb(255, 122, 47))", innerBg: "rgba(1, 22, 39, 0.85)" },
  "Breeze": { syntax: themes.github, bg: "linear-gradient(140deg, rgb(142, 199, 251), rgb(28, 85, 170))", innerBg: "rgba(255, 255, 255, 0.85)" },
  "Dracula": { syntax: themes.dracula, bg: themes.dracula.plain.backgroundColor || "#282a36", innerBg: themes.dracula.plain.backgroundColor || "#282a36" },
  "VS Dark": { syntax: themes.vsDark, bg: themes.vsDark.plain.backgroundColor || "#1e1e1e", innerBg: themes.vsDark.plain.backgroundColor || "#1e1e1e" },
  "Night Owl": { syntax: themes.nightOwl, bg: themes.nightOwl.plain.backgroundColor || "#011627", innerBg: themes.nightOwl.plain.backgroundColor || "#011627" },
  "Okaidia": { syntax: themes.okaidia, bg: themes.okaidia.plain.backgroundColor || "#272822", innerBg: themes.okaidia.plain.backgroundColor || "#272822" },
  "GitHub": { syntax: themes.github, bg: themes.github.plain.backgroundColor || "#f6f8fa", innerBg: themes.github.plain.backgroundColor || "#f6f8fa" },
  "Midnight": { syntax: themes.synthwave84, bg: "linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248))", innerBg: "rgba(38, 35, 53, 0.85)" },
  "Cosmic": { syntax: themes.okaidia, bg: "linear-gradient(140deg, rgb(15, 32, 39), rgb(32, 58, 67), rgb(44, 83, 100))", innerBg: "rgba(39, 40, 34, 0.75)" },
  "Aurora": { syntax: themes.dracula, bg: "linear-gradient(140deg, rgb(29, 151, 108), rgb(147, 249, 185))", innerBg: "rgba(40, 42, 54, 0.75)" },
  "Hacker": { syntax: themes.vsDark, bg: "radial-gradient(circle at center, #004d00 0%, #000000 100%)", innerBg: "rgba(30, 30, 30, 0.75)" },
};

const CodeWindow = ({ code, onFormat }) => {
  const [copied, setCopied] = useState(false);
  const [activeThemeName, setActiveThemeName] = useState(() => {
    return localStorage.getItem("codeTheme") || "Sunset";
  });
  
  useEffect(() => {
    localStorage.setItem("codeTheme", activeThemeName);
  }, [activeThemeName]);
  
  const activeTheme = THEMES[activeThemeName] || THEMES["Dracula"];
  const currentSyntax = activeTheme.syntax;
  const currentBackground = activeTheme.bg;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Controls Container */}
      <div className="flex items-center justify-between w-full px-1">
        <select
            value={activeThemeName}
            onChange={(e) => setActiveThemeName(e.target.value)}
            className="text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 outline-none shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {Object.keys(THEMES).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
        </select>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onFormat}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shadow-sm"
          >
            <Sparkles size={14} /> Format
          </button>

          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg border border-transparent shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition"
          >
            {copied ? (
              <Check size={16} className="text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Ray.so Style Outer Wrapper */}
      <div 
        className="w-full rounded-2xl p-6 sm:p-4 md:p-6 transition-all duration-500 ease-in-out shadow-inner"
        style={{ background: currentBackground }}
      >
        {/* Inner Code Window */}
        <div 
          className="rounded-xl overflow-hidden shadow-2xl border border-white/10 w-full backdrop-blur-md transition-colors duration-500"
          style={{ backgroundColor: activeTheme.innerBg || '#0d1117' }}
        >
          {/* Header */}
          <div className="flex items-center justify-start px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
          </div>

          {/* Code Area with Syntax Highlight */}
          <Highlight theme={currentSyntax} code={code} language="javascript">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className="p-4 overflow-x-auto text-sm font-mono custom-scrollbar"
                style={{ ...style, background: "transparent" }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="inline-block w-10 text-slate-500/50 select-none">
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
      </div>
    </div>
  );
};

export default CodeWindow;