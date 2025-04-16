import pandas as pd
import numpy as np
from faker import Faker
import random

# Initialize Faker for realistic text data
fake = Faker('en_IN')

# Define choices based on pipeline requirements
industries_choices = [
    'Agriculture and Allied Industries', 'Auto Components', 'Automobiles', 'Aviation', 'Ayush',
    'Banking', 'Biotechnology', 'Cement', 'Chemicals', 'Consumer Durables', 'Defence Manufacturing',
    'E-Commerce', 'Education and Training', 'Electric Vehicle', 'Electronics System Design & Manufacturing',
    'Engineering and Capital Goods', 'Financial Services', 'FMCG', 'Food Processing', 'Gems and Jewellery',
    'Healthcare', 'Infrastructure', 'Insurance', 'IT & BPM', 'Manufacturing', 'Media and Entertainment',
    'Medical Devices', 'Metals and Mining', 'MSME', 'Oil and Gas', 'Paper & Packaging', 'Pharmaceuticals',
    'Ports', 'Power', 'Railways', 'Real Estate', 'Renewable Energy', 'Retail', 'Roads', 'Science and Technology',
    'Services', 'Steel', 'Telecommunications', 'Textiles', 'Tourism and Hospitality'
]

# Map industries to industry groups
industry_groups_map = {
    'Agriculture and Allied Industries': 'Agriculture',
    'Auto Components': 'Automotive',
    'Automobiles': 'Automotive',
    'Aviation': 'Transportation',
    'Ayush': 'Healthcare',
    'Banking': 'Financial Services',
    'Biotechnology': 'Biotechnology',
    'Cement': 'Construction',
    'Chemicals': 'Chemicals',
    'Consumer Durables': 'Consumer Goods',
    'Defence Manufacturing': 'Defence',
    'E-Commerce': 'Commerce',
    'Education and Training': 'Education',
    'Electric Vehicle': 'Automotive',
    'Electronics System Design & Manufacturing': 'Electronics',
    'Engineering and Capital Goods': 'Engineering',
    'Financial Services': 'Financial Services',
    'FMCG': 'Consumer Goods',
    'Food Processing': 'Food and Beverage',
    'Gems and Jewellery': 'Luxury Goods',
    'Healthcare': 'Healthcare',
    'Infrastructure': 'Infrastructure',
    'Insurance': 'Financial Services',
    'IT & BPM': 'Information Technology',
    'Manufacturing': 'Manufacturing',
    'Media and Entertainment': 'Media',
    'Medical Devices': 'Healthcare',
    'Metals and Mining': 'Mining',
    'MSME': 'Small Business',
    'Oil and Gas': 'Energy',
    'Paper & Packaging': 'Packaging',
    'Pharmaceuticals': 'Pharmaceuticals',
    'Ports': 'Transportation',
    'Power': 'Energy',
    'Railways': 'Transportation',
    'Real Estate': 'Real Estate',
    'Renewable Energy': 'Energy',
    'Retail': 'Commerce',
    'Roads': 'Infrastructure',
    'Science and Technology': 'Technology',
    'Services': 'Services',
    'Steel': 'Manufacturing',
    'Telecommunications': 'Telecommunications',
    'Textiles': 'Textiles',
    'Tourism and Hospitality': 'Hospitality'
}

estimated_revenue_choices = ['Less than $1M', '$1M to $10M', '$10M to $50M', '$50M to $100M', '$100M to $500M', '$1B to $10B', '$10B+']
number_employees_choices = ['1-10', '11-50', '51-100', '101-250', '251-500', '501-1000', '1001-5000']
investment_stage_choices = ['Seed', 'Series A', 'Series B', 'Series C', 'IPO']
funding_status_choices = ['Seed', 'Early Stage Venture', 'Growing', 'M&A']
growth_category_choices = ['Growing', 'Medium', 'High']
growth_confidence_choices = ['Low', 'Medium', 'High']
total_funding_amount_choices = ['$0 to $1M', '$1M to $5M', '$5M to $10M', '$10M to $50M', '$50M to $100M', '$100M to $500M']
headquarters_locations = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Jammu and Kashmir'
]

# Function to convert funding amount to numeric for scoring
def clean_funding_amount(amount):
    if isinstance(amount, str):
        # Extract the upper bound of the range
        upper = amount.split(' to ')[-1].replace('$', '').replace('M', '000000').replace('K', '000')
        try:
            return int(float(upper))
        except ValueError:
            return 0
    return amount

# Function to generate Operating Status with 17-18% Closed
def determine_operating_status(row, closed_prob=0.175):
    score = 0
    # High influence factors
    revenue_weights = {
        '$10B+': 0.5, '$1B to $10B': 0.4, '$100M to $500M': 0.3, '$50M to $100M': 0.25,
        '$10M to $50M': 0.2, '$1M to $10M': 0.15, 'Less than $1M': 0.1
    }
    score += revenue_weights.get(row['Estimated Revenue'], 0.0)
    
    funding_amount = clean_funding_amount(row['Total Funding Amount'])
    if funding_amount > 50_000_000:
        score += 0.4
    elif funding_amount > 10_000_000:
        score += 0.3
    elif funding_amount > 1_000_000:
        score += 0.2
    elif funding_amount > 0:
        score += 0.1
    
    employee_weights = {
        '1001-5000': 0.4, '501-1000': 0.3, '251-500': 0.25, '101-250': 0.2,
        '51-100': 0.15, '11-50': 0.1, '1-10': 0.05
    }
    score += employee_weights.get(row['Number of Employees'], 0.0)
    
    if row['Growth Confidence'] == 'High':
        score += 0.3
    elif row['Growth Confidence'] == 'Medium':
        score += 0.15
    elif row['Growth Confidence'] == 'Low':
        score -= 0.1
    
    if row['Monthly Visit Growth'] > 100:
        score += 0.3
    elif row['Monthly Visit Growth'] > 0:
        score += 0.15
    elif row['Monthly Visit Growth'] < 0:
        score -= 0.1
    
    # Moderate influence factors
    if row['Number of Funding Rounds'] >= 4:
        score += 0.15
    elif row['Number of Funding Rounds'] >= 2:
        score += 0.1
    
    years_active = 2025 - row['Founded Date']
    if years_active <= 3:
        score -= 0.1
    elif years_active >= 7:
        score += 0.1
    
    if row['Monthly visit'] > 100_000:
        score += 0.15
    elif row['Monthly visit'] > 10_000:
        score += 0.1
    
    # Adjust score to target 17-18% Closed
    prob_closed = 1.0 - min(1.0, max(0.0, score / 2.5))  # Invert score: lower score -> higher prob_closed
    prob_closed = min(0.35, prob_closed * 0.8)  # Tune to ~0.175 average
    return 'Closed' if random.random() < prob_closed else 'Active'

# Generate synthetic data
def generate_synthetic_data(n_rows=1000):
    data = []
    closed_count = 0
    target_closed = random.randint(170, 180)  # Exact 17-18%
    
    for _ in range(n_rows):
        # Basic company info
        org_name = fake.company() + ' ' + random.choice(['Labs', 'Technologies', 'Solutions', 'Innovations', 'Pvt Ltd'])
        industry = random.choice(industries_choices)
        industry_group = industry_groups_map.get(industry, 'Other')
        hq_location = random.choice(headquarters_locations)
        founded_year = random.randint(2017, 2024)
        
        # Decide Operating Status early to set features accordingly
        is_closed = False
        if closed_count < target_closed and random.random() < 0.3:  # Bias toward Closed until target
            is_closed = True
            closed_count += 1
        
        # Financial and growth metrics
        if is_closed:
            estimated_revenue = random.choice(estimated_revenue_choices[:3])  # Up to $10M
            total_funding = random.choice(total_funding_amount_choices[:2])  # Up to $5M
            num_employees = random.choice(number_employees_choices[:3])  # Up to 100
            growth_confidence = random.choice(['Low', 'Medium'])
            monthly_visit_growth = random.uniform(-100, 50)  # Negative or low
            monthly_visits = random.randint(0, 50_000)  # Lower visits
            num_funding_rounds = random.randint(0, 2)  # Fewer rounds
            funding_status = random.choice(funding_status_choices[:2])  # Seed or Early Stage
            investment_stage = random.choice(investment_stage_choices[:2])  # Seed or Series A
        else:
            estimated_revenue = random.choice(estimated_revenue_choices)
            total_funding = random.choice(total_funding_amount_choices)
            num_employees = random.choice(number_employees_choices)
            growth_confidence = random.choice(growth_confidence_choices)
            monthly_visit_growth = random.uniform(-100, 2000)
            monthly_visits = random.randint(0, 2_000_000)
            num_funding_rounds = random.randint(0, 7)
            funding_status = random.choice(funding_status_choices)
            investment_stage = random.choice(investment_stage_choices)
        
        # Employee and founder info
        num_founders = random.randint(0, 5)
        founders = ', '.join([fake.name() for _ in range(max(1, num_founders))])  # At least one founder
        
        # Growth metrics
        visit_duration = random.randint(0, 2500)
        visit_duration_growth = random.uniform(-100, 10000)
        growth_category = random.choice(growth_category_choices)
        
        # Other details
        patents_granted = random.randint(0, 10)
        
        # Create row
        row = {
            'Organization Name': org_name,
            'Industries': industry,
            'Headquarters Location': hq_location,
            'Estimated Revenue': estimated_revenue,
            'Operating Status': 'Closed' if is_closed else 'Active',
            'Founded Date': founded_year,
            'Investment Stage': investment_stage,
            'Industry Groups': industry_group,
            'Number of Founders': max(1, num_founders),
            'Founders': founders,
            'Number of Employees': num_employees,
            'Number of Funding Rounds': num_funding_rounds,
            'Funding Status': funding_status,
            'Total Funding Amount': total_funding,
            'Growth Category': growth_category,
            'Growth Confidence': growth_confidence,
            'Monthly visit': monthly_visits,
            'Monthly Visit Growth': monthly_visit_growth,
            'Visit Duration Growth': visit_duration_growth,
            'Patents Granted': patents_granted,
            'Visit Duration': visit_duration
        }
        
        # Verify Operating Status with scoring for consistency
        if determine_operating_status(row) != row['Operating Status']:
            # Adjust features to align with score-based expectation
            if row['Operating Status'] == 'Closed':
                row['Estimated Revenue'] = random.choice(estimated_revenue_choices[:2])  # Up to $1M
                row['Total Funding Amount'] = total_funding_amount_choices[0]  # $0 to $1M
                row['Number of Employees'] = random.choice(number_employees_choices[:2])  # Up to 50
                row['Growth Confidence'] = 'Low'
                row['Monthly Visit Growth'] = random.uniform(-100, 0)
                row['Monthly visit'] = random.randint(0, 10_000)
                row['Number of Funding Rounds'] = 0
                row['Funding Status'] = funding_status_choices[0]  # Seed
                row['Investment Stage'] = investment_stage_choices[0]  # Seed
        
        data.append(row)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV_
    df.to_csv('data_2.csv', index=False)
    return df

# Generate data
if __name__ == '__main__':
    synthetic_data = generate_synthetic_data(1000)
    print(synthetic_data.head())
    print("\nOperating Status Distribution:")
    print(synthetic_data['Operating Status'].value_counts())
    print("\nOperating Status Proportions:")
    print(synthetic_data['Operating Status'].value_counts(normalize=True))