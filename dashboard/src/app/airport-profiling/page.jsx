"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import { Building2, Activity, Shapes, Users } from "lucide-react";

export default function AirportProfiling() {
  const [clusters, setClusters] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [elbowData, setElbowData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, tsRes, eRes] = await Promise.all([
          fetch("/data/airport-profiling/cluster-centers.json").then(res => res.json()),
          fetch("/data/airport-profiling/time-series.json").then(res => res.json()),
          fetch("/data/airport-profiling/elbow-data.json").then(res => res.json())
        ]);
        setClusters(cRes);
        setTimeSeries(tsRes);
        setElbowData(eRes);
      } catch (error) {
        console.error("Failed to load clustering data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Airport Profiling" />
        <PageWrapper>
          <div className="flex h-64 items-center justify-center text-gray-500 animate-pulse">
            Loading Clustering Models...
          </div>
        </PageWrapper>
      </>
    );
  }


  return (
    <>
      <Header title="Airport Profiling (K-Means Clustering)" />
      <PageWrapper>
        <div className="space-y-6 max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 gap-6">
            {/* Elbow Method Chart */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" /> Optimal K Selection (Elbow Method)
              </h3>
              <p className="text-sm text-gray-400 mb-6">Sum of Squared Errors (SSE) determines k=4 is optimal.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={elbowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="k" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(val) => `${val/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="sse" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Cluster Cards */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 mt-8">Airport Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clusters.map((c, i) => {
                const colors = [
                  "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
                  "border-orange-500/30 bg-orange-500/10 text-orange-400",
                  "border-red-500/30 bg-red-500/10 text-red-500"
                ];
                return (
                  <div key={i} className="bg-[#111] border border-[#222] rounded-2xl p-5 hover:border-[#444] transition-colors relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${colors[i % 4].split(' ')[0].replace('border-', 'bg-').split('/')[0]}`} />
                    <h4 className="font-bold text-white text-lg mb-4">{c.cluster}</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-[#1a1a1a] px-3 py-2 rounded-lg">
                        <span className="text-xs text-gray-400">Avg Dep Delay</span>
                        <span className="font-mono font-semibold text-white">{c.delay_dep} min</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#1a1a1a] px-3 py-2 rounded-lg">
                        <span className="text-xs text-gray-400">Avg Arr Delay</span>
                        <span className="font-mono font-semibold text-white">{c.delay_arr} min</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#1a1a1a] px-3 py-2 rounded-lg">
                        <span className="text-xs text-gray-400">Cancel Rate</span>
                        <span className="font-mono font-semibold text-white">{(c.cancel_rate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                         <div className="flex items-center gap-1.5 text-xs text-gray-500">
                           <Users className="w-3.5 h-3.5" /> Flights
                         </div>
                         <span className="text-xs font-semibold text-gray-300">{c.flights.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-400" /> Avg Delay Timeline (August 2018)
            </h3>
            <p className="text-sm text-gray-400 mb-6">Tracking average daily delays across the 4 identified clusters over time.</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" tick={{fontSize: 12}} />
                  <YAxis stroke="#666" tick={{fontSize: 12}} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" name="C1 (Efficient)" dataKey="C1" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="C2 (Weathered)" dataKey="C2" stroke="#eab308" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="C3 (Congested)" dataKey="C3" stroke="#f97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="C4 (Problematic)" dataKey="C4" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </PageWrapper>
    </>
  );
}
