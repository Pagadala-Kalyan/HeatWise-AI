import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sun, Leaf, HelpCircle, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WhatIfSimulator({ selectedZone, onSimulationComplete, onResetSimulation }) {
  const [trees, setTrees] = useState(0);
  const [coolRoofsPercent, setCoolRoofsPercent] = useState(0);
  const [pavement, setPavement] = useState(false);
  const [simResults, setSimResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset simulator values when a different zone is selected
  useEffect(() => {
    setTrees(0);
    setCoolRoofsPercent(0);
    setPavement(false);
    setSimResults(null);
  }, [selectedZone]);

  const handleSimulate = async () => {
    if (!selectedZone) return;
    setLoading(true);
    try {
      const data = await api.simulateIntervention(
        selectedZone.properties.id,
        trees,
        coolRoofsPercent,
        pavement
      );
      setSimResults(data);
      if (onSimulationComplete) {
        onSimulationComplete(data);
      }
    } catch (error) {
      console.error("Simulation run failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTrees(0);
    setCoolRoofsPercent(0);
    setPavement(false);
    setSimResults(null);
    if (onResetSimulation) {
      onResetSimulation();
    }
  };

  if (!selectedZone) {
    return (
      <div className="glass-panel" style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', gap: '12px', padding: '24px', borderStyle: 'dashed' }}>
        <HelpCircle size={36} style={{ opacity: 0.4 }} />
        <span style={{ fontSize: '13px', textAlign: 'center' }}>Select a neighborhood on the satellite map to run What-If simulations.</span>
      </div>
    );
  }

  const props = selectedZone.properties;

  return (
    <div className="glass-panel glow-green animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
        <Leaf className="grad-text-cool" size={22} />
        What-If Cooling Simulator
      </h2>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Tweak urban parameters in <strong>{props.name}</strong> to run microclimatic simulations and preview temperature drops.
      </p>

      {/* Simulator Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {/* Sliders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
            <span>Add Shade Trees</span>
            <span style={{ color: 'var(--primary-green)' }}>{trees} Trees</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="10"
            value={trees}
            onChange={(e) => setTrees(parseInt(e.target.value))}
            className="slider-green"
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span>0</span>
            <span>300 (Max Canopy)</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
            <span>Install Cool Roofs</span>
            <span style={{ color: 'var(--primary-blue)' }}>{coolRoofsPercent}% Roof area</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={coolRoofsPercent}
            onChange={(e) => setCoolRoofsPercent(parseInt(e.target.value))}
            className="slider-blue"
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span>0%</span>
            <span>100% (Full Retrofit)</span>
          </div>
        </div>

        {/* Checkbox Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: '4px 0' }}>
          <input
            type="checkbox"
            checked={pavement}
            onChange={(e) => setPavement(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
          />
          Apply Reflective Cool Pavement
        </label>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={handleSimulate} 
          disabled={loading || (!trees && !coolRoofsPercent && !pavement)}
          className="glass-btn primary" 
          style={{ flexGrow: 1 }}
        >
          {loading ? 'Simulating...' : 'Run Simulation'}
        </button>
        <button 
          onClick={handleReset}
          className="glass-btn danger" 
          title="Reset Parameters"
          style={{ width: '46px', padding: 0 }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Simulator Results */}
      {simResults ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Big Temperature Change Banner */}
          <div className="sub-card" style={{ borderLeft: '4px solid var(--primary-green)', background: 'rgba(16, 185, 129, 0.03)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Simulated Temp Reduction</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-green)', marginTop: '4px' }}>-{simResults.simulated.temp_reduction.toFixed(1)}°C</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Expected surface temperature drops from {simResults.original.actual_temp}°C to <strong style={{ color: 'white' }}>{simResults.simulated.actual_temp}°C</strong>.
            </p>
          </div>

          {/* Indicator comparison list inside sub-card */}
          <div className="sub-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Vegetation (NDVI)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{simResults.original.ndvi.toFixed(2)}</span>
                <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
                <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>{simResults.simulated.ndvi.toFixed(2)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Surface Albedo</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{simResults.original.albedo.toFixed(2)}</span>
                <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
                <span style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{simResults.simulated.albedo.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Building Density</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{Math.round(simResults.original.building_density * 100)}%</span>
                <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{Math.round(simResults.simulated.building_density * 100)}%</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Residual Heat Anomaly</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: simResults.original.residual_heat > 0 ? 'var(--primary-red)' : 'var(--primary-green)' }}>
                  {simResults.original.residual_heat > 0 ? '+' : ''}{simResults.original.residual_heat.toFixed(1)}°C
                </span>
                <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
                <span style={{ 
                  color: simResults.simulated.residual_heat > 0.5 ? 'var(--primary-orange)' : 'var(--primary-green)',
                  fontWeight: 700
                }}>
                  {simResults.simulated.residual_heat > 0 ? '+' : ''}{simResults.simulated.residual_heat.toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          {/* Anomaly Resolution Indicator */}
          {simResults.simulated.residual_heat <= 0.5 ? (
            <div className="sub-card" style={{ display: 'flex', gap: '10px', padding: '14px', background: 'rgba(16, 185, 129, 0.04)', fontSize: '11px', alignItems: 'center', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary-green)', flexShrink: 0 }} />
              <span style={{ color: 'var(--primary-green)', fontWeight: 500 }}>Success: Interventions have successfully resolved the microclimate hotspot anomaly.</span>
            </div>
          ) : (
            <div className="sub-card" style={{ display: 'flex', gap: '10px', padding: '14px', background: 'rgba(245, 158, 11, 0.04)', fontSize: '11px', alignItems: 'center', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              <AlertTriangle size={18} style={{ color: 'var(--primary-orange)', flexShrink: 0 }} />
              <span style={{ color: 'var(--primary-orange)', fontWeight: 500 }}>Partial Resolution: Residual heat remains positive. Consider increasing planting or albedo.</span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)', fontSize: '12px', border: '1px dashed var(--border-light)', borderRadius: '10px' }}>
          Adjust sliders above and click "Run Simulation" to model the changes.
        </div>
      )}
    </div>
  );
}
