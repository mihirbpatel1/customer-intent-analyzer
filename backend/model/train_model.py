import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer

# Load the dataset
df = pd.read_csv("../data/ecommerce_customers.csv")

# Drop rows with missing values
df.dropna(inplace=True)

# Define label: 0 = Normal, 1 = Loyal, 2 = Fraudulent
def classify(row):
    if row['is_fraudulent'] == 1:
        return 2
    elif row['loyalty_score'] >= 70:
        return 1
    else:
        return 0

df['label'] = df.apply(classify, axis=1)

# Features and target
X = df.drop(columns=['customer_id', 'is_fraudulent', 'customer_since', 'label'])
y = df['label']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing
categorical = ['gender', 'country', 'preferred_category']
numerical = ['age', 'avg_order_value', 'total_orders', 'last_purchase', 'email_open_rate', 'loyalty_score', 'churn_risk']

preprocessor = ColumnTransformer(transformers=[
    ('num', StandardScaler(), numerical),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical)
])

# Full pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Train
pipeline.fit(X_train, y_train)

# Save model
with open("classifier.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("✅ Model trained and saved!")
