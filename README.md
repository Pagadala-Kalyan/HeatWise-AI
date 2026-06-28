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

🌍 **Live Demo**: **[https://huggingface.co/spaces/Kalyan-P/HeatWise-AI](https://huggingface.co/spaces/Kalyan-P/HeatWise-AI)**

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

### 1. Real OSM Neighborhood Boundary Mapping
Instead of static predefined grids, HeatWise AI queries coordinates or city searches via the **OpenStreetMap Overpass API** to fetch real neighborhood, suburb, and quarter nodes. It runs the **Sutherland-Hodgman clipping algorithm** to build organic, gap-free Voronoi boundary overlays that mirror real city maps.

### 2. Residual Heat Anomaly Detection (USP)
Instead of raw heat, HeatWise AI trains a **Random Forest Regressor** to predict the *Expected Temperature* of an area based on physical parameters (NDVI, Albedo, Building Density). The **Residual Heat** anomaly (`Actual - Expected`) identifies prioritized cooling traps (>0.5°C).

### 3. Causal Diagnostics & Intervention Roadmap
Classifies the dominant cause of localized heating (e.g., vegetation canopy deficits, dense building masses, low solar albedo) with confidence margins. It recommends specific interventions (Cool Roofs, Tree Canopies, Reflective Asphalt) with costs (₹), timeframes, and projected UHI drop metrics.

### 4. Interactive What-If Sandbox
Planners can select any neighborhood and test physical interventions (adding trees, coating roofs, installing reflective pavements) via sliders. The simulator updates heat maps, metrics, and chart plots dynamically.

### 5. Budget Allocation Optimizer (0-1 Knapsack Solver)
Planners input a city-wide funding limit (in Crores). The decision engine solves a **0-1 Knapsack Optimization Problem** maximizing cumulative UHI cooling ROI (**Person-Degrees of Cooling**). A priority roadmap is generated, which planners can simulate globally on the map.

### 6. Cosmoq & Holographic Blueprint Aesthetics
* **Swaying Auroras**: Reactive vertical light pillars (cyan, orange, magenta) sway in the background.
* **Holographic Blueprint Map**: WebGL/CSS filters transform standard street tiles into glowing cyan holographic blueprint meshes.
* **Reactive Double-Theme Switcher**: Swaps between cosmic Dark Mode and high-contrast Slate-Gray Light Mode, adjusting map basemaps, input fields, and legend panels.
* **Client-Backend Zone Synchronization**: Passes active geocoded map datasets in the JSON payload to backend endpoints (`/api/optimize`, `/api/simulate-batch`) to guarantee 100% synchronized neighborhood naming and metrics.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite), Leaflet.js, React-Leaflet, Chart.js, Lucide Icons, Tailwind-free Custom HSL Glassmorphic CSS.
* **Backend**: FastAPI (Python), Uvicorn.
* **Machine Learning**: Scikit-Learn (Random Forest Regressor), Pandas, NumPy.
* **GIS Mapping**: GeoJSON vector overlay grids.
* **Deployment**: Docker (Multi-stage build).

---

## 📁 Repository Structure

```text
HeatWise-AI/
 ├── backend/
 │    ├── ml/
 │    │    ├── data_generator.py   # Live OSM Overpass query & Voronoi clipper
 │    │    ├── predictor.py        # RF model training & UHI diagnostics
 │    │    └── optimizer.py        # Knapsack budget allocator
 │    ├── data/
 │    │    └── vijayawada_grid.json # Backup preset city dataset
 │    ├── main.py                  # FastAPI route controllers
 │    ├── test_ml.py               # Backend ML verification suite
 │    └── requirements.txt         # Python libraries
 ├── frontend/
 │    ├── src/
 │    │    ├── components/
 │    │    │    ├── MapView.jsx          # Leaflet map renderer & filters
 │    │    │    ├── BudgetOptimizer.jsx  # Knapsack roadmap layout
 │    │    │    ├── WhatIfSimulator.jsx  # Sliders & simulation delta
 │    │    │    └── MetricsChart.jsx     # Comparison plots
 │    │    ├── services/
 │    │    │    └── api.js               # API client with zone-state sync
 │    │    ├── App.jsx                   # Layout, navigation, & theme state
 │    │    ├── index.css                 # Custom HSL variables & keyframes
 ├── Dockerfile                     # Multi-stage Docker deployment config
 ├── FEATURES_GUIDE.md              # Markdown features list & user manual
 ├── FEATURES_GUIDE.docx            # Microsoft Word document with embedded diagram
 └── README.md                      # Documentation
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
Navigate to the root directory and create a virtual environment:
```bash
python -m venv venv
source venv/Scripts/activate # On Windows: venv\Scripts\activate
```

Install Python packages:
```bash
pip install -r backend/requirements.txt
```

Run the ML tests to generate the dataset and verify predictions:
```bash
python backend/test_ml.py
```

Start the FastAPI server:
```bash
python -m uvicorn backend.main:app --reload
```
The backend API will be available at `http://127.0.0.1:8000` (docs at `/docs`).

### 2. Frontend Setup
Navigate to the `frontend/` directory:
```bash
cd frontend
```

Install Node packages:
```bash
npm install
```

Start the Vite development server:
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
7. Once build completes, the live web application is accessible at: **[https://huggingface.co/spaces/Kalyan-P/HeatWise-AI](https://huggingface.co/spaces/Kalyan-P/HeatWise-AI)**.

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
