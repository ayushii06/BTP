"use client";

import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import MetricCard from "@/components/cards/MetricCard";
import { Clock, Building2, Route, Network, BrainCircuit, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Header title="Project Overview" />
      <PageWrapper>
        <div className="max-w-5xl mx-auto space-y-12">
          
          <section className="text-center py-10 relative overflow-hidden rounded-3xl border border-[#1f1f1f] bg-gradient-to-b from-[#111] to-[#0a0a0a]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <BrainCircuit className="w-4 h-4" />
                <span>Final Year B.Tech Project</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Analyzing and Optimizing <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                  Airplane Connectivity
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
                Using Machine Learning and Graph Algorithms to predict delays, 
                profile airports, and optimize flight networks.
              </p>
            </motion.div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Analytical Components</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard 
                title="Delay Prediction (ML)"
                value="82.4%"
                subtitle="Accuracy"
                icon={Clock}
                href="/delay-prediction"
                gradient="from-blue-500 to-indigo-500"
              />
              <MetricCard 
                title="Airport Profiling (Clustering)"
                value="4"
                subtitle="Distinct Profiles"
                icon={Building2}
                href="/airport-profiling"
                gradient="from-emerald-500 to-teal-500"
              />
              <MetricCard 
                title="Shortest Path Analysis"
                value="N/A"
                subtitle="Dijkstra Routing"
                icon={Route}
                href="/shortest-path"
                gradient="from-orange-500 to-amber-500"
              />
              <MetricCard 
                title="Connectivity Optimization"
                value="93.6%"
                subtitle="Delay Reduction"
                icon={Network}
                href="/mst-optimization"
                gradient="from-rose-500 to-pink-500"
              />
            </div>
          </section>
        </div>
      </PageWrapper>
    </>
  );
}
