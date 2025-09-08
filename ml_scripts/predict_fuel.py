import pandas as pd
import json
from datetime import timedelta
from sklearn.linear_model import LinearRegression
import numpy as np

URL_DATA = "https://storage.data.gov.my/commodities/fuelprice.parquet"

def fetch_data():
    df = pd.read_parquet(URL_DATA)
    df = df[df["series_type"] == "level"]
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    return df

def train_and_predict(df, fuel, weeks_ahead=1):
    df = df.dropna(subset=[fuel])
    X = np.arange(len(df)).reshape(-1, 1)
    y = df[fuel].values
    model = LinearRegression()
    model.fit(X, y)
    future_index = np.array([[len(df) + i] for i in range(weeks_ahead)])
    preds = model.predict(future_index)
    return preds.tolist()

def predict_next_weeks(df, weeks=4):
    fuels = ["ron95", "ron97", "diesel", "diesel_eastmsia"]
    last_date = df["date"].max()
    forecast = []
    for i in range(1, weeks + 1):
        next_date = last_date + timedelta(weeks=i)
        pred = {fuel: train_and_predict(df, fuel, weeks_ahead=i)[-1] for fuel in fuels}
        forecast.append({"date": next_date.strftime("%Y-%m-%d"), **pred})
    return forecast

if __name__ == "__main__":
    df = fetch_data()
    forecast = predict_next_weeks(df, weeks=4)
    print(json.dumps(forecast))  