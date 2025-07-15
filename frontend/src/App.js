import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCheck, FaUserSecret, FaHeart } from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend
} from "recharts";

export default function App() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    country: "",
    avg_order_value: "",
    total_orders: "",
    last_purchase: "",
    preferred_category: "",
    email_open_rate: "",
    loyalty_score: "",
    churn_risk: "",
  });

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleFraud = { age: "45", gender: "Male", country: "Nigeria", avg_order_value: "320", total_orders: "3", last_purchase: "2024-05-01", preferred_category: "Electronics", email_open_rate: "0.1", loyalty_score: "12", churn_risk: "0.8" };
  const sampleLoyal = { age: "34", gender: "Female", country: "USA", avg_order_value: "120", total_orders: "25", last_purchase: "2025-07-01", preferred_category: "Apparel", email_open_rate: "0.95", loyalty_score: "92", churn_risk: "0.02" };
  const sampleNormal = { age: "28", gender: "Other", country: "Canada", avg_order_value: "75", total_orders: "10", last_purchase: "2025-06-10", preferred_category: "Books", email_open_rate: "0.5", loyalty_score: "48", churn_risk: "0.3" };

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preparedData = {
      age: parseInt(formData.age),
      gender: formData.gender,
      country: formData.country,
      avg_order_value: parseFloat(formData.avg_order_value),
      total_orders: parseInt(formData.total_orders),
      last_purchase: formData.last_purchase, // string in yyyy-mm-dd
      preferred_category: formData.preferred_category,
      email_open_rate: parseFloat(formData.email_open_rate),
      loyalty_score: parseInt(formData.loyalty_score),
      churn_risk: parseFloat(formData.churn_risk),
    };

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8004/predict", preparedData);
      setResult(res.data.label);
      setConfidence(res.data.confidence);
      setHistory([...history, res.data]);
    } catch (err) {
      alert("Prediction failed. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ age: "", gender: "", country: "", avg_order_value: "", total_orders: "", last_purchase: "", preferred_category: "", email_open_rate: "", loyalty_score: "", churn_risk: "" });
    setResult(null);
    setConfidence(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("history");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const summaryData = [
    { label: "Normal", count: history.filter(h => h.label === "Normal").length },
    { label: "Loyal", count: history.filter(h => h.label === "Loyal").length },
    { label: "Fraudulent", count: history.filter(h => h.label === "Fraudulent").length },
  ];

  const colors = {
    Normal: "#10B981",
    Loyal: "#3B82F6",
    Fraudulent: "#EF4444",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white px-4 py-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">🛍️ E-Commerce Customer Analyzer</h1>
        <button onClick={toggleTheme} className="px-3 py-1 bg-gray-200 rounded dark:bg-gray-700">🌗 Toggle Theme</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 font-medium capitalize">{key.replace("_", " ")}</label>
              <input
                type={key === "last_purchase" ? "date" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                max={key === "last_purchase" ? new Date().toISOString().split("T")[0] : undefined}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 flex-wrap">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">🔍 Analyze</button>
          <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">🧹 Reset</button>
          <button type="button" onClick={clearHistory} className="bg-red-400 px-4 py-2 rounded">🗑️ Clear History</button>
          <button type="button" onClick={() => setFormData(sampleFraud)} className="bg-red-200 px-4 py-2 rounded">⚠️ Test Fraud</button>
          <button type="button" onClick={() => setFormData(sampleLoyal)} className="bg-blue-200 px-4 py-2 rounded">💙 Test Loyal</button>
          <button type="button" onClick={() => setFormData(sampleNormal)} className="bg-green-200 px-4 py-2 rounded">✅ Test Normal</button>
        </div>
      </form>

      {loading && <p className="text-center mt-4 text-indigo-600">🔄 Predicting...</p>}

      {result && (
        <div className="text-center mt-6">
          <div className={`inline-block px-5 py-2 font-semibold text-lg rounded-full shadow text-white ${result === 'Loyal' ? 'bg-blue-600' : result === 'Fraudulent' ? 'bg-red-600' : 'bg-green-600'}`}>
            {result === "Loyal" && <FaHeart className="inline mr-2" />} 
            {result === "Fraudulent" && <FaUserSecret className="inline mr-2" />} 
            {result === "Normal" && <FaUserCheck className="inline mr-2" />} 
            Prediction: {result}
          </div>
          {confidence !== null && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Confidence: {confidence}%</p>}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">📊 Prediction Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={summaryData}>
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={summaryData} dataKey="count" nameKey="label" outerRadius={100} label>
                    {summaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[entry.label]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
