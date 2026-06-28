import sys
import os

# Set standard output encoding to UTF-8 to handle Unicode characters (like ₹ and °) in the terminal
if sys.platform.startswith('win'):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add parent directory to path so we can import backend packages
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.ml.data_generator import generate_city_data
from backend.ml.predictor import HeatWisePredictor
from backend.ml.optimizer import optimize_cooling_investments

def run_tests():
    print("=== STARTING ML & OPTIMIZER TESTS ===")
    
    # 1. Test data generator
    print("\n[Test 1] Generating raw Vijayawada grid GeoJSON...")
    geojson = generate_city_data("vijayawada")
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 12
    print("SUCCESS: 12 zones generated in GeoJSON format.")
    
    # 2. Test ML model and predictions
    print("\n[Test 2] Training Expected Temperature model & processing data...")
    predictor = HeatWisePredictor()
    processed_geojson = predictor.process_city_data()
    
    # Verify new features added by predictor
    first_props = processed_geojson["features"][0]["properties"]
    assert "expected_temp" in first_props
    assert "residual_heat" in first_props
    assert "cause" in first_props
    assert "intervention" in first_props
    assert "cost" in first_props
    
    print("SUCCESS: ML model trained and evaluated on all zones.")
    print(f"Zone '{first_props['name']}' Actual Temp: {first_props['actual_temp']}°C, Expected: {first_props['expected_temp']}°C, Residual: {first_props['residual_heat']}°C")
    print(f"Diagnosed Cause: '{first_props['cause']}' (Confidence: {first_props['cause_confidence']}%)")
    print(f"Recommended Intervention: '{first_props['intervention']}' (Estimated Cost: {first_props['cost_formatted']})")
    
    # 3. Test Budget Optimizer
    print("\n[Test 3] Testing Budget Optimizer with ₹10 Crore (₹10,000,000 * 10)...")
    budget_rupees = 10 * 10000000 # 10 Crore
    optimization_results = optimize_cooling_investments(processed_geojson["features"], budget_rupees)
    
    assert "selected_zones" in optimization_results
    assert optimization_results["total_cost"] <= budget_rupees
    
    print("SUCCESS: Budget Optimizer ran successfully.")
    print(f"Total Budget: ₹10.00 Cr")
    print(f"Optimized Spent: {optimization_results['total_cost_formatted']}")
    print(f"Remaining Budget: {optimization_results['remaining_budget_formatted']}")
    print(f"Total Cooling (Cumulative Degrees): {optimization_results['total_cooling_degrees']}°C")
    print(f"Total Population Benefited: {optimization_results['total_people_benefited']:,} people")
    print("Selected Zones:")
    for zone in optimization_results["selected_zones"]:
        print(f" - {zone['name']}: {zone['intervention']} ({zone['cost_formatted']})")
        
    print("\n=== ALL ML & BACKEND TESTS PASSED ===")

if __name__ == "__main__":
    run_tests()
