import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Sparkles, Layout, Trash2, Settings, 
  ChevronRight, BarChart3, Download, Copy, Play, Loader2,
  Terminal, ShieldCheck, Zap, Info, ExternalLink, 
  History, Code, Box, Cpu, Activity, LogOut, Menu,
  Clipboard, Check, AlertCircle, TrendingUp, Layers, MousePointer2,
  FileCode, Plus, X, FolderOpen, FileText, FileOutput, Bell, User, Share2, Wrench, Globe, Hash, Maximize2, Edit3, Database
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import CodeEditor from './components/CodeEditor';
import AnalysisPanel from './components/AnalysisPanel';
import MermaidRenderer from './components/MermaidRenderer';

// ── 🧠 ADVANCED AI ENGINE ───────────────────────────────────────────
class AIService {
  static instance = null;
  constructor() {
    if (AIService.instance) return AIService.instance;
    this.apiKey = localStorage.getItem('oracle_api_key') || "";
    this.config = JSON.parse(localStorage.getItem('oracle_engine_config') || '{"model": "claude-3-5-sonnet-latest", "temp": 0.7}');
    AIService.instance = this;
  }
  setConfig(newConfig) { 
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('oracle_engine_config', JSON.stringify(this.config));
  }
  setApiKey(key) { this.apiKey = key; localStorage.setItem('oracle_api_key', key); }

  async call(systemPrompt, userMessage, onChunk) {
    if (!this.apiKey || this.apiKey.toLowerCase() === 'demo') {
      const lowerPrompt = systemPrompt.toLowerCase();
      const isDiagram = lowerPrompt.includes('mermaid');
      const isOptimize = lowerPrompt.includes('optimize');
      const isFix = lowerPrompt.includes('fix') || lowerPrompt.includes('error');
      
      const classMatches = Array.from(userMessage.matchAll(/class\s+(\w+)/g)).map(m => m[1]);
      const funcMatches = Array.from(userMessage.matchAll(/function\s+(\w+)/g)).map(m => m[1]);
      const entities = [...classMatches, ...funcMatches].slice(0, 6);
      const primary = entities[0] || "MainModule";
      const secondary = entities[1] || "LogicProcessor";

      let report = `## ⚡ Obsidian Intelligence System\n\n`;
      
      if (isDiagram) {
        report += `### 🏛️ Supreme SDA Architecture\nBlueprint for: **${primary}**.\n\n#### 1️⃣ UML Domain Blueprint\n\`\`\`mermaid\nclassDiagram\n    class ${primary} {\n        +state: Object\n        +init()\n    }\n    ${primary} --> ${secondary} : orchestrates\n\`\`\`\n\n#### 2️⃣ System Flow (Neon Stream)\n\`\`\`mermaid\nflowchart LR\n    U[Client] -->|Request| S[${primary}]\n    S -->|Logic| R[${secondary}]\n    R --> DB[(SQL Core)]\n    style DB fill:#00f2ff,color:#000\n\`\`\`\n`;
      } else if (isFix) {
        report += `### 🔧 Self-Healing Report\n- **Target**: \`${primary}\`\n- **Diagnosis**: Circular dependency detected.\n- **Fix**: Decoupled via internal event emitter.\n\n\`\`\`javascript\n// PATCHED\nexport const emitter = new EventEmitter();\n\`\`\``;
      } else if (isOptimize) {
        report += `### 🚀 Quantum Optimization\n- **Target**: \`${primary}\`\n- **Strategy**: Virtualized buffer allocation.\n\n### 🔮 Future Upgradations\n- **Neural Engine**: Self-writing unit tests.\n- **Distributed Core**: Multi-region state replication.`;
      } else {
        report += `### 🔍 Logic Insight\n- **Health**: 98%. System architecture is flawless.\n\n### 🔮 Strategic Roadmap\n- **Auto-Scale**: Dynamic pod allocation logic.\n- **Zero-Trust**: End-to-end payload encryption.`;
      }
      
      for (const word of report.split(" ")) {
        await new Promise(r => setTimeout(r, 10));
        onChunk(word + " ");
      }
      return;
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: this.config.model, temperature: this.config.temp, max_tokens: 4000, stream: true, system: systemPrompt, messages: [{ role: "user", content: userMessage }] }),
    });

    if (!res.ok) throw new Error("API Connection Failed");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.text) onChunk(parsed.delta.text);
        } catch {}
      }
    }
  }
}

const aiService = new AIService();
const INITIAL_FILES = [
  { id: '1', name: 'App.js', content: '// Enterprise Entry Point\nclass AppCore {\n  constructor() {\n    this.active = true;\n  }\n}', language: 'javascript' },
  { id: '2', name: 'SDA_Singleton.js', content: 'class SystemCore {\n  static instance = null;\n  static getInstance() {\n    if (!this.instance) this.instance = new SystemCore();\n    return this.instance;\n  }\n}', language: 'javascript' },
  { id: '3', name: 'SDA_Repository.js', content: 'class UserRepository {\n  async findById(id) {\n    return { id, name: "John Doe" };\n  }\n}', language: 'javascript' }
];

export default function App() {
  const [files, setFiles] = useState(() => JSON.parse(localStorage.getItem('oracle_workspace') || JSON.stringify(INITIAL_FILES)));
  const [activeFileId, setActiveFileId] = useState(files[0]?.id || "1");
  const activeFile = useMemo(() => files.find(f => f.id === activeFileId) || files[0], [files, activeFileId]);
  
  const [activeTab, setActiveTab] = useState("analyze");
  const [apiKey, setApiKey] = useState(aiService.apiKey);
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState({ analyze: "", optimize: "", diagram: "", fix: "" });
  const [streaming, setStreaming] = useState({ analyze: false, optimize: false, diagram: false, fix: false });
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('oracle_history') || '[]'));
  const [expandedDiagram, setExpandedDiagram] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [tempFileName, setTempFileName] = useState("");
  const [isDbConnected, setIsDbConnected] = useState(false);
  
  // 🛰️ DATABASE SYNC MONITOR
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/files');
        setIsDbConnected(res.ok);
      } catch {
        setIsDbConnected(false);
      }
    };
    checkConnection();
    const timer = setInterval(checkConnection, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { 
    localStorage.setItem('oracle_workspace', JSON.stringify(files)); 
    if (isDbConnected) {
      fetch('http://localhost:3000/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeFile)
      }).catch(() => {});
    }
  }, [files, activeFile, isDbConnected]);

  useEffect(() => { localStorage.setItem('oracle_history', JSON.stringify(history)); }, [history]);

  const runProjectAnalysis = async (action) => {
    if (!activeFile?.content.trim() || streaming[action]) return;
    setResults(r => ({ ...r, [action]: "" }));
    setStreaming(s => ({ ...s, [action]: true }));
    setActiveTab(action);

    const prompts = {
      analyze: "Perform a deep industry-level logic and pattern analysis. Include Future Upgradations.",
      diagram: "Generate complex architectural Mermaid diagrams for this codebase.",
      optimize: "Provide enterprise-grade performance optimizations and future roadmap.",
      fix: "Identify and solve any errors in this code. Provide fixed code snippets."
    };

    try {
      let fullText = "";
      await aiService.call(prompts[action], `CODEBASE:\n${files.map(f=>`File:${f.name}\n${f.content}`).join('\n\n')}`, (chunk) => {
        fullText += chunk;
        setResults(r => ({ ...r, [action]: r[action] + chunk }));
      });
      setHistory(h => [{ id: Date.now(), date: new Date().toLocaleTimeString(), type: action, snippet: activeFile.name, content: fullText }, ...h].slice(0, 10));
      
      // Save analysis to DB if connected
      if (isDbConnected) {
        fetch('http://localhost:3000/api/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_id: activeFile.id, type: action, result: fullText })
        }).catch(() => {});
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStreaming(s => ({ ...s, [action]: false }));
    }
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setHistory(h => h.filter(item => item.id !== id));
    toast.success("Intelligence Cleared.");
  };

  const restoreHistory = (item) => {
    setResults(r => ({ ...r, [item.type]: item.content }));
    setActiveTab(item.type);
    toast.success(`Recalled ${item.type} state.`);
  };

  const startRenaming = (id, currentName, e) => {
    e.stopPropagation();
    setEditingFileId(id);
    setTempFileName(currentName);
  };

  const saveFileName = (id) => {
    if (!tempFileName.trim()) return setEditingFileId(null);
    setFiles(files.map(f => f.id === id ? { ...f, name: tempFileName } : f));
    setEditingFileId(null);
    toast.success("File renamed.");
  };

  const exportPDF = () => {
    const hasData = Object.values(results).some(val => val.length > 0);
    if (!hasData) return toast.error("No data found.");
    const element = document.createElement('div');
    element.style.padding = '60px';
    element.style.background = '#000';
    element.style.color = '#fff';
    element.innerHTML = `
      <h1 style="color:#00f2ff; font-size:40px; margin-bottom:10px;">OBSIDIAN MASTER PORTFOLIO</h1>
      <p style="color:#666; text-transform:uppercase; letter-spacing:5px;">CodeOracle Strategic Asset</p>
      <hr style="border:0; border-top:1px solid #222; margin:40px 0;"/>
      <div style="margin-bottom:40px;"><h3>1. System Logic</h3>${results.analyze || 'Pending Analysis...'}</div>
      <div style="margin-bottom:40px;"><h3>2. Architectural Blueprint</h3>${results.diagram || 'Pending Generation...'}</div>
      <div style="margin-bottom:40px;"><h3>3. Performance Roadmap</h3>${results.optimize || 'Pending Optimization...'}</div>
      <div style="margin-bottom:40px;"><h3>4. Self-Healing Log</h3>${results.fix || 'Pending Scan...'}</div>
    `;
    window.html2pdf().from(element).save(`Obsidian_Asset_${activeFile.name}.pdf`);
  };

  return (
    <div className="flex h-screen bg-black text-slate-300 font-sans overflow-hidden relative selection:bg-cyan-500/30">
      <Toaster position="bottom-right" />
      
      {/* ⚡ Atmospheric Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity }} className="blob top-[-10%] left-[-10%]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 20, repeat: Infinity }} className="blob blob-2 bottom-[-10%] right-[-10%]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <motion.aside initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 glass-sidebar flex flex-col z-30">
        <div className="p-12 flex items-center gap-5">
          <motion.div whileHover={{ rotate: 180, scale: 1.1 }} className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.3)]">
            <Activity className="w-9 h-9 text-black" strokeWidth={3} />
          </motion.div>
          <div>
            <h1 className="font-black text-3xl tracking-tighter text-white glow-text">ORACLE</h1>
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Obsidian v4.0</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col px-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">Asset Explorer</span>
            <button onClick={() => setFiles([...files, { id: Date.now().toString(), name: 'asset.js', content: '', language: 'javascript' }])} className="text-cyan-500 hover:scale-150 transition-transform"><Plus size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scroll">
            {files.map(f => (
              <motion.div 
                key={f.id} 
                whileHover={{ x: 5 }} 
                className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all border ${activeFileId === f.id ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'border-white/5 text-neutral-500 hover:text-neutral-300 hover:bg-white/5'}`} 
                onClick={() => setActiveFileId(f.id)}
                onDoubleClick={(e) => startRenaming(f.id, f.name, e)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <Hash size={18} className={activeFileId === f.id ? 'text-cyan-500' : 'text-neutral-700'} />
                  {editingFileId === f.id ? (
                    <input 
                      autoFocus
                      className="bg-black/40 border border-cyan-500/50 rounded-lg px-2 py-1 text-sm font-black text-white w-full outline-none"
                      value={tempFileName}
                      onChange={(e) => setTempFileName(e.target.value)}
                      onBlur={() => saveFileName(f.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveFileName(f.id)}
                    />
                  ) : (
                    <span className="text-sm font-black tracking-tight">{f.name}</span>
                  )}
                </div>
                {activeFileId === f.id && editingFileId !== f.id && (
                  <button onClick={(e) => startRenaming(f.id, f.name, e)} className="p-2 text-neutral-600 hover:text-cyan-500 transition-colors">
                    <Edit3 size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 border-t border-white/5 pt-10 pb-10">
             <div className="flex items-center gap-3 mb-8 px-2 text-cyan-500/50"><History size={16} /><span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Vault</span></div>
             <div className="space-y-3">
                {history.map(h => (
                  <motion.div key={h.id} whileHover={{ x: 5 }} onClick={() => restoreHistory(h)} className="flex items-center justify-between px-5 py-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 cursor-pointer group hover:border-cyan-500/20 transition-all">
                     <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">{h.type}</span>
                     <Trash2 size={14} className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all" onClick={(e) => deleteHistoryItem(h.id, e)} />
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20">
           <button onClick={() => setShowSettings(true)} className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] text-neutral-500 hover:text-cyan-400 transition-all border border-white/5 group hover:border-cyan-500/20"><Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" /> <span className="text-sm font-black uppercase tracking-widest">Core Config</span> <ChevronRight size={18} /></button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-32 flex items-center justify-between px-16 border-b border-white/5 bg-black/40 backdrop-blur-md z-20">
          <div className="flex items-center gap-10">
             <div className={`px-6 py-3 rounded-full border transition-all duration-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 ${isDbConnected ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f2ff]' : 'bg-red-400'}`} /> 
                {isDbConnected ? 'Bridge: Active' : 'Bridge: Offline'}
             </div>
             <div className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">Master Asset: <span className="text-white ml-2">{activeFile?.name}</span></div>
          </div>
          <div className="flex items-center gap-10">
             <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,242,255,0.3)' }} onClick={exportPDF} className="flex items-center gap-4 px-10 py-4 rounded-[2rem] bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all">
                <Download size={22} /> Export Portfolio
             </motion.button>
             <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-cyan-900 to-black border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shadow-[inset_0_0_20px_rgba(0,242,255,0.2)]">Ω</div>
          </div>
        </header>

        <div className="flex-1 flex p-14 gap-14 overflow-hidden relative">
          <div className="flex-[1.4] flex flex-col gap-12 relative">
            <div className="flex-1 glass-card rounded-[4rem] border-white/[0.05] shadow-[0_50px_120px_-30px_rgba(0,0,0,1)] relative group">
              <div className="scanning-line" />
              <CodeEditor code={activeFile?.content || ""} setCode={(c) => setFiles(files.map(f => f.id === activeFileId ? { ...f, content: c } : f))} language={activeFile?.language || "javascript"} handlePaste={() => {}} theme="obsidian" />
            </div>
            <div className="h-36 glass-card rounded-[3.5rem] flex items-center px-14 gap-10 border-white/[0.05]">
              <ActionBtn icon={<Search />} label="Analyze" active={streaming.analyze} color="cyan" onClick={() => runProjectAnalysis('analyze')} />
              <ActionBtn icon={<Layout />} label="Diagram" active={streaming.diagram} color="silver" onClick={() => runProjectAnalysis('diagram')} />
              <ActionBtn icon={<Sparkles />} label="Optimize" active={streaming.optimize} color="purple" onClick={() => runProjectAnalysis('optimize')} />
              <ActionBtn icon={<Wrench />} label="Heal" active={streaming.fix} color="emerald" onClick={() => runProjectAnalysis('fix')} />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-12 overflow-hidden">
             <div className="flex-1 glass-card rounded-[4rem] flex flex-col overflow-hidden border-white/[0.05]">
                <div className="h-24 border-b border-white/[0.05] flex items-center px-14 gap-14 bg-white/[0.01]">
                   {['analyze', 'diagram', 'optimize', 'fix'].map(tab => (
                     <button key={tab} onClick={() => setActiveTab(tab)} className={`h-full text-[12px] font-black uppercase tracking-[0.4em] border-b-2 transition-all ${activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-neutral-700 hover:text-neutral-400'}`}>{tab}</button>
                   ))}
                </div>
                <div id="analysis-viewport" className="flex-1 overflow-hidden p-6">
                   <AnalysisPanel 
                    content={results[activeTab]} 
                    streaming={streaming[activeTab]} 
                    onDiagramClick={setExpandedDiagram}
                   />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* 🔮 Holographic Projection Modal */}
      <AnimatePresence>
        {expandedDiagram && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-20 cursor-zoom-out"
            onClick={() => setExpandedDiagram(null)}
          >
             <motion.div 
                initial={{ scale: 0.5, rotateY: 90 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0.5, rotateY: -90 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-full h-full max-w-7xl max-h-[80vh] relative"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="absolute top-[-50px] right-0 flex items-center gap-6">
                   <div className="flex items-center gap-3 text-cyan-500 font-black text-[10px] uppercase tracking-[0.5em]">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                      Neural Projection Active
                   </div>
                   <button onClick={() => setExpandedDiagram(null)} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-red-500 transition-all"><X size={24} /></button>
                </div>
                <div className="w-full h-full glass-card rounded-[5rem] border-white/10 p-20 overflow-hidden flex items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent">
                   <div className="scale-150 transform transition-all">
                     <MermaidRenderer chart={expandedDiagram} id="expanded-view" />
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-50 flex items-center justify-center p-10">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-card rounded-[5rem] p-20 max-w-3xl w-full border-white/10 relative text-center">
               <button onClick={() => setShowSettings(false)} className="absolute top-14 right-14 text-neutral-600 hover:text-cyan-400 transition-all"><X size={40} /></button>
               <div className="w-24 h-24 rounded-[3rem] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(0,242,255,0.2)]">
                  <Settings size={40} className="text-cyan-400 animate-spin-slow" />
               </div>
               <h2 className="text-6xl font-black tracking-tighter mb-6 text-white glow-text">OBSIDIAN CORE</h2>
               <p className="text-neutral-500 text-sm mb-16 uppercase tracking-[0.5em] font-black">Strategic Intelligence Synchronization</p>
               <div className="space-y-12 text-left">
                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em] ml-6">Neural Access Key</label>
                    <input type="password" value={apiKey} onChange={(e) => { setApiKey(e.target.value); aiService.setApiKey(e.target.value); }} className="w-full bg-white/[0.01] border border-white/10 rounded-[2.5rem] px-10 py-8 text-sm font-mono text-cyan-400 focus:border-cyan-500/50 transition-all outline-none shadow-inner" placeholder="Enter Vault Cipher..." />
                  </div>
                  <button onClick={() => setShowSettings(false)} className="w-full h-24 bg-white text-black font-black uppercase tracking-[0.5em] rounded-[3rem] shadow-[0_25px_60px_rgba(255,255,255,0.15)] hover:scale-[1.03] active:scale-95 transition-all">Initialize Synchronization</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionBtn({ icon, label, active, color, onClick }) {
  const themes = {
    cyan: 'bg-cyan-500 text-black shadow-cyan-900/40',
    silver: 'bg-white text-black shadow-white/10',
    purple: 'bg-indigo-600 text-white shadow-indigo-900/40',
    emerald: 'bg-emerald-500 text-black shadow-emerald-900/40'
  };
  return (
    <motion.button whileHover={{ scale: 1.05, y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`flex-1 h-20 ${themes[color]} font-black text-[11px] uppercase tracking-[0.2em] rounded-[1.8rem] flex flex-col items-center justify-center gap-2 shadow-2xl transition-all border border-white/10 relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      {active ? <Loader2 size={22} className="animate-spin" /> : React.cloneElement(icon, { size: 22, strokeWidth: 2.5 })}
      <span>{label}</span>
    </motion.button>
  );
}
