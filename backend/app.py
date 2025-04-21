from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from pipeline import predict_startup, generate_peer_comparison_report, compare_to_selected_startup, RevenueMapper, EmployeeRangeConverter, FundingConverter, YearsActiveCalculator, GrowthConfidenceConverter, IndustriesEncoder, FrequencyEncoder, DerivedFeatures
import math
import pymongo
import logging

# Logging Setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Setup
MONGO_URI = "mongodb://localhost:27017/"
try:
    mongo_client = pymongo.MongoClient(MONGO_URI)
    db = mongo_client["startup_db"]
    active_startups_collection = db["active_startups"]
    closed_startups_collection = db["closed_startups"]  # New collection for Closed startups
    logger.info("Connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise Exception(f"MongoDB connection failed: {str(e)}")

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
    Founded_Date: float = None
    Investment_Stage: str = None
    Industry_Groups: str = None
    Number_of_Founders: float = None
    Founders: str = None
    Number_of_Employees: str = None
    Number_of_Funding_Rounds: float = None
    Funding_Status: str = None
    Total_Funding_Amount: str = None
    Growth_Category: str = None
    Growth_Confidence: str = None
    Monthly_visit: float = None
    Visit_Duration_Growth: float = None
    Patents_Granted: float = None
    Visit_Duration: float = None

class ComparisonRequest(BaseModel):
    startup_data: StartupData
    selected_startup_name: str

# API Endpoints
@app.post("/predict")
async def predict(data: StartupData):
    input_data = data.dict(exclude_unset=True)
    logger.info(f"Received input data: {input_data}")
    if not input_data:
        raise HTTPException(status_code=422, detail="No valid data provided")
    try:
        # Convert field names from underscores to spaces for the pipeline
        converted_data = {}
        field_mapping = {
            "Organization_Name": "Organization Name",
            "Industries": "Industries",
            "Headquarters_Location": "Headquarters Location",
            "Estimated_Revenue": "Estimated Revenue",
            "Founded_Date": "Founded Date",
            "Investment_Stage": "Investment Stage",
            "Industry_Groups": "Industry Groups",
            "Number_of_Founders": "Number of Founders",
            "Founders": "Founders",
            "Number_of_Employees": "Number of Employees",
            "Number_of_Funding_Rounds": "Number of Funding Rounds",
            "Funding_Status": "Funding Status",
            "Total_Funding_Amount": "Total Funding Amount",
            "Growth_Category": "Growth Category",
            "Growth_Confidence": "Growth Confidence",
            "Monthly_visit": "Monthly visit",
            "Visit_Duration_Growth": "Visit Duration Growth",
            "Patents_Granted": "Patents Granted",
            "Visit_Duration": "Visit Duration"
        }
        
        for key, value in input_data.items():
            if key in field_mapping:
                converted_data[field_mapping[key]] = value
            else:
                converted_data[key] = value
        
        result = predict_startup(converted_data)
        logger.info(f"Prediction for {data.Organization_Name}: {result['practical_prediction']['label']} (Confidence: {result['practical_prediction']['confidence']})")
        startup_data = input_data
        startup_data["prediction"] = result["practical_prediction"]["label"]
        startup_data["confidence_level"] = result["practical_prediction"]["confidence"]
        
        if result["practical_prediction"]["label"] == "Active":
            active_startups_collection.update_one(
                {"Organization_Name": startup_data.get("Organization_Name")},
                {"$set": startup_data},
                upsert=True
            )
            logger.info(f"Stored Active startup: {startup_data.get('Organization_Name')}")
        elif result["practical_prediction"]["label"] == "Closed":
            # Optional: Store Closed startups in a separate collection
            closed_startups_collection.update_one(
                {"Organization_Name": startup_data.get("Organization_Name")},
                {"$set": startup_data},
                upsert=True
            )
            logger.info(f"Stored Closed startup: {startup_data.get('Organization_Name')}")
        else:
            logger.warning(f"Unexpected prediction value: {result['practical_prediction']['label']}")
        return result
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/peer_comparison")
async def peer_comparison(data: StartupData):
    input_data = data.dict(exclude_unset=True)
    logger.info(f"Peer comparison input data: {input_data}")
    if not input_data:
        raise HTTPException(status_code=422, detail="No valid data provided")
    try:
        # Convert field names from underscores to spaces for the pipeline
        converted_data = {}
        field_mapping = {
            "Organization_Name": "Organization Name",
            "Industries": "Industries",
            "Headquarters_Location": "Headquarters Location",
            "Estimated_Revenue": "Estimated Revenue",
            "Founded_Date": "Founded Date",
            "Investment_Stage": "Investment Stage",
            "Industry_Groups": "Industry Groups",
            "Number_of_Founders": "Number of Founders",
            "Founders": "Founders",
            "Number_of_Employees": "Number of Employees",
            "Number_of_Funding_Rounds": "Number of Funding Rounds",
            "Funding_Status": "Funding Status",
            "Total_Funding_Amount": "Total Funding Amount",
            "Growth_Category": "Growth Category",
            "Growth_Confidence": "Growth Confidence",
            "Monthly_visit": "Monthly visit",
            "Visit_Duration_Growth": "Visit Duration Growth",
            "Patents_Granted": "Patents Granted",
            "Visit_Duration": "Visit Duration"
        }
        
        for key, value in input_data.items():
            if key in field_mapping:
                converted_data[field_mapping[key]] = value
            else:
                converted_data[key] = value
        
        report = generate_peer_comparison_report(converted_data, "startup_og.csv")
        clean_report = replace_inf_nan(report)
        return clean_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Peer comparison failed: {str(e)}")

@app.post("/compare_to_startup")
async def compare_to_startup(request: ComparisonRequest):
    input_data = request.startup_data.dict(exclude_unset=True)
    logger.info(f"Compare to startup input data: {input_data}")
    try:
        # Convert field names from underscores to spaces for the pipeline
        converted_data = {}
        field_mapping = {
            "Organization_Name": "Organization Name",
            "Industries": "Industries",
            "Headquarters_Location": "Headquarters Location",
            "Estimated_Revenue": "Estimated Revenue",
            "Founded_Date": "Founded Date",
            "Investment_Stage": "Investment Stage",
            "Industry_Groups": "Industry Groups",
            "Number_of_Founders": "Number of Founders",
            "Founders": "Founders",
            "Number_of_Employees": "Number of Employees",
            "Number_of_Funding_Rounds": "Number of Funding Rounds",
            "Funding_Status": "Funding Status",
            "Total_Funding_Amount": "Total Funding Amount",
            "Growth_Category": "Growth Category",
            "Growth_Confidence": "Growth Confidence",
            "Monthly_visit": "Monthly visit",
            "Visit_Duration_Growth": "Visit Duration Growth",
            "Patents_Granted": "Patents Granted",
            "Visit_Duration": "Visit Duration"
        }
        
        for key, value in input_data.items():
            if key in field_mapping:
                converted_data[field_mapping[key]] = value
            else:
                converted_data[key] = value
        
        report = compare_to_selected_startup(
            converted_data,
            request.selected_startup_name,
            "startup_og.csv"
        )
        clean_report = replace_inf_nan(report)
        return clean_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

@app.get("/startups")
async def get_startups():
    try:
        startups = list(active_startups_collection.find({}, {"_id": 0}))
        formatted_startups = [
            {
                "Organization_Name": s.get("Organization_Name", "Unknown"),
                "Industries": s.get("Industries", "N/A"),
                "Headquarters_Location": s.get("Headquarters_Location", "N/A"),
                "Investment_Stage": s.get("Investment_Stage", "N/A"),
                "prediction": s.get("prediction", "N/A")
            }
            for s in startups
        ]
        logger.info(f"Fetched {len(formatted_startups)} startups")
        return formatted_startups
    except Exception as e:
        logger.error(f"Failed to fetch startups: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch startups: {str(e)}")

@app.get("/debug_startups")
async def debug_startups():
    try:
        count = active_startups_collection.count_documents({})
        startups = list(active_startups_collection.find({}, {"_id": 0}))
        logger.info(f"Debug fetched {count} startups")
        return {"count": count, "startups": startups}
    except Exception as e:
        logger.error(f"Debug failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Debug failed: {str(e)}")

# Main Execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)