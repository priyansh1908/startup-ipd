import pandas as pd
import numpy as np
import re
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, OrdinalEncoder, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import zscore
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestClassifier
import joblib
from datetime import datetime

# Constants
USD_TO_INR = 83.50
W_H = 0.7
W_O = 0.3

# Custom Transformers (unchanged)
class RevenueMapper(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        if isinstance(X_copy, pd.DataFrame):
            X_copy = X_copy.iloc[:, 0].astype(str).values
        elif isinstance(X_copy, np.ndarray):
            X_copy = X_copy.astype(str) if X_copy.ndim == 1 else X_copy[:, 0].astype(str)
        else:
            X_copy = np.array(X_copy, dtype=str)
        def parse_revenue(revenue):
            revenue = str(revenue).strip().lower()
            if revenue in ['unknown', 'nan', 'none', '', '—', '–', '-']:
                return np.nan
            revenue_clean = revenue.replace('$', '').replace(',', '')
            multiplier = 1.0
            if 'k' in revenue_clean:
                multiplier = 1e3
                revenue_clean = revenue_clean.replace('k', '').strip()
            elif 'm' in revenue_clean:
                multiplier = 1e6
                revenue_clean = revenue_clean.replace('m', '').strip()
            elif 'b' in revenue_clean:
                multiplier = 1e9
                revenue_clean = revenue_clean.replace('b', '').strip()
            if 'to' in revenue_clean:
                try:
                    low, high = revenue_clean.split('to')
                    low = low.strip()
                    high = high.strip()
                    high_multiplier = multiplier
                    if 'k' in high:
                        high_multiplier = 1e3
                        high = high.replace('k', '').strip()
                    elif 'm' in high:
                        high_multiplier = 1e6
                        high = high.replace('m', '').strip()
                    elif 'b' in high:
                        high_multiplier = 1e9
                        high = high.replace('b', '').strip()
                    low_val = float(low) * multiplier
                    high_val = float(high) * high_multiplier
                    return (low_val + high_val) / 2
                except:
                    return np.nan
            if 'less than' in revenue_clean:
                try:
                    value = revenue_clean.replace('less than', '').strip()
                    val_multiplier = multiplier
                    if 'k' in value:
                        val_multiplier = 1e3
                        value = value.replace('k', '').strip()
                    elif 'm' in value:
                        val_multiplier = 1e6
                        value = value.replace('m', '').strip()
                    elif 'b' in value:
                        val_multiplier = 1e9
                        value = value.replace('b', '').strip()
                    return float(value) * val_multiplier * 0.5
                except:
                    return 500000.0 if multiplier == 1e6 else 500000000.0 if multiplier == 1e9 else 500.0
            try:
                return float(revenue_clean) * multiplier
            except:
                return np.nan
        result = np.array([parse_revenue(x) for x in X_copy]).reshape(-1, 1)
        return result
    def get_feature_names_out(self, input_features=None):
        return ["revenue_mapped"]

class EmployeeRangeConverter(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        if isinstance(X_copy, pd.DataFrame):
            X_copy = X_copy.iloc[:, 0].astype(str).values
        elif isinstance(X_copy, np.ndarray):
            X_copy = X_copy.astype(str) if X_copy.ndim == 1 else X_copy[:, 0].astype(str)
        else:
            X_copy = np.array(X_copy, dtype=str)
        def parse_employees(emp):
            emp = str(emp).strip().lower()
            if emp in ['unknown', 'nan', 'none', '', '—', '–', '-']:
                return np.nan
            if '-' in emp:
                try:
                    low, high = emp.split('-')
                    return (float(low.strip()) + float(high.strip())) / 2
                except:
                    return np.nan
            elif '+' in emp:
                try:
                    return float(emp.replace('+', '').strip())
                except:
                    return np.nan
            try:
                return float(emp)
            except:
                return np.nan
        result = np.array([parse_employees(x) for x in X_copy]).reshape(-1, 1)
        return result
    def get_feature_names_out(self, input_features=None):
        return ["employees_converted"]

class FundingConverter(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        if isinstance(X_copy, pd.DataFrame):
            X_copy = X_copy.iloc[:, 0].astype(str).values
        elif isinstance(X_copy, np.ndarray):
            X_copy = X_copy.astype(str) if X_copy.ndim == 1 else X_copy[:, 0].astype(str)
        else:
            X_copy = np.array(X_copy, dtype=str)
        def parse_funding(fund):
            fund = str(fund).strip().lower()
            if fund in ['unknown', 'nan', 'none', '', '—', '–', '-']:
                return np.nan
            fund_clean = fund.replace('$', '').replace(',', '')
            multiplier = 1.0
            if 'k' in fund_clean:
                multiplier = 1e3
                fund_clean = fund_clean.replace('k', '').strip()
            elif 'm' in fund_clean:
                multiplier = 1e6
                fund_clean = fund_clean.replace('m', '').strip()
            elif 'b' in fund_clean:
                multiplier = 1e9
                fund_clean = fund_clean.replace('b', '').strip()
            if 'to' in fund_clean:
                try:
                    low, high = fund_clean.split('to')
                    low = low.strip()
                    high = high.strip()
                    high_multiplier = multiplier
                    if 'k' in high:
                        high_multiplier = 1e3
                        high = high.replace('k', '').strip()
                    elif 'm' in high:
                        high_multiplier = 1e6
                        high = high.replace('m', '').strip()
                    elif 'b' in high:
                        high_multiplier = 1e9
                        high = high.replace('b', '').strip()
                    low_val = float(low) * multiplier
                    high_val = float(high) * high_multiplier
                    return (low_val + high_val) / 2
                except:
                    return np.nan
            if 'less than' in fund_clean:
                try:
                    value = fund_clean.replace('less than', '').strip()
                    val_multiplier = multiplier
                    if 'k' in value:
                        val_multiplier = 1e3
                        value = value.replace('k', '').strip()
                    elif 'm' in value:
                        val_multiplier = 1e6
                        value = value.replace('m', '').strip()
                    elif 'b' in value:
                        val_multiplier = 1e9
                        value = value.replace('b', '').strip()
                    return float(value) * val_multiplier * 0.5
                except:
                    return 500000.0 if multiplier == 1e6 else 500000000.0 if multiplier == 1e9 else 500.0
            try:
                return float(fund_clean) * multiplier
            except:
                return np.nan
        result = np.array([parse_funding(x) for x in X_copy]).reshape(-1, 1)
        return result
    def get_feature_names_out(self, input_features=None):
        return ["funding_amount_converted"]

class YearsActiveCalculator(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        if isinstance(X_copy, pd.DataFrame):
            X_copy = X_copy.iloc[:, 0].astype(str).values
        elif isinstance(X_copy, np.ndarray):
            X_copy = X_copy.astype(str) if X_copy.ndim == 1 else X_copy[:, 0].astype(str)
        else:
            X_copy = np.array(X_copy, dtype=str)
        def calculate_years(year):
            try:
                year = float(year)
                current_year = datetime.now().year
                return current_year - year if year <= current_year else np.nan
            except:
                return np.nan
        result = np.array([calculate_years(x) for x in X_copy]).reshape(-1, 1)
        return result
    def get_feature_names_out(self, input_features=None):
        return ["years_active"]

class GrowthConfidenceConverter(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        if isinstance(X_copy, pd.DataFrame):
            X_copy = X_copy.iloc[:, 0].astype(str).values
        elif isinstance(X_copy, np.ndarray):
            X_copy = X_copy.astype(str) if X_copy.ndim == 1 else X_copy[:, 0].astype(str)
        else:
            X_copy = np.array(X_copy, dtype=str)
        def parse_confidence(x):
            x = str(x).strip().lower()
            mapping = {"low": 0.3, "medium": 0.5, "high": 0.7, "unknown": 0.5}
            return mapping.get(x, 0.5)
        result = np.array([parse_confidence(x) for x in X_copy]).reshape(-1, 1)
        return result
    def get_feature_names_out(self, input_features=None):
        return ["growth_confidence_converted"]

class IndustriesEncoder(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        self.vectorizer = TfidfVectorizer(max_features=50, stop_words="english")
        if isinstance(X, pd.DataFrame):
            X = X.iloc[:, 0].astype(str).values
        elif isinstance(X, np.ndarray):
            X = X.astype(str) if X.ndim == 1 else X[:, 0].astype(str)
        else:
            X = np.array(X, dtype=str)
        self.vectorizer.fit(X)
        return self
    def transform(self, X):
        if isinstance(X, pd.DataFrame):
            X = X.iloc[:, 0].astype(str).values
        elif isinstance(X, np.ndarray):
            X = X.astype(str) if X.ndim == 1 else X[:, 0].astype(str)
        else:
            X = np.array(X, dtype=str)
        return self.vectorizer.transform(X).toarray()
    def get_feature_names_out(self, input_features=None):
        return self.vectorizer.get_feature_names_out()

class FrequencyEncoder(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        if isinstance(X, pd.DataFrame):
            X = X.iloc[:, 0].astype(str).values
        elif isinstance(X, np.ndarray):
            X = X.astype(str) if X.ndim == 1 else X[:, 0].astype(str)
        else:
            X = np.array(X, dtype=str)
        self.freq_map_ = pd.Series(X.ravel()).value_counts(normalize=True).to_dict()
        return self
    def transform(self, X):
        if isinstance(X, pd.DataFrame):
            X = X.iloc[:, 0].astype(str).values
        elif isinstance(X, np.ndarray):
            X = X.astype(str) if X.ndim == 1 else X[:, 0].astype(str)
        else:
            X = np.array(X, dtype=str)
        result = np.array([self.freq_map_.get(x, 0.0) for x in X.ravel()]).reshape(-1, 1)
        return result
    def get_feature_names_out(self, input_features=None):
        return ["frequency_encoded"]

class DerivedFeatures(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.feature_names_ = None
        self.required_cols = {
            "revenue": None,
            "employees": None,
            "funding": None,
            "years": None,
            "growth_confidence": None
        }
    def fit(self, X, y=None, feature_names=None):
        if feature_names is None:
            raise ValueError("feature_names must be provided")
        self.feature_names_ = list(feature_names)
        return self
    def transform(self, X):
        if self.feature_names_ is None:
            raise ValueError("Feature names must be set during fit.")
        if isinstance(X, np.ndarray):
            X_df = pd.DataFrame(X, columns=self.feature_names_)
        else:
            X_df = X.copy()
        for col in self.feature_names_:
            if "revenue_mapped" in col.lower():
                self.required_cols["revenue"] = col
            elif "employees_converted" in col.lower():
                self.required_cols["employees"] = col
            elif "funding_amount_converted" in col.lower():
                self.required_cols["funding"] = col
            elif "years_active" in col.lower():
                self.required_cols["years"] = col
            elif "growth_confidence_converted" in col.lower():
                self.required_cols["growth_confidence"] = col
        missing_cols = [k for k, v in self.required_cols.items() if v is None]
        if missing_cols:
            raise ValueError(f"Required columns not found: {missing_cols}")
        revenue_col = self.required_cols["revenue"]
        employees_col = self.required_cols["employees"]
        funding_col = self.required_cols["funding"]
        years_col = self.required_cols["years"]
        growth_confidence_col = self.required_cols["growth_confidence"]
        X_df["Funding Per Year"] = X_df[funding_col] / X_df[years_col].replace(0, 1)
        X_df["Hardwork Factor"] = X_df[revenue_col] / X_df[employees_col].replace(0, 1)
        H_prime = zscore(X_df["Hardwork Factor"].fillna(0))
        X_df["Non-Financial Score (N)"] = W_H * H_prime + W_O * X_df[growth_confidence_col].fillna(0)
        return X_df.values
    def fit_transform(self, X, y=None, **fit_params):
        feature_names = fit_params.get('feature_names', None)
        self.fit(X, y, feature_names=feature_names)
        return self.transform(X)
    def get_feature_names_out(self, input_features=None):
        if self.feature_names_ is None:
            raise ValueError("Feature names must be set during fit.")
        return list(self.feature_names_) + ["Funding Per Year", "Hardwork Factor", "Non-Financial Score (N)"]

# Plotting Functions (replaced with data generation)
def generate_bar_chart_data(z_diff, feature_display_names):
    z_diff_sorted = z_diff.sort_values()
    data = [
        {
            "feature": feature_display_names.get(feat, feat),
            "z_score": float(z_diff_sorted[feat]) if pd.notna(z_diff_sorted[feat]) else 0,
            "fill": "green" if z_diff_sorted[feat] > 0 else "red"
        }
        for feat in z_diff_sorted.index
    ]
    return data

def generate_radar_chart_data(startup_features, industry_avg, feature_display_names):
    data = [
        {
            "feature": feature_display_names.get(feat, feat),
            "startup_z_score": float(startup_features[feat] - industry_avg[feat]) if pd.notna(startup_features[feat]) and pd.notna(industry_avg[feat]) else 0,
            "industry_avg": 0
        }
        for feat in startup_features.index
    ]
    return data

# Pipeline Creation (unchanged)
def create_preprocessing_pipeline():
    numerical_features = [
        "Number of Founders", "Number of Funding Rounds", "Monthly visit",
        "Visit Duration Growth", "Patents Granted", "Visit Duration"
    ]
    custom_numerical_features = [
        "Estimated Revenue", "Number of Employees", "Total Funding Amount", "Founded Date"
    ]
    categorical_features = [
        "Investment Stage", "Funding Status", "Growth Category", "Industry Groups", "Founders"
    ]
    frequency_encoded_features = ["Headquarters Location"]
    industries_feature = ["Industries"]
    growth_confidence_feature = ["Growth Confidence"]
    numerical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    revenue_transformer = Pipeline(steps=[
        ("mapper", RevenueMapper()),
        ("imputer", SimpleImputer(strategy="constant", fill_value=0)),
        ("scaler", StandardScaler())
    ])
    employees_transformer = Pipeline(steps=[
        ("converter", EmployeeRangeConverter()),
        ("imputer", SimpleImputer(strategy="constant", fill_value=0)),
        ("scaler", StandardScaler())
    ])
    funding_transformer = Pipeline(steps=[
        ("converter", FundingConverter()),
        ("imputer", SimpleImputer(strategy="mean")),
        ("scaler", StandardScaler())
    ])
    years_transformer = Pipeline(steps=[
        ("calculator", YearsActiveCalculator()),
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="constant", fill_value="Unknown")),
        ("encoder", OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1))
    ])
    frequency_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="constant", fill_value="Unknown")),
        ("freq_encoder", FrequencyEncoder())
    ])
    industries_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="constant", fill_value="Unknown")),
        ("encoder", IndustriesEncoder())
    ])
    growth_confidence_transformer = Pipeline(steps=[
        ("converter", GrowthConfidenceConverter()),
        ("imputer", SimpleImputer(strategy="constant", fill_value=0.5)),
        ("scaler", StandardScaler())
    ])
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_transformer, numerical_features),
            ("revenue", revenue_transformer, ["Estimated Revenue"]),
            ("employees", employees_transformer, ["Number of Employees"]),
            ("funding", funding_transformer, ["Total Funding Amount"]),
            ("years", years_transformer, ["Founded Date"]),
            ("cat", categorical_transformer, categorical_features),
            ("freq", frequency_transformer, frequency_encoded_features),
            ("industries", industries_transformer, industries_feature),
            ("growth_confidence", growth_confidence_transformer, growth_confidence_feature)
        ],
        verbose_feature_names_out=False
    )
    return preprocessor

def create_full_pipeline():
    preprocessor = create_preprocessing_pipeline()
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("derived", DerivedFeatures()),
        ("classifier", RandomForestClassifier(random_state=13))
    ])
    return pipeline

# Training and Prediction Functions (unchanged)
def train_pipeline(data_path, save_path="startup_pipeline.pkl"):
    df = pd.read_csv(data_path)
    print(f"X_train shape (initial): {df.shape}")
    print(f"Columns in dataset: {df.columns.tolist()}")
    numeric_cols = ["Founded Date", "Number of Founders", "Number of Funding Rounds", "Monthly visit",
                    "Visit Duration Growth", "Patents Granted", "Visit Duration"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
            df[col] = pd.to_numeric(df[col], errors='coerce')
    for col in ["Estimated Revenue", "Total Funding Amount", "Growth Confidence"]:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
    if "Industries" in df.columns:
        df["Industries"] = df["Industries"].astype(str).replace(r'—|–|-|N/A|unknown|nan', "Unknown", regex=True).str.strip()
    if "Number of Employees" in df.columns:
        df["Number of Employees"] = df["Number of Employees"].apply(
            lambda x: str(x).strip() if pd.notna(x) else np.nan
        )
    feature_columns = [
        "Industries", "Headquarters Location", "Estimated Revenue", "Founded Date",
        "Investment Stage", "Industry Groups", "Number of Founders", "Founders",
        "Number of Employees", "Number of Funding Rounds", "Funding Status",
        "Total Funding Amount", "Growth Category", "Growth Confidence",
        "Monthly visit", "Visit Duration Growth", "Patents Granted", "Visit Duration"
    ]
    feature_columns = [col for col in feature_columns if col in df.columns]
    if "Operating Status" not in df.columns:
        raise ValueError("Target column 'Operating Status' not found in dataset")
    X = df[feature_columns]
    y = df["Operating Status"]
    le = LabelEncoder()
    y = le.fit_transform(y)
    joblib.dump(le, "target_encoder.pkl")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=13
    )
    print(f"X_train shape: {X_train.shape}")
    print(f"Features used: {X_train.columns.tolist()}")
    preprocessor = create_preprocessing_pipeline()
    derived = DerivedFeatures()
    classifier = RandomForestClassifier(random_state=13)
    X_train_preprocessed = preprocessor.fit_transform(X_train)
    feature_names = preprocessor.get_feature_names_out()
    X_train_derived = derived.fit_transform(X_train_preprocessed, y_train, feature_names=feature_names)
    classifier.fit(X_train_derived, y_train)
    print("Components fitted successfully")
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("derived", derived),
        ("classifier", classifier)
    ])
    joblib.dump(pipeline, save_path)
    print(f"Pipeline saved to {save_path}")
    return pipeline

def predict_startup(startup_data, pipeline_path="startup_pipeline.pkl", target_encoder_path="target_encoder.pkl"):
    pipeline = joblib.load(pipeline_path)
    le = joblib.load(target_encoder_path)
    if isinstance(startup_data, dict):
        startup_data = pd.DataFrame([startup_data])
    required_columns = [
        "Industries", "Headquarters Location", "Estimated Revenue", "Founded Date",
        "Investment Stage", "Industry Groups", "Number of Founders", "Founders",
        "Number of Employees", "Number of Funding Rounds", "Funding Status",
        "Total Funding Amount", "Growth Category", "Growth Confidence",
        "Monthly visit", "Visit Duration Growth", "Patents Granted", "Visit Duration"
    ]
    for col in required_columns:
        if col not in startup_data.columns:
            startup_data[col] = np.nan
    numeric_cols = ["Founded Date", "Number of Founders", "Number of Funding Rounds", "Monthly visit",
                    "Visit Duration Growth", "Patents Granted", "Visit Duration"]
    for col in numeric_cols:
        if col in startup_data.columns:
            startup_data[col] = startup_data[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
            startup_data[col] = pd.to_numeric(startup_data[col], errors='coerce')
    for col in ["Estimated Revenue", "Total Funding Amount", "Growth Confidence"]:
        if col in startup_data.columns:
            startup_data[col] = startup_data[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
    if "Industries" in startup_data.columns:
        startup_data["Industries"] = startup_data["Industries"].astype(str).replace(r'—|–|-|N/A|unknown|nan', "Unknown", regex=True).str.strip()
    prediction = pipeline.predict(startup_data)
    prediction_label = le.inverse_transform(prediction)[0]
    return {
        "prediction": prediction_label
    }

# Peer Comparison Report
def generate_peer_comparison_report(startup_data, dataset_path, top_n=5):
    df = pd.read_csv(dataset_path)
    numeric_cols = ["Founded Date", "Number of Founders", "Number of Funding Rounds", "Monthly visit",
                    "Visit Duration Growth", "Patents Granted", "Visit Duration"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
            df[col] = pd.to_numeric(df[col], errors='coerce')
    for col in ["Estimated Revenue", "Total Funding Amount", "Growth Confidence"]:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
    if "Industries" in df.columns:
        df["Industries"] = df["Industries"].astype(str).replace(r'—|–|-|N/A|unknown|nan', "Unknown", regex=True).str.strip()
    if "Number of Employees" in df.columns:
        df["Number of Employees"] = df["Number of Employees"].apply(
            lambda x: str(x).strip() if pd.notna(x) else np.nan
        )
    if isinstance(startup_data, dict):
        startup_name = startup_data.get("Organization_Name", "Unnamed Startup")
        startup_data = pd.DataFrame([startup_data])
    else:
        startup_name = startup_data.get("Organization_Name", ["Unnamed Startup"])[0]
    startup_data["Organization Name"] = startup_name
    df = pd.concat([df, startup_data], ignore_index=True)
    startup_index = len(df) - 1
    pipeline = joblib.load("startup_pipeline.pkl")
    transformed_df = pipeline.named_steps['preprocessor'].transform(df)
    feature_names = pipeline.named_steps['preprocessor'].get_feature_names_out()
    derived_df = pipeline.named_steps['derived'].fit_transform(
        transformed_df,
        feature_names=feature_names
    )
    feature_names = pipeline.named_steps['derived'].get_feature_names_out(feature_names)
    df_transformed = pd.DataFrame(derived_df, columns=feature_names)
    feature_name_mapping = {
        'revenue_mapped': 'Estimated Revenue',
        'num__Number of Founders': 'Number of Founders',
        'employees_converted': 'Number of Employees',
        'num__Number of Funding Rounds': 'Number of Funding Rounds',
        'funding_amount_converted': 'Total Funding Amount',
        'growth_confidence_converted': 'Growth Confidence',
        'num__Monthly visit': 'Monthly Visit',
        'num__Visit Duration Growth': 'Visit Duration Growth',
        'num__Patents Granted': 'Patents Granted',
        'num__Visit Duration': 'Visit Duration',
        'years_active': 'Years Active',
        'cat__Investment Stage': 'Investment Stage',
        'cat__Funding Status': 'Funding Status',
        'cat__Growth Category': 'Growth Category',
        'cat__Industry Groups': 'Industry Groups',
        'cat__Founders': 'Founders',
        'freq__Headquarters Location': 'Headquarters Location',
        'Funding Per Year': 'Funding Per Year',
        'Hardwork Factor': 'Hardwork Factor',
        'Non-Financial Score (N)': 'Non-Financial Score (N)'
    }
    # Select features corresponding to user-entered fields
    input_features = [
        "revenue_mapped", "num__Number of Founders", "employees_converted",
        "num__Number of Funding Rounds", "funding_amount_converted", "growth_confidence_converted",
        "num__Monthly visit", "num__Visit Duration Growth", "num__Patents Granted", "num__Visit Duration",
        "years_active", "cat__Investment Stage", "cat__Funding Status", "cat__Growth Category",
        "cat__Industry Groups", "cat__Founders", "freq__Headquarters Location",
        "Funding Per Year", "Hardwork Factor", "Non-Financial Score (N)"
    ]
    selected_features = [f for f in input_features if f in df_transformed.columns]
    original_values = df_transformed[selected_features].copy()
    df_transformed[selected_features] = df_transformed[selected_features].apply(zscore, nan_policy='omit')
    le = LabelEncoder()
    if "Investment Stage" in df.columns:
        df["Investment Stage"] = df["Investment Stage"].astype(str)
        df_transformed["Investment Stage Encoded"] = le.fit_transform(df["Investment Stage"])
    else:
        df_transformed["Investment Stage Encoded"] = 0
    vectorizer = TfidfVectorizer(stop_words="english")
    if "Industries" in df.columns:
        df["Industries"] = df["Industries"].apply(
            lambda x: " ".join([i.strip() for i in str(x).split(",")]) if isinstance(x, str) else "Unknown"
        )
        industry_matrix = vectorizer.fit_transform(df["Industries"])
    else:
        industry_matrix = np.zeros((len(df), 1))
    funding_stage_column = df_transformed["Investment Stage Encoded"].values.reshape(-1, 1)
    combined_matrix = hstack([industry_matrix, funding_stage_column])
    industry_funding_similarity = cosine_similarity(combined_matrix)
    similarities = industry_funding_similarity[startup_index]
    similar_indices = np.argsort(-similarities)[1:top_n+1]
    similar_startups = df.iloc[similar_indices]
    industry_avg = df_transformed.iloc[similar_indices][selected_features].mean()
    startup_features = df_transformed.loc[startup_index, selected_features]
    z_diff = startup_features - industry_avg
    pros = z_diff[z_diff > 0].index.tolist()
    cons = z_diff[z_diff <= 0].index.tolist()
    pros_descriptive = [feature_name_mapping.get(feature, feature) for feature in pros]
    cons_descriptive = [feature_name_mapping.get(feature, feature) for feature in cons]
    if not pros_descriptive:
        pros_descriptive = ["No strengths identified compared to peers."]
    if not cons_descriptive:
        cons_descriptive = ["No weaknesses identified compared to peers."]
    raw_comparison = []
    for feature in selected_features:
        readable_name = feature_name_mapping.get(feature, feature)
        startup_val = original_values.loc[startup_index, feature]
        industry_val = original_values.iloc[similar_indices][feature].mean()
        raw_comparison.append({
            "Feature": readable_name,
            "Startup_Value": float(startup_val) if pd.notna(startup_val) else None,
            "Industry_Avg": float(industry_val) if pd.notna(industry_val) else None
        })
    # Generate chart data
    bar_chart_data = generate_bar_chart_data(z_diff, feature_name_mapping)
    radar_chart_data = generate_radar_chart_data(startup_features, industry_avg, feature_name_mapping)
    # Collect peer data
    peer_data = []
    for idx in similar_indices:
        startup = df.iloc[idx]
        peer_metrics = {}
        for feature in selected_features:
            readable_name = feature_name_mapping.get(feature, feature)
            value = original_values.loc[idx, feature]
            peer_metrics[readable_name] = float(value) if pd.notna(value) else None
        peer_data.append({
            "name": startup["Organization Name"] if pd.notna(startup["Organization Name"]) else "Unknown",
            "metrics": peer_metrics
        })
    # Add startup's own data
    startup_metrics = {}
    for feature in selected_features:
        readable_name = feature_name_mapping.get(feature, feature)
        value = original_values.loc[startup_index, feature]
        startup_metrics[readable_name] = float(value) if pd.notna(value) else None
    peer_data.append({
        "name": startup_name,
        "metrics": startup_metrics
    })
    report = {
        "Startup_Name": startup_name,
        "Similar_Startups": similar_startups["Organization Name"].tolist() if "Organization Name" in similar_startups.columns else [],
        "Pros": pros_descriptive,
        "Cons": cons_descriptive,
        "Raw_Comparison": raw_comparison,
        "bar_chart_data": bar_chart_data,
        "radar_chart_data": radar_chart_data,
        "peer_data": peer_data
    }
    return report

# Direct Comparison (unchanged)
def compare_to_selected_startup(startup_data, selected_startup_name, dataset_path):
    df = pd.read_csv(dataset_path)
    numeric_cols = ["Founded Date", "Number of Founders", "Number of Funding Rounds", "Monthly visit",
                    "Visit Duration Growth", "Patents Granted", "Visit Duration"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
            df[col] = pd.to_numeric(df[col], errors='coerce')
    for col in ["Estimated Revenue", "Total Funding Amount", "Growth Confidence"]:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
    if "Industries" in df.columns:
        df["Industries"] = df["Industries"].astype(str).replace(r'—|–|-|N/A|unknown|nan', "Unknown", regex=True).str.strip()
    if "Number of Employees" in df.columns:
        df["Number of Employees"] = df["Number of Employees"].apply(
            lambda x: str(x).strip() if pd.notna(x) else np.nan
        )
    if isinstance(startup_data, dict):
        startup_name = startup_data.get("Organization_Name", "Unnamed Startup")
        startup_data = pd.DataFrame([startup_data])
    else:
        startup_name = startup_data.get("Organization_Name", ["Unnamed Startup"])[0]
    startup_data["Organization Name"] = startup_name
    df = pd.concat([df, startup_data], ignore_index=True)
    startup_index = len(df) - 1
    selected_index = df[df["Organization Name"] == selected_startup_name].index
    if len(selected_index) == 0:
        raise ValueError(f"Selected startup '{selected_startup_name}' not found in dataset")
    selected_index = selected_index[0]
    pipeline = joblib.load("startup_pipeline.pkl")
    transformed_df = pipeline.named_steps['preprocessor'].transform(df)
    feature_names = pipeline.named_steps['preprocessor'].get_feature_names_out()
    derived_df = pipeline.named_steps['derived'].fit_transform(
        transformed_df,
        feature_names=feature_names
    )
    feature_names = pipeline.named_steps['derived'].get_feature_names_out(feature_names)
    df_transformed = pd.DataFrame(derived_df, columns=feature_names)
    feature_name_mapping = {
        'revenue_mapped': 'Estimated Revenue',
        'num__Number of Founders': 'Number of Founders',
        'employees_converted': 'Number of Employees',
        'num__Number of Funding Rounds': 'Number of Funding Rounds',
        'funding_amount_converted': 'Total Funding Amount',
        'growth_confidence_converted': 'Growth Confidence',
        'num__Monthly visit': 'Monthly Visit',
        'num__Visit Duration Growth': 'Visit Duration Growth',
        'num__Patents Granted': 'Patents Granted',
        'num__Visit Duration': 'Visit Duration',
        'years_active': 'Years Active',
        'cat__Investment Stage': 'Investment Stage',
        'cat__Funding Status': 'Funding Status',
        'cat__Growth Category': 'Growth Category',
        'cat__Industry Groups': 'Industry Groups',
        'cat__Founders': 'Founders',
        'freq__Headquarters Location': 'Headquarters Location',
        'Funding Per Year': 'Funding Per Year',
        'Hardwork Factor': 'Hardwork Factor',
        'Non-Financial Score (N)': 'Non-Financial Score (N)'
    }
    input_features = [
        "revenue_mapped", "num__Number of Founders", "employees_converted",
        "num__Number of Funding Rounds", "funding_amount_converted", "growth_confidence_converted",
        "num__Monthly visit", "num__Visit Duration Growth", "num__Patents Granted", "num__Visit Duration",
        "years_active", "cat__Investment Stage", "cat__Funding Status", "cat__Growth Category",
        "cat__Industry Groups", "cat__Founders", "freq__Headquarters Location",
        "Funding Per Year", "Hardwork Factor", "Non-Financial Score (N)"
    ]
    selected_features = [f for f in input_features if f in df_transformed.columns]
    original_values = df_transformed[selected_features].copy()
    pair_df = df_transformed.loc[[startup_index, selected_index], selected_features]
    z_scores = pair_df.apply(zscore, nan_policy='omit')
    z_diff = z_scores.loc[startup_index] - z_scores.loc[selected_index]
    pros = z_diff[z_diff > 0].index.tolist()
    cons = z_diff[z_diff <= 0].index.tolist()
    pros_descriptive = [feature_name_mapping.get(feature, feature) for feature in pros]
    cons_descriptive = [feature_name_mapping.get(feature, feature) for feature in cons]
    if not pros_descriptive:
        pros_descriptive = ["No strengths identified compared to selected startup."]
    if not cons_descriptive:
        cons_descriptive = ["No weaknesses identified compared to selected startup."]
    report = {
        "Startup_Name": startup_name,
        "Selected_Startup": selected_startup_name,
        "Pros": pros_descriptive,
        "Cons": cons_descriptive
    }
    return report

# Main Execution
if __name__ == "__main__":
    pipeline = train_pipeline("startups.csv")
    sample_input = {
        "Organization_Name": "StartupX",
        "Industries": "Tech, AI",
        "Headquarters_Location": "Mumbai, Maharashtra, India",
        "Estimated_Revenue": "$1B to $10B",
        "Founded_Date": 2020,
        "Investment_Stage": "Seed",
        "Industry_Groups": "Technology",
        "Number_of_Founders": 2,
        "Founders": "John Doe, Jane Smith",
        "Number_of_Employees": "10-50",
        "Number_of_Funding_Rounds": 2,
        "Funding_Status": "Early Stage Venture",
        "Total_Funding_Amount": "$1M to $5M",
        "Growth_Category": "High Growth",
        "Growth_Confidence": "High",
        "Monthly_visit": 10000,
        "Visit_Duration_Growth": 0.1,
        "Patents_Granted": 2,
        "Visit_Duration": 300
    }
    prediction = predict_startup(sample_input)
    print("Prediction:", prediction)
    report = generate_peer_comparison_report(sample_input, "startups.csv")
    print("\nPeer Comparison Report:")
    print(f"Startup: {report['Startup_Name']}")
    print(f"Similar_Startups: {', '.join(report['Similar_Startups'])}")
    print("Pros:", report["Pros"])
    print("Cons:", report["Cons"])
    if report["Similar_Startups"]:
        comp_report = compare_to_selected_startup(sample_input, report["Similar_Startups"][0], "startups.csv")
        print("\nComparison to Selected Startup:")
        print(f"Startup: {comp_report['Startup_Name']}")
        print(f"Selected Startup: {comp_report['Selected_Startup']}")
        print("Pros:", comp_report["Pros"])
        print("Cons:", comp_report["Cons"])