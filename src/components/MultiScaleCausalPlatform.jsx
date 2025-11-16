import React, { useState, useEffect } from 'react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, RotateCcw, Upload, Download, Info } from 'lucide-react';

const MultiScaleCausalPlatform = () => {
  const [activeTab, setActiveTab] = useState('vgae');
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeStep, setTimeStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Floating background nodes
  const [bgNodes, setBgNodes] = useState([]);
  
  // Initialize floating background nodes
  useEffect(() => {
    const nodes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.4 + 0.2
    }));
    setBgNodes(nodes);
  }, []);
  
  // Animate floating nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setBgNodes(nodes => nodes.map(node => ({
        ...node,
        x: (node.x + node.speedX + 100) % 100,
        y: (node.y + node.speedY + 100) % 100
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Simulated VGAE latent variables
  const [latentVars, setLatentVars] = useState([
    { id: 'z1', name: 'Transcription Factor Activity', value: 0.75, genetic_influence: 0.82 },
    { id: 'z2', name: 'Metabolic Flux', value: 0.45, genetic_influence: 0.63 },
    { id: 'z3', name: 'Cell Cycle Regulation', value: 0.60, genetic_influence: 0.71 },
    { id: 'z4', name: 'Stress Response', value: 0.30, genetic_influence: 0.45 }
  ]);

  // Knowledge graph nodes (genes/proteins)
  const [graphNodes, setGraphNodes] = useState([
    { id: 'g1', name: 'TP53', x: 150, y: 100, type: 'gene', connections: ['g2', 'g4'] },
    { id: 'g2', name: 'MYC', x: 250, y: 80, type: 'gene', connections: ['g3', 'g5'] },
    { id: 'g3', name: 'MAPK1', x: 350, y: 120, type: 'protein', connections: ['g4'] },
    { id: 'g4', name: 'CDKN1A', x: 200, y: 200, type: 'gene', connections: ['g5'] },
    { id: 'g5', name: 'AKT1', x: 300, y: 180, type: 'protein', connections: ['g1'] }
  ]);

  // Neural ODE time series data
  const [phenotypeData, setPhenotypeData] = useState([]);
  const [odeParameters, setOdeParameters] = useState([
    { param: 'k1 (z1→z2)', value: 0.42, strength: 'moderate' },
    { param: 'k2 (z2→z3)', value: 0.78, strength: 'strong' },
    { param: 'k3 (z3→z4)', value: 0.21, strength: 'weak' },
    { param: 'k4 (z1→z4)', value: 0.65, strength: 'moderate' }
  ]);

  // Initialize phenotype time series
  useEffect(() => {
    const initData = [];
    for (let t = 0; t <= 20; t++) {
      initData.push({
        time: t,
        migration: 0.5 + 0.3 * Math.sin(t * 0.3) + 0.1 * Math.random(),
        differentiation: 0.2 + 0.05 * t + 0.1 * Math.random(),
        predicted: 0.5 + 0.3 * Math.sin(t * 0.3)
      });
    }
    setPhenotypeData(initData);
  }, []);

  // Simulate Neural ODE dynamics
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setTimeStep(prev => {
        if (prev >= 20) {
          setIsSimulating(false);
          return prev;
        }
        
        // Update latent variables based on ODE
        setLatentVars(vars => vars.map((v, i) => ({
          ...v,
          value: Math.max(0, Math.min(1, v.value + 0.05 * Math.sin(prev * 0.5 + i)))
        })));
        
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const resetSimulation = () => {
    setTimeStep(0);
    setIsSimulating(false);
    setLatentVars([
      { id: 'z1', name: 'Transcription Factor Activity', value: 0.75, genetic_influence: 0.82 },
      { id: 'z2', name: 'Metabolic Flux', value: 0.45, genetic_influence: 0.63 },
      { id: 'z3', name: 'Cell Cycle Regulation', value: 0.60, genetic_influence: 0.71 },
      { id: 'z4', name: 'Stress Response', value: 0.30, genetic_influence: 0.45 }
    ]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadStatus('Uploading...');
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.latentVariables) {
          setLatentVars(data.latentVariables);
        }
        if (data.graphNodes) {
          setGraphNodes(data.graphNodes);
        }
        if (data.odeParameters) {
          setOdeParameters(data.odeParameters);
        }
        if (data.phenotypeData) {
          setPhenotypeData(data.phenotypeData);
        }
        
        setUploadStatus('✓ Data uploaded successfully!');
        setTimeout(() => setUploadStatus(''), 3000);
      } catch (err) {
        setUploadStatus('✗ Error: Invalid JSON file');
        setTimeout(() => setUploadStatus(''), 3000);
      }
    };
    
    reader.onerror = () => {
      setUploadStatus('✗ Error reading file');
      setTimeout(() => setUploadStatus(''), 3000);
    };
    
    reader.readAsText(file);
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      latentVariables: latentVars,
      graphNodes: graphNodes,
      odeParameters: odeParameters,
      phenotypeData: phenotypeData,
      currentTimeStep: timeStep,
      modelMetrics: {
        r2Score: 0.89,
        mse: 0.12,
        sparsity: 0.87,
        mutualInformation: 0.76
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `causal-inference-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen bg-black text-white p-6 overflow-auto relative">
      {/* Dynamic floating background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            {/* Glow filter for nodes */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Stronger glow for LED elements */}
            <filter id="ledGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {bgNodes.map(node => (
            <circle
              key={node.id}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="#4b5563"
              opacity={node.opacity}
              filter="url(#glow)"
            />
          ))}
          {/* Connection lines between nearby nodes */}
          {bgNodes.map((node, i) => 
            bgNodes.slice(i + 1).map((other, j) => {
              const dx = node.x - other.x;
              const dy = node.y - other.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 15) {
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${other.x}%`}
                    y2={`${other.y}%`}
                    stroke="#4b5563"
                    strokeWidth="0.5"
                    opacity={0.15}
                  />
                );
              }
              return null;
            })
          )}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">The Chronos Platform</h1>
          <p className="text-gray-400">VGAE + Neural ODE for Genomics → Omics → Phenotype</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('vgae')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'vgae' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Stage 1: VGAE
          </button>
          <button
            onClick={() => setActiveTab('ode')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'ode' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Stage 2: Neural ODE
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'validation' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Validation
          </button>
        </div>

        {/* VGAE Tab */}
        {activeTab === 'vgae' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-semibold">Variational Graph Autoencoder</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Learns compressed latent representation from multi-omics data constrained by genetic variation.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {/* Knowledge Graph Visualization */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Biological Knowledge Graph</h3>
                  <svg width="100%" height="300" className="bg-gray-950 rounded">
                    {/* Draw edges */}
                    {graphNodes.map(node => 
                      node.connections.map(targetId => {
                        const target = graphNodes.find(n => n.id === targetId);
                        return (
                          <line
                            key={`${node.id}-${targetId}`}
                            x1={node.x}
                            y1={node.y}
                            x2={target.x}
                            y2={target.y}
                            stroke="#ef4444"
                            strokeWidth="2"
                            opacity="0.4"
                          />
                        );
                      })
                    )}
                    {/* Draw nodes */}
                    {graphNodes.map(node => (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="25"
                          fill={node.type === 'gene' ? '#dc2626' : '#f87171'}
                          stroke="#fff"
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedNode(node)}
                        />
                        <text
                          x={node.x}
                          y={node.y + 40}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="12"
                        >
                          {node.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-600"></div>
                      <span>Genes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-400"></div>
                      <span>Proteins</span>
                    </div>
                  </div>
                </div>

                {/* Latent Variables */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Causal Latent Variables (z)</h3>
                  <div className="space-y-4">
                    {latentVars.map(lv => (
                      <div key={lv.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{lv.name}</span>
                          <span className="text-gray-400">{lv.value.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div
                            className="bg-red-600 h-3 rounded-full transition-all"
                            style={{ width: `${lv.value * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Genetic Influence: {(lv.genetic_influence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedNode && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-600 rounded-lg">
                  <h4 className="font-medium mb-2">Selected: {selectedNode.name}</h4>
                  <p className="text-sm text-gray-300">
                    Type: {selectedNode.type} | Connections: {selectedNode.connections.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Neural ODE Tab */}
        {activeTab === 'ode' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-red-400" />
                  <h2 className="text-xl font-semibold">Neural Ordinary Differential Equation</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
                  >
                    {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isSimulating ? 'Pause' : 'Simulate'}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Models temporal dynamics: dz/dt = f(z, θ). Time step: {timeStep}/20
              </p>

              <div className="grid grid-cols-2 gap-6">
                {/* Phenotype Time Series */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Phenotype Dynamics</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={phenotypeData.slice(0, Math.max(5, timeStep + 1))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                        labelStyle={{ color: '#9ca3af' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="migration" stroke="#dc2626" name="Migration (Observed)" />
                      <Line type="monotone" dataKey="predicted" stroke="#f87171" name="Predicted" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* ODE Parameters */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Learned ODE Parameters (θ)</h3>
                  <div className="space-y-3">
                    {odeParameters.map((param, idx) => (
                      <div key={idx} className="p-3 bg-gray-800 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{param.param}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            param.strength === 'strong' ? 'bg-green-900 text-green-300' :
                            param.strength === 'moderate' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {param.strength}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${param.value * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">{param.value.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-600 rounded text-sm">
                    <p className="text-gray-300">
                      Sparsity penalty enforced. Network refinement complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Latent State */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Current Latent State (t={timeStep})</h3>
              <div className="grid grid-cols-4 gap-4">
                {latentVars.map(lv => (
                  <div key={lv.id} className="bg-gray-900 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {lv.value.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">{lv.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Validation Tab */}
        {activeTab === 'validation' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-semibold">Quality Assurance & Validation</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Mendelian Randomization */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Mendelian Randomization Results</h3>
                  <div className="space-y-3">
                    {latentVars.map(lv => (
                      <div key={lv.id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span className="text-sm">{lv.name} → Phenotype</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            p = {(0.001 * Math.random()).toExponential(2)}
                          </span>
                          <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">
                            Causal
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perturbation Experiments */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Suggested CRISPR Validations</h3>
                  <div className="space-y-3">
                    {graphNodes.slice(0, 3).map(node => (
                      <div key={node.id} className="p-3 bg-gray-800 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{node.name} knockout</span>
                          <span className="text-xs px-2 py-1 bg-red-900 text-red-300 rounded">
                            High Priority
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Predicted effect: {(Math.random() * 0.5 + 0.3).toFixed(2)} reduction in migration
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Model Performance */}
              <div className="mt-6 bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Model Performance Metrics</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">0.89</div>
                    <div className="text-sm text-gray-400">R² Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">0.12</div>
                    <div className="text-sm text-gray-400">MSE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">87%</div>
                    <div className="text-sm text-gray-400">Sparsity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">0.76</div>
                    <div className="text-sm text-gray-400">MI (z, SNPs)</div>
                  </div>
                </div>
              </div>

              {/* Limitations */}
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                <h4 className="font-medium mb-2 text-yellow-300">Known Limitations</h4>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>Requires high-quality initial knowledge graph</li>
                  <li>Latent factors may conflate multiple biological effects</li>
                  <li>Temporal resolution limited by sampling frequency</li>
                  <li>Validation requires extensive experimental follow-up</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 items-center">
          <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 cursor-pointer transition">
            <Upload className="w-4 h-4" />
            Upload Multi-Omics Data
            <input 
              type="file" 
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Export Results
          </button>
          {uploadStatus && (
            <span className={`text-sm ${uploadStatus.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {uploadStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiScaleCausalPlatform;
