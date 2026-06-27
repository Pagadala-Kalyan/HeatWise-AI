---
title: HeatWise AI
emoji: 🌍
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---
# ❄️ HeatWise AI — AI-Powered Urban Cooling Decision Engine

> **"Helping cities spend every cooling dollar where it delivers the maximum impact."**

---

## 🛰️ Project Overview
Most cities invest millions in cooling initiatives (tree planting, cool roofs, reflective pavements) based on simple satellite temperature maps. However, **a hotspot does not tell planners why it is hot.** 

Two streets with the identical high temperatures may require completely different solutions:
* One needs canopy coverage (low vegetation).
* Another suffers from poor ventilation and dense building layouts.
* Another is dominated by heat-retaining black asphalt.

**HeatWise AI** shifts the paradigm from simple *heat analysis* to *active investment decisions*. By analyzing satellite inputs (NDVI, surface albedo, building density), it uses machine learning to establish microclimate baselines, diagnose the dominant cause of overheating, recommend target solutions, simulate What-If scenarios, and run budget optimizations.

---

## 🌟 Core Features

### 1. Residual Heat Anomaly Detection (USP)
Instead of looking at raw heat, HeatWise AI trains a **Random Forest Regressor** to predict the *Expected Temperature* of an area based on its physical properties. It then calculates the **Residual Heat** (`Actual - Expected`). Areas with high positive residuals represent microclimate anomalies that are hotter than they should be, indicating localized heat traps.

### 2. Microclimate Cause Diagnosis
The engine analyzes local deviations against baseline features to classify the dominant cause of overheating (e.g. low canopy vegetation, dense concrete structure, or dark surface materials) along with a diagnostic confidence percentage.

### 3. Actionable cooling Recommendations
Rather than showing generic advice, the engine matches diagnosed causes with concrete interventions, calculating the **Expected Temperature Drop (°C)**, estimated costs in Indian Rupees (₹), and deployment timeframe.

### 4. Interactive What-If Simulator
Allows planners to select a neighborhood on the map, adjust sliders (e.g., add 150 trees, cover 60% of roofs, lay cool pavements), and run a simulator. The heat map and temperature plots update in real-time, displaying the physical cooling ROI.

### 5. Smart Budget Optimizer (0-1 Knapsack Solver)
Planners input their total cooling budget (e.g. ₹10 Crore). The engine solves a **0-1 Knapsack Optimization Problem** that maximizes the **Person-Degrees of Cooling** (cooling impact $\times$ population density $\times$ area), returning the highest-ROI investment plan.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite), Leaflet.js, React-Leaflet, Chart.js, Lucide Icons, Tailwind-free Custom HSL Glassmorphic CSS.
* **Backend**: FastAPI (Python), Uvicorn.
* **Machine Learning**: Scikit-Learn (Random Forest Regressor), Pandas, NumPy.
* **GIS Mapping**: GeoJSON vector overlay grids.
* **Deployment**: Docker (Multi-stage build).

---

## 📁 Repository Structure
```
HeatWise-AI/
 ├── backend/
 │    ├── ml/
 │    │    ├── data_generator.py   # Generates Vijayawada grid polygons
 │    │    ├── predictor.py        # RF model training & cause diagnosis
 │    │    └── optimizer.py        # Knapsack budget optimizer
 │    ├── data/
 │    │    └── vijayawada_grid.json # GeoJSON city dataset
 │    ├── main.py                  # FastAPI server & route handlers
 │    ├── test_ml.py               # Backend ML test suite
 │    └── requirements.txt         # Python libraries
 ├── frontend/
 │    ├── public/
 │    ├── src/
 │    │    ├── components/
 │    │    │    ├── MapView.jsx          # Leaflet map styling & overlay
 │    │    │    ├── BudgetOptimizer.jsx  # Knapsack UI & budget summary
 │    │    │    ├── WhatIfSimulator.jsx  # Sliders & simulation delta
 │    │    │    └── MetricsChart.jsx     # Side-by-side bar chart
 │    │    ├── services/
 │    │    │    └── api.js               # API client with offline fallback
 │    │    ├── App.jsx                   # Main layout and tab controller
 │    │    ├── index.css                 # Custom glassmorphic styling
 │    │    └── main.jsx
 │    ├── package.json
 │    └── vite.config.js
 ├── Dockerfile                     # Multi-stage Docker config
 └── README.md                      # Documentation
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
1. Navigate to the root directory and create a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # On Windows: venv\Scripts\activate
   ```
2. Install Python packages:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the ML tests to generate the dataset and verify predictions:
   ```bash
   python backend/test_ml.py
   ```
4. Start the FastAPI server:
   ```bash
   python -m uvicorn backend.main:app --reload
   ```
   The backend API will be available at `http://127.0.0.1:8000` (docs at `/docs`).

### 2. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. The frontend dev server is configured to proxy API requests to the backend.

---

## 🌐 Internet Deployment Guide (Not localhost)

You can easily deploy HeatWise AI to the internet for free using the following steps:

### Option A: Hugging Face Spaces (Recommended - Easiest & Free)
Hugging Face Spaces offers free container hosting for ML projects.
1. Sign up for a free account on [Hugging Face](https://huggingface.co/).
2. Click **New Space** in the top right.
3. Name your Space (e.g., `heatwise-ai`), select **Docker** as the SDK, and choose **Blank** template.
4. Set the space to **Public** and select the free CPU Basic hardware tier.
5. Clone the space repository locally or upload your files directly to the Space's Git repository.
6. The `Dockerfile` at the root of our project will be detected automatically. Hugging Face will build the React frontend, package it inside the FastAPI container, and serve it on port `7860`.
7. Once build completes, your live web application will be accessible at: `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME`.

### Option B: Render.com (Full Web Service)
Render is a popular platform for deploying full-stack apps.
1. Create a free account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub Repository (`https://github.com/Pagadala-Kalyan/HeatWise-AI`).
4. Set the following configurations:
   * **Runtime**: `Docker`
   * **Instance Type**: `Free`
5. Click **Deploy Web Service**. Render will build the container using our root `Dockerfile` and expose it to the internet with a free `onrender.com` SSL domain.

---

## 📝 License
This project is licensed under the MIT License.
