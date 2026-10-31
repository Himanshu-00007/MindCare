
import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report


# 1. Load dataset
data = pd.read_csv("dataset/mindcare_data.csv")

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)


# 2. Select the 21 questionnaire responses
features = (
    [f"phq{i}" for i in range(1, 10)] +
    [f"gad{i}" for i in range(1, 8)] +
    [f"ghq{i}" for i in range(1, 6)]
)

target = "PHQ9_severity_label"

# Check required columns
required_columns = features + [target]

missing_columns = [
    col for col in required_columns
    if col not in data.columns
]

if missing_columns:
    raise ValueError(
        f"Missing columns in dataset: {missing_columns}"
    )

# Remove rows containing missing values
data = data.dropna(subset=required_columns)

X = data[features]
y = data[target]

# Display class distribution
print("\nClass Distribution:")
print(y.value_counts())

if y.nunique() < 2:
    raise ValueError("At least two target classes are required.")


# 3. Split dataset into training and testing
# Removed stratify=y because the severe class has only 1 record.

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))


# 4. Create Decision Tree model
model = DecisionTreeClassifier(
    max_depth=5,
    random_state=42
)


# 5. Train the model
model.fit(X_train, y_train)

print("\nModel training completed!")


# 6. Make predictions
predictions = model.predict(X_test)


# 7. Evaluate model
accuracy = accuracy_score(y_test, predictions)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# 8. Save trained model
os.makedirs("model", exist_ok=True)

joblib.dump(
    model,
    "model/mindcare_model.pkl"
)

print("\nModel saved successfully!")
print("Location: model/mindcare_model.pkl")


# IMPORTANT:
# This is synthetic demonstration data.
# Labels are calculated from PHQ-9 score thresholds.
# This model is NOT clinically validated.
