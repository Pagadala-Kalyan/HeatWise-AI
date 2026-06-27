def optimize_cooling_investments(features, budget_rupees):
    """
    Solves the 0-1 Knapsack problem to select the optimal combination of zone interventions
    that maximizes the total cooling impact (Person-Degrees of Cooling) within the given budget.
    
    Benefit = Expected Cooling (°C) * Population Benefited (Population Density * Area)
    Cost = Intervention Cost (Rupees)
    """
    items = []
    for f in features:
        props = f["properties"]
        population = int(props["population_density"] * props["area_sq_km"])
        benefit = props["expected_cooling"] * population
        
        items.append({
            "id": props["id"],
            "name": props["name"],
            "cost": props["cost"],
            "expected_cooling": props["expected_cooling"],
            "population": population,
            "benefit": benefit,
            "intervention": props["intervention"],
            "details": props["intervention_details"],
            "residual_heat": props["residual_heat"],
            "actual_temp": props["actual_temp"]
        })
        
    n = len(items)
    best_value = -1
    best_combination = []
    
    # Since n=12 is very small (2^12 = 4096 combinations), we can find the exact global optimum 
    # instantly using a bitmask combination search.
    for i in range(1 << n):
        current_combination = []
        current_cost = 0
        current_benefit = 0
        
        for j in range(n):
            if (i >> j) & 1:
                current_combination.append(items[j])
                current_cost += items[j]["cost"]
                current_benefit += items[j]["benefit"]
                
        if current_cost <= budget_rupees:
            if current_benefit > best_value:
                best_value = current_benefit
                best_combination = current_combination
                
    total_cost = sum(item["cost"] for item in best_combination)
    total_cooling = sum(item["expected_cooling"] for item in best_combination)
    total_people = sum(item["population"] for item in best_combination)
    
    # Format results for API consumption
    selected_zones = []
    for item in best_combination:
        selected_zones.append({
            "id": item["id"],
            "name": item["name"],
            "cost": item["cost"],
            "cost_formatted": f"₹{item['cost']/10000000:.1f} Cr",
            "expected_cooling": item["expected_cooling"],
            "intervention": item["intervention"],
            "details": item["details"],
            "population": item["population"]
        })
        
    # Sort selected zones by priority (highest benefit-to-cost ratio first)
    selected_zones.sort(key=lambda x: x["expected_cooling"] / x["cost"] if x["cost"] > 0 else 0, reverse=True)
    
    return {
        "selected_zones": selected_zones,
        "total_cost": total_cost,
        "total_cost_formatted": f"₹{total_cost/10000000:.2f} Cr",
        "total_cooling_degrees": round(total_cooling, 1),
        "total_people_benefited": total_people,
        "remaining_budget": budget_rupees - total_cost,
        "remaining_budget_formatted": f"₹{(budget_rupees - total_cost)/10000000:.2f} Cr"
    }
