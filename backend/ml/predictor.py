import numpy as np
import pandas as pd
import json
import os
from sklearn.ensemble import RandomForestRegressor
from backend.ml.data_generator import generate_city_data

class HeatWisePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self.mean_ndvi = 0.3
        self.mean_density = 0.6
        self.mean_albedo = 0.15

    def train_model(self):
        # Generate synthetic training data representing thousands of urban blocks
        # relationship: Temp = 45.0 - 12 * NDVI + 8 * Density - 10 * Albedo + noise
        np.random.seed(42)
        n_samples = 300
        
        ndvi = np.random.uniform(0.1, 0.7, n_samples)
        density = np.random.uniform(0.2, 0.95, n_samples)
        albedo = np.random.uniform(0.08, 0.25, n_samples)
        
        # Base relationship + noise
        expected_temp = 42.0 - 10.0 * ndvi + 6.0 * density - 8.0 * albedo
        noise = np.random.normal(0, 0.4, n_samples)
        actual_temp = expected_temp + noise
        
        X = pd.DataFrame({
            'ndvi': ndvi,
            'building_density': density,
            'albedo': albedo
        })
        y = actual_temp
        
        self.model.fit(X, y)
        self.is_trained = True
        
        # Store mean values for cause diagnostics
        self.mean_ndvi = float(np.mean(ndvi))
        self.mean_density = float(np.mean(density))
        self.mean_albedo = float(np.mean(albedo))
        print("Expected Temperature Regressor Model trained successfully.")

    def predict_expected(self, ndvi, density, albedo):
        if not self.is_trained:
            self.train_model()
        X_pred = pd.DataFrame([[ndvi, density, albedo]], columns=['ndvi', 'building_density', 'albedo'])
        return float(self.model.predict(X_pred)[0])

    def diagnose_cause(self, ndvi, density, albedo):
        # Rule-based classifier layered with ML statistical deviations from "normal" cooling baselines
        causes = []
        
        # 1. Vegetation deficiency
        if ndvi < 0.25:
            severity = (0.25 - ndvi) / 0.25
            confidence = int(min(98, 70 + severity * 30))
            causes.append({
                "cause": "Low Vegetation Canopy",
                "confidence": confidence,
                "severity": float(severity),
                "metric": f"NDVI: {ndvi:.2f} (Target: >0.35)"
            })
            
        # 2. Structural density (heat trapping)
        if density > 0.75:
            severity = (density - 0.75) / 0.25
            confidence = int(min(98, 75 + severity * 25))
            causes.append({
                "cause": "Dense Concrete & Heat Trapping Structures",
                "confidence": confidence,
                "severity": float(severity),
                "metric": f"Building Density: {int(density*100)}% (Target: <65%)"
            })
            
        # 3. Albedo deficiency (dark heat retaining materials)
        if albedo < 0.14:
            severity = (0.14 - albedo) / 0.14
            confidence = int(min(95, 65 + severity * 35))
            causes.append({
                "cause": "Heat-Retaining Dark Surfaces",
                "confidence": confidence,
                "severity": float(severity),
                "metric": f"Surface Albedo: {albedo:.2f} (Target: >0.18)"
            })
            
        # If no strong trigger, evaluate relative to mean values
        if not causes:
            # Pick the worst performing metric relative to optimal
            deviations = [
                ("Low Vegetation Canopy", (0.35 - ndvi) / 0.35, f"NDVI: {ndvi:.2f}"),
                ("Dense Concrete & Heat Trapping Structures", (density - 0.5) / 0.5, f"Building Density: {int(density*100)}%"),
                ("Heat-Retaining Dark Surfaces", (0.18 - albedo) / 0.18, f"Surface Albedo: {albedo:.2f}")
            ]
            # sort by deviation severity
            deviations.sort(key=lambda x: x[1], reverse=True)
            causes.append({
                "cause": deviations[0][0],
                "confidence": 62,
                "severity": float(max(0.1, deviations[0][1])),
                "metric": deviations[0][2]
            })
            
        # Sort causes by severity
        causes.sort(key=lambda x: x["severity"], reverse=True)
        return causes[0]

    def get_recommendations(self, primary_cause, area_sq_km):
        # Yields precise, actionable cooling intervention recommendations with cost and cooling ROI
        if "Vegetation" in primary_cause:
            return {
                "intervention": "Urban Tree Canopy Expansion",
                "details": "Plant 350+ native shade trees (Neem, Gulmohar) along sidewalks and in pocket parks.",
                "expected_cooling": 2.8, # °C cooling
                "cost": 15000000, # ₹1.5 Crore
                "cost_formatted": "₹1.5 Crore",
                "timeframe": "12-18 months"
            }
        elif "Concrete" in primary_cause:
            return {
                "intervention": "Reflective Cool Roof Initiative",
                "details": "Apply high-albedo elastomeric coating to 65% of flat residential and commercial roofs.",
                "expected_cooling": 1.9, # °C cooling
                "cost": 25000000, # ₹2.5 Crore
                "cost_formatted": "₹2.5 Crore",
                "timeframe": "6-9 months"
            }
        else: # Dark surfaces
            return {
                "intervention": "High-Albedo Cool Pavements",
                "details": "Resurface primary streets and parking areas with light-colored reflective asphalt coatings.",
                "expected_cooling": 1.4, # °C cooling
                "cost": 20000000, # ₹2.0 Crore
                "cost_formatted": "₹2.0 Crore",
                "timeframe": "9-12 months"
            }

    def process_city_data(self, city_name="vijayawada"):
        # Path to city grid
        grid_path = os.path.join(os.path.dirname(__file__), "..", "data", f"{city_name.lower()}_grid.json")
        if not os.path.exists(grid_path):
            generate_city_data(city_name)
            
        with open(grid_path, "r") as f:
            geojson = json.load(f)
            
        if not self.is_trained:
            self.train_model()
            
        for feature in geojson["features"]:
            props = feature["properties"]
            ndvi = props["ndvi"]
            density = props["building_density"]
            albedo = props["albedo"]
            actual = props["actual_temp"]
            
            # Predict expected temp using ML Model
            expected = self.predict_expected(ndvi, density, albedo)
            residual = actual - expected
            
            # Diagnose cause
            diagnosis = self.diagnose_cause(ndvi, density, albedo)
            
            # Generate intervention recommendation
            rec = self.get_recommendations(diagnosis["cause"], props["area_sq_km"])
            
            # Update properties
            props["expected_temp"] = round(expected, 1)
            props["residual_heat"] = round(residual, 1)
            props["priority_score"] = round(max(0, residual * 2.0 + (actual - 35.0)), 1)
            props["cause"] = diagnosis["cause"]
            props["cause_confidence"] = diagnosis["confidence"]
            props["cause_metric"] = diagnosis["metric"]
            props["intervention"] = rec["intervention"]
            props["intervention_details"] = rec["details"]
            props["expected_cooling"] = rec["expected_cooling"]
            props["cost"] = rec["cost"]
            props["cost_formatted"] = rec["cost_formatted"]
            props["timeframe"] = rec["timeframe"]
            
        return geojson

if __name__ == "__main__":
    predictor = HeatWisePredictor()
    data = predictor.process_city_data()
    print("Sample Output (Zone 1):")
    print(json.dumps(data["features"][0]["properties"], indent=2))
