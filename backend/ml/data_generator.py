import json
import os

def generate_vijayawada_data():
    # Center points for 12 key zones in Vijayawada, Andhra Pradesh, India
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
    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "vijayawada_grid.json")
    
    with open(out_path, "w") as f:
        json.dump(geojson_data, f, indent=2)
        
    print(f"Generated GeoJSON data for {len(zones)} zones in {out_path}")
    return geojson_data

if __name__ == "__main__":
    generate_vijayawada_data()
