"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle2, Clock, AlertTriangle, Target, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DelayPrediction() {
  const [metrics, setMetrics] = useState({});
  const [featureImportance, setFeatureImportance] = useState([]);
  const [confusionMatrix, setConfusionMatrix] = useState({ matrix: [], labels: [] });
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ airline: "Delta", origin: "LAX", dest: "JFK", time: "Morning" });
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsRes, featuresRes, cmRes] = await Promise.all([
          fetch("/data/delay-prediction/model-metrics.json").then((res) => res.json()),
          fetch("/data/delay-prediction/feature-importance.json").then((res) => res.json()),
          fetch("/data/delay-prediction/confusion-matrix.json").then((res) => res.json())
        ]);
        setMetrics(metricsRes);
        setFeatureImportance(featuresRes);
        setConfusionMatrix(cmRes);
      } catch (error) {
        console.error("Failed to load generic data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePredict = (e) => {
    e.preventDefault();
    setPrediction({ status: "checking" });
    setTimeout(() => {
      // Dummy logic for Phase 1 visualization
      const isDelayed = Math.random() > 0.5;
      setPrediction({
        status: "done",
        delayed: isDelayed,
        prob: isDelayed ? (0.6 + Math.random() * 0.3).toFixed(2) : (0.1 + Math.random() * 0.3).toFixed(2)
      });
    }, 1500);
  };

  if (loading) {
    return (
      <>
        <Header title="Delay Prediction" />
        <PageWrapper>
          <div className="flex h-64 items-center justify-center text-gray-500 animate-pulse">
            Loading ML Models...
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Header title="Flight Delay Prediction (Gradient Boosting)" />
      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Left Panel: Prediction Simulator */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" /> Model Simulator
              </h3>
              
              <form onSubmit={handlePredict} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Airline</label>
                  <select 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, airline: e.target.value})}
                  >
                    <option>Delta</option>
                    <option>American Airlines</option>
                    <option>United Airlines</option>
                    <option>Southwest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Origin</label>
                  <input type="text" value={formData.origin} onChange={(e)=>setFormData({...formData, origin: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Destination</label>
                  <input type="text" value={formData.dest} onChange={(e)=>setFormData({...formData, dest: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Time of Day</label>
                  <select 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={prediction?.status === "checking"}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                  {prediction?.status === "checking" ? (
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 animate-spin" /> Analyzing...</span>
                  ) : "Predict Delay"}
                </button>
              </form>

              {/* Prediction Result */}
              {prediction?.status === "done" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl border ${prediction.delayed ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/10"}`}
                >
                  <div className="flex items-center gap-3">
                    {prediction.delayed ? <AlertTriangle className="text-red-400" /> : <CheckCircle2 className="text-emerald-400" />}
                    <div>
                      <h4 className={`font-bold ${prediction.delayed ? "text-red-400" : "text-emerald-400"}`}>
                        {prediction.delayed ? "Flight Likely Delayed" : "Flight Expected On-Time"}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">Probability: {(parseFloat(prediction.prob) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Panel: Metrics & Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="Accuracy" value={metrics.accuracy} />
              <MetricBox label="ROC-AUC" value={metrics.roc_auc} />
              <MetricBox label="Precision" value={metrics.precision} />
              <MetricBox label="Recall" value={metrics.recall} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Importance Chart */}
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" /> Feature Importance
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={featureImportance} margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#666" />
                      <YAxis dataKey="feature" type="category" stroke="#999" width={100} tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }} />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                        {featureImportance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(220, 80%, ${60 - index * 5}%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Confusion Matrix (Simple visual representation) */}
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" /> Confusion Matrix
                </h3>
                <div className="grid grid-cols-2 gap-2 h-64">
                  <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-400">True Negative (On-Time)</span>
                    <span className="text-3xl font-bold text-emerald-400">{confusionMatrix.matrix[0]?.[0]}</span>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/20 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-400">False Positive</span>
                    <span className="text-3xl font-bold text-red-400">{confusionMatrix.matrix[0]?.[1]}</span>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/20 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-400">False Negative</span>
                    <span className="text-3xl font-bold text-red-400">{confusionMatrix.matrix[1]?.[0]}</span>
                  </div>
                  <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-400">True Positive (Delayed)</span>
                    <span className="text-3xl font-bold text-emerald-400">{confusionMatrix.matrix[1]?.[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
               <h4 className="font-semibold text-white mb-2">Model Details</h4>
               <p className="text-sm text-gray-400 leading-relaxed">
                 The predictive model uses a <strong>Gradient Boosting Classifier</strong> optimized with <code>GridSearchCV</code>. 
                 Due to strong class imbalance (much fewer delayed flights than on-time flights), we applied <strong>SMOTE (Synthetic Minority Over-sampling Technique)</strong> to balance the training data. The analysis shows that <strong>Departure Time</strong> and the <strong>Origin Airport</strong> are the most significant indicators of a potential flight delay.
               </p>
            </div>

          </div>
        </div>
      </PageWrapper>
    </>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col justify-center">
      <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-white mt-1">
        {typeof value === 'number' ? (value * 100).toFixed(1) + "%" : "-"}
      </span>
    </div>
  );
}
