
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import joblib
from pathlib import Path


# 1. Create FastAPI application
app = FastAPI(
    title="Mindcare ML API",
    description="Mental health questionnaire classification demo",
    version="1.0.0"
)


# 2. Load trained ML model
BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model" / "mindcare_model.pkl"

model = joblib.load(MODEL_PATH)

print("ML Model loaded successfully!")


# 3. Define input validation
class AssessmentInput(BaseModel):

    # PHQ-9: 9 questions
    phq1: int = Field(ge=0, le=3)
    phq2: int = Field(ge=0, le=3)
    phq3: int = Field(ge=0, le=3)
    phq4: int = Field(ge=0, le=3)
    phq5: int = Field(ge=0, le=3)
    phq6: int = Field(ge=0, le=3)
    phq7: int = Field(ge=0, le=3)
    phq8: int = Field(ge=0, le=3)
    phq9: int = Field(ge=0, le=3)

    # GAD-7: 7 questions
    gad1: int = Field(ge=0, le=3)
    gad2: int = Field(ge=0, le=3)
    gad3: int = Field(ge=0, le=3)
    gad4: int = Field(ge=0, le=3)
    gad5: int = Field(ge=0, le=3)
    gad6: int = Field(ge=0, le=3)
    gad7: int = Field(ge=0, le=3)

    # GHQ: 5 questions
    ghq1: int = Field(ge=0, le=3)
    ghq2: int = Field(ge=0, le=3)
    ghq3: int = Field(ge=0, le=3)
    ghq4: int = Field(ge=0, le=3)
    ghq5: int = Field(ge=0, le=3)


# 4. Create prediction endpoint
@app.post("/predict")
def predict(data: AssessmentInput):

    try:

        # Convert input into dictionary
        input_data = data.model_dump()

        # Calculate questionnaire totals
        phq9_total = sum(
            input_data[f"phq{i}"] for i in range(1, 10)
        )

        gad7_total = sum(
            input_data[f"gad{i}"] for i in range(1, 8)
        )

        ghq5_total = sum(
            input_data[f"ghq{i}"] for i in range(1, 6)
        )

        # Maintain the same feature order used during training
        features = (
            [f"phq{i}" for i in range(1, 10)] +
            [f"gad{i}" for i in range(1, 8)] +
            [f"ghq{i}" for i in range(1, 6)]
        )

        # Convert input into DataFrame
        input_df = pd.DataFrame(
            [[input_data[col] for col in features]],
            columns=features
        )

        # Get prediction
        prediction = model.predict(input_df)[0]

        return {
            "success": True,
            "message": "Demo prediction generated successfully",

            "scores": {
                "PHQ9": phq9_total,
                "GAD7": gad7_total,
                "GHQ5": ghq5_total
            },

            "predicted_category": prediction,

            "notice": (
                "Experimental classification using kaggle and WHO training data. "
                "This is not a clinical diagnosis."
            )
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# 5. Root endpoint
@app.get("/")
def home():

    return {
        "message": "Welcome to Mindcare ML API",
        "status": "Running"
    }
