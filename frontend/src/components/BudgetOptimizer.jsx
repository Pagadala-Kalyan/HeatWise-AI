import React, { useState } from 'react';
import { api } from '../services/api';
import { Coins, TrendingDown, Users, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export default function BudgetOptimizer({ onApplyPlan, onSelectZone, city = 'vijayawada' }) {
  const [budgetCrore, setBudgetCrore] = useState('10');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!budgetCrore || parseFloat(budgetCrore) <= 0) {
      setError("Please enter a valid positive budget amount.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.optimizeBudget(budgetCrore, city);
      setResults(data);
    } catch (err) {
      setError("Failed to calculate budget allocation. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate budget spend percentage
  const getSpendPercent = () => {
    if (!results || !budgetCrore) return 0;
    const requestedRupees = parseFloat(budgetCrore) * 10000000;
    if (requestedRupees === 0) return 0;
    return Math.min(100, (results.total_cost / requestedRupees) * 100);
  };

  const spendPercent = getSpendPercent();

  return (
    <div className="glass-panel glow-blue animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
        <Coins className="grad-text-cool" size={22} />
        Budget Allocation Optimizer
      </h2>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Enter your total funding limit. The decision engine runs a 0-1 Knapsack solver to maximize cooling ROI (Person-Degrees of Cooling).
      </p>

      <form onSubmit={handleOptimize} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>₹</span>
          <input
            type="number"
            value={budgetCrore}
            onChange={(e) => setBudgetCrore(e.target.value)}
            className="glass-input"
            placeholder="Enter budget"
            style={{ width: '100%', paddingLeft: '32px', paddingRight: '75px' }}
            min="0.5"
            max="100"
            step="0.5"
          />
          <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Crore</span>
        </div>
        <button type="submit" className="glass-btn primary" disabled={loading} style={{ minWidth: '120px' }}>
          {loading ? 'Solving...' : 'Optimize'}
        </button>
      </form>

      {error && (
        <div className="sub-card glow-red" style={{ display: 'flex', gap: '10px', padding: '14px', marginBottom: '20px', background: 'rgba(239, 68, 68, 0.04)', fontSize: '13px' }}>
          <ShieldAlert size={18} style={{ color: 'var(--primary-red)', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {results ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sub-card" style={{ background: 'rgba(59, 130, 246, 0.02)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Allocated Funds</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: 'var(--primary-blue)' }}>{results.total_cost_formatted}</h3>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>Unspent: {results.remaining_budget_formatted}</span>
              </div>
              
              <div className="sub-card" style={{ background: 'rgba(16, 185, 129, 0.02)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Cumulative Cooling</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: 'var(--primary-green)' }}>+{results.total_cooling_degrees}°C</h3>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>Estimated net drop</span>
              </div>
            </div>

            {/* Budget Utilization Progress Bar */}
            <div className="sub-card" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <span>Budget Spent</span>
                <span>{spendPercent.toFixed(0)}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${spendPercent}%`, 
                    background: `linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-green) 100%)` 
                  }}
                ></div>
              </div>
            </div>

            <div className="sub-card" style={{ background: 'rgba(245, 158, 11, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>HRI Protection index</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: 'var(--primary-orange)' }}>{results.total_people_benefited.toLocaleString()} people</h3>
                </div>
                <Users size={24} style={{ color: 'var(--primary-orange)', opacity: 0.8 }} />
              </div>
            </div>
          </div>

          {/* Selected Plan List */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Zap size={14} className="grad-text-cool" />
              Investment Priority Roadmap ({results.selected_zones.length})
            </h3>
            
            {results.selected_zones.length === 0 ? (
              <div className="sub-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                No projects fit within the specified budget. Try increasing the budget limit.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.selected_zones.map((zone, index) => (
                  <div 
                    key={zone.id} 
                    className="sub-card" 
                    onClick={() => onSelectZone && onSelectZone(zone.id)}
                    style={{ borderLeft: `4px solid var(--primary-green)`, background: 'rgba(255,255,255,0.005)', cursor: onSelectZone ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16,185,129,0.08)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, border: '1px solid rgba(16,185,129,0.2)' }}>
                          {index + 1}
                        </span>
                        <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{zone.name}</h4>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-blue)' }}>{zone.cost_formatted}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '8px', marginTop: '6px' }}>
                      <span>{zone.intervention}</span>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>-{zone.expected_cooling}°C impact</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {results.selected_zones.length > 0 && onApplyPlan && (
            <button 
              onClick={() => onApplyPlan(results.selected_zones)}
              className="glass-btn success"
              style={{ width: '100%', display: 'flex', gap: '8px', padding: '14px', fontSize: '13px', borderRadius: '12px' }}
            >
              <CheckCircle2 size={16} />
              Simulate Entire Plan on Map
            </button>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', gap: '12px', borderStyle: 'dashed' }}>
          <Coins size={36} style={{ strokeWidth: 1, opacity: 0.4 }} />
          <span style={{ fontSize: '13px' }}>Click "Optimize" to view results</span>
        </div>
      )}
    </div>
  );
}
