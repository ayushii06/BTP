"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import { Network, Activity, Filter, RefreshCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const NetworkGraph = dynamic(() => import("@/components/graphs/NetworkGraph"), { ssr: false });

export default function MSTOptimization() {
  const [nodes, setNodes] = useState([]);
  const [fullEdges, setFullEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("full"); // 'full', 'mst', 'overlay'
  const [hoverNode, setHoverNode] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [nRes, fullRes, mstRes, compRes] = await Promise.all([
          fetch("/data/mst-optimization/nodes.json").then(res => res.json()),
          fetch("/data/mst-optimization/full-edges.json").then(res => res.json()),
          fetch("/data/mst-optimization/mst-edges.json").then(res => res.json()),
          fetch("/data/mst-optimization/comparison.json").then(res => res.json())
        ]);
        setNodes(nRes);
        setFullEdges(fullRes);
        setMstEdges(mstRes);
        setComparison(compRes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const { graphData, highlightLinks } = useMemo(() => {
    if(!nodes.length) return { graphData: {nodes:[], links:[]}, highlightLinks: new Set() };

    let currentLinks = [];
    let highlighted = new Set();

    if (viewMode === "full") {
      currentLinks = fullEdges;
    } else if (viewMode === "mst") {
      currentLinks = mstEdges;
      mstEdges.forEach(e => highlighted.add(`${e.source}-${e.target}`));
    } else if (viewMode === "overlay") {
      currentLinks = fullEdges;
      mstEdges.forEach(e => highlighted.add(`${e.source}-${e.target}`));
    }

    return {
      graphData: { nodes: [...nodes], links: [...currentLinks] },
      highlightLinks: highlighted
    };
  }, [nodes, fullEdges, mstEdges, viewMode]);

  if (loading) {
    return (
      <>
        <Header title="Connectivity Optimization" />
        <PageWrapper>
          <div className="flex h-64 items-center justify-center text-gray-500 animate-pulse">Loading MST Algorithm Data...</div>
        </PageWrapper>
      </>
    );
  }

  const reductionPercent = comparison ? ((comparison.total_full - comparison.total_mst) / comparison.total_full * 100).toFixed(1) : 0;

  const barData = comparison ? [
    { name: "Full Network", delay: comparison.total_full },
    { name: "Optimized (MST)", delay: comparison.total_mst }
  ] : [];

  return (
    <>
      <Header title="Network Optimization (Kruskal's MST)" />
      <PageWrapper>
        <div className="space-y-6 max-w-7xl mx-auto">

          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Network className="w-24 h-24 text-rose-500" />
              </div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Network Nodes</h4>
              <p className="text-4xl font-bold text-white relative z-10">{nodes.length}</p>
              <p className="text-sm text-gray-500 mt-1 relative z-10">California Airports Evaluated</p>
            </div>
            
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Total Carrier Delay (Before)</h4>
              <p className="text-4xl font-bold text-gray-300 line-through decoration-rose-500/50">{comparison?.total_full} min</p>
              <p className="text-sm text-gray-500 mt-1">Full redundant network</p>
            </div>

            <div className="bg-[#111] border border-rose-500/30 rounded-2xl p-6 bg-gradient-to-br from-[#111] to-rose-950/20">
              <h4 className="text-sm font-medium text-rose-300 mb-2">Optimized Delay (MST)</h4>
              <p className="text-4xl font-bold text-white">{comparison?.total_mst} min</p>
              <p className="text-sm text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                ↓ {reductionPercent}% Reduction
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Col: Controls & Chart */}
            <div className="xl:col-span-1 space-y-6">
              {/* Controls */}
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-rose-400" /> View Controls
                </h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setViewMode("full")}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${viewMode === 'full' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:bg-[#222]'}`}
                  >
                    <span className="font-medium">1. Show Full Network</span>
                    {viewMode === 'full' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                  <button 
                    onClick={() => setViewMode("mst")}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${viewMode === 'mst' ? 'bg-rose-900/40 border-rose-500/50 text-rose-100' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:bg-[#222]'}`}
                  >
                    <span className="font-medium">2. Show MST Only</span>
                    {viewMode === 'mst' && <div className="w-2 h-2 rounded-full bg-rose-400" />}
                  </button>
                  <button 
                    onClick={() => setViewMode("overlay")}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${viewMode === 'overlay' ? 'bg-blue-900/40 border-blue-500/50 text-blue-100' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:bg-[#222]'}`}
                  >
                    <span className="font-medium">3. Overlay Comparison</span>
                    {viewMode === 'overlay' && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                  </button>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                 <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Delay Comparison
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} />
                      <RechartsTooltip cursor={{fill: '#1a1a1a'}} contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff'}} />
                      <Bar dataKey="delay" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#4b5563" : "#f43f5e"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Col: Network Graph */}
            <div className="xl:col-span-2 bg-[#111] border border-[#222] rounded-2xl relative overflow-hidden flex flex-col h-[600px]">
              <div className="absolute top-4 left-4 z-10 bg-[#0a0a0a]/80 backdrop-blur border border-[#333] px-4 py-3 rounded-xl space-y-1">
                 <h4 className="text-white font-semibold flex items-center gap-2">
                   <Network className="w-4 h-4 text-rose-500"/>
                   {viewMode === 'full' ? 'Full CA Connectivity Graph' : viewMode === 'mst' ? 'Minimum Spanning Tree (MST)' : 'MST vs Full Network Overlay'}
                 </h4>
                 <p className="text-xs text-gray-400">
                   Edges represent flights. Weights represent carrier delay.
                 </p>
                 {hoverNode && (
                    <motion.div 
                      initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}}
                      className="mt-3 pt-3 border-t border-[#333]"
                    >
                      <p className="text-sm text-white"><span className="text-gray-500">Airport:</span> {hoverNode.id} - {hoverNode.name}</p>
                    </motion.div>
                 )}
              </div>
              
              <div className="flex-1 w-full relative">
                <NetworkGraph 
                  graphData={graphData}
                  highlightedLinks={highlightLinks}
                  setHoverNode={setHoverNode}
                />
              </div>

              {/* Action reset zoom */}
              <button 
                onClick={() => setViewMode(prev => prev)} // Forces re-render of effect if we added a key, but fine as is.
                className="absolute bottom-4 right-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Reset View"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
