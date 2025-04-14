import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta

# Initialize Faker for generating realistic names and locations
fake = Faker()

# Set random seed for reproducibility
np.random.seed(13)
random.seed(13)

# Number of records
n_samples = 1000

# Helper functions
def random_revenue():
    ranges = [
        "Less than $1M", "$1M to $10M", "$10M to $50M", "$50M to $100M",
        "$100M to $500M", "$500M to $1B", "$1B to $10B"
    ]
    weights = [0.3, 0.25, 0.2, 0.1, 0.08, 0.05, 0.02]
    return random.choices(ranges, weights=weights, k=1)[0]

def random_employees():
    ranges = ["1-10", "10-50", "50-100", "100-500", "500-1000", "1000+"]
    weights = [0.3, 0.3, 0.2, 0.1, 0.05, 0.05]
    return random.choices(ranges, weights=weights, k=1)[0]

def random_funding():
    ranges = [
        "Less than $500K", "$500K to $1M", "$1M to $5M", "$5M to $10M",
        "$10M to $50M", "$50M to $100M", "$100M+"
    ]
    weights = [0.3, 0.2, 0.2, 0.15, 0.1, 0.03, 0.02]
    return random.choices(ranges, weights=weights, k=1)[0]

def random_founded_date():
    start_date = datetime(1980, 1, 1)
    end_date = datetime(2025, 1, 1)
    days_range = (end_date - start_date).days
    random_days = random.randint(0, days_range)
    return (start_date + timedelta(days=random_days)).year

# Generate synthetic data
data = {
    "Organization Name": [fake.company() for _ in range(n_samples)],
    "Industries": [
        random.choice([
            "Tech, AI", "FinTech, Blockchain", "HealthTech, Biotech", "E-commerce, Retail",
            "EdTech, Education", "GreenTech, Sustainability", "Gaming, Entertainment",
            "SaaS, Cloud Computing"
        ]) for _ in range(n_samples)
    ],
    "Headquarters Location": [
        random.choice([
            "Mumbai, Maharashtra, India", "Bangalore, Karnataka, India", "Delhi, India",
            "San Francisco, CA, USA", "New York, NY, USA", "London, UK", "Singapore",
            "Berlin, Germany"
        ]) for _ in range(n_samples)
    ],
    "Estimated Revenue": [random_revenue() for _ in range(n_samples)],
    "Founded Date": [random_founded_date() for _ in range(n_samples)],
    "Investment Stage": [
        random.choice(["Seed", "Series A", "Series B", "Series C", "Pre-Seed", "Unknown"])
        for _ in range(n_samples)
    ],
    "Industry Groups": [
        random.choice(["Technology", "Finance", "Healthcare", "Retail", "Education", "Energy"])
        for _ in range(n_samples)
    ],
    "Number of Founders": [random.randint(1, 5) for _ in range(n_samples)],
    "Founders": [
        ", ".join([fake.name() for _ in range(random.randint(1, 3))]) for _ in range(n_samples)
    ],
    "Number of Employees": [random_employees() for _ in range(n_samples)],
    "Number of Funding Rounds": [random.randint(0, 5) for _ in range(n_samples)],
    "Funding Status": [
        random.choice([
            "Early Stage Venture", "Late Stage Venture", "M&A", "IPO", "Bootstrapped", "Unknown"
        ]) for _ in range(n_samples)
    ],
    "Total Funding Amount": [random_funding() for _ in range(n_samples)],
    "Growth Category": [
        random.choice(["High Growth", "Moderate Growth", "Stable", "Declining"])
        for _ in range(n_samples)
    ],
    "Growth Confidence": [
        random.choice(["High", "Medium", "Low", "Unknown"]) for _ in range(n_samples)
    ],
    "Monthly visit": [random.randint(1000, 1000000) for _ in range(n_samples)],
    "Visit Duration Growth": [round(random.uniform(-0.5, 0.5), 2) for _ in range(n_samples)],
    "Patents Granted": [random.randint(0, 50) for _ in range(n_samples)],
    "Visit Duration": [random.randint(100, 600) for _ in range(n_samples)],
    "Operating Status": [
        random.choice(["Active", "Closed"]) for _ in range(n_samples)
    ]
}

# Create DataFrame
df = pd.DataFrame(data)

# Introduce some missing data
for col in df.columns:
    if col not in ["Organization Name", "Operating Status"]:
        mask = np.random.random(len(df)) < 0.1  # 10% missing data
        df.loc[mask, col] = np.nan

# Save to CSV
df.to_csv("synthetic_startups.csv", index=False)
print("Synthetic dataset saved to 'synthetic_startups.csv'")