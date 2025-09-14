import numpy as np
import pandas as pd
from scipy.spatial.distance import cdist
import random
import os

# --- FILE PATH LOGIC ---
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, '..', '..', 'dataset', 'synthetic_routes_large.csv')
df = pd.read_csv(file_path)

# --- *** ACCURATE DISTANCE CALCULATION *** ---
def compute_haversine_distance_matrix(points):
    """
    Calculates the distance matrix using the Haversine formula to get
    real-world distances in kilometers between lat/lon points.
    """
    R = 6371  # Earth radius in kilometers
    
    # Convert latitude and longitude from degrees to radians
    points_rad = np.radians(points)
    
    lat = points_rad[:, 0]
    lon = points_rad[:, 1]
    
    # Use broadcasting to compute pairwise differences
    dlon = lon[:, np.newaxis] - lon
    dlat = lat[:, np.newaxis] - lat
    
    a = np.sin(dlat / 2.0)**2 + np.cos(lat[:, np.newaxis]) * np.cos(lat) * np.sin(dlon / 2.0)**2
    
    c = 2 * np.arcsin(np.sqrt(a))
    distance_matrix = R * c
    return distance_matrix

def load_points():
    points = df[['latitude', 'longitude']].values
    depot_index = df.index[df['depot'] == 1].tolist()[0]
    return points, depot_index

def fitness(route, distance_matrix):
    # This route INCLUDES the depot at the start
    full_route = list(route) + [route[0]] # Add return to depot at the end
    dist = 0
    for i in range(len(full_route) - 1):
        dist += distance_matrix[full_route[i], full_route[i+1]]
    return dist

def init_population(pop_size, n_points, depot_index):
    population = []
    nodes = list(range(n_points))
    if depot_index in nodes:
        nodes.remove(depot_index)
    for _ in range(pop_size):
        route = random.sample(nodes, len(nodes))
        population.append(route)
    return population

def tournament_selection(population, scores, k=3):
    selected = []
    for _ in range(len(population)):
        aspirants_indices = random.sample(range(len(population)), k)
        aspirant_scores = [scores[i] for i in aspirants_indices]
        winner_index = aspirants_indices[np.argmin(aspirant_scores)]
        selected.append(population[winner_index])
    return selected

def ordered_crossover(parent1, parent2):
    size = len(parent1)
    child = [None]*size
    start, end = sorted(random.sample(range(size), 2))
    child[start:end] = parent1[start:end]
    pointer = end
    for gene in parent2:
        if gene not in child:
            if pointer >= size: pointer = 0
            child[pointer] = gene
            pointer += 1
    return child

def swap_mutation(route, mutation_rate=0.02):
    if random.random() < mutation_rate:
        idx1, idx2 = random.sample(range(len(route)), 2)
        route[idx1], route[idx2] = route[idx2], route[idx1]
    return route

def ga_solver(points, depot_index, pop_size=100, generations=200):

    distance_matrix = compute_haversine_distance_matrix(points)
    
    population = init_population(pop_size, len(points), depot_index)
    best_route = None
    best_score = float('inf')

    for gen in range(generations):
        # Pass the full route (including depot) to the fitness function
        scores = [fitness([depot_index] + route, distance_matrix) for route in population]
        current_best_idx = np.argmin(scores)
        if scores[current_best_idx] < best_score:
            best_score = scores[current_best_idx]
            best_route = population[current_best_idx]
        
        selected = tournament_selection(population, scores)
        next_pop = []
        for i in range(0, pop_size, 2):
            p1, p2 = selected[i], selected[i+1]
            c1, c2 = ordered_crossover(p1, p2), ordered_crossover(p2, p1)
            next_pop.extend([swap_mutation(c1), swap_mutation(c2)])
        population = next_pop

    if best_route:
        full_route_indices = [depot_index] + best_route + [depot_index]
        return full_route_indices, best_score
    return [], float('inf')


def run_ga():
    points, depot_index = load_points()
    best_route_indices, best_distance = ga_solver(points, depot_index)
    return best_route_indices, best_distance

def run_ga_dynamic(points_data):
    custom_df = pd.DataFrame(points_data)
    points = custom_df[['latitude', 'longitude']].values
    depot_index_list = custom_df.index[custom_df['depot'] == 1].tolist()
    
    if not depot_index_list:
        raise ValueError("No depot found in the provided points data.")
    depot_index = depot_index_list[0]

    best_route_indices, best_distance = ga_solver(points, depot_index)
    final_route_ids = [custom_df.iloc[i]['point_id'] for i in best_route_indices]
    return final_route_ids, best_distance

# --- SAFEGUARD ---
if __name__ == "__main__":
    print("--- ERROR ---")
    print("This script is a module and is not meant to be run directly.")
    print("Please run the main Flask application instead by executing:")
    print("  python app.py")
    print("from the 'backend' directory.")
