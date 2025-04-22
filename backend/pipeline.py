import pandas as pd
import numpy as np
import re
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, OrdinalEncoder, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import zscore
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import joblib
from datetime import datetime
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import os
import warnings
warnings.filterwarnings('ignore')

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

# Plotting Functions (unchanged)
def generate_bar_chart_data(z_diff, feature_display_names):
    significant_diff = z_diff[abs(z_diff) > 0.25]
    z_diff_sorted = significant_diff.sort_values()
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
        ("classifier", xgb.XGBClassifier(random_state=13, use_label_encoder=False, eval_metric='logloss'))
    ])
    return pipeline

# Training and Prediction Functions (unchanged except for predict_startup)
def train_pipeline(data_path, save_path="startup_pipeline.pkl"):
    df = pd.read_csv(data_path)
    print(f"X_train shape (initial): {df.shape}")
    print(f"Columns in dataset: {df.columns.tolist()}")
    
    missing_counts = df.isna().sum()
    print("\nMissing values in each column:")
    for col, count in missing_counts.items():
        if count > 0:
            print(f"{col}: {count} missing values")
    
    numeric_cols = ["Founded Date", "Number of Founders", "Number of Funding Rounds", "Monthly visit",
                    "Visit Duration Growth", "Patents Granted", "Visit Duration"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            missing_after = df[col].isna().sum()
            print(f"Missing values in {col} after conversion: {missing_after}")
    
    for col in ["Estimated Revenue", "Total Funding Amount", "Growth Confidence"]:
        if col in df.columns:
            df[col] = df[col].astype(str).replace(r'—|–|-|N/A|unknown|nan', np.nan, regex=True)
            missing_after = df[col].isna().sum()
            print(f"Missing values in {col} after conversion: {missing_after}")
    
    if "Industries" in df.columns:
        df["Industries"] = df["Industries"].astype(str).replace(r'—|–|-|N/A|unknown|nan', "Unknown", regex=True).str.strip()
    
    if "Number of Employees" in df.columns:
        df["Number of Employees"] = df["Number of Employees"].apply(
            lambda x: str(x).strip() if pd.notna(x) else np.nan
        )
        missing_after = df["Number of Employees"].isna().sum()
        print(f"Missing values in Number of Employees after conversion: {missing_after}")
    
    feature_columns = [
        "Industries", "Headquarters Location", "Estimated Revenue", "Founded Date",
        "Investment Stage", "Industry Groups", "Number of Founders", "Founders",
        "Number of Employees", "Number of Funding Rounds", "Funding Status",
        "Total Funding Amount", "Growth Category", "Growth Confidence",
        "Monthly visit", "Visit Duration Growth", "Patents Granted", "Visit Duration"
    ]
    feature_columns = [col for col in feature_columns if col in df.columns]
    
    missing_in_features = df[feature_columns].isna().sum()
    print("\nMissing values in feature columns:")
    for col, count in missing_in_features.items():
        if count > 0:
            print(f"{col}: {count} missing values")
    
    rows_with_missing = df[feature_columns].isna().any(axis=1).sum()
    print(f"\nRows with any missing values in feature columns: {rows_with_missing}")
    
    if "Operating Status" not in df.columns:
        raise ValueError("Target column 'Operating Status' not found in dataset")
    
    missing_in_target = df["Operating Status"].isna().sum()
    print(f"Missing values in Operating Status: {missing_in_target}")
    
    # Instead of dropping rows, fill missing values
    df_clean = df.copy()
    
    # Fill missing values in feature columns
    for col in feature_columns:
        if df_clean[col].dtype in ['int64', 'float64']:
            # For numeric columns, use median
            df_clean[col] = df_clean[col].fillna(df_clean[col].median())
        else:
            # For categorical columns, use mode
            df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0])
    
    # Fill missing values in target column
    df_clean["Operating Status"] = df_clean["Operating Status"].fillna(df_clean["Operating Status"].mode()[0])
    
    print(f"Rows after filling missing values: {len(df_clean)}")
    
    X = df_clean[feature_columns]
    y = df_clean["Operating Status"]
    
    class_counts = y.value_counts()
    print("\nClass distribution:")
    for cls, count in class_counts.items():
        print(f"Class {cls}: {count} samples ({count/len(y)*100:.2f}%)")
    
    le = LabelEncoder()
    y = le.fit_transform(y)
    joblib.dump(le, "target_encoder.pkl")
    
    class_counts = np.bincount(y)
    print("\nClass distribution after encoding:")
    for i, count in enumerate(class_counts):
        print(f"Class {le.inverse_transform([i])[0]}: {count} samples ({count/len(y)*100:.2f}%)")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=13
    )
    print(f"X_train shape: {X_train.shape}")
    print(f"X_test shape: {X_test.shape}")
    print(f"Features used: {X_train.columns.tolist()}")
    
    preprocessor = create_preprocessing_pipeline()
    derived = DerivedFeatures()
    
    X_train_preprocessed = preprocessor.fit_transform(X_train)
    feature_names = preprocessor.get_feature_names_out()
    X_train_derived = derived.fit_transform(X_train_preprocessed, y_train, feature_names=feature_names)
    
    classifier = xgb.XGBClassifier(random_state=13, use_label_encoder=False, eval_metric='logloss')
    classifier.fit(X_train_derived, y_train)
    print("Components fitted successfully")
    
    X_test_preprocessed = preprocessor.transform(X_test)
    X_test_derived = derived.transform(X_test_preprocessed)
    y_pred = classifier.predict(X_test_derived)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    conf_matrix = confusion_matrix(y_test, y_pred)
    class_report = classification_report(y_test, y_pred, target_names=le.classes_)
    
    print("\nModel Performance:")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print("\nConfusion Matrix:")
    print(conf_matrix)
    print("\nClassification Report:")
    print(class_report)
    
    # Create ROC curve
    y_pred_proba = classifier.predict_proba(X_test_derived)
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba[:, 1])
    roc_auc = roc_auc_score(y_test, y_pred_proba[:, 1])
    
    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend(loc="lower right")
    
    # Create plots directory if it doesn't exist
    os.makedirs('plots', exist_ok=True)
    plt.savefig('plots/roc_curve.png')
    plt.close()
    
    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=13)
    cv_scores = cross_val_score(classifier, X_train_derived, y_train, cv=cv)
    print("\nCross-validation scores:", cv_scores)
    print(f"Mean CV score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('derived', derived),
        ('classifier', classifier)
    ])
    
    joblib.dump(pipeline, save_path)
    print(f"\nPipeline saved to {save_path}")
    
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
    
    # Get prediction with Hardwork Factor as a feature
    prediction = pipeline.predict(startup_data)
    
    # Handle unseen labels gracefully
    try:
        prediction_label = le.inverse_transform(prediction)[0]
    except ValueError as e:
        print(f"Warning: {str(e)}")
        # Get available classes from the LabelEncoder
        available_classes = le.classes_
        if len(available_classes) == 0:
            # If no classes are available, use a default mapping
            prediction_label = "Active" if prediction[0] == 1 else "Closed"
        elif len(available_classes) == 2:  # Binary classification
            prediction_label = "Active" if prediction[0] == 1 else "Closed"
        else:
            # For multi-class, use the most common class
            prediction_label = available_classes[0]
    
    # Get preprocessed data
    preprocessor = pipeline.named_steps['preprocessor']
    derived = pipeline.named_steps['derived']
    classifier = pipeline.named_steps['classifier']
    
    startup_data_preprocessed = preprocessor.transform(startup_data)
    feature_names = preprocessor.get_feature_names_out()
    startup_data_derived = derived.transform(startup_data_preprocessed)
    
    if isinstance(startup_data_derived, np.ndarray):
        startup_data_derived_df = pd.DataFrame(startup_data_derived, columns=derived.get_feature_names_out(feature_names))
    else:
        startup_data_derived_df = startup_data_derived
    
    # Get Hardwork Factor
    if "Hardwork Factor" in startup_data_derived_df.columns:
        hardwork_factor = startup_data_derived_df["Hardwork Factor"].values[0]
    else:
        revenue_col = None
        employees_col = None
        for col in startup_data_derived_df.columns:
            if "revenue_mapped" in col.lower():
                revenue_col = col
            elif "employees_converted" in col.lower():
                employees_col = col
        
        if revenue_col and employees_col:
            hardwork_factor = startup_data_derived_df[revenue_col].values[0] / startup_data_derived_df[employees_col].replace(0, 1).values[0]
        else:
            hardwork_factor = 0
    
    # Get prediction probabilities without Hardwork Factor adjustment
    prediction_probs = classifier.predict_proba(startup_data_derived)
    prediction_no_adjustment = np.argmax(prediction_probs, axis=1)
    
    try:
        prediction_no_adjustment_label = le.inverse_transform(prediction_no_adjustment)[0]
    except ValueError:
        prediction_no_adjustment_label = prediction_label
    
    # Adjust probabilities based on Hardwork Factor
    adjusted_probs = prediction_probs.copy()
    active_class_idx = np.where(le.classes_ == "Active")[0][0] if "Active" in le.classes_ else 0
    normalized_hardwork = (hardwork_factor - np.mean(hardwork_factor)) / (np.std(hardwork_factor) + 1e-10)
    adjustment = np.clip(normalized_hardwork * 0.2, -0.2, 0.2)
    adjusted_probs[0, active_class_idx] = np.clip(adjusted_probs[0, active_class_idx] + adjustment, 0, 1)
    adjusted_probs = adjusted_probs / adjusted_probs.sum(axis=1, keepdims=True)
    
    # Apply randomness for practical prediction
    np.random.seed(int(hardwork_factor * 1000) % 10000)
    random_factor = np.random.normal(0, 0.15)
    practical_probs = adjusted_probs.copy()
    practical_probs[0, active_class_idx] = np.clip(practical_probs[0, active_class_idx] + random_factor, 0, 1)
    practical_probs = practical_probs / practical_probs.sum(axis=1, keepdims=True)
    
    practical_prediction = np.argmax(practical_probs, axis=1)
    try:
        practical_prediction_label = le.inverse_transform(practical_prediction)[0]
    except ValueError:
        practical_prediction_label = prediction_label
    
    # Compare predictions
    prediction_changed_no_adjustment = prediction_label != prediction_no_adjustment_label
    prediction_changed_practical = prediction_label != practical_prediction_label
    hardwork_impact = "Changed" if prediction_changed_practical else "Unchanged"
    
    # Calculate confidence level
    confidence_level = "High"
    prob_diff = abs(practical_probs[0, active_class_idx] - 0.5)
    if prob_diff < 0.1:
        confidence_level = "Low"
    elif prob_diff < 0.2:
        confidence_level = "Medium"
    
    # Calculate evaluation metrics for both predictions
    metrics = {
        "original_prediction": {
            "label": prediction_label,
            "display_label": "Successful" if prediction_label == "Active" else "Struggling",
            "probability": float(prediction_probs[0, prediction[0]]),
            "confidence": confidence_level
        },
        "no_hardwork_adjustment": {
            "label": prediction_no_adjustment_label,
            "display_label": "Successful" if prediction_no_adjustment_label == "Active" else "Struggling",
            "probability": float(prediction_probs[0, prediction_no_adjustment[0]]),
            "confidence": "High" if abs(prediction_probs[0, prediction_no_adjustment[0]] - 0.5) > 0.2 else "Medium" if abs(prediction_probs[0, prediction_no_adjustment[0]] - 0.5) > 0.1 else "Low"
        },
        "practical_prediction": {
            "label": practical_prediction_label,
            "display_label": "Successful" if practical_prediction_label == "Active" else "Struggling",
            "probability": float(practical_probs[0, practical_prediction[0]]),
            "confidence": confidence_level
        },
        "comparison": {
            "prediction_changed_no_adjustment": prediction_changed_no_adjustment,
            "prediction_changed_practical": prediction_changed_practical,
            "hardwork_impact": hardwork_impact,
            "hardwork_factor": float(hardwork_factor),
            "hardwork_adjustment": float(adjustment),
            "random_factor": float(random_factor)
        },
        "probabilities": {
            "original": prediction_probs.tolist(),
            "no_adjustment": prediction_probs.tolist(),
            "practical": practical_probs.tolist()
        }
    }
    
    return metrics

# Peer Comparison Report (unchanged)
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
        startup_name = startup_data.get("Organization_Name") or startup_data.get("Organization Name") or "Unnamed Startup"
        startup_data = pd.DataFrame([startup_data])
    else:
        startup_name = (
            startup_data.get("Organization_Name", [None])[0] or 
            startup_data.get("Organization Name", [None])[0] or 
            "Unnamed Startup"
        )
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
    bar_chart_data = generate_bar_chart_data(z_diff, feature_name_mapping)
    radar_chart_data = generate_radar_chart_data(startup_features, industry_avg, feature_name_mapping)
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
        startup_name = startup_data.get("Organization_Name") or startup_data.get("Organization Name") or "Unnamed Startup"
        startup_data = pd.DataFrame([startup_data])
    else:
        startup_name = (
            startup_data.get("Organization_Name", [None])[0] or 
            startup_data.get("Organization Name", [None])[0] or 
            "Unnamed Startup"
        )
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
    # Test prediction with sample data
    sample_input = {
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

    prediction = predict_startup(sample_input)
    print("\nPrediction Results:")
    print(f"Original Prediction (with Hardwork Factor as feature): {prediction['original_prediction']['label']} (Probability: {prediction['original_prediction']['probability']:.4f})")
    print(f"Prediction without Hardwork Adjustment: {prediction['no_hardwork_adjustment']['label']} (Probability: {prediction['no_hardwork_adjustment']['probability']:.4f})")
    print(f"Practical Prediction (with Hardwork Adjustment): {prediction['practical_prediction']['label']} (Probability: {prediction['practical_prediction']['probability']:.4f})")
    print(f"Changed without Adjustment: {prediction['comparison']['prediction_changed_no_adjustment']}")
    print(f"Changed with Practical Adjustment: {prediction['comparison']['prediction_changed_practical']}")
    print(f"Hardwork Factor Impact: {prediction['comparison']['hardwork_impact']}")
    print(f"Hardwork Factor: {prediction['comparison']['hardwork_factor']:.4f}")
    print(f"Hardwork Adjustment: {prediction['comparison']['hardwork_adjustment']:.4f}")
    
    # Generate peer comparison report
    report = generate_peer_comparison_report(sample_input, "startup_og.csv")
    print("\nPeer Comparison Report:")
    print(f"Startup: {report['Startup_Name']}")
    print(f"Similar_Startups: {', '.join(report['Similar_Startups'])}")
    print("Pros:", report["Pros"])
    print("Cons:", report["Cons"])
    
    if report["Similar_Startups"]:
        comp_report = compare_to_selected_startup(sample_input, report["Similar_Startups"][0], "startup_og.csv")
        print("\nComparison to Selected Startup:")
        print(f"Startup: {comp_report['Startup_Name']}")
        print(f"Selected Startup: {comp_report['Selected_Startup']}")
        print("Pros:", comp_report["Pros"])
        print("Cons:", comp_report["Cons"])