import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#080808',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#00f2ff',
    lineColor: '#00f2ff',
    secondaryColor: '#171717',
    tertiaryColor: '#000000',
    fontFamily: 'Outfit, system-ui, sans-serif',
    fontSize: '13px',
    nodeBorder: '#00f2ff',
    clusterBkg: 'rgba(0, 242, 255, 0.03)',
    clusterBorder: '#00f2ff',
    edgeLabelBackground: '#000',
    defaultLinkColor: '#00f2ff',
  },
  securityLevel: 'loose',
  flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis' },
  er: { useMaxWidth: false },
  sequence: { useMaxWidth: false },
  class: { useMaxWidth: false },
});

const MermaidRenderer = ({ chart, id, onClick }) => {
  const ref = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    let timeoutId = null;
    
    const renderDiagram = async () => {
      if (chart.length < 20) return;

      try {
        const uniqueId = `mermaid-${id}-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        
        if (!isCancelled && ref.current) {
          ref.current.innerHTML = svg;
          ref.current.style.opacity = "1";
          
          const svgElement = ref.current.querySelector('svg');
          if (svgElement) {
            // 📏 NORMAL SCALE LOGIC
            svgElement.style.maxWidth = '100%';
            svgElement.style.width = 'auto';
            svgElement.style.maxHeight = '500px'; // Cap the height for normal view
            svgElement.style.margin = 'auto';
            svgElement.style.display = 'block';
          }
        }
      } catch (error) {
        console.debug('Mermaid: Partial or invalid chart during stream.');
      }
    };

    if (ref.current) {
      ref.current.style.opacity = "0.3";
      timeoutId = setTimeout(renderDiagram, 300);
    }

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [chart, id]);

  return (
    <div 
      onClick={() => onClick && onClick(chart)}
      className="mermaid-container bg-black/20 rounded-[2.5rem] p-10 border border-white/[0.05] overflow-auto mb-8 shadow-2xl min-h-[300px] flex items-center justify-center group hover:border-cyan-500/30 transition-all duration-500 relative cursor-zoom-in"
    >
      <div className="absolute top-6 left-6 flex gap-2 items-center pointer-events-none">
         <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30 animate-pulse" />
         <span className="text-[8px] font-black text-cyan-500/30 uppercase tracking-[0.4em]">Strategic Blueprint</span>
      </div>
      <div ref={ref} className="w-full flex justify-center transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default MermaidRenderer;
