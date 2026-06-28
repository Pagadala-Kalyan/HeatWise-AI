import json
import os

def generate_city_data(city_name="vijayawada"):
    city_name = city_name.lower()
    
    if city_name == "vijayawada":
        zones = [
            {
                "id": 1,
                "name": "One Town",
                "center": [16.520, 80.615],
                "ndvi": 0.12,          # Very low vegetation
                "density": 0.92,       # Extremely high density, narrow streets
                "albedo": 0.11,        # Dark asphalt and old roofs
                "actual_temp": 44.8,   # Extremely hot
                "population_density": 22000,
                "area_sq_km": 1.8
            },
            {
                "id": 2,
                "name": "Benz Circle",
                "center": [16.500, 80.648],
                "ndvi": 0.18,          # Low vegetation
                "density": 0.85,       # High density, commercial buildings, paved surfaces
                "albedo": 0.13,        # Concrete/Asphalt heavy
                "actual_temp": 43.2,   # Very hot
                "population_density": 18000,
                "area_sq_km": 2.2
            },
            {
                "id": 3,
                "name": "Patamata",
                "center": [16.495, 80.665],
                "ndvi": 0.32,          # Medium vegetation (residential gardens)
                "density": 0.65,       # Medium building density
                "albedo": 0.16,        # Average roofs and concrete
                "actual_temp": 40.5,   # Moderately hot
                "population_density": 12000,
                "area_sq_km": 3.0
            },
            {
                "id": 4,
                "name": "Governorpet",
                "center": [16.512, 80.630],
                "ndvi": 0.15,          # Low vegetation
                "density": 0.88,       # High commercial density
                "albedo": 0.12,        # Dense concrete surfaces
                "actual_temp": 43.9,   # Very hot
                "population_density": 20000,
                "area_sq_km": 1.5
            },
            {
                "id": 5,
                "name": "Gunadala",
                "center": [16.518, 80.665],
                "ndvi": 0.38,          # Moderately high vegetation, hilly surrounds
                "density": 0.52,       # Medium-low building density
                "albedo": 0.17,        # Rocky soil and some vegetation
                "actual_temp": 39.2,   # Cooler
                "population_density": 8500,
                "area_sq_km": 3.5
            },
            {
                "id": 6,
                "name": "Vidyadharapuram",
                "center": [16.530, 80.600],
                "ndvi": 0.22,          # Low-medium vegetation
                "density": 0.78,       # High density (industrial/residential mix)
                "albedo": 0.14,        # Metal roofs and concrete
                "actual_temp": 42.5,   # Hot
                "population_density": 15000,
                "area_sq_km": 2.8
            },
            {
                "id": 7,
                "name": "Kanuru",
                "center": [16.480, 80.685],
                "ndvi": 0.42,          # High vegetation (newer development with plots)
                "density": 0.45,       # Medium-low building density
                "albedo": 0.19,        # Mixed clay tiles and lighter paint
                "actual_temp": 38.1,   # Moderate
                "population_density": 6000,
                "area_sq_km": 4.0
            },
            {
                "id": 8,
                "name": "Gollapudi",
                "center": [16.545, 80.575],
                "ndvi": 0.55,          # Very high vegetation (agricultural boundary)
                "density": 0.28,       # Low building density
                "albedo": 0.20,        # Natural soils, vegetation, clay roofs
                "actual_temp": 36.8,   # Coolest zone
                "population_density": 3500,
                "area_sq_km": 5.0
            },
            {
                "id": 9,
                "name": "Moghalrajpuram",
                "center": [16.505, 80.645],
                "ndvi": 0.28,          # Medium-low vegetation
                "density": 0.72,       # Medium-high building density, rocky hillsides
                "albedo": 0.15,        # Mixed materials
                "actual_temp": 41.1,   # Moderately hot
                "population_density": 14000,
                "area_sq_km": 2.0
            },
            {
                "id": 10,
                "name": "Bhavanipuram",
                "center": [16.525, 80.590],
                "ndvi": 0.35,          # Medium vegetation (near riverbank park areas)
                "density": 0.58,       # Medium building density
                "albedo": 0.17,        # Balanced materials
                "actual_temp": 39.8,   # Moderate
                "population_density": 11000,
                "area_sq_km": 2.5
            },
            {
                "id": 11,
                "name": "Satyanarayanapuram",
                "center": [16.525, 80.638],
                "ndvi": 0.20,          # Low vegetation (residential grid layout)
                "density": 0.82,       # High building density
                "albedo": 0.13,        # Concrete roofs and streets
                "actual_temp": 42.9,   # Hot
                "population_density": 17000,
                "area_sq_km": 1.9
            },
            {
                "id": 12,
                "name": "Krishnalanka",
                "center": [16.495, 80.630],
                "ndvi": 0.25,          # Medium-low vegetation (dense houses near Krishna river)
                "density": 0.80,       # High building density
                "albedo": 0.14,        # Dark metal sheets and clay roofs
                "actual_temp": 41.8,   # Hot
                "population_density": 19000,
                "area_sq_km": 2.1
            }
        ]
    elif city_name == "hyderabad":
        zones = [
            {
                "id": 1,
                "name": "Charminar",
                "center": [17.3616, 78.4747],
                "ndvi": 0.08,          # Extremely dense heritage area
                "density": 0.95,
                "albedo": 0.10,
                "actual_temp": 45.5,
                "population_density": 28000,
                "area_sq_km": 1.6
            },
            {
                "id": 2,
                "name": "Gachibowli",
                "center": [17.4401, 78.3489],
                "ndvi": 0.24,          # High-rise commercial sector
                "density": 0.68,
                "albedo": 0.16,
                "actual_temp": 42.0,
                "population_density": 9000,
                "area_sq_km": 3.8
            },
            {
                "id": 3,
                "name": "Madhapur",
                "center": [17.4483, 78.3741],
                "ndvi": 0.15,          # Dense IT corridor
                "density": 0.80,
                "albedo": 0.14,
                "actual_temp": 43.1,
                "population_density": 14000,
                "area_sq_km": 2.9
            },
            {
                "id": 4,
                "name": "Jubilee Hills",
                "center": [17.4278, 78.4063],
                "ndvi": 0.46,          # High-canopy upscale residential area
                "density": 0.42,
                "albedo": 0.19,
                "actual_temp": 37.8,
                "population_density": 5000,
                "area_sq_km": 4.2
            },
            {
                "id": 5,
                "name": "Banjara Hills",
                "center": [17.4165, 78.4243],
                "ndvi": 0.38,          # Hilly, green residential/commercial
                "density": 0.50,
                "albedo": 0.18,
                "actual_temp": 39.0,
                "population_density": 7500,
                "area_sq_km": 3.5
            },
            {
                "id": 6,
                "name": "Secunderabad",
                "center": [17.4399, 78.4983],
                "ndvi": 0.16,          # Dense transit & commercial hub
                "density": 0.85,
                "albedo": 0.13,
                "actual_temp": 43.5,
                "population_density": 19000,
                "area_sq_km": 2.5
            },
            {
                "id": 7,
                "name": "Begumpet",
                "center": [17.4448, 78.4598],
                "ndvi": 0.28,          # Mid-city residential / airport zone
                "density": 0.72,
                "albedo": 0.15,
                "actual_temp": 41.5,
                "population_density": 13000,
                "area_sq_km": 2.1
            },
            {
                "id": 8,
                "name": "Kukatpally",
                "center": [17.4933, 78.3976],
                "ndvi": 0.12,          # High-density residential apartments
                "density": 0.90,
                "albedo": 0.12,
                "actual_temp": 44.9,
                "population_density": 24000,
                "area_sq_km": 3.2
            },
            {
                "id": 9,
                "name": "Mehdipatnam",
                "center": [17.3958, 78.4311],
                "ndvi": 0.18,          # Highly crowded junction/market
                "density": 0.82,
                "albedo": 0.13,
                "actual_temp": 42.8,
                "population_density": 17500,
                "area_sq_km": 2.0
            },
            {
                "id": 10,
                "name": "Dilsukhnagar",
                "center": [17.3688, 78.5247],
                "ndvi": 0.14,          # Hyper-congested commercial core
                "density": 0.89,
                "albedo": 0.12,
                "actual_temp": 44.2,
                "population_density": 23000,
                "area_sq_km": 2.3
            },
            {
                "id": 11,
                "name": "Uppal",
                "center": [17.4022, 78.5601],
                "ndvi": 0.26,          # Semi-industrial/residential boundary
                "density": 0.62,
                "albedo": 0.16,
                "actual_temp": 40.8,
                "population_density": 11000,
                "area_sq_km": 3.0
            },
            {
                "id": 12,
                "name": "Nampally",
                "center": [17.3912, 78.4682],
                "ndvi": 0.10,          # Transit terminal & markets
                "density": 0.88,
                "albedo": 0.11,
                "actual_temp": 44.0,
                "population_density": 20500,
                "area_sq_km": 1.8
            }
        ]
    elif city_name in ["visakhapatnam", "vizag"]:
        zones = [
            {
                "id": 1,
                "name": "Jagadamba Centre",
                "center": [17.7121, 83.3005],
                "ndvi": 0.10,          # Congested commercial core
                "density": 0.90,
                "albedo": 0.11,
                "actual_temp": 43.8,
                "population_density": 21000,
                "area_sq_km": 1.5
            },
            {
                "id": 2,
                "name": "MVP Colony",
                "center": [17.7431, 83.3305],
                "ndvi": 0.35,          # Large planned residential sector
                "density": 0.60,
                "albedo": 0.16,
                "actual_temp": 39.5,
                "population_density": 12500,
                "area_sq_km": 2.8
            },
            {
                "id": 3,
                "name": "Gajuwaka",
                "center": [17.6908, 83.2085],
                "ndvi": 0.12,          # Industrial and heavy truck corridor
                "density": 0.88,
                "albedo": 0.12,
                "actual_temp": 44.5,
                "population_density": 18000,
                "area_sq_km": 3.5
            },
            {
                "id": 4,
                "name": "Madhurawada",
                "center": [17.8185, 83.3485],
                "ndvi": 0.45,          # Developing green valley
                "density": 0.38,
                "albedo": 0.20,
                "actual_temp": 37.0,
                "population_density": 6500,
                "area_sq_km": 5.0
            },
            {
                "id": 5,
                "name": "Rushikonda",
                "center": [17.7815, 83.3785],
                "ndvi": 0.55,          # Scenic coastal hills & IT sector
                "density": 0.25,
                "albedo": 0.22,
                "actual_temp": 35.8,
                "population_density": 3000,
                "area_sq_km": 4.5
            },
            {
                "id": 6,
                "name": "Seethammadhara",
                "center": [17.7371, 83.3065],
                "ndvi": 0.32,          # Upper-middle class green colony
                "density": 0.65,
                "albedo": 0.15,
                "actual_temp": 40.1,
                "population_density": 11000,
                "area_sq_km": 2.2
            },
            {
                "id": 7,
                "name": "Dwaraka Nagar",
                "center": [17.7265, 83.3005],
                "ndvi": 0.15,          # Central business hub & shopping complex
                "density": 0.86,
                "albedo": 0.12,
                "actual_temp": 43.0,
                "population_density": 17000,
                "area_sq_km": 1.7
            },
            {
                "id": 8,
                "name": "Kurmannapalem",
                "center": [17.6745, 83.1555],
                "ndvi": 0.20,          # Residential area near steel plant
                "density": 0.72,
                "albedo": 0.14,
                "actual_temp": 42.5,
                "population_density": 9500,
                "area_sq_km": 4.0
            },
            {
                "id": 9,
                "name": "Gopalapatnam",
                "center": [17.7585, 83.2285],
                "ndvi": 0.22,          # Dense residential junction
                "density": 0.78,
                "albedo": 0.13,
                "actual_temp": 41.8,
                "population_density": 15000,
                "area_sq_km": 2.4
            },
            {
                "id": 10,
                "name": "Pendurthi",
                "center": [17.7985, 83.1985],
                "ndvi": 0.38,          # Suburban green boundary
                "density": 0.42,
                "albedo": 0.17,
                "actual_temp": 38.0,
                "population_density": 5500,
                "area_sq_km": 4.8
            },
            {
                "id": 11,
                "name": "Anakapalle",
                "center": [17.6915, 83.0035],
                "ndvi": 0.30,          # Outer agricultural/jaggery market town
                "density": 0.70,
                "albedo": 0.15,
                "actual_temp": 41.0,
                "population_density": 8000,
                "area_sq_km": 3.6
            },
            {
                "id": 12,
                "name": "Bheemunipatnam",
                "center": [17.8885, 83.4485],
                "ndvi": 0.48,          # Coastal historic town
                "density": 0.30,
                "albedo": 0.19,
                "actual_temp": 36.2,
                "population_density": 4000,
                "area_sq_km": 4.2
            }
        ]
    else:
        raise ValueError(f"Unknown city: {city_name}")

    features = []
    # Create rectangular bounding box grid for each zone
    # Offset of 0.0075 degrees lat/lon gives a rectangle of approx. 1.6km x 1.6km
    offset = 0.0075
    
    for z in zones:
        lat, lon = z["center"]
        
        # Build coordinates array: lon, lat order for GeoJSON compliance
        poly_coords = [
            [lon - offset, lat - offset],
            [lon + offset, lat - offset],
            [lon + offset, lat + offset],
            [lon - offset, lat + offset],
            [lon - offset, lat - offset] # Close the polygon
        ]
        
        feature = {
            "type": "Feature",
            "properties": {
                "id": z["id"],
                "name": z["name"],
                "ndvi": z["ndvi"],
                "building_density": z["density"],
                "albedo": z["albedo"],
                "actual_temp": z["actual_temp"],
                "population_density": z["population_density"],
                "area_sq_km": z["area_sq_km"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly_coords]
            }
        }
        features.append(feature)
        
    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Save directory
    os.makedirs(os.path.join(os.path.dirname(__file__), "..", "data"), exist_ok=True)
    out_path = os.path.join(os.path.dirname(__file__), "..", "data", f"{city_name}_grid.json")
    
    with open(out_path, "w") as f:
        json.dump(geojson_data, f, indent=2)
        
    print(f"Generated GeoJSON data for {len(zones)} zones in {out_path}")
    return geojson_data

import urllib.request
import numpy as np

def get_live_temperature(lat: float, lon: float) -> float:
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'HeatWise-AI-Agent'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return float(data["current"]["temperature_2m"])
    except Exception as e:
        print(f"Failed to fetch live temperature from Open-Meteo: {e}")
        # Fallback to a reasonable default temperature (e.g. 35.0)
        return 35.0

def fetch_osm_suburbs(lat: float, lon: float) -> list:
    url = "https://overpass-api.de/api/interpreter"
    query = f"""[out:json][timeout:10];
    (
      node["place"~"suburb|neighbourhood|quarter"](around:12000, {lat}, {lon});
    );
    out body 35;"""
    
    try:
        data = urllib.parse.urlencode({"data": query}).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={'User-Agent': 'HeatWise-AI-Agent'})
        with urllib.request.urlopen(req, timeout=8) as response:
            res = json.loads(response.read().decode())
            elements = res.get("elements", [])
            suburbs = []
            for el in elements:
                name = el.get("tags", {}).get("name")
                if name:
                    suburbs.append({
                        "name": name,
                        "lat": el.get("lat"),
                        "lon": el.get("lon")
                    })
            return suburbs
    except Exception as e:
        print(f"OSM Overpass suburb fetch failed: {e}")
        return []

def clip_polygon_py(poly, p1, p2):
    # Midpoint of the two sites
    mx = (p1["lon"] + p2["lon"]) / 2.0
    my = (p1["lat"] + p2["lat"]) / 2.0
    
    # Normal vector pointing to p1
    nx = p1["lon"] - p2["lon"]
    ny = p1["lat"] - p2["lat"]
    
    def is_inside(x, y):
        return (x - mx) * nx + (y - my) * ny > 0
        
    def get_intersection(x1, y1, x2, y2):
        num = (mx - x1) * nx + (my - y1) * ny
        den = (x2 - x1) * nx + (y2 - y1) * ny
        if abs(den) < 1e-9:
            return None
        t = num / den
        if 0 <= t <= 1:
            return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]
        return None
        
    clipped = []
    if not poly:
        return clipped
        
    for i in range(len(poly)):
        current = poly[i]
        next_pt = poly[(i + 1) % len(poly)]
        
        curr_inside = is_inside(current[0], current[1])
        next_inside = is_inside(next_pt[0], next_pt[1])
        
        if curr_inside:
            clipped.append(current)
            
        if curr_inside != next_inside:
            intersect = get_intersection(current[0], current[1], next_pt[0], next_pt[1])
            if intersect:
                clipped.append(intersect)
                
    return clipped

def smooth_polygon_py(coords, iterations=1):
    poly = list(coords)
    if not poly:
        return poly
        
    is_closed = False
    if len(poly) > 2 and poly[0][0] == poly[-1][0] and poly[0][1] == poly[-1][1]:
        poly.pop()
        is_closed = True
        
    for _ in range(iterations):
        next_poly = []
        for i in range(len(poly)):
            p0 = poly[i]
            p1 = poly[(i + 1) % len(poly)]
            
            # Chaikin's corner-cutting coefficients
            qx = 0.75 * p0[0] + 0.25 * p1[0]
            qy = 0.75 * p0[1] + 0.25 * p1[1]
            
            rx = 0.25 * p0[0] + 0.75 * p1[0]
            ry = 0.25 * p0[1] + 0.75 * p1[1]
            
            next_poly.append([qx, qy])
            next_poly.append([rx, ry])
        poly = next_poly
        
    if is_closed and poly:
        poly.append([poly[0][0], poly[0][1]])
        
    return poly

def generate_live_grid(lat: float, lon: float, city_name="Live Location"):
    # Fetch live base temp
    base_temp = get_live_temperature(lat, lon)
    
    # 1. Fetch real OSM suburbs
    suburbs = fetch_osm_suburbs(lat, lon)
    
    # Bounding box limits for the Voronoi grid
    min_lat, max_lat = lat - 0.03, lat + 0.03
    min_lon, max_lon = lon - 0.03, lon + 0.03
    
    # Fallback to synthetic suburbs if OSM fetch failed or returned too few nodes
    if len(suburbs) < 6:
        print("Using synthetic fallback suburbs...")
        suburbs = []
        fallback_names = [
            "Central Core", "North Gate", "East Extension", "South Hub", 
            "West District", "North-East Sector", "South-East Quarter", "South-West District", 
            "Riverside Wards", "Highland Belt", "Industrial Quarters", "Green Valley"
        ]
        for idx, name in enumerate(fallback_names):
            angle = (idx / len(fallback_names)) * 2 * np.pi
            r = 0.015 + 0.005 * np.sin(idx)
            suburbs.append({
                "name": name,
                "lat": lat + r * np.sin(angle),
                "lon": lon + r * np.cos(angle)
            })
            
    # Remove duplicates or extremely close coordinates to avoid clipping bugs
    unique_suburbs = []
    for s in suburbs:
        if not any(abs(s["lat"] - u["lat"]) < 1e-4 and abs(s["lon"] - u["lon"]) < 1e-4 for u in unique_suburbs):
            unique_suburbs.append(s)
    suburbs = unique_suburbs
            
    features = []
    zone_id = 1
    
    # Compute Voronoi cells for each suburb
    for idx, s in enumerate(suburbs):
        # Initial polygon is the bounding box
        poly = [
            [min_lon, min_lat],
            [max_lon, min_lat],
            [max_lon, max_lat],
            [min_lon, max_lat],
            [min_lon, min_lat]
        ]
        
        # Clip against all other suburbs
        for o_idx, other in enumerate(suburbs):
            if o_idx == idx:
                continue
            poly = clip_polygon_py(poly, s, other)
            if not poly:
                break
                
        if not poly:
            continue
            
        # Smooth the polygon vertices using Chaikin's algorithm (set to 0 to prevent corner gaps)
        poly = smooth_polygon_py(poly, iterations=0)
        
        # Distance from center
        dist = np.sqrt((s["lat"] - lat)**2 + (s["lon"] - lon)**2) / 0.015
        
        # Random parameters based on coordinates seed
        seed_val = int(abs(s["lat"] * 1000 + s["lon"] * 1000)) % 10000
        np.random.seed(seed_val)
        
        density = max(0.20, min(0.95, 0.90 - 0.12 * dist + np.random.uniform(-0.05, 0.05)))
        ndvi = max(0.08, min(0.65, 0.12 + 0.08 * dist + np.random.uniform(-0.04, 0.04)))
        albedo = max(0.09, min(0.24, 0.11 + 0.02 * dist + np.random.uniform(-0.02, 0.02)))
        pop = int(max(1500, min(35000, 25000 - 4500 * dist + np.random.randint(-1000, 1000))))
        area = round(1.5 + 0.5 * dist, 1)
        
        t_var = 4.0 * density - 5.0 * ndvi - 2.5 * albedo
        noise = np.random.normal(0, 0.15)
        actual_temp = round(base_temp + t_var + noise, 1)
        
        feature = {
            "type": "Feature",
            "properties": {
                "id": zone_id,
                "name": s["name"],
                "ndvi": round(ndvi, 3),
                "building_density": round(density, 3),
                "albedo": round(albedo, 3),
                "actual_temp": actual_temp,
                "population_density": pop,
                "area_sq_km": area
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly]
            }
        }
        features.append(feature)
        zone_id += 1
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

if __name__ == "__main__":
    generate_city_data("vijayawada")
    generate_city_data("hyderabad")
    generate_city_data("visakhapatnam")

