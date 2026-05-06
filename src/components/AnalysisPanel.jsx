import React from 'react';
import ReactMarkdown from 'react-markdown';
import MermaidRenderer from './MermaidRenderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Cpu } from 'lucide-react';

const AnalysisPanel = ({ content, streaming, placeholder, onDiagramClick }) => {
  if (!content && !streaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-12 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/20 shadow-2xl">
          {placeholder?.icon || <Cpu size={32} />}
        </div>
        <div className="space-y-3">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Core Ready</h3>
          <p className="text-neutral-600 text-[11px] max-w-[240px] leading-relaxed font-bold uppercase tracking-widest">
            {placeholder?.text || "System waiting for Strategic Input..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 overflow-y-auto h-full space-y-8 bg-transparent">
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-4 mt-12 mb-6" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mt-10 mb-4 flex items-center gap-3" {...props} />,
          p: ({ node, ...props }) => <p className="text-neutral-500 text-[13px] leading-relaxed mb-6 font-medium" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-3 mb-8 text-neutral-500 text-[12px]" {...props} />,
          li: ({ node, ...props }) => <li className="ml-2 pl-2 marker:text-white" {...props} />,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            
            if (lang === 'mermaid') {
              return (
                <div className="my-10 p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.05]">
                  <MermaidRenderer 
                    chart={String(children).replace(/\n$/, '')} 
                    id={Math.random().toString(36).substr(2, 9)} 
                    onClick={onDiagramClick}
                  />
                </div>
              );
            }
            
            const Highlighter = (SyntaxHighlighter && (SyntaxHighlighter.default || SyntaxHighlighter)) || 'pre';
            
            return !inline && match ? (
              <div className="rounded-[2.5rem] overflow-hidden border border-white/[0.05] my-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
                <div className="bg-white/[0.02] px-6 py-3 border-b border-white/[0.05] text-[9px] text-neutral-500 font-black tracking-[0.3em] flex justify-between items-center uppercase">
                  <span>{lang} Result</span>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                  </div>
                </div>
                <Highlighter
                  style={tomorrow}
                  language={lang}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '32px', fontSize: '13px', backgroundColor: '#050505', lineHeight: '1.7' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </Highlighter>
              </div>
            ) : (
              <code className="bg-white/5 text-white px-2 py-0.5 rounded-md text-[11px] font-mono border border-white/5" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {streaming && (
        <div className="flex gap-4 items-center mt-10 p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-[10px] text-white font-black tracking-[0.4em] uppercase">Mercury Core processing...</span>
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;
