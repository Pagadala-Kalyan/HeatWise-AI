// API Client for HeatWise AI
// Includes a fully functional local fallback engine in case the FastAPI backend is not running

const API_BASE = '/api';

// Realistic mock data matching the backend's Vijayawada grid
const MOCK_ZONES = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "name": "One Town",
        "ndvi": 0.12,
        "building_density": 0.92,
        "albedo": 0.11,
        "actual_temp": 44.8,
        "population_density": 22000,
        "area_sq_km": 1.8,
        "expected_temp": 45.4,
        "residual_heat": -0.6,
        "priority_score": 8.6,
        "cause": "Dense Concrete & Heat Trapping Structures",
        "cause_confidence": 92,
        "cause_metric": "Building Density: 92% (Target: <65%)",
        "intervention": "Reflective Cool Roof Initiative",
        "intervention_details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
        "expected_cooling": 1.9,
        "cost": 25000000,
        "cost_formatted": "₹2.5 Crore",
        "timeframe": "6-9 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6075, 16.5125],
          [80.6225, 16.5125],
          [80.6225, 16.5275],
          [80.6075, 16.5275],
          [80.6075, 16.5125]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 2,
        "name": "Benz Circle",
        "center": [16.500, 80.648],
        "ndvi": 0.18,
        "building_density": 0.85,
        "albedo": 0.13,
        "actual_temp": 43.2,
        "population_density": 18000,
        "area_sq_km": 2.2,
        "expected_temp": 44.1,
        "residual_heat": -0.9,
        "priority_score": 6.4,
        "cause": "Dense Concrete & Heat Trapping Structures",
        "cause_confidence": 85,
        "cause_metric": "Building Density: 85% (Target: <65%)",
        "intervention": "Reflective Cool Roof Initiative",
        "intervention_details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
        "expected_cooling": 1.9,
        "cost": 25000000,
        "cost_formatted": "₹2.5 Crore",
        "timeframe": "6-9 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6405, 16.4925],
          [80.6555, 16.4925],
          [80.6555, 16.5075],
          [80.6405, 16.5075],
          [80.6405, 16.4925]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 3,
        "name": "Patamata",
        "ndvi": 0.32,
        "building_density": 0.65,
        "albedo": 0.16,
        "actual_temp": 40.5,
        "population_density": 12000,
        "area_sq_km": 3.0,
        "expected_temp": 41.4,
        "residual_heat": -0.9,
        "priority_score": 3.7,
        "cause": "Low Vegetation Canopy",
        "cause_confidence": 72,
        "cause_metric": "NDVI: 0.32 (Target: >0.35)",
        "intervention": "Urban Tree Canopy Expansion",
        "intervention_details": "Plant 350+ native shade trees (Neem, Gulmohar) along sidewalks and in pocket parks.",
        "expected_cooling": 2.8,
        "cost": 15000000,
        "cost_formatted": "₹1.5 Crore",
        "timeframe": "12-18 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6575, 16.4875],
          [80.6725, 16.4875],
          [80.6725, 16.5025],
          [80.6575, 16.5025],
          [80.6575, 16.4875]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 4,
        "name": "Governorpet",
        "ndvi": 0.15,
        "building_density": 0.88,
        "albedo": 0.12,
        "actual_temp": 43.9,
        "population_density": 20000,
        "area_sq_km": 1.5,
        "expected_temp": 44.7,
        "residual_heat": -0.8,
        "priority_score": 7.3,
        "cause": "Dense Concrete & Heat Trapping Structures",
        "cause_confidence": 88,
        "cause_metric": "Building Density: 88% (Target: <65%)",
        "intervention": "Reflective Cool Roof Initiative",
        "intervention_details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
        "expected_cooling": 1.9,
        "cost": 25000000,
        "cost_formatted": "₹2.5 Crore",
        "timeframe": "6-9 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6225, 16.5045],
          [80.6375, 16.5045],
          [80.6375, 16.5195],
          [80.6225, 16.5195],
          [80.6225, 16.5045]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 5,
        "name": "Gunadala",
        "ndvi": 0.38,
        "building_density": 0.52,
        "albedo": 0.17,
        "actual_temp": 39.2,
        "population_density": 8500,
        "area_sq_km": 3.5,
        "expected_temp": 39.9,
        "residual_heat": -0.7,
        "priority_score": 2.8,
        "cause": "Heat-Retaining Dark Surfaces",
        "cause_confidence": 65,
        "cause_metric": "Surface Albedo: 0.17 (Target: >0.18)",
        "intervention": "High-Albedo Cool Pavements",
        "intervention_details": "Resurface primary streets and parking areas with light-colored reflective asphalt coatings.",
        "expected_cooling": 1.4,
        "cost": 20000000,
        "cost_formatted": "₹2.0 Crore",
        "timeframe": "9-12 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6575, 16.5105],
          [80.6725, 16.5105],
          [80.6725, 16.5255],
          [80.6575, 16.5255],
          [80.6575, 16.5105]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 6,
        "name": "Vidyadharapuram",
        "ndvi": 0.22,
        "building_density": 0.78,
        "albedo": 0.14,
        "actual_temp": 42.5,
        "population_density": 15000,
        "area_sq_km": 2.8,
        "expected_temp": 43.3,
        "residual_heat": -0.8,
        "priority_score": 5.9,
        "cause": "Dense Concrete & Heat Trapping Structures",
        "cause_confidence": 78,
        "cause_metric": "Building Density: 78% (Target: <65%)",
        "intervention": "Reflective Cool Roof Initiative",
        "intervention_details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
        "expected_cooling": 1.9,
        "cost": 25000000,
        "cost_formatted": "₹2.5 Crore",
        "timeframe": "6-9 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.5925, 16.5225],
          [80.6075, 16.5225],
          [80.6075, 16.5375],
          [80.5925, 16.5375],
          [80.5925, 16.5225]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 7,
        "name": "Kanuru",
        "ndvi": 0.42,
        "building_density": 0.45,
        "albedo": 0.19,
        "actual_temp": 38.1,
        "population_density": 6000,
        "area_sq_km": 4.0,
        "expected_temp": 38.9,
        "residual_heat": -0.8,
        "priority_score": 1.5,
        "cause": "Heat-Retaining Dark Surfaces",
        "cause_confidence": 62,
        "cause_metric": "Surface Albedo: 0.19 (Target: >0.18)",
        "intervention": "High-Albedo Cool Pavements",
        "intervention_details": "Resurface primary streets and parking areas with light-colored reflective asphalt coatings.",
        "expected_cooling": 1.4,
        "cost": 20000000,
        "cost_formatted": "₹2.0 Crore",
        "timeframe": "9-12 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6775, 16.4725],
          [80.6925, 16.4725],
          [80.6925, 16.4875],
          [80.6775, 16.4875],
          [80.6775, 16.4725]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 8,
        "name": "Gollapudi",
        "ndvi": 0.55,
        "building_density": 0.28,
        "albedo": 0.20,
        "actual_temp": 36.8,
        "population_density": 3500,
        "area_sq_km": 5.0,
        "expected_temp": 36.5,
        "residual_heat": 0.3,
        "priority_score": 2.4,
        "cause": "Heat-Retaining Dark Surfaces",
        "cause_confidence": 62,
        "cause_metric": "Surface Albedo: 0.20 (Target: >0.18)",
        "intervention": "High-Albedo Cool Pavements",
        "intervention_details": "Resurface primary streets and parking areas with light-colored reflective asphalt coatings.",
        "expected_cooling": 1.4,
        "cost": 20000000,
        "cost_formatted": "₹2.0 Crore",
        "timeframe": "9-12 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.5675, 16.5375],
          [80.5825, 16.5375],
          [80.5825, 16.5525],
          [80.5675, 16.5525],
          [80.5675, 16.5375]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 9,
        "name": "Moghalrajpuram",
        "ndvi": 0.28,
        "building_density": 0.72,
        "albedo": 0.15,
        "actual_temp": 41.1,
        "population_density": 14000,
        "area_sq_km": 2.0,
        "expected_temp": 42.1,
        "residual_heat": -1.0,
        "priority_score": 4.1,
        "cause": "Low Vegetation Canopy",
        "cause_confidence": 75,
        "cause_metric": "NDVI: 0.28 (Target: >0.35)",
        "intervention": "Urban Tree Canopy Expansion",
        "intervention_details": "Plant 350+ native shade trees (Neem, Gulmohar) along sidewalks and in pocket parks.",
        "expected_cooling": 2.8,
        "cost": 15000000,
        "cost_formatted": "₹1.5 Crore",
        "timeframe": "12-18 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6375, 16.4975],
          [80.6525, 16.4975],
          [80.6525, 16.5125],
          [80.6375, 16.5125],
          [80.6375, 16.4975]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 10,
        "name": "Bhavanipuram",
        "ndvi": 0.35,
        "building_density": 0.58,
        "albedo": 0.17,
        "actual_temp": 39.8,
        "population_density": 11000,
        "area_sq_km": 2.5,
        "expected_temp": 40.5,
        "residual_heat": -0.7,
        "priority_score": 3.4,
        "cause": "Heat-Retaining Dark Surfaces",
        "cause_confidence": 62,
        "cause_metric": "Surface Albedo: 0.17 (Target: >0.18)",
        "intervention": "High-Albedo Cool Pavements",
        "intervention_details": "Resurface primary streets and parking areas with light-colored reflective asphalt coatings.",
        "expected_cooling": 1.4,
        "cost": 20000000,
        "cost_formatted": "₹2.0 Crore",
        "timeframe": "9-12 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.5825, 16.5175],
          [80.5975, 16.5175],
          [80.5975, 16.5325],
          [80.5825, 16.5325],
          [80.5825, 16.5175]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 11,
        "name": "Satyanarayanapuram",
        "ndvi": 0.20,
        "building_density": 0.82,
        "albedo": 0.13,
        "actual_temp": 42.9,
        "population_density": 17000,
        "area_sq_km": 1.9,
        "expected_temp": 43.7,
        "residual_heat": -0.8,
        "priority_score": 6.3,
        "cause": "Dense Concrete & Heat Trapping Structures",
        "cause_confidence": 82,
        "cause_metric": "Building Density: 82% (Target: <65%)",
        "intervention": "Reflective Cool Roof Initiative",
        "intervention_details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
        "expected_cooling": 1.9,
        "cost": 25000000,
        "cost_formatted": "₹2.5 Crore",
        "timeframe": "6-9 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6305, 16.5175],
          [80.6455, 16.5175],
          [80.6455, 16.5325],
          [80.6305, 16.5325],
          [80.6305, 16.5175]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 12,
        "name": "Krishnalanka",
        "ndvi": 0.25,
        "building_density": 0.80,
        "albedo": 0.14,
        "actual_temp": 41.8,
        "population_density": 19000,
        "area_sq_km": 2.1,
        "expected_temp": 42.6,
        "residual_heat": -0.8,
        "priority_score": 5.2,
        "cause": "Dense Concrete & Heat Trapping Structures",
        "cause_confidence": 80,
        "cause_metric": "Building Density: 80% (Target: <65%)",
        "intervention": "Reflective Cool Roof Initiative",
        "intervention_details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
        "expected_cooling": 1.9,
        "cost": 25000000,
        "cost_formatted": "₹2.5 Crore",
        "timeframe": "6-9 months"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [80.6225, 16.4875],
          [80.6375, 16.4875],
          [80.6375, 16.5025],
          [80.6225, 16.5025],
          [80.6225, 16.4875]
        ]]
      }
    }
  ]
};

export const api = {
  // Fetch city GeoJSON data
  async getCityData() {
    try {
      const response = await fetch(`${API_BASE}/city-data`);
      if (!response.ok) throw new Error("Backend response error");
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Loading local demonstration map data...", error);
      return JSON.parse(JSON.stringify(MOCK_ZONES));
    }
  },

  // Solve budget optimization problem (Knapsack)
  async optimizeBudget(budgetCrore) {
    try {
      const response = await fetch(`${API_BASE}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget_crore: parseFloat(budgetCrore) })
      });
      if (!response.ok) throw new Error("Backend optimization failed");
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Running local client-side optimization engine...", error);
      return localOptimize(parseFloat(budgetCrore));
    }
  },

  // Run a what-if microclimate simulation
  async simulateIntervention(zoneId, trees, coolRoofsPercent, pavement) {
    try {
      const response = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone_id: parseInt(zoneId),
          trees_added: parseInt(trees || 0),
          cool_roofs_percentage: parseInt(coolRoofsPercent || 0),
          reflective_pavement: !!pavement
        })
      });
      if (!response.ok) throw new Error("Backend simulation failed");
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Running local client-side physics simulator...", error);
      return localSimulate(zoneId, trees, coolRoofsPercent, pavement);
    }
  }
};

// Client-side exact Knapsack solver for the offline mode
function localOptimize(budgetCrore) {
  const budgetRupees = budgetCrore * 10000000;
  
  const items = MOCK_ZONES.features.map(f => {
    const props = f.properties;
    const population = Math.floor(props.population_density * props.area_sq_km);
    const benefit = props.expected_cooling * population;
    return {
      id: props.id,
      name: props.name,
      cost: props.cost,
      expected_cooling: props.expected_cooling,
      population,
      benefit,
      intervention: props.intervention,
      details: props.intervention_details
    };
  });

  const n = items.length;
  let bestValue = -1;
  let bestCombination = [];

  for (let i = 0; i < (1 << n); i++) {
    let currentComb = [];
    let currentCost = 0;
    let currentBenefit = 0;

    for (let j = 0; j < n; j++) {
      if ((i >> j) & 1) {
        currentComb.push(items[j]);
        currentCost += items[j].cost;
        currentBenefit += items[j].benefit;
      }
    }

    if (currentCost <= budgetRupees) {
      if (currentBenefit > bestValue) {
        bestValue = currentBenefit;
        bestCombination = currentComb;
      }
    }
  }

  const totalCost = bestCombination.reduce((sum, item) => sum + item.cost, 0);
  const totalCooling = bestCombination.reduce((sum, item) => sum + item.expected_cooling, 0);
  const totalPeople = bestCombination.reduce((sum, item) => sum + item.population, 0);

  const selectedZones = bestCombination.map(item => ({
    id: item.id,
    name: item.name,
    cost: item.cost,
    cost_formatted: `₹${(item.cost / 10000000).toFixed(1)} Cr`,
    expected_cooling: item.expected_cooling,
    intervention: item.intervention,
    details: item.details,
    population: item.population
  }));

  selectedZones.sort((a, b) => (b.expected_cooling / b.cost) - (a.expected_cooling / a.cost));

  return {
    selected_zones: selectedZones,
    total_cost: totalCost,
    total_cost_formatted: `₹${(totalCost / 10000000).toFixed(2)} Cr`,
    total_cooling_degrees: parseFloat(totalCooling.toFixed(1)),
    total_people_benefited: totalPeople,
    remaining_budget: budgetRupees - totalCost,
    remaining_budget_formatted: `₹${((budgetRupees - totalCost) / 10000000).toFixed(2)} Cr`
  };
}

// Client-side simulator for the offline mode
function localSimulate(zoneId, trees, coolRoofsPercent, pavement) {
  const zone = MOCK_ZONES.features.find(f => f.properties.id === parseInt(zoneId));
  if (!zone) return null;

  const props = zone.properties;
  
  const ndviDelta = parseInt(trees || 0) * 0.0012;
  const ndviNew = Math.min(0.85, props.ndvi + ndviDelta);

  const albedoDeltaRoofs = (parseInt(coolRoofsPercent || 0) / 100) * 0.08;
  const albedoDeltaPave = pavement ? 0.04 : 0;
  const albedoNew = Math.min(0.35, props.albedo + albedoDeltaRoofs + albedoDeltaPave);

  const densityDelta = (parseInt(trees || 0) * 0.0002) + ((parseInt(coolRoofsPercent || 0) / 100) * 0.02);
  const densityNew = Math.max(0.1, props.building_density - densityDelta);

  // Re-predict expected temp using client-side regression formula approximation:
  // Temp = 42.0 - 10 * NDVI + 6 * Density - 8 * Albedo
  const expectedTempOrig = 42.0 - 10.0 * props.ndvi + 6.0 * props.building_density - 8.0 * props.albedo;
  const expectedTempNew = 42.0 - 10.0 * ndviNew + 6.0 * densityNew - 8.0 * albedoNew;

  // Temperature reduction due to physical changes
  const tempReduction = (ndviNew - props.ndvi) * 11.5 + (albedoNew - props.albedo) * 9.5;
  const actualTempNew = Math.max(30.0, props.actual_temp - tempReduction);
  const residualHeatNew = actualTempNew - expectedTempNew;

  return {
    zone_id: parseInt(zoneId),
    name: props.name,
    original: {
      ndvi: props.ndvi,
      albedo: props.albedo,
      building_density: props.building_density,
      actual_temp: props.actual_temp,
      expected_temp: parseFloat(expectedTempOrig.toFixed(1)),
      residual_heat: props.residual_heat
    },
    simulated: {
      ndvi: parseFloat(ndviNew.toFixed(3)),
      albedo: parseFloat(albedoNew.toFixed(3)),
      building_density: parseFloat(densityNew.toFixed(3)),
      actual_temp: parseFloat(actualTempNew.toFixed(1)),
      expected_temp: parseFloat(expectedTempNew.toFixed(1)),
      residual_heat: parseFloat(residualHeatNew.toFixed(1)),
      temp_reduction: parseFloat(tempReduction.toFixed(1))
    }
  };
}
