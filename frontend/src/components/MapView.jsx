import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper component to center/fit the map bounds when data loads
function MapBoundsController({ geoJsonData, selectedZone }) {
  const map = useMap();
  
  useEffect(() => {
    if (geoJsonData && geoJsonData.features && geoJsonData.features.length > 0) {
      const geojsonLayer = L.geoJSON(geoJsonData);
      map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20] });
    }
  }, [geoJsonData, map]);

  useEffect(() => {
    if (selectedZone && selectedZone.geometry) {
      const center = L.geoJSON(selectedZone).getBounds().getCenter();
      map.setView(center, 14, { animate: true });
    }
  }, [selectedZone, map]);

  return null;
}

export default function MapView({ 
  geoJsonData, 
  selectedZone, 
  onSelectZone, 
  activeLayer, 
  simulatedZoneData 
}) {
  
  // Style function for coloring polygons based on active layer
  const getStyle = (feature) => {
    const props = feature.properties;
    const isSelected = selectedZone && selectedZone.properties.id === props.id;
    
    // Check if this zone is currently simulated
    const isSimulated = simulatedZoneData && simulatedZoneData.zone_id === props.id;
    const data = isSimulated ? simulatedZoneData.simulated : props;
    
    let color = '#3B82F6';
    let fillOpacity = 0.6;

    if (activeLayer === 'actual_temp') {
      const temp = data.actual_temp;
      if (temp > 43.5) color = '#991B1B'; // Extreme Red
      else if (temp > 41.5) color = '#EF4444'; // Hot Red
      else if (temp > 39.5) color = '#F59E0B'; // Amber
      else if (temp > 37.5) color = '#10B981'; // Green
      else color = '#3B82F6'; // Cool Blue
    } 
    else if (activeLayer === 'residual_heat') {
      // Residual is Actual - Expected. Hot anomalies are positive.
      const res = data.residual_heat;
      if (res > 2.0) color = '#D946EF'; // Deep Magenta / Extreme Anomaly
      else if (res > 0.5) color = '#EF4444'; // Red / High Anomaly
      else if (res > -0.5) color = '#6B7280'; // Neutral Grey
      else if (res > -1.5) color = '#10B981'; // Green / Shaded Cool
      else color = '#3B82F6'; // Blue / Deep Cooling
    } 
    else if (activeLayer === 'ndvi') {
      const ndvi = data.ndvi;
      if (ndvi > 0.45) color = '#064E3B'; // Dark Forest Green
      else if (ndvi > 0.3) color = '#10B981'; // Leaf Green
      else if (ndvi > 0.2) color = '#F59E0B'; // Dry Grass Yellow
      else color = '#78350F'; // Barren Earth Brown
    } 
    else if (activeLayer === 'building_density') {
      const density = data.building_density;
      if (density > 0.8) color = '#E2E8F0'; // Concrete White/Grey
      else if (density > 0.6) color = '#94A3B8'; // Medium Grey
      else if (density > 0.4) color = '#475569'; // Low Grey
      else color = '#1E293B'; // Dark Slate
    }

    return {
      fillColor: color,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#3B82F6' : 'rgba(255,255,255,0.15)',
      dashArray: isSelected ? '0' : '3',
      fillOpacity: isSelected ? 0.8 : fillOpacity
    };
  };

  // Event handler for each feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onSelectZone(feature);
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.8,
          weight: selectedZone && selectedZone.properties.id === feature.properties.id ? 3 : 2,
          color: '#ffffff'
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(getStyle(feature));
      }
    });
  };

  return (
    <div style={{ height: '100%', minHeight: '400px', position: 'relative' }}>
      <MapContainer 
        center={[16.506, 80.648]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        zoomControl={true}
      >
        {/* CartoDB Dark Matter basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {geoJsonData && (
          <GeoJSON 
            key={`${activeLayer}-${selectedZone ? selectedZone.properties.id : 'none'}-${simulatedZoneData ? simulatedZoneData.zone_id : 'none'}`}
            data={geoJsonData}
            style={getStyle}
            onEachFeature={onEachFeature}
          />
        )}
        
        <MapBoundsController geoJsonData={geoJsonData} selectedZone={selectedZone} />
      </MapContainer>
      
      {/* Map Legend Floating Container */}
      <div className="glass-panel" style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '12px 16px',
        pointerEvents: 'auto',
        background: 'rgba(10, 15, 30, 0.85)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {activeLayer === 'actual_temp' && 'Surface Temp (°C)'}
          {activeLayer === 'residual_heat' && 'Residual Heat Anomaly (°C)'}
          {activeLayer === 'ndvi' && 'Vegetation Index (NDVI)'}
          {activeLayer === 'building_density' && 'Building Density (%)'}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activeLayer === 'actual_temp' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#991B1B', borderRadius: '2px' }}></span> &gt; 43.5°C (Extreme)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', borderRadius: '2px' }}></span> 41.5 - 43.5°C (Hot)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', borderRadius: '2px' }}></span> 39.5 - 41.5°C (Warm)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '2px' }}></span> 37.5 - 39.5°C (Optimal)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '2px' }}></span> &lt; 37.5°C (Cool)</div>
            </>
          )}
          {activeLayer === 'residual_heat' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#D946EF', borderRadius: '2px' }}></span> &gt; +2.0°C (Critical Hotspot Anomaly)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', borderRadius: '2px' }}></span> +0.5°C to +2.0°C (Investigate)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#6B7280', borderRadius: '2px' }}></span> -0.5°C to +0.5°C (Neutral)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '2px' }}></span> -1.5°C to -0.5°C (Optimal cooling)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '2px' }}></span> &lt; -1.5°C (Enhanced cooling)</div>
            </>
          )}
          {activeLayer === 'ndvi' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#064E3B', borderRadius: '2px' }}></span> &gt; 0.45 (Dense Canopy)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '2px' }}></span> 0.30 - 0.45 (Moderate Green)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', borderRadius: '2px' }}></span> 0.20 - 0.30 (Sparse / Grass)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#78350F', borderRadius: '2px' }}></span> &lt; 0.20 (Urban Core / Barren)</div>
            </>
          )}
          {activeLayer === 'building_density' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></span> &gt; 80% (Hyper-Dense Block)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#94A3B8', borderRadius: '2px' }}></span> 60% - 80% (Dense Residential)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#475569', borderRadius: '2px' }}></span> 40% - 60% (Medium Density)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#1E293B', borderRadius: '2px' }}></span> &lt; 40% (Low Density/Suburban)</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
