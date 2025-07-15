from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import json
import os
from datetime import date, datetime  # ✅ Added datetime

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("model/classifier.pkl")

# Schema
class CustomerInput(BaseModel):
    age: int
    gender: str
    country: str
    avg_order_value: float
    total_orders: int
    last_purchase: date
    preferred_category: str
    email_open_rate: float
    loyalty_score: int
    churn_risk: float

# Save to file
def save_prediction_to_file(data, filename="prediction_history.json"):
    data["timestamp"] = datetime.now().isoformat()  # ✅ fixed timestamp
    if os.path.exists(filename):
        with open(filename, "r+") as file:
            existing = json.load(file)
            existing.append(data)
            file.seek(0)
            json.dump(existing, file, indent=2)
    else:
        with open(filename, "w") as file:
            json.dump([data], file, indent=2)

# Prediction endpoint
@app.post("/predict")
def predict(customer: CustomerInput):


    try:
        print("✅ Received:", customer.dict())
        data = customer.dict()

        # ✅ Replace ISO date with "days since last purchase"
        today = datetime.today().date()
        data["last_purchase"] = (today - data["last_purchase"]).days

        input_df = pd.DataFrame([data])
        prediction = model.predict(input_df)[0]

        confidence = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(input_df)[0]
            confidence = np.max(proba)

        label_map = {0: "Normal", 1: "Loyal", 2: "Fraudulent"}
        predicted_label = label_map.get(prediction, "Unknown")

        # 🚨 Flag suspicious as fraud even if model says "Normal"
        if predicted_label == "Normal":
            suspicious = (
                input_df["avg_order_value"].iloc[0] > 1000 or
                input_df["churn_risk"].iloc[0] > 0.8 or
                input_df["loyalty_score"].iloc[0] < 20 or
                input_df["email_open_rate"].iloc[0] < 0.2 or
                input_df["total_orders"].iloc[0] <= 3
            )
            if suspicious:
                predicted_label = "Fraudulent"


        result = {
            "label": predicted_label,
            "confidence": round(float(confidence * 100), 2) if confidence else None,
            "input": data
        }

        save_prediction_to_file(result)
        return result
    

    except Exception as e:
        print("❌ Prediction error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
