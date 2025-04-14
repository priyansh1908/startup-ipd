from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import pandas as pd
import joblib
from pipeline import predict_startup, generate_peer_comparison_report, compare_to_selected_startup
import math

# Utility Functions
def replace_inf_nan(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: replace_inf_nan(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_inf_nan(item) for item in obj]
    else:
        return obj

# FastAPI Setup
app = FastAPI(title="Startup Analysis API")
origins = [
    "http://localhost:3000",
    "https://your-frontend-domain.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Model
class StartupData(BaseModel):
    Organization_Name: str = None
    Industries: str = None
    Headquarters_Location: str = None
    Estimated_Revenue: str = None
    Founded_Date: int = None
    Investment_Stage: str = None
    Industry_Groups: str = None
    Number_of_Founders: int = None
    Founders: str = None
    Number_of_Employees: str = None
    Number_of_Funding_Rounds: int = None
    Funding_Status: str = None
    Total_Funding_Amount: str = None
    Growth_Category: str = None
    Growth_Confidence: str = None
    Monthly_visit: float = None
    Visit_Duration_Growth: float = None
    Patents_Granted: float = None
    Visit_Duration: float = None
    @validator('*', pre=True)
    def convert_none_to_default(cls, v):
        return v if v is not None else None
    @validator('Founded_Date', 'Number_of_Founders', 'Number_of_Funding_Rounds', 'Monthly_visit', 'Visit_Duration_Growth', 'Patents_Granted', 'Visit_Duration', pre=True)
    def convert_to_float_or_int(cls, v):
        if v is None:
            return None
        try:
            if isinstance(v, (int, float)):
                return v
            v = str(v).strip().replace(',', '')
            if '.' in v:
                return float(v)
            return int(v)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid numeric value for {cls.__name__}")

class ComparisonRequest(BaseModel):
    startup_data: StartupData
    selected_startup_name: str

# API Endpoints
@app.post("/predict")
async def predict(data: StartupData):
    if not data.dict(exclude_unset=True):
        raise HTTPException(status_code=422, detail="No valid data provided")
    try:
        result = predict_startup(data.dict(exclude_unset=True))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/peer_comparison")
async def peer_comparison(data: StartupData):
    if not data.dict(exclude_unset=True):
        raise HTTPException(status_code=422, detail="No valid data provided")
    try:
        report = generate_peer_comparison_report(data.dict(exclude_unset=True), "startups.csv")
        clean_report = replace_inf_nan(report)
        return clean_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Peer comparison failed: {str(e)}")

@app.post("/compare_to_startup")
async def compare_to_startup(request: ComparisonRequest):
    try:
        report = compare_to_selected_startup(
            request.startup_data.dict(exclude_unset=True),
            request.selected_startup_name,
            "startups.csv"
        )
        clean_report = replace_inf_nan(report)
        return clean_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

# Main Execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)