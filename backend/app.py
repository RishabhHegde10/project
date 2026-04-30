from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from pathlib import Path
import logging
import joblib

# ------------------ INIT ------------------
app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------ LOAD MODEL ------------------
def load_model():
    candidates = [
        Path("models/model_behavior.pkl"),
        Path("models/model.pkl"),
    ]

    for p in candidates:
        if p.exists():
            logger.info(f"Loading model: {p}")
            return joblib.load(p)

    raise FileNotFoundError("No model file found")

model = load_model()

# ------------------ DB MODELS ------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    child_name = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False)

class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    typing_speed = db.Column(db.Float)
    accuracy = db.Column(db.Float)
    total_errors = db.Column(db.Integer)
    cognitive_score = db.Column(db.Float)
    prediction = db.Column(db.Integer)
    probability = db.Column(db.Float)
    risk_level = db.Column(db.String(20))

def init_db():
    with app.app_context():
        db.create_all()

# ------------------ FIXED TRANSFORM ------------------
def transform_input(data):
    def safe_float(value, default=0.0):
        if value is None:
            return default
        if isinstance(value, str):
            cleaned = value.strip().lower()
            if cleaned in {"", "no", "null", "none", "nan", "n/a"}:
                return default
            try:
                return float(cleaned)
            except (TypeError, ValueError):
                return default
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def safe_int(value, default=0):
        if value is None:
            return default
        if isinstance(value, str):
            cleaned = value.strip().lower()
            if cleaned in {"", "no", "null", "none", "nan", "n/a"}:
                return default
            try:
                return int(float(cleaned))
            except (TypeError, ValueError):
                return default
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return default

    total_errors = safe_int(data.get("total_errors", 0))
    accuracy = safe_float(data.get("overall_accuracy", 0.0))
    typing_speed = safe_float(data.get("typing_speed", 0.0))

    total_hits = max(1, 100 - total_errors)
    total_clicks = typing_speed * 10

    # total_score must align with training schema:
    # [overall_accuracy, total_errors, total_hits, total_score, total_clicks, error_rate, efficiency]
    # Prefer explicit frontend value when provided; otherwise derive a stable proxy.
    total_score = safe_float(data.get("total_score"), max(0.0, total_hits - total_errors))

    error_rate = total_errors / (total_hits + total_errors + 1)
    efficiency = total_hits / (total_clicks + 1)

    features = [
        accuracy,
        total_errors,
        total_hits,
        total_score,
        total_clicks,
        error_rate,
        efficiency
    ]

    logger.info(
        "Final features [overall_accuracy, total_errors, total_hits, total_score, total_clicks, error_rate, efficiency]: %s",
        features,
    )
    logger.info("Feature length: %s", len(features))

    return features


def normalize_prediction(raw_prediction):
    """
    Supports numeric model outputs (0/1) and string labels (e.g., Yes/No, High/Low).
    Returns (prediction_int, risk_level).
    """
    if isinstance(raw_prediction, str):
        label = raw_prediction.strip().lower()
        high_labels = {"yes", "high", "1", "true", "positive", "risk"}
        prediction_int = 1 if label in high_labels else 0
    else:
        try:
            prediction_int = 1 if float(raw_prediction) >= 1 else 0
        except (TypeError, ValueError):
            prediction_int = 0

    risk_level = "high" if prediction_int == 1 else "low"
    return prediction_int, risk_level

# ------------------ AUTH ------------------
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json

        user = User(
            email=data["email"],
            password=generate_password_hash(data["password"]),
            child_name=data["child_name"],
            age=int(data["age"])
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered successfully", "user_id": user.id})

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 400

# ------------------ LOGIN ------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if user and check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Login successful", "user_id": user.id})

    return jsonify({"error": "Invalid credentials"}), 401

# ------------------ HISTORY ------------------
@app.route("/history/<int:user_id>")
def history(user_id):
    records = Assessment.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "typing_speed": r.typing_speed,
            "accuracy": r.accuracy,
            "prediction": r.prediction,
            "risk_level": r.risk_level
        }
        for r in records
    ])

# ------------------ PREDICT ------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        logger.info(f"Input: {data}")

        features = transform_input(data)

        raw_prediction = model.predict([features])[0]
        prediction_int, risk_level = normalize_prediction(raw_prediction)

        if hasattr(model, "predict_proba"):
            probability = model.predict_proba([features])[0][1]
        else:
            probability = None

        # Save to DB
        user_id = data.get("user_id")
        if user_id:
            record = Assessment(
                user_id=user_id,
                typing_speed=data.get("typing_speed", 0),
                accuracy=data.get("overall_accuracy", 0),
                total_errors=data.get("total_errors", 0),
                cognitive_score=data.get("cognitive_score"),
                prediction=prediction_int,
                probability=probability,
                risk_level=risk_level
            )
            db.session.add(record)
            db.session.commit()

        return jsonify({
            "prediction": prediction_int,
            "raw_prediction": str(raw_prediction),
            "risk_level": risk_level,
            "probability": probability
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ TEST MODEL ------------------
@app.route("/test-model")
def test_model():
    try:
        dummy = {
            "overall_accuracy": 85,
            "total_errors": 10,
            "typing_speed": 30
        }

        features = transform_input(dummy)
        raw_prediction = model.predict([features])[0]
        prediction_int, risk_level = normalize_prediction(raw_prediction)

        return jsonify({
            "features": features,
            "prediction": prediction_int,
            "raw_prediction": str(raw_prediction),
            "risk_level": risk_level
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# ------------------ RUN ------------------
if __name__ == "__main__":
    app.run(debug=True)