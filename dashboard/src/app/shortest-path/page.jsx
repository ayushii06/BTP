"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import { Route, Search, Navigation } from "lucide-react";

// Disable SSR for the Force Graph because it uses HTML5 Canvas heavily
const NetworkGraph = dynamic(() => import("@/components/graphs/NetworkGraph"), { ssr: false });

export default function ShortestPath() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [source, setSource] = useState("LAX");
  const [dest, setDest] = useState("JFK");
  const [pathFound, setPathFound] = useState(null);
  
  // Graph visual state
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        const [nRes, lRes] = await Promise.all([
          fetch("/data/shortest-path/airports.json").then(res => res.json()),
          fetch("/data/shortest-path/graph-edges.json").then(res => res.json())
        ]);
        setNodes(nRes);
        setLinks(lRes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const graphData = useMemo(() => {
    return { nodes: [...nodes], links: [...links] };
  }, [nodes, links]);

  const handleFindPath = (e) => {
    e.preventDefault();
    if(source === dest) return;

    // Hardcoded demo paths based on dummy data
    // In Phase 2, this would hit the Flask API
    const demoPaths = {
      "LAX-JFK": [
        { route: ["LAX", "JFK"], time: 350, diff: "Fastest" },
        { route: ["LAX", "CHI", "JFK"], time: 370, diff: "+20 min" },
        { route: ["LAX", "SFO", "JFK"], time: 410, diff: "+60 min" }
      ],
      "LAX-ATL": [
        { route: ["LAX", "LAS", "DFW", "ATL"], time: 315, diff: "Fastest" }
      ]
    };

    const key = `${source}-${dest}`;
    const result = demoPaths[key] || [
      { route: [source, "SFO", dest], time: 420, diff: "Fastest (Simulated)" }
    ];

    setPathFound(result);

    // Highlight the best path
    const bestRoute = result[0].route;
    setHighlightNodes(new Set(bestRoute));
    
    let pathLinks = new Set();
    for(let i = 0; i < bestRoute.length - 1; i++) {
      pathLinks.add(`${bestRoute[i]}-${bestRoute[i+1]}`);
    }
    setHighlightLinks(pathLinks);
  };

  if (loading) {
    return (
      <>
        <Header title="Shortest Path" />
        <PageWrapper>
          <div className="flex h-64 items-center justify-center text-gray-500 animate-pulse">Loading Graph Data...</div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Header title="Shortest Path Analysis (Dijkstra)" />
      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[75vh]">
          
          {/* Controls */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-400" /> Route Finder
            </h3>
            
            <form onSubmit={handleFindPath} className="space-y-4 mb-8">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Source Airport</label>
                <select value={source} onChange={(e)=>setSource(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500">
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id} - {n.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Destination Airport</label>
                <select value={dest} onChange={(e)=>setDest(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500">
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id} - {n.name}</option>)}
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Find Best Route
              </button>
            </form>

            {/* Results Table */}
            {pathFound && (
              <div className="flex-1 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 border-b border-[#333] pb-2">Alternative Paths</h4>
                <div className="space-y-4">
                  {pathFound.map((p, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${i === 0 ? "border-orange-500/50 bg-orange-500/10" : "border-[#333] bg-[#1a1a1a]"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold uppercase ${i===0 ? "text-orange-400" : "text-gray-500"}`}>
                          {i === 0 ? "Optimal Route" : `Alternative ${i}`}
                        </span>
                        <span className="text-xs font-medium text-gray-400">{p.diff}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm text-gray-200 flex-wrap">
                        {p.route.map((r, ri) => (
                          <span key={ri} className="flex items-center gap-2">
                            {r} {ri < p.route.length -1 && <span className="text-gray-600">→</span>}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-lg font-bold text-white">{p.time}</span> <span className="text-sm text-gray-500">min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* Network Visualization */}
          <div className="lg:col-span-2 bg-[#111] border border-[#222] rounded-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10 bg-[#0a0a0a]/80 backdrop-blur border border-[#333] px-3 py-1.5 rounded-lg">
              <span className="text-xs text-gray-300 font-medium flex items-center gap-2">
                <Route className="w-4 h-4 text-orange-500"/> Interactive Graph Map
              </span>
            </div>
            {/* The GraphWrapper needs to be sized properly. The canvas fills its parent. */}
            <div className="flex-1 relative w-full h-[500px] lg:h-full">
              <NetworkGraph 
                graphData={graphData} 
                highlightedNodes={highlightNodes} 
                highlightedLinks={highlightLinks}
              />
            </div>
          </div>

        </div>
      </PageWrapper>
    </>
  );
}
