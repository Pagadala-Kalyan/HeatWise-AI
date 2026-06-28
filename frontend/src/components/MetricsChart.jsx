import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChart3 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MetricsChart({ geoJsonData, simulatedZoneData }) {
  if (!geoJsonData || !geoJsonData.features) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', fontSize: '13px' }}>
        Loading charts...
      </div>
    );
  }

  // Display only the top 12 hotspot zones sorted by residual heat
  const features = [...geoJsonData.features]
    .sort((a, b) => b.properties.residual_heat - a.properties.residual_heat)
    .slice(0, 12);
  
  const labels = features.map(f => f.properties.name);
  
  // Use simulated temperature if we have active simulated zone data
  const actualTemps = features.map(f => {
    const props = f.properties;
    if (simulatedZoneData && simulatedZoneData.zone_id === props.id) {
      return simulatedZoneData.simulated.actual_temp;
    }
    return props.actual_temp;
  });

  const expectedTemps = features.map(f => {
    const props = f.properties;
    if (simulatedZoneData && simulatedZoneData.zone_id === props.id) {
      return simulatedZoneData.simulated.expected_temp;
    }
    return props.expected_temp;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Expected Temp (AI Baseline)',
        data: expectedTemps,
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'rgba(59, 130, 246, 0.95)',
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: 'Actual Temp (Satellite Observed)',
        data: actualTemps,
        backgroundColor: 'rgba(239, 68, 68, 0.55)',
        borderColor: 'rgba(239, 68, 68, 0.95)',
        borderWidth: 1.5,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            family: 'Inter',
            size: 11,
            weight: '500'
          },
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        titleFont: {
          family: 'Outfit',
          weight: '600'
        },
        bodyFont: {
          family: 'Inter'
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.raw.toFixed(1)}°C`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawOnChartArea: true,
          drawTicks: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter',
            size: 9
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        min: 30, // Focus on the relevant temperature scale
        max: 50,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawTicks: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter',
            size: 10
          },
          stepSize: 5
        }
      }
    }
  };

  return (
    <div className="glass-panel glow-blue animate-fade-in" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
        <BarChart3 size={18} className="grad-text-cool" />
        Temperature Deviations: Actual vs Expected AI Model Baseline
      </h3>
      <div style={{ flexGrow: 1, position: 'relative', minHeight: '260px' }}>
        <Bar data={data} options={options} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
        <span>⚠️ Anomaly: Actual (Red) &gt; Expected (Blue)</span>
        <span>✅ Optimal: Actual (Red) &lt;= Expected (Blue)</span>
      </div>
    </div>
  );
}
