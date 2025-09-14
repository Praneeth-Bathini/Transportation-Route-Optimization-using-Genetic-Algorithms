import pandas as pd
import random
import math
import os

NUM_DELIVERY_POINTS = 50  # large dataset
CITY_LAT = 17.3850         # Hyderabad approx
CITY_LON = 78.4867
MAX_RADIUS_KM = 12         # ~12 km radius

# Conversion factors
KM_PER_DEG_LAT = 111  # 1 degree latitude ~ 111 km
KM_PER_DEG_LON = 111 * math.cos(math.radians(CITY_LAT))  # depends on latitude

def generate_large_synthetic_dataset():
    data = []

    # Depot
    data.append({
        "point_id": 0,
        "latitude": CITY_LAT,
        "longitude": CITY_LON,
        "traffic_multiplier": 1.0,
        "depot": 1
    })

    # Delivery points
    for i in range(1, NUM_DELIVERY_POINTS + 1):
        # Random angle in radians
        angle = random.uniform(0, 2 * math.pi)
        # Random radius (sqrt for uniform distribution inside circle)
        radius_km = MAX_RADIUS_KM * math.sqrt(random.random())

        # Convert km to degrees
        dlat = radius_km / KM_PER_DEG_LAT
        dlon = (radius_km / KM_PER_DEG_LON)

        # Apply polar offset
        lat = CITY_LAT + dlat * math.sin(angle)
        lon = CITY_LON + dlon * math.cos(angle)

        traffic = round(random.uniform(0.5, 1.5), 2)
        data.append({
            "point_id": i,
            "latitude": lat,
            "longitude": lon,
            "traffic_multiplier": traffic,
            "depot": 0
        })

    df = pd.DataFrame(data)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, '..', '..', 'dataset', 'synthetic_routes_large.csv')
    file_path = os.path.abspath(file_path)
    df.to_csv(file_path, index=False)

    print(f"CSV saved at: {file_path}")


if __name__ == "__main__":
    generate_large_synthetic_dataset()
