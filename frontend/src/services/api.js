// API Client for HeatWise AI
// Includes a fully functional local fallback engine in case the FastAPI backend is not running

const API_BASE = '/api';

// Realistic mock data matching the backend's Vijayawada grid
const CITY_ZONES = {
  vijayawada: [
    { id: 1, name: "One Town", center: [16.520, 80.615], ndvi: 0.12, density: 0.92, albedo: 0.11, actual_temp: 44.8, population_density: 22000, area_sq_km: 1.8 },
    { id: 2, name: "Benz Circle", center: [16.500, 80.648], ndvi: 0.18, density: 0.85, albedo: 0.13, actual_temp: 43.2, population_density: 18000, area_sq_km: 2.2 },
    { id: 3, name: "Patamata", center: [16.495, 80.665], ndvi: 0.32, density: 0.65, albedo: 0.16, actual_temp: 40.5, population_density: 12000, area_sq_km: 3.0 },
    { id: 4, name: "Governorpet", center: [16.512, 80.630], ndvi: 0.15, density: 0.88, albedo: 0.12, actual_temp: 43.9, population_density: 20000, area_sq_km: 1.5 },
    { id: 5, name: "Gunadala", center: [16.518, 80.665], ndvi: 0.38, density: 0.52, albedo: 0.17, actual_temp: 39.2, population_density: 8500, area_sq_km: 3.5 },
    { id: 6, name: "Vidyadharapuram", center: [16.530, 80.600], ndvi: 0.22, density: 0.78, albedo: 0.14, actual_temp: 42.5, population_density: 15000, area_sq_km: 2.8 },
    { id: 7, name: "Kanuru", center: [16.480, 80.685], ndvi: 0.42, density: 0.45, albedo: 0.19, actual_temp: 38.1, population_density: 6000, area_sq_km: 4.0 },
    { id: 8, name: "Gollapudi", center: [16.545, 80.575], ndvi: 0.55, density: 0.28, albedo: 0.20, actual_temp: 36.8, population_density: 3500, area_sq_km: 5.0 },
    { id: 9, name: "Moghalrajpuram", center: [16.505, 80.645], ndvi: 0.28, density: 0.72, albedo: 0.15, actual_temp: 41.1, population_density: 14000, area_sq_km: 2.0 },
    { id: 10, name: "Bhavanipuram", center: [16.525, 80.590], ndvi: 0.35, density: 0.58, albedo: 0.17, actual_temp: 39.8, population_density: 11000, area_sq_km: 2.5 },
    { id: 11, name: "Satyanarayanapuram", center: [16.525, 80.638], ndvi: 0.20, density: 0.82, albedo: 0.13, actual_temp: 42.9, population_density: 17000, area_sq_km: 1.9 },
    { id: 12, name: "Krishnalanka", center: [16.495, 80.630], ndvi: 0.25, density: 0.80, albedo: 0.14, actual_temp: 41.8, population_density: 19000, area_sq_km: 2.1 }
  ],
  hyderabad: [
    { id: 1, name: "Charminar", center: [17.3616, 78.4747], ndvi: 0.08, density: 0.95, albedo: 0.10, actual_temp: 45.5, population_density: 28000, area_sq_km: 1.6 },
    { id: 2, name: "Gachibowli", center: [17.4401, 78.3489], ndvi: 0.24, density: 0.68, albedo: 0.16, actual_temp: 42.0, population_density: 9000, area_sq_km: 3.8 },
    { id: 3, name: "Madhapur", center: [17.4483, 78.3741], ndvi: 0.15, density: 0.80, albedo: 0.14, actual_temp: 43.1, population_density: 14000, area_sq_km: 2.9 },
    { id: 4, name: "Jubilee Hills", center: [17.4278, 78.4063], ndvi: 0.46, density: 0.42, albedo: 0.19, actual_temp: 37.8, population_density: 5000, area_sq_km: 4.2 },
    { id: 5, name: "Banjara Hills", center: [17.4165, 78.4243], ndvi: 0.38, density: 0.50, albedo: 0.18, actual_temp: 39.0, population_density: 7500, area_sq_km: 3.5 },
    { id: 6, name: "Secunderabad", center: [17.4399, 78.4983], ndvi: 0.16, density: 0.85, albedo: 0.13, actual_temp: 43.5, population_density: 19000, area_sq_km: 2.5 },
    { id: 7, name: "Begumpet", center: [17.4448, 78.4598], ndvi: 0.28, density: 0.72, albedo: 0.15, actual_temp: 41.5, population_density: 13000, area_sq_km: 2.1 },
    { id: 8, name: "Kukatpally", center: [17.4933, 78.3976], ndvi: 0.12, density: 0.90, albedo: 0.12, actual_temp: 44.9, population_density: 24000, area_sq_km: 3.2 },
    { id: 9, name: "Mehdipatnam", center: [17.3958, 78.4311], ndvi: 0.18, density: 0.82, albedo: 0.13, actual_temp: 42.8, population_density: 17500, area_sq_km: 2.0 },
    { id: 10, name: "Dilsukhnagar", center: [17.3688, 78.5247], ndvi: 0.14, density: 0.89, albedo: 0.12, actual_temp: 44.2, population_density: 23000, area_sq_km: 2.3 },
    { id: 11, name: "Uppal", center: [17.4022, 78.5601], ndvi: 0.26, density: 0.62, albedo: 0.16, actual_temp: 40.8, population_density: 11000, area_sq_km: 3.0 },
    { id: 12, name: "Nampally", center: [17.3912, 78.4682], ndvi: 0.10, density: 0.88, albedo: 0.11, actual_temp: 44.0, population_density: 20500, area_sq_km: 1.8 }
  ],
  visakhapatnam: [
    { id: 1, name: "Jagadamba Centre", center: [17.7121, 83.3005], ndvi: 0.10, density: 0.90, albedo: 0.11, actual_temp: 43.8, population_density: 21000, area_sq_km: 1.5 },
    { id: 2, name: "MVP Colony", center: [17.7431, 83.3305], ndvi: 0.35, density: 0.60, albedo: 0.16, actual_temp: 39.5, population_density: 12500, area_sq_km: 2.8 },
    { id: 3, name: "Gajuwaka", center: [17.6908, 83.2085], ndvi: 0.12, density: 0.88, albedo: 0.12, actual_temp: 44.5, population_density: 18000, area_sq_km: 3.5 },
    { id: 4, name: "Madhurawada", center: [17.8185, 83.3485], ndvi: 0.45, density: 0.38, albedo: 0.20, actual_temp: 37.0, population_density: 6500, area_sq_km: 5.0 },
    { id: 5, name: "Rushikonda", center: [17.7815, 83.3785], ndvi: 0.55, density: 0.25, albedo: 0.22, actual_temp: 35.8, population_density: 3000, area_sq_km: 4.5 },
    { id: 6, name: "Seethammadhara", center: [17.7371, 83.3065], ndvi: 0.32, density: 0.65, albedo: 0.15, actual_temp: 40.1, population_density: 11000, area_sq_km: 2.2 },
    { id: 7, name: "Dwaraka Nagar", center: [17.7265, 83.3005], ndvi: 0.15, density: 0.86, albedo: 0.12, actual_temp: 43.0, population_density: 17000, area_sq_km: 1.7 },
    { id: 8, name: "Kurmannapalem", center: [17.6745, 83.1555], ndvi: 0.20, density: 0.72, albedo: 0.14, actual_temp: 42.5, population_density: 9500, area_sq_km: 4.0 },
    { id: 9, name: "Gopalapatnam", center: [17.7585, 83.2285], ndvi: 0.22, density: 0.78, albedo: 0.13, actual_temp: 41.8, population_density: 15000, area_sq_km: 2.4 },
    { id: 10, name: "Pendurthi", center: [17.7985, 83.1985], ndvi: 0.38, density: 0.42, albedo: 0.17, actual_temp: 38.0, population_density: 5500, area_sq_km: 4.8 },
    { id: 11, name: "Anakapalle", center: [17.6915, 83.0035], ndvi: 0.30, density: 0.70, albedo: 0.15, actual_temp: 41.0, population_density: 8000, area_sq_km: 3.6 },
    { id: 12, name: "Bheemunipatnam", center: [17.8885, 83.4485], ndvi: 0.48, density: 0.30, albedo: 0.19, actual_temp: 36.2, population_density: 4000, area_sq_km: 4.2 }
  ]
};

function calculateMockProperties(z) {
  const ndvi = z.ndvi;
  const density = z.density;
  const albedo = z.albedo;
  const actual = z.actual_temp;
  
  const expected = 42.0 - 10.0 * ndvi + 6.0 * density - 8.0 * albedo;
  const residual = actual - expected;
  const priority = Math.max(0, residual * 2.0 + (actual - 35.0));
  
  let cause = "";
  let confidence = 62;
  let metric = "";
  let severity = 0;
  
  if (ndvi < 0.25) {
    severity = (0.25 - ndvi) / 0.25;
    cause = "Low Vegetation Canopy";
    confidence = Math.min(98, Math.floor(70 + severity * 30));
    metric = `NDVI: ${ndvi.toFixed(2)} (Target: >0.35)`;
  } else if (density > 0.75) {
    severity = (density - 0.75) / 0.25;
    cause = "Dense Concrete & Heat Trapping Structures";
    confidence = Math.min(98, Math.floor(75 + severity * 25));
    metric = `Building Density: ${Math.floor(density * 100)}% (Target: <65%)`;
  } else if (albedo < 0.14) {
    severity = (0.14 - albedo) / 0.14;
    cause = "Heat-Retaining Dark Surfaces";
    confidence = Math.min(95, Math.floor(65 + severity * 35));
    metric = `Surface Albedo: ${albedo.toFixed(2)} (Target: >0.18)`;
  } else {
    const devs = [
      { name: "Low Vegetation Canopy", val: (0.35 - ndvi) / 0.35, metric: `NDVI: ${ndvi.toFixed(2)}` },
      { name: "Dense Concrete & Heat Trapping Structures", val: (density - 0.5) / 0.5, metric: `Building Density: ${Math.floor(density * 100)}%` },
      { name: "Heat-Retaining Dark Surfaces", val: (0.18 - albedo) / 0.18, metric: `Surface Albedo: ${albedo.toFixed(2)}` }
    ];
    devs.sort((a, b) => b.val - a.val);
    cause = devs[0].name;
    confidence = 62;
    metric = devs[0].metric;
  }
  
  let intervention = "";
  let details = "";
  let expected_cooling = 1.4;
  let cost = 20000000;
  let cost_formatted = "₹2.0 Crore";
  let timeframe = "9-12 months";
  
  if (cause.includes("Vegetation")) {
    intervention = "Urban Tree Canopy Expansion";
    details = "Plant 350+ native shade trees (Neem, Gulmohar) along sidewalks and in pocket parks.";
    expected_cooling = 2.8;
    cost = 15000000;
    cost_formatted = "₹1.5 Crore";
    timeframe = "12-18 months";
  } else if (cause.includes("Concrete")) {
    intervention = "Reflective Cool Roof Initiative";
    details = "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.";
    expected_cooling = 1.9;
    cost = 25000000;
    cost_formatted = "₹2.5 Crore";
    timeframe = "6-9 months";
  } else {
    intervention = "High-Albedo Cool Pavements";
    details = "Resurface primary streets and parking areas with light-colored reflective asphalt coatings.";
    expected_cooling = 1.4;
    cost = 20000000;
    cost_formatted = "₹2.0 Crore";
    timeframe = "9-12 months";
  }
  
  return {
    id: z.id,
    name: z.name,
    ndvi,
    building_density: density,
    albedo,
    actual_temp: actual,
    population_density: z.population_density,
    area_sq_km: z.area_sq_km,
    expected_temp: parseFloat(expected.toFixed(1)),
    residual_heat: parseFloat(residual.toFixed(1)),
    priority_score: parseFloat(priority.toFixed(1)),
    cause,
    cause_confidence: confidence,
    cause_metric: metric,
    intervention,
    intervention_details: details,
    expected_cooling,
    cost,
    cost_formatted,
    timeframe
  };
}

function buildCityGeoJSON(zones) {
  const offset = 0.0075;
  return {
    type: "FeatureCollection",
    features: zones.map(z => {
      const [lat, lon] = z.center;
      return {
        type: "Feature",
        properties: calculateMockProperties(z),
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lon - offset, lat - offset],
            [lon + offset, lat - offset],
            [lon + offset, lat + offset],
            [lon - offset, lat + offset],
            [lon - offset, lat - offset]
          ]]
        }
      };
    })
  };
}

async function fetchLiveTempOffline(lat, lon) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);
    if (response.ok) {
      const data = await response.json();
      return parseFloat(data.current.temperature_2m);
    }
  } catch (e) {
    console.warn("Failed to fetch live temp offline", e);
  }
  return 35.0;
}

function buildCustomMockDataset(city, lat, lon, baseTemp) {
  const step = 0.015;
  const zones = [];
  let zone_id = 1;

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const lat_off = (i - 3) * step;
      const lon_off = (j - 3) * step;
      
      const dist = Math.sqrt(Math.pow(i - 3, 2) + Math.pow(j - 3, 2));
      
      // Simple pseudo-random generator seeded by lat, lon, and cell indices
      const seed = Math.sin(lat * 10 + lon * 20 + i * 30 + j * 40) * 10000;
      const rand = () => {
        const x = Math.sin(seed + zone_id) * 10000;
        return x - Math.floor(x);
      };

      const density = Math.max(0.20, Math.min(0.95, 0.90 - 0.12 * dist + (rand() * 0.1 - 0.05)));
      const ndvi = Math.max(0.08, Math.min(0.65, 0.12 + 0.08 * dist + (rand() * 0.08 - 0.04)));
      const albedo = Math.max(0.09, Math.min(0.24, 0.11 + 0.02 * dist + (rand() * 0.04 - 0.02)));
      const pop = Math.floor(Math.max(1500, Math.min(35000, 25000 - 4500 * dist + (rand() * 2000 - 1000))));
      const area = parseFloat((1.5 + 0.5 * dist).toFixed(1));

      let name = `Zone ${String.fromCharCode(65 + i)}${j + 1}`;
      if (i === 3 && j === 3) {
        name = "City Core Center";
      } else if (dist < 1.5) {
        name = `Inner City Sector ${String.fromCharCode(65 + i)}${j + 1}`;
      } else if (dist > 3.0) {
        name = `Suburban Sector ${String.fromCharCode(65 + i)}${j + 1}`;
      }

      const t_var = 4.0 * density - 5.0 * ndvi - 2.5 * albedo;
      const noise = rand() * 0.3 - 0.15;
      const actual_temp = parseFloat((baseTemp + t_var + noise).toFixed(1));

      zones.push({
        id: zone_id,
        name,
        center: [lat + lat_off, lon + lon_off],
        ndvi,
        density,
        albedo,
        actual_temp,
        population_density: pop,
        area_sq_km: area
      });
      zone_id++;
    }
  }

  return buildCityGeoJSON(zones);
}

export const api = {
  isOffline: false,
  activeMockDataset: null,

  // Fetch city GeoJSON data
  async getCityData(city = "vijayawada", latitude = null, longitude = null) {
    try {
      let url = `${API_BASE}/city-data?city=${encodeURIComponent(city.toLowerCase())}`;
      if (latitude !== null && longitude !== null) {
        url += `&latitude=${latitude}&longitude=${longitude}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Backend response error");
      this.isOffline = false;
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Loading local demonstration map data...", error);
      this.isOffline = true;
      if (latitude !== null && longitude !== null) {
        const baseTemp = await fetchLiveTempOffline(latitude, longitude);
        this.activeMockDataset = buildCustomMockDataset(city, latitude, longitude, baseTemp);
      } else {
        const zones = CITY_ZONES[city.toLowerCase()] || CITY_ZONES.vijayawada;
        this.activeMockDataset = buildCityGeoJSON(zones);
      }
      return JSON.parse(JSON.stringify(this.activeMockDataset));
    }
  },

  // Solve budget optimization problem (Knapsack)
  async optimizeBudget(budgetCrore, city = "vijayawada", latitude = null, longitude = null) {
    try {
      const response = await fetch(`${API_BASE}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          budget_crore: parseFloat(budgetCrore), 
          city,
          latitude: latitude !== null ? parseFloat(latitude) : null,
          longitude: longitude !== null ? parseFloat(longitude) : null
        })
      });
      if (!response.ok) throw new Error("Backend optimization failed");
      this.isOffline = false;
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Running local client-side optimization engine...", error);
      this.isOffline = true;
      const zones = CITY_ZONES[city.toLowerCase()] || CITY_ZONES.vijayawada;
      const dataset = this.activeMockDataset || buildCityGeoJSON(zones);
      return localOptimize(parseFloat(budgetCrore), dataset);
    }
  },

  // Run a what-if microclimate simulation
  async simulateIntervention(zoneId, trees, coolRoofsPercent, pavement, city = "vijayawada", latitude = null, longitude = null) {
    try {
      const response = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone_id: parseInt(zoneId),
          trees_added: parseInt(trees || 0),
          cool_roofs_percentage: parseInt(coolRoofsPercent || 0),
          reflective_pavement: !!pavement,
          city,
          latitude: latitude !== null ? parseFloat(latitude) : null,
          longitude: longitude !== null ? parseFloat(longitude) : null
        })
      });
      if (!response.ok) throw new Error("Backend simulation failed");
      this.isOffline = false;
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Running local client-side physics simulator...", error);
      this.isOffline = true;
      const zones = CITY_ZONES[city.toLowerCase()] || CITY_ZONES.vijayawada;
      const dataset = this.activeMockDataset || buildCityGeoJSON(zones);
      return localSimulate(zoneId, trees, coolRoofsPercent, pavement, dataset);
    }
  },

  // Run batch microclimate simulations
  async simulateBatchInterventions(simulations, city = "vijayawada", latitude = null, longitude = null) {
    try {
      const response = await fetch(`${API_BASE}/simulate-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          simulations, 
          city,
          latitude: latitude !== null ? parseFloat(latitude) : null,
          longitude: longitude !== null ? parseFloat(longitude) : null
        })
      });
      if (!response.ok) throw new Error("Backend batch simulation failed");
      this.isOffline = false;
      return await response.json();
    } catch (error) {
      console.warn("Backend offline. Running local client-side batch simulation...", error);
      this.isOffline = true;
      const results = {};
      const zones = CITY_ZONES[city.toLowerCase()] || CITY_ZONES.vijayawada;
      const dataset = this.activeMockDataset || buildCityGeoJSON(zones);
      for (const sim of simulations) {
        const res = localSimulate(sim.zone_id, sim.trees_added, sim.cool_roofs_percentage, sim.reflective_pavement, dataset);
        if (res) {
          results[sim.zone_id.toString()] = res;
        }
      }
      return results;
    }
  }
};

// Client-side scaled 0-1 Knapsack solver for the offline mode
function localOptimize(budgetCrore, dataset) {
  const budgetRupees = budgetCrore * 10000000;
  
  const items = dataset.features.map(f => {
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
  
  let scaleFactor = 100000;
  if (budgetRupees < scaleFactor) {
    scaleFactor = 1;
  } else if (Math.floor(budgetRupees / scaleFactor) > 5000) {
    scaleFactor = Math.floor(budgetRupees / 5000);
  }
  const scaledBudget = Math.floor(budgetRupees / scaleFactor);
  
  const dp = Array.from({ length: n + 1 }, () => new Array(scaledBudget + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    const itemCost = Math.max(1, Math.floor(items[i-1].cost / scaleFactor));
    const itemBenefit = items[i-1].benefit;
    for (let w = 0; w <= scaledBudget; w++) {
      if (itemCost <= w) {
        dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w - itemCost] + itemBenefit);
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  const bestCombination = [];
  let w = scaledBudget;
  for (let i = n; i > 0; i--) {
    const itemCost = Math.max(1, Math.floor(items[i-1].cost / scaleFactor));
    if (dp[i][w] !== dp[i-1][w]) {
      bestCombination.push(items[i-1]);
      w -= itemCost;
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
function localSimulate(zoneId, trees, coolRoofsPercent, pavement, dataset) {
  const zone = dataset.features.find(f => f.properties.id === parseInt(zoneId));
  if (!zone) return null;

  const props = zone.properties;
  
  const ndviDelta = parseInt(trees || 0) * 0.0012;
  const ndviNew = Math.min(0.85, props.ndvi + ndviDelta);

  const albedoDeltaRoofs = (parseInt(coolRoofsPercent || 0) / 100) * 0.08;
  const albedoDeltaPave = pavement ? 0.04 : 0;
  const albedoNew = Math.min(0.35, props.albedo + albedoDeltaRoofs + albedoDeltaPave);

  const densityDelta = (parseInt(trees || 0) * 0.0002) + ((parseInt(coolRoofsPercent || 0) / 100) * 0.02);
  const densityNew = Math.max(0.1, props.building_density - densityDelta);

  const expectedTempOrig = 42.0 - 10.0 * props.ndvi + 6.0 * props.building_density - 8.0 * props.albedo;
  const expectedTempNew = 42.0 - 10.0 * ndviNew + 6.0 * densityNew - 8.0 * albedoNew;

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
