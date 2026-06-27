import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional

from backend.ml.predictor import HeatWisePredictor
from backend.ml.optimizer import optimize_cooling_investments

app = FastAPI(
    title="HeatWise AI API",
    description="Decision engine for urban cooling investment optimization",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
predictor = HeatWisePredictor()
predictor.train_model()

# Request and Response Schemas
class BudgetRequest(BaseModel):
    budget_crore: float = Field(..., gt=0, description="Budget in Crores (₹1 Crore = 10,000,000 Rupees)")

class SimulationRequest(BaseModel):
    zone_id: int = Field(..., description="ID of the zone to simulate")
    trees_added: int = Field(0, ge=0, le=500, description="Number of trees to add (0-500)")
    cool_roofs_percentage: int = Field(0, ge=0, le=100, description="Percentage of roofs converted to cool roofs (0-100)")
    reflective_pavement: bool = Field(False, description="Whether to apply reflective pavement")

@app.get("/api/city-data")
def get_city_data():
    try:
        geojson = predictor.process_city_data()
        return geojson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/optimize")
def optimize_budget(req: BudgetRequest):
    try:
        geojson = predictor.process_city_data()
        features = geojson["features"]
        # Convert Crore to Rupees
        budget_rupees = int(req.budget_crore * 10000000)
        results = optimize_cooling_investments(features, budget_rupees)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simulate")
def simulate_intervention(req: SimulationRequest):
    try:
        geojson = predictor.process_city_data()
        target_feature = None
        
        for feature in geojson["features"]:
            if feature["properties"]["id"] == req.zone_id:
                target_feature = feature
                break
                
        if not target_feature:
            raise HTTPException(status_code=404, detail=f"Zone with ID {req.zone_id} not found")
            
        props = target_feature["properties"]
        
        # Calculate new environmental indicators based on inputs
        # 1 tree increases NDVI by a small fraction in the 1.6km x 1.6km grid
        ndvi_delta = req.trees_added * 0.0012
        ndvi_new = min(0.85, props["ndvi"] + ndvi_delta)
        
        # Cool roofs increase albedo. If 100% of roofs are cool, albedo increases by 0.08
        albedo_delta_roofs = (req.cool_roofs_percentage / 100.0) * 0.08
        
        # Reflective pavement adds 0.04 to albedo
        albedo_delta_pave = 0.04 if req.reflective_pavement else 0.0
        
        albedo_new = min(0.35, props["albedo"] + albedo_delta_roofs + albedo_delta_pave)
        
        # Building density slightly decreases due to green roofs/pocket parks if trees/roofs are high
        density_delta = (req.trees_added * 0.0002) + ((req.cool_roofs_percentage / 100.0) * 0.02)
        density_new = max(0.1, props["building_density"] - density_delta)
        
        # Recalculate Expected Temperature using our Random Forest Model
        expected_temp_new = predictor.predict_expected(ndvi_new, density_new, albedo_new)
        
        # Calculate physical temperature reduction
        # (Based on standard microclimate cooling studies)
        temp_reduction = (
            (ndvi_new - props["ndvi"]) * 11.5 + 
            (albedo_new - props["albedo"]) * 9.5
        )
        
        actual_temp_new = max(30.0, props["actual_temp"] - temp_reduction)
        residual_heat_new = actual_temp_new - expected_temp_new
        
        return {
            "zone_id": req.zone_id,
            "name": props["name"],
            "original": {
                "ndvi": round(props["ndvi"], 3),
                "albedo": round(props["albedo"], 3),
                "building_density": round(props["building_density"], 3),
                "actual_temp": round(props["actual_temp"], 1),
                "expected_temp": round(props["expected_temp"], 1),
                "residual_heat": round(props["residual_heat"], 1)
            },
            "simulated": {
                "ndvi": round(ndvi_new, 3),
                "albedo": round(albedo_new, 3),
                "building_density": round(density_new, 3),
                "actual_temp": round(actual_temp_new, 1),
                "expected_temp": round(expected_temp_new, 1),
                "residual_heat": round(residual_heat_new, 1),
                "temp_reduction": round(temp_reduction, 1)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve React build static files in production
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
    
    # Fallback to index.html for React SPA Routing
    @app.exception_handler(404)
    async def custom_404_handler(request, exc):
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {
            "message": "HeatWise AI Backend is running. Frontend build not detected. Please build the React frontend.",
            "api_docs": "/docs"
        }
