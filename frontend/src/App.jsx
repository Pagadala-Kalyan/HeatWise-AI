import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import MapView from './components/MapView';
import BudgetOptimizer from './components/BudgetOptimizer';
import WhatIfSimulator from './components/WhatIfSimulator';
import MetricsChart from './components/MetricsChart';
import { 
  Flame, 
  Leaf, 
  Building2, 
  Thermometer, 
  Map as MapIcon, 
  CheckCircle, 
  HelpCircle,
  TrendingDown, 
  Users,
  Compass,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeLayer, setActiveLayer] = useState('residual_heat'); // default layer
  const [simulatedZoneData, setSimulatedZoneData] = useState(null);
  const [activeRightTab, setActiveRightTab] = useState('diagnosis'); // 'diagnosis' or 'optimizer'
  
  // Stores batch simulation results when a budget plan is applied
  const [appliedPlanSimulations, setAppliedPlanSimulations] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Load initial city map data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await api.getCityData();
      setGeoJsonData(data);
      
      // Auto-select One Town (the hottest zone) on load
      if (data && data.features && data.features.length > 0) {
        const oneTown = data.features.find(f => f.properties.name === "One Town") || data.features[0];
        setSelectedZone(oneTown);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Handle single zone simulator outputs
  const handleSimulationComplete = (simData) => {
    setSimulatedZoneData(simData);
    setAppliedPlanSimulations(null); // Clear batch plan simulation when running single-zone What-If
  };

  const handleResetSimulation = () => {
    setSimulatedZoneData(null);
  };

  // Handle batch simulation of entire budget plan
  const handleApplyBudgetPlan = async (selectedPlanZones) => {
    if (!geoJsonData) return;
    
    // Simulate each zone in the plan
    const simulatedMap = {};
    for (const zone of selectedPlanZones) {
      // Create simulation values based on intervention
      let trees = 0;
      let coolRoofs = 0;
      let pavement = false;

      if (zone.intervention.includes("Tree")) {
        trees = 250;
      } else if (zone.intervention.includes("Roof")) {
        coolRoofs = 100;
      } else if (zone.intervention.includes("Pavement")) {
        pavement = true;
      }

      // Simulate client-side using our helper in api client
      const sim = await api.simulateIntervention(zone.id, trees, coolRoofs, pavement);
      if (sim) {
        simulatedMap[zone.id] = sim;
      }
    }
    
    setAppliedPlanSimulations(simulatedMap);
    setSimulatedZoneData(null); // Clear single simulator view
    setActiveRightTab('diagnosis'); // Switch to view the results on individual zones
    
    // Auto-select the first zone in the plan to show details
    if (selectedPlanZones.length > 0) {
      const targetFeature = geoJsonData.features.find(f => f.properties.id === selectedPlanZones[0].id);
      if (targetFeature) setSelectedZone(targetFeature);
    }
  };

  const handleClearPlanSimulation = () => {
    setAppliedPlanSimulations(null);
  };

  // Helper to resolve a zone's rendering properties (original vs single-simulated vs batch-simulated)
  const getZoneDisplayProps = (feature) => {
    const props = feature.properties;
    
    // Case 1: Single zone simulation is active for this zone
    if (simulatedZoneData && simulatedZoneData.zone_id === props.id) {
      return { ...props, ...simulatedZoneData.simulated, isSimulated: true };
    }
    
    // Case 2: Batch plan simulation is active and has data for this zone
    if (appliedPlanSimulations && appliedPlanSimulations[props.id]) {
      return { ...props, ...appliedPlanSimulations[props.id].simulated, isSimulated: true };
    }
    
    // Case 3: Return original data
    return { ...props, isSimulated: false };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#070a13', color: 'white', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(59, 130, 246, 0.1)', borderTopColor: 'var(--primary-blue)', animation: 'spin 1s linear infinite' }}></div>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 500 }}>Initializing HeatWise AI Engine...</h2>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const activeZoneProps = selectedZone ? getZoneDisplayProps(selectedZone) : null;

  // Compile stats for header metric cards
  const totalAnomalies = geoJsonData ? geoJsonData.features.filter(f => f.properties.residual_heat > 0.5).length : 0;
  const avgTemp = geoJsonData ? (geoJsonData.features.reduce((sum, f) => sum + f.properties.actual_temp, 0) / geoJsonData.features.length).toFixed(1) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
      {/* Header Panel */}
      <header className="glass-panel" style={{ margin: '12px 12px 0 12px', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', borderRadius: '14px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px', fontWeight: 800 }}>
            <span style={{ fontSize: '26px' }}>❄️</span>
            <span className="grad-text-cool">HeatWise AI</span>
          </h1>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
            AI-Powered Urban Cooling Decision Engine
          </span>
        </div>
        
        {/* Weather station badge */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', alignItems: 'center' }}>
          {appliedPlanSimulations && (
            <div className="glass-panel glow-green animate-pulse-slow" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', fontSize: '11px', color: 'var(--primary-green)', fontWeight: 600 }}>
              <CheckCircle size={14} />
              Optimized Plan Simulated
              <RotateCcw size={12} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={handleClearPlanSimulation} title="Clear Plan Simulation" />
            </div>
          )}
          <div className="glass-panel" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
            📍 <strong style={{ color: 'white' }}>Vijayawada, AP</strong>
          </div>
          <div className="glass-panel" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
            🌡️ Mean Temp: <strong style={{ color: 'var(--primary-red)' }}>{avgTemp}°C</strong>
          </div>
          <div className="glass-panel" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
            ⚠️ Hotspots: <strong style={{ color: 'var(--primary-orange)' }}>{totalAnomalies} zones</strong>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="dashboard-grid" style={{ flexGrow: 1, padding: '12px', overflow: 'hidden' }}>
        
        {/* Left Column: Map and Global Charts */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflow: 'hidden' }}>
          {/* Map Overlay Controls */}
          <div className="glass-panel" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapIcon size={14} /> Layer Overlay:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setActiveLayer('residual_heat')}
                className={`glass-btn ${activeLayer === 'residual_heat' ? 'primary' : ''}`}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                <Flame size={12} /> Residual Heat (USP)
              </button>
              <button 
                onClick={() => setActiveLayer('actual_temp')}
                className={`glass-btn ${activeLayer === 'actual_temp' ? 'primary' : ''}`}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                <Thermometer size={12} /> Observed Temp
              </button>
              <button 
                onClick={() => setActiveLayer('ndvi')}
                className={`glass-btn ${activeLayer === 'ndvi' ? 'primary' : ''}`}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                <Leaf size={12} /> Vegetation (NDVI)
              </button>
              <button 
                onClick={() => setActiveLayer('building_density')}
                className={`glass-btn ${activeLayer === 'building_density' ? 'primary' : ''}`}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                <Building2 size={12} /> Building Density
              </button>
            </div>
          </div>

          {/* Interactive Map */}
          <div style={{ flexGrow: 1, minHeight: '350px' }}>
            <MapView 
              geoJsonData={geoJsonData}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              activeLayer={activeLayer}
              simulatedZoneData={simulatedZoneData}
            />
          </div>

          {/* Comparative Chart */}
          <div style={{ height: '30%' }}>
            <MetricsChart 
              geoJsonData={geoJsonData}
              simulatedZoneData={simulatedZoneData}
            />
          </div>
        </section>

        {/* Right Column: Decisions, Simulator, and Optimizer */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflow: 'hidden' }}>
          {/* Tab Selector */}
          <div className="glass-panel" style={{ padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => setActiveRightTab('diagnosis')}
              className={`glass-btn ${activeRightTab === 'diagnosis' ? 'primary' : ''}`}
              style={{ border: 'none', borderRadius: '10px' }}
            >
              Diagnosis & Simulator
            </button>
            <button
              onClick={() => setActiveRightTab('optimizer')}
              className={`glass-btn ${activeRightTab === 'optimizer' ? 'primary' : ''}`}
              style={{ border: 'none', borderRadius: '10px' }}
            >
              Budget Optimizer (₹)
            </button>
          </div>

          {/* Tab Contents */}
          <div style={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
            {activeRightTab === 'optimizer' ? (
              <BudgetOptimizer onApplyPlan={handleApplyBudgetPlan} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
                
                {/* Zone Details / Diagnosis Panel */}
                {selectedZone ? (
                  <div className="glass-panel animate-fade-in" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--primary-blue)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Zone Analysis</span>
                        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{activeZoneProps.name}</h2>
                      </div>
                      
                      {activeZoneProps.isSimulated && (
                        <div style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: 'var(--primary-green)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>
                          Simulated Preview
                        </div>
                      )}
                    </div>

                    {/* Zone Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                      <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Observed Temp</span>
                        <h4 style={{ fontSize: '15px', color: activeZoneProps.actual_temp > 41 ? 'var(--primary-red)' : 'var(--text-primary)' }}>
                          {activeZoneProps.actual_temp}°C
                        </h4>
                      </div>
                      <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>AI Expected Temp</span>
                        <h4 style={{ fontSize: '15px' }}>{activeZoneProps.expected_temp}°C</h4>
                      </div>
                      <div className="glass-panel" style={{ 
                        padding: '10px', 
                        textAlign: 'center', 
                        background: activeZoneProps.residual_heat > 0.5 ? 'rgba(239,68,68,0.03)' : 'rgba(16,185,129,0.03)',
                        borderColor: activeZoneProps.residual_heat > 0.5 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
                      }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Residual Heat</span>
                        <h4 style={{ fontSize: '15px', color: activeZoneProps.residual_heat > 0.5 ? 'var(--primary-red)' : 'var(--primary-green)', fontWeight: 700 }}>
                          {activeZoneProps.residual_heat > 0 ? '+' : ''}{activeZoneProps.residual_heat}°C
                        </h4>
                      </div>
                    </div>

                    {/* Diagnosis details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.015)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Primary Heat Cause:</span>
                          <span style={{ fontSize: '11px', color: 'var(--primary-orange)', fontWeight: 600 }}>{activeZoneProps.cause_confidence}% Confidence</span>
                        </div>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertTriangle size={14} style={{ color: 'var(--primary-orange)' }} />
                          {activeZoneProps.cause}
                        </h4>
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block', marginTop: '3px' }}>
                          Sensor Metric: {activeZoneProps.cause_metric}
                        </span>
                      </div>

                      {/* Intervention recommendation */}
                      <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--primary-blue)', background: 'rgba(59,130,246,0.02)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--primary-blue)', fontWeight: 600, textTransform: 'uppercase' }}>AI Recommended Intervention</span>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{activeZoneProps.intervention}</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                          {activeZoneProps.intervention_details}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                          <span>Cost: <strong style={{ color: 'white' }}>{activeZoneProps.cost_formatted}</strong></span>
                          <span>Cooling ROI: <strong style={{ color: 'var(--primary-green)' }}>-{activeZoneProps.expected_cooling}°C</strong></span>
                          <span>Time: <strong style={{ color: 'white' }}>{activeZoneProps.timeframe}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Select a zone on the map to inspect details.
                  </div>
                )}
                
                {/* What-If Simulator section */}
                <div style={{ flexGrow: 1, minHeight: '280px' }}>
                  <WhatIfSimulator 
                    selectedZone={selectedZone}
                    onSimulationComplete={handleSimulationComplete}
                    onResetSimulation={handleResetSimulation}
                  />
                </div>

              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
