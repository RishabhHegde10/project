import pandas as pd
from sklearn.linear_model import LogisticRegression
import pickle

# Load dataset
df = pd.read_csv("train.csv")

# Select features
features = [
    "A1_Score","A2_Score","A3_Score","A4_Score","A5_Score",
    "A6_Score","A7_Score","A8_Score","A9_Score","A10_Score"
]

X = df[features]

# Target already 0/1
y = df["Class/ASD"]

print("X shape:", X.shape)
print("y unique:", y.unique())

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ MODEL TRAINED SUCCESSFULLY")