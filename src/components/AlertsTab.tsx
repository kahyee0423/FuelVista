"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import axios from "axios";

interface Alert {
  fuel: string;
  condition: "above" | "below";
  threshold: number;
  frequency: "instant" | "daily" | "weekly";
}

export default function AlertsTab({ latestPrices }: { latestPrices: Record<string, number> }) {
  const [telegram, setTelegram] = useState("");
  const [fuel, setFuel] = useState<Alert["fuel"]>("ron95");
  const [threshold, setThreshold] = useState(0);
  const [condition, setCondition] = useState<Alert["condition"]>("below");
  const [frequency, setFrequency] = useState<Alert["frequency"]>("instant");
  const [subscriptions, setSubscriptions] = useState<Alert[]>([]);
  const [alertPreview, setAlertPreview] = useState("");

  const fuelOptions = [
    { value: "ron95", label: "RON95" },
    { value: "ron97", label: "RON97" },
    { value: "diesel", label: "Diesel (Peninsular)" },
    { value: "diesel_eastmsia", label: "Diesel (East Malaysia)" },
  ];

  // Load existing subscriptions for the current Telegram username
  useEffect(() => {
    if (!telegram) return;
    const fetchSubscriptions = async () => {
      try {
        const subRef = doc(db, "subscriptions", telegram);
        const docSnap = await getDoc(subRef);
        if (docSnap.exists()) setSubscriptions(docSnap.data().alerts || []);
        else setSubscriptions([]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubscriptions();
  }, [telegram]);

  useEffect(() => {
    const currentPrice = latestPrices?.[fuel] ?? 0;
    if (!currentPrice) {
      setAlertPreview("No price data available.");
      return;
    }
    const willTrigger = condition === "above" ? currentPrice > threshold : currentPrice < threshold;
    setAlertPreview(
      willTrigger
        ? `Current price RM ${currentPrice.toFixed(2)} will trigger your alert!`
        : `Current price RM ${currentPrice.toFixed(2)} is safe.`
    );
  }, [fuel, threshold, condition, latestPrices]);

  const handleSubscribe = async () => {
  if (!telegram) {
    alert("Please enter your Telegram username.");
    return;
  }

  const newSub: Alert = { fuel, condition, threshold, frequency };

  try {
    const subRef = doc(db, "subscriptions", telegram);
    const docSnap = await getDoc(subRef);

    let existingAlerts: Alert[] = [];
    let chat_id = null;

    if (docSnap.exists()) {
      existingAlerts = docSnap.data().alerts || [];
      chat_id = docSnap.data().chat_id || null;
    }

    const updatedAlerts = [...existingAlerts, newSub];
    await setDoc(subRef, { telegram, alerts: updatedAlerts, chat_id }, { merge: true });
    setSubscriptions(updatedAlerts);
    window.open("https://t.me/FuelVistaBot", "_blank");
    alert("Telegram opened. Please press /start in the bot to activate alerts.");

    const currentPrice = latestPrices[fuel];
    const trigger = condition === "above" ? currentPrice > threshold : currentPrice < threshold;
    setAlertPreview(
      trigger
        ? `Current price RM ${currentPrice.toFixed(2)} will trigger your alert!`
        : `Current price RM ${currentPrice.toFixed(2)} is safe.`
    );

  } catch (err) {
    console.error(err);
    alert("Failed to save subscription.");
  }
};

  const removeSubscription = async (index: number) => {
    if (!telegram) return;
    const newSubs = [...subscriptions];
    newSubs.splice(index, 1);
    setSubscriptions(newSubs);

    try {
      const subRef = doc(db, "subscriptions", telegram);
      await setDoc(subRef, { telegram, alerts: newSubs }, { merge: true });
    } catch (err) {
      console.error(err);
      alert("Failed to update Firebase.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h2 className="text-2xl font-bold">Fuel Price Alerts</h2>
              <p className="text-blue-100 mt-1">Get notified when fuel prices change</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Alert Settings
                </h3>
              </div>
              
              <div className="space-y-2 text-xs">
                <label className="block text-xs font-medium text-gray-700">Fuel Type</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={fuel} 
                  onChange={e => setFuel(e.target.value as Alert["fuel"])}
                >
                  {fuelOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              
              <div className="space-y-2 text-xs">
                <label className="block font-medium text-gray-700">Condition</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={condition} 
                  onChange={e => setCondition(e.target.value as Alert["condition"])}
                >
                  <option value="above">Notify when above threshold</option>
                  <option value="below">Notify when below threshold</option>
                </select>
              </div>
              
              <div className="space-y-2 text-xs">
                <label className="block font-medium text-gray-700">Threshold (RM)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={threshold} 
                  onChange={e => setThreshold(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2 text-xs">
                <label className="block font-medium text-gray-700">Frequency</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={frequency} 
                  onChange={e => setFrequency(e.target.value as Alert["frequency"])}
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Telegram Configuration
                </h3>
              </div>
              
              <div className="space-y-2 text-xs">
                <label className="block font-medium text-gray-700">Telegram Username</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    @
                  </span>
                  <input 
                    type="text" 
                    placeholder="username" 
                    className="flex-1 block w-full rounded-none rounded-r-md p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    value={telegram} 
                    onChange={e => setTelegram(e.target.value)} 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Make sure you've started the bot on Telegram before subscribing
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Alert Preview
                </h4>
                <div className={`p-3 rounded-md ${alertPreview.includes("will trigger") ? "bg-yellow-100 text-yellow-800 border border-yellow-200" : "bg-green-100 text-green-800 border border-green-200"}`}>
                  {alertPreview}
                </div>
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                onClick={handleSubscribe}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Subscribe to Alert
              </button>
            </div>
          </div>

          {subscriptions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your Active Subscriptions
              </h3>
              <div className="grid gap-3">
                {subscriptions.map((sub, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{sub.fuel.toUpperCase()}</span>
                      <span className="text-gray-700">{sub.condition} RM {sub.threshold.toFixed(2)}</span>
                      <span className="text-xs text-gray-500 ml-2">({sub.frequency})</span>
                    </div>
                    <button 
                      onClick={() => removeSubscription(i)}
                      className="text-red-500 hover:text-red-700 transition flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}