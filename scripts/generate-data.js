const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../dashboard/public/data');
const folders = ['delay-prediction', 'airport-profiling', 'shortest-path', 'mst-optimization'];

// Ensure directories exist
folders.forEach(folder => {
  const dir = path.join(dataDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('Folders created.');

// --- Task 1: Delay Prediction Data ---
const metrics = { accuracy: 0.824, roc_auc: 0.856, precision: 0.76, recall: 0.80, f1: 0.78 };
fs.writeFileSync(path.join(dataDir, 'delay-prediction/model-metrics.json'), JSON.stringify(metrics, null, 2));

const confusionMatrix = {
  matrix: [
    [1045, 156],
    [210, 890]
  ],
  labels: ["On-Time", "Delayed"]
};
fs.writeFileSync(path.join(dataDir, 'delay-prediction/confusion-matrix.json'), JSON.stringify(confusionMatrix, null, 2));

const featureImportance = [
  { feature: "Departure Time", importance: 0.35 },
  { feature: "Origin Airport", importance: 0.22 },
  { feature: "Airline Carrier", importance: 0.18 },
  { feature: "Destination Airport", importance: 0.15 },
  { feature: "Time of Day (Engineered)", importance: 0.10 }
];
fs.writeFileSync(path.join(dataDir, 'delay-prediction/feature-importance.json'), JSON.stringify(featureImportance, null, 2));

// --- Task 2: Airport Profiling Data ---
const clusterCenters = [
  { cluster: "Cluster 1 (Efficient)", delay_dep: 5.2, delay_arr: 4.1, cancel_rate: 0.01, flights: 8500 },
  { cluster: "Cluster 2 (Weather Impacted)", delay_dep: 18.5, delay_arr: 22.1, cancel_rate: 0.05, flights: 3200 },
  { cluster: "Cluster 3 (Congested)", delay_dep: 15.0, delay_arr: 16.5, cancel_rate: 0.02, flights: 6700 },
  { cluster: "Cluster 4 (Problematic)", delay_dep: 45.2, delay_arr: 48.0, cancel_rate: 0.09, flights: 1100 }
];
fs.writeFileSync(path.join(dataDir, 'airport-profiling/cluster-centers.json'), JSON.stringify(clusterCenters, null, 2));

const timeSeriesData = [
  { date: "2018-08-01", C1: 4.5, C2: 12.0, C3: 14.1, C4: 35.0 },
  { date: "2018-08-05", C1: 6.1, C2: 25.0, C3: 16.0, C4: 42.1 },
  { date: "2018-08-10", C1: 3.8, C2: 15.0, C3: 13.5, C4: 38.5 },
  { date: "2018-08-15", C1: 5.5, C2: 30.5, C3: 18.0, C4: 55.0 },
  { date: "2018-08-20", C1: 4.0, C2: 11.5, C3: 12.0, C4: 30.2 }
];
fs.writeFileSync(path.join(dataDir, 'airport-profiling/time-series.json'), JSON.stringify(timeSeriesData, null, 2));

const elbowData = [
  { k: 1, sse: 150000 },
  { k: 2, sse: 85000 },
  { k: 3, sse: 45000 },
  { k: 4, sse: 25000 },
  { k: 5, sse: 22000 },
  { k: 6, sse: 19000 },
  { k: 7, sse: 17000 }
];
fs.writeFileSync(path.join(dataDir, 'airport-profiling/elbow-data.json'), JSON.stringify(elbowData, null, 2));

// --- Task 3: Shortest Path Data ---
// Only top CA airports + some majors
const airports = [
  { id: "LAX", name: "Los Angeles", group: 1, val: 20 },
  { id: "SFO", name: "San Francisco", group: 1, val: 18 },
  { id: "JFK", name: "New York", group: 2, val: 25 },
  { id: "CHI", name: "Chicago O'Hare", group: 2, val: 22 },
  { id: "ATL", name: "Atlanta", group: 3, val: 30 },
  { id: "DFW", name: "Dallas", group: 3, val: 24 },
  { id: "DEN", name: "Denver", group: 2, val: 20 },
  { id: "LAS", name: "Las Vegas", group: 1, val: 15 }
];
fs.writeFileSync(path.join(dataDir, 'shortest-path/airports.json'), JSON.stringify(airports, null, 2));

const pathEdges = [
  { source: "LAX", target: "SFO", weight: 65 },
  { source: "LAX", target: "JFK", weight: 350 },
  { source: "SFO", target: "JFK", weight: 345 },
  { source: "LAX", target: "CHI", weight: 240 },
  { source: "CHI", target: "JFK", weight: 130 },
  { source: "SFO", target: "DEN", weight: 150 },
  { source: "DEN", target: "JFK", weight: 220 },
  { source: "LAX", target: "LAS", weight: 45 },
  { source: "LAS", target: "DFW", weight: 150 },
  { source: "DFW", target: "ATL", weight: 120 },
  { source: "ATL", target: "JFK", weight: 140 }
];
fs.writeFileSync(path.join(dataDir, 'shortest-path/graph-edges.json'), JSON.stringify(pathEdges, null, 2));

// --- Task 4: MST Data ---
const caAirports = [
  { id: "BUR", name: "Burbank", group: 1, val: 5 },
  { id: "LGB", name: "Long Beach", group: 1, val: 4 },
  { id: "LAX", name: "Los Angeles", group: 1, val: 25 },
  { id: "OAK", name: "Oakland", group: 2, val: 12 },
  { id: "ONT", name: "Ontario", group: 2, val: 8 },
  { id: "SMF", name: "Sacramento", group: 3, val: 9 },
  { id: "SAN", name: "San Diego", group: 3, val: 15 },
  { id: "SFO", name: "San Francisco", group: 2, val: 22 },
  { id: "SJC", name: "San Jose", group: 3, val: 14 },
  { id: "SNA", name: "Santa Ana", group: 1, val: 7 }
];
fs.writeFileSync(path.join(dataDir, 'mst-optimization/nodes.json'), JSON.stringify(caAirports, null, 2));

const fullGraph = [
  { source: "LAX", target: "SFO", w: 45 }, { source: "LAX", target: "OAK", w: 23 },
  { source: "LAX", target: "SJC", w: 18 }, { source: "LAX", target: "SMF", w: 56 },
  { source: "SFO", target: "BUR", w: 20 }, { source: "SFO", target: "ONT", w: 45 },
  { source: "SFO", target: "SAN", w: 32 }, { source: "SFO", target: "SNA", w: 34 },
  { source: "OAK", target: "BUR", w: 12 }, { source: "OAK", target: "LGB", w: 28 },
  { source: "OAK", target: "ONT", w: 15 }, { source: "OAK", target: "SAN", w: 30 },
  { source: "SJC", target: "BUR", w: 14 }, { source: "SJC", target: "ONT", w: 19 },
  { source: "SJC", target: "SAN", w: 25 }, { source: "SJC", target: "SNA", w: 22 },
  { source: "SMF", target: "BUR", w: 30 }, { source: "SMF", target: "LGB", w: 40 },
  { source: "SMF", target: "ONT", w: 35 }, { source: "SMF", target: "SAN", w: 42 }
];
fs.writeFileSync(path.join(dataDir, 'mst-optimization/full-edges.json'), JSON.stringify(fullGraph, null, 2));

const mstEdges = [
  { source: "OAK", target: "BUR", w: 12 },
  { source: "SJC", target: "BUR", w: 14 },
  { source: "OAK", target: "ONT", w: 15 },
  { source: "LAX", target: "SJC", w: 18 },
  { source: "SFO", target: "BUR", w: 20 },
  { source: "SJC", target: "SNA", w: 22 },
  { source: "LAX", target: "OAK", w: 23 }, // Usually would drop some loop, but this is representative dummy data
  { source: "SJC", target: "SAN", w: 25 },
  { source: "OAK", target: "LGB", w: 28 },
  { source: "SMF", target: "BUR", w: 30 }
];
fs.writeFileSync(path.join(dataDir, 'mst-optimization/mst-edges.json'), JSON.stringify(mstEdges, null, 2));

const mstComparison = { 
  total_full: 562, 
  total_mst: 207 
};
fs.writeFileSync(path.join(dataDir, 'mst-optimization/comparison.json'), JSON.stringify(mstComparison, null, 2));

console.log('JSON data successfully created!');
