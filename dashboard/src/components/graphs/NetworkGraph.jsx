"use client";

import { useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

// Since it's dynamic imported, it will load only on client
export default function NetworkGraph({ 
  graphData, 
  highlightedNodes = new Set(), 
  highlightedLinks = new Set(),
  hoverNode = null,
  setHoverNode 
}) {
  const fgRef = useRef();

  useEffect(() => {
    // Optional: make the graph gently fit to view
    if (fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(40, 50);
      }, 500);
    }
  }, [graphData]);

  return (
    <div className="w-full h-full bg-[#050505] rounded-xl overflow-hidden cursor-crosshair">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="name"
        // Dynamically size nodes based on their val property, defaulting to 10 if none exists.
        // And nodeRelSize is reduced to 2 for smaller base sizing.
        nodeVal={(node) => node.val || node.value || 10}
        nodeColor={(node) => highlightedNodes.has(node.id) ? "#3b82f6" : "#444"}
        nodeRelSize={2}
        linkColor={(link) => {
          const isHighlighted = highlightedLinks.has(
            `${link.source.id || link.source}-${link.target.id || link.target}`
          ) || highlightedLinks.has(
            `${link.target.id || link.target}-${link.source.id || link.source}`
          );
          return isHighlighted ? "#3b82f6" : "#222";
        }}
        linkWidth={(link) => {
          const isHighlighted = highlightedLinks.has(
            `${link.source.id || link.source}-${link.target.id || link.target}`
          ) || highlightedLinks.has(
            `${link.target.id || link.target}-${link.source.id || link.source}`
          );
          return isHighlighted ? 3 : 1;
        }}
        linkDirectionalParticles={(link) => {
          const isHighlighted = highlightedLinks.has(
            `${link.source.id || link.source}-${link.target.id || link.target}`
          );
          return isHighlighted ? 2 : 0;
        }}
        linkDirectionalParticleSpeed={0.01}
        onNodeHover={(node) => setHoverNode?.(node)}
        backgroundColor="rgba(0,0,0,0)"
        width={800} // Responsive wrappers will control size
        height={500}
      />
    </div>
  );
}
