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

    # Scale down the costs dynamically to make the DP table size manageable
    # 100,000 Rupees (₹1 Lakh) is our base scaling step
    scale_factor = 100000
    if budget_rupees < scale_factor:
        scale_factor = 1
    elif budget_rupees // scale_factor > 5000:
        scale_factor = budget_rupees // 5000
        
    scaled_budget = int(budget_rupees // scale_factor)
    
    # dp[i][w] represents the maximum benefit of first i items with budget w
    dp = [[0] * (scaled_budget + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        item_cost = max(1, int(items[i-1]["cost"] // scale_factor))
        item_benefit = items[i-1]["benefit"]
        for w in range(scaled_budget + 1):
            if item_cost <= w:
                dp[i][w] = max(dp[i-1][w], dp[i-1][w - item_cost] + item_benefit)
            else:
                dp[i][w] = dp[i-1][w]
                
    # Backtrack to find the selected items
    best_combination = []
    w = scaled_budget
    for i in range(n, 0, -1):
        item_cost = max(1, int(items[i-1]["cost"] // scale_factor))
        if dp[i][w] != dp[i-1][w]:
            best_combination.append(items[i-1])
            w -= item_cost
                
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
