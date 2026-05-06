import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import { Code, Clipboard } from 'lucide-react';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ code, setCode, language, handlePaste }) => {
  const SimpleEditor = (Editor && (Editor.default || Editor)) || 'textarea';

  const getLanguageModel = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'python': return languages.python;
      case 'javascript': return languages.js;
      case 'typescript': return languages.ts;
      case 'java': return languages.java;
      default: return languages.js;
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#020617] rounded-3xl border border-white/5 relative group transition-all hover:border-white/10">
      <SimpleEditor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, getLanguageModel(language), language)}
        padding={32}
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 14,
          minHeight: '100%',
          backgroundColor: 'transparent',
          color: '#f1f5f9',
          lineHeight: '1.7',
        }}
        textareaClassName="focus:outline-none cursor-text w-full h-full"
      />
      {!code && (
        <div 
          onClick={handlePaste}
          className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-slate-950/40 backdrop-blur-[4px] cursor-pointer group/zone transition-all hover:bg-slate-950/60"
        >
          <div className="w-full h-full border-2 border-dashed border-sky-500/20 rounded-[2.5rem] flex flex-col items-center justify-center group-hover/zone:border-sky-500/40 transition-all">
            <div className="w-24 h-24 rounded-[2.5rem] bg-sky-500/5 border border-sky-500/10 flex items-center justify-center mb-8 shadow-2xl shadow-sky-900/20 group-hover/zone:scale-110 transition-transform">
              <Clipboard className="w-12 h-12 text-sky-500/60" />
            </div>
            <h3 className="text-slate-200 font-bold text-2xl mb-4 tracking-tight">Paste Source Code</h3>
            <p className="text-slate-500 text-sm max-w-[340px] leading-relaxed font-medium mb-10">
              Click anywhere in this box to paste from your clipboard, or use <kbd className="bg-white/10 px-2 py-1 rounded text-sky-400 font-mono mx-1">Ctrl + V</kbd> to begin.
            </p>
            
            <div className="flex items-center gap-6 opacity-40 group-hover/zone:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                Auto-Detection
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                Multi-Language
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
