from pipeline import train_pipeline, predict_startup  # Adjust import path to your pipeline module

# Train the pipeline
pipeline = train_pipeline("data_2.csv")

# Test with a likely Closed company
closed_sample = {
    "Organization Name": "Test Startup",
    "Industries": "FinTech",
    "Headquarters Location": "Delhi",
    "Estimated Revenue": "Less than $1M",
    "Founded Date": 2023,
    "Investment Stage": "Seed",
    "Industry Groups": "Commerce",
    "Number of Founders": 1,
    "Founders": "Ravi Kumar",
    "Number of Employees": "1-10",
    "Number of Funding Rounds": 0,
    "Funding Status": "Seed",
    "Total Funding Amount": "$0 to $1M",
    "Growth Category": "Medium",
    "Growth Confidence": "Low",
    "Monthly visit": 500,
    "Monthly Visit Growth": -10.0,
    "Visit Duration Growth": 0.0,
    "Patents Granted": 0,
    "Visit Duration": 100
}

prediction = predict_startup(closed_sample)
print("Prediction for Closed sample:", prediction)