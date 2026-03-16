import React from "react";

export default function SimpleHighlighter({ code }) {

  const highlight = (code) => {
    const rules = [
      { regex: /\/\/.*/g, className: "text-slate-500 italic" },
      { regex: /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/g, className: "text-emerald-400" },
      { regex: /\b(function|return|const|let|if|else|for|while)\b/g, className: "text-indigo-400" },
      { regex: /\b(true|false|null)\b/g, className: "text-amber-400" },
    ];

    let parts = [{ text: code, className: "text-slate-300" }];

    rules.forEach(rule => {
      let newParts = [];

      parts.forEach(part => {
        if (part.className !== "text-slate-300") {
          newParts.push(part);
          return;
        }

        let lastIndex = 0;
        let match;

        while ((match = rule.regex.exec(part.text)) !== null) {

          if (match.index > lastIndex) {
            newParts.push({
              text: part.text.substring(lastIndex, match.index),
              className: "text-slate-300"
            });
          }

          newParts.push({
            text: match[0],
            className: rule.className
          });

          lastIndex = rule.regex.lastIndex;
        }

        if (lastIndex < part.text.length) {
          newParts.push({
            text: part.text.substring(lastIndex),
            className: "text-slate-300"
          });
        }

      });

      parts = newParts;

    });

    return parts.map((part, i) => (
      <span key={i} className={part.className}>
        {part.text}
      </span>
    ));
  };

  return (
    <code className="block whitespace-pre">
      {code.split("\n").map((line, i) => (
        <div key={i} className="flex">
          <span className="w-10 text-slate-600 select-none text-right pr-4">
            {i + 1}
          </span>
          <span>{highlight(line)}</span>
        </div>
      ))}
    </code>
  );
}