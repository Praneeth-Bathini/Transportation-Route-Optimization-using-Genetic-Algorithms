# 🚚 Transport Optimizer

## 📖 Overview

*Transport Optimizer* is a web application designed to solve the Vehicle Routing Problem (VRP) by finding the most efficient route for deliveries originating from a central depot. Built with a React frontend and a Flask backend, this tool utilizes a *Genetic Algorithm (GA)* to calculate the optimal sequence of stops, minimizing total travel distance. Users can visualize points on an interactive map, add custom delivery locations by right-clicking, and receive an optimized route plan, including the sequence of stops and total distance. The backend leverages the *Haversine formula* for accurate real-world distance calculations between geographical coordinates.

### Why this project?

Optimizing delivery routes is crucial for logistics efficiency, reducing fuel costs, saving time, and improving customer satisfaction. This project provides an interactive and visual tool to tackle this complex combinatorial optimization problem using a well-established metaheuristic approach (Genetic Algorithm).

---

## ✨ Key Features

| Feature                  | Description                                                                                                                               |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| 🗺 *Interactive Map* | Visualizes depot and delivery points using Leaflet. |
| 📍 *Dynamic Point Entry* | Users can *right-click* on the map to add new delivery points.                        |
| 🗑 *Point Management* | Users can remove added delivery points from the list view.                                |
| ⚙ *Genetic Algorithm* | Employs a GA (initialization, selection, crossover, mutation) to find near-optimal delivery routes. |
| 🌍 *Haversine Distance* | Calculates accurate *real-world distances* (in kilometers) between latitude/longitude points using the Haversine formula. |
| 📊 *Route Visualization* | Displays the calculated optimal route polyline on the map.                                |
| 🧾 *Route Manifest* | Shows the sequence of stops (including depot start/end) for the optimized route in a dedicated panel tab. |
| 📈 *Summary Statistics* | Provides total calculated distance and the number of delivery stops in summary cards.     |
| 🔄 *Dynamic Optimization*| Sends the current set of points (including user-added ones) to the backend (/api/optimize_dynamic) for optimization via a POST request. |
| 🔐 *User Authentication* | Basic frontend login interface (currently uses hardcoded credentials for demo).             |

---

## ⚡ Workflow Diagram

```mermaid
graph TD;
    A[Load Initial Points / Add Points on Map] --> B[Frontend Displays Points on Leaflet Map];
    B --> C{User Clicks 'Find Optimal Route'};
    C --> D[Frontend Sends Current Points Data via POST to /api/optimize_dynamic];
    D --> E[Backend: Genetic Algorithm Calculates Optimal Route Sequence];
    E --> F[Backend: Haversine Formula Computes Distances];
    F --> G[Backend Returns Optimized Route (IDs) & Total Distance];
    G --> H[Frontend Displays Route Polyline & Updates Manifest/Summary];

## 🛠 Tech Stack

| Category        | Tools                                                                      |
| :-------------- | :------------------------------------------------------------------------- |
| *Frontend* | React, React Router DOM, Leaflet, React-Leaflet, Axios, Tailwind CSS, Web Vitals |
| *Backend* | Flask, Flask-CORS                       |
| *Algorithm* | Python, NumPy, Pandas, Scipy (cdist) |
| *Data* | CSV           |
| *Styling* | Tailwind CSS         |
| *Testing (FE)*| Jest, React Testing Library (@testing-library/react, @testing-library/jest-dom) |

---
