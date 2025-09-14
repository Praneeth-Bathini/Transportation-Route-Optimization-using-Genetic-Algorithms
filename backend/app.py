from flask import Flask, jsonify, request
from flask_cors import CORS
from controllers.ga_solver import run_ga, df, run_ga_dynamic

app = Flask(__name__)
CORS(app)

# --- EXISTING ROUTES ---

@app.route("/api/optimize", methods=["GET"])
def optimize_route():
    """ The original static optimization endpoint. """
    best_route_indices, best_distance = run_ga()
    
    # Map indices back to original point_ids from the CSV
    route_ids = [df.iloc[i]['point_id'] for i in best_route_indices]

    return jsonify({
        "optimized_route": route_ids,
        "total_distance_km": round(best_distance, 2)
    })

@app.route("/api/get_points", methods=["GET"])
def get_points():
    """ Serves the initial list of points from the CSV. """
    points = df.to_dict(orient="records")
    return jsonify(points)


# --- *** DYNAMIC ROUTE *** ---

@app.route("/api/optimize_dynamic", methods=["POST"])
def optimize_dynamic_route():
    """
    Receives a custom list of points from the frontend and runs the
    optimizer on that specific set of points.
    """
    points_data = request.get_json()
    if not points_data:
        return jsonify({"error": "No data provided"}), 400

    # Call the new dynamic solver function
    best_route_ids, best_distance = run_ga_dynamic(points_data)
    
    return jsonify({
        "optimized_route": best_route_ids,
        "total_distance_km": round(best_distance, 2)
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
