import pickle
import numpy as np

# Load trained model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_risk(data):
    features = np.array([[
        data["error_rate"],
        data["pause_time"],
        data["quiz_accuracy"],
        data["cognitive_score"]
    ]])

    prob = model.predict_proba(features)[0][1]

    if prob > 0.6:
        level = "High"
    elif prob > 0.3:
        level = "Medium"
    else:
        level = "Low"

    return float(prob), level