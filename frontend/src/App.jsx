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
  AlertTriangle,
  RotateCcw,
  Compass,
  Heart,
  ChevronDown
} from 'lucide-react';

const CITY_CONFIG = {
  vijayawada: {
    label: 'Vijayawada',
    state: 'Andhra Pradesh',
    center: [16.5062, 80.6480],
    zoom: 12
  },
  hyderabad: {
    label: 'Hyderabad',
    state: 'Telangana',
    center: [17.4065, 78.4772],
    zoom: 11
  },
  visakhapatnam: {
    label: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    center: [17.7231, 83.2985],
    zoom: 12
  }
};

export default function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeLayer, setActiveLayer] = useState('residual_heat'); // default layer
  const [simulatedZoneData, setSimulatedZoneData] = useState(null);
  const [activeRightTab, setActiveRightTab] = useState('diagnosis'); // 'diagnosis' or 'optimizer'
  const [selectedCity, setSelectedCity] = useState('vijayawada');
  
  // Stores batch simulation results when a budget plan is applied
  const [appliedPlanSimulations, setAppliedPlanSimulations] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Load initial city map data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setSelectedZone(null);
      setSimulatedZoneData(null);
      setAppliedPlanSimulations(null);
      const data = await api.getCityData(selectedCity);
      setGeoJsonData(data);
      setIsOffline(api.isOffline);
      
      // Auto-select the hottest zone on load
      if (data && data.features && data.features.length > 0) {
        const hottest = data.features.reduce((a, b) =>
          b.properties.actual_temp > a.properties.actual_temp ? b : a
        , data.features[0]);
        setSelectedZone(hottest);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedCity]);

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
    
    // Create batch simulation inputs
    const simulations = selectedPlanZones.map(zone => {
      let trees_added = 0;
      let cool_roofs_percentage = 0;
      let reflective_pavement = false;

      if (zone.intervention.includes("Tree")) {
        trees_added = 250;
      } else if (zone.intervention.includes("Roof")) {
        cool_roofs_percentage = 100;
      } else if (zone.intervention.includes("Pavement")) {
        reflective_pavement = true;
      }

      return {
        zone_id: zone.id,
        trees_added,
        cool_roofs_percentage,
        reflective_pavement
      };
    });

    const simulatedMap = await api.simulateBatchInterventions(simulations, selectedCity);
    
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#040712', color: 'white', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(59, 130, 246, 0.1)', borderTopColor: 'var(--primary-blue)', animation: 'spin 1s linear infinite' }}></div>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 500, letterSpacing: '0.02em' }}>Initializing HeatWise AI Engine...</h2>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
      
      {/* Sleek Floating Header Panel */}
      <header className="glass-panel" style={{ margin: '20px 32px 0 32px', padding: '16px 28px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 800 }}>
            <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.3))' }}>❄️</span>
            <span className="grad-text-cool">HeatWise AI</span>
          </h1>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            AI-Powered Urban Cooling Decision Engine
          </span>
        </div>
        
        {/* Header Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {appliedPlanSimulations && (
            <div className="glass-panel glow-green animate-pulse-slow" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.08)', fontSize: '12px', color: 'var(--primary-green)', fontWeight: 700, borderRadius: '10px' }}>
              <CheckCircle size={14} />
              Optimized Plan Simulated
              <RotateCcw size={12} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={handleClearPlanSimulation} title="Clear Plan Simulation" />
            </div>
          )}
          {isOffline ? (
            <div className="glass-panel" style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.08)', color: 'var(--primary-red)', fontSize: '12px', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }}></span>
              Offline Mode (Demo)
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.08)', color: 'var(--primary-green)', fontSize: '12px', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-green)', animation: 'pulseDot 2s infinite' }}></span>
              Live ML Backend
            </div>
          )}
          <div className="glass-panel" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, borderRadius: '10px' }}>
            📍
            <select
              id="city-selector"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 700,
                fontSize: '12px',
                fontFamily: 'Outfit, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                paddingRight: '20px'
              }}
            >
              {Object.entries(CITY_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key} style={{ background: '#0d1117', color: 'white' }}>
                  {cfg.label}, {cfg.state}
                </option>
              ))}
            </select>
            <ChevronDown size={12} style={{ color: 'var(--text-secondary)', marginLeft: '-16px', pointerEvents: 'none' }} />
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, borderRadius: '10px' }}>
            🌡️ Mean Temp: <strong style={{ color: 'var(--primary-red)' }}>{avgTemp}°C</strong>
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, borderRadius: '10px' }}>
            ⚠️ Hotspots: <strong style={{ color: 'var(--primary-orange)' }}>{totalAnomalies} zones</strong>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="dashboard-grid">
        
        {/* Left Column: Map and Global Charts (Breathing room & width) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Map Card */}
          <div className="glass-panel glow-blue" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Map Overlay Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapIcon size={16} className="grad-text-cool" /> Map Layer Overlay:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button 
                  onClick={() => setActiveLayer('residual_heat')}
                  className={`glass-btn ${activeLayer === 'residual_heat' ? 'primary' : ''}`}
                  style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '8px' }}
                >
                  <Flame size={12} /> Residual Heat (USP)
                </button>
                <button 
                  onClick={() => setActiveLayer('actual_temp')}
                  className={`glass-btn ${activeLayer === 'actual_temp' ? 'primary' : ''}`}
                  style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '8px' }}
                >
                  <Thermometer size={12} /> Observed Temp
                </button>
                <button 
                  onClick={() => setActiveLayer('ndvi')}
                  className={`glass-btn ${activeLayer === 'ndvi' ? 'primary' : ''}`}
                  style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '8px' }}
                >
                  <Leaf size={12} /> Vegetation (NDVI)
                </button>
                <button 
                  onClick={() => setActiveLayer('building_density')}
                  className={`glass-btn ${activeLayer === 'building_density' ? 'primary' : ''}`}
                  style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '8px' }}
                >
                  <Building2 size={12} /> Building Density
                </button>
              </div>
            </div>

            {/* Interactive Map Container */}
            <div style={{ height: '420px', position: 'relative' }}>
              <MapView 
                geoJsonData={geoJsonData}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                activeLayer={activeLayer}
                simulatedZoneData={simulatedZoneData}
              />
            </div>
          </div>

          {/* Comparative Chart Card */}
          <div style={{ minHeight: '360px' }}>
            <MetricsChart 
              geoJsonData={geoJsonData}
              simulatedZoneData={simulatedZoneData}
            />
          </div>
        </section>

        {/* Right Column: Decisions, Simulator, and Optimizer */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tab Selection Switch */}
          <div className="tab-container">
            <button
              onClick={() => setActiveRightTab('diagnosis')}
              className={`tab-btn ${activeRightTab === 'diagnosis' ? 'active' : ''}`}
            >
              <Compass size={14} /> Diagnosis & Simulator
            </button>
            <button
              onClick={() => setActiveRightTab('optimizer')}
              className={`tab-btn ${activeRightTab === 'optimizer' ? 'active' : ''}`}
            >
              <Heart size={14} /> Budget Optimizer (₹)
            </button>
          </div>

          {/* Tab Contents */}
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeRightTab === 'optimizer' ? (
              <BudgetOptimizer 
                onApplyPlan={handleApplyBudgetPlan} 
                city={selectedCity}
                onSelectZone={(zoneId) => {
                  if (!geoJsonData) return;
                  const zoneFeature = geoJsonData.features.find(f => f.properties.id === zoneId);
                  if (zoneFeature) {
                    setSelectedZone(zoneFeature);
                    setActiveRightTab('diagnosis');
                  }
                }}
              />
            ) : (
              <>
                {/* Zone Details / Diagnosis Panel */}
                {selectedZone ? (
                  <div className="glass-panel glow-red animate-fade-in" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--primary-blue)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Zone Analysis</span>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          {activeZoneProps.name}
                          {activeZoneProps.isSimulated && <span className="pulse-dot"></span>}
                        </h2>
                      </div>
                      
                      {activeZoneProps.isSimulated && (
                        <div style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: 'var(--primary-green)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 700 }}>
                          Simulated Preview
                        </div>
                      )}
                    </div>

                    {/* Zone Metrics Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                      <div className="glass-panel" style={{ padding: '14px 10px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>Observed Temp</span>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px', color: activeZoneProps.actual_temp > 41 ? 'var(--primary-red)' : 'var(--text-primary)' }}>
                          {activeZoneProps.actual_temp}°C
                        </h4>
                      </div>
                      <div className="glass-panel" style={{ padding: '14px 10px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>AI Expected</span>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px', color: 'var(--primary-blue)' }}>
                          {activeZoneProps.expected_temp}°C
                        </h4>
                      </div>
                      <div className="glass-panel" style={{ 
                        padding: '14px 10px', 
                        textAlign: 'center', 
                        background: activeZoneProps.residual_heat > 0.5 ? 'rgba(239,68,68,0.04)' : 'rgba(16,185,129,0.04)',
                        borderColor: activeZoneProps.residual_heat > 0.5 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                        borderRadius: '12px'
                      }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>Residual Heat</span>
                        <h4 style={{ fontSize: '18px', color: activeZoneProps.residual_heat > 0.5 ? 'var(--primary-red)' : 'var(--primary-green)', fontWeight: 800, marginTop: '6px' }}>
                          {activeZoneProps.residual_heat > 0 ? '+' : ''}{activeZoneProps.residual_heat}°C
                        </h4>
                      </div>
                    </div>

                    {/* Diagnosis details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="sub-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Primary Heat Cause:</span>
                          <span style={{ fontSize: '11px', color: 'var(--primary-orange)', fontWeight: 700 }}>{activeZoneProps.cause_confidence}% Confidence</span>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <AlertTriangle size={15} style={{ color: 'var(--primary-orange)' }} />
                          {activeZoneProps.cause}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
                          Metric Alert: <strong style={{ color: 'white', fontWeight: 500 }}>{activeZoneProps.cause_metric}</strong>
                        </span>
                      </div>

                      {/* Intervention recommendation */}
                      <div className="sub-card" style={{ borderLeft: '4px solid var(--primary-blue)', background: 'rgba(59,130,246,0.015)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--primary-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Recommended Intervention</span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{activeZoneProps.intervention}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                          {activeZoneProps.intervention_details}
                        </p>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px', marginTop: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Cost: <strong style={{ color: 'var(--text-primary)' }}>{activeZoneProps.cost_formatted}</strong></span>
                          <span style={{ color: 'var(--text-secondary)' }}>Cooling ROI: <strong style={{ color: 'var(--primary-green)', fontWeight: 700 }}>-{activeZoneProps.expected_cooling}°C</strong></span>
                          <span style={{ color: 'var(--text-secondary)' }}>Timeframe: <strong style={{ color: 'var(--text-primary)' }}>{activeZoneProps.timeframe}</strong></span>
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
                <div>
                  <WhatIfSimulator 
                    selectedZone={selectedZone}
                    city={selectedCity}
                    onSimulationComplete={handleSimulationComplete}
                    onResetSimulation={handleResetSimulation}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
