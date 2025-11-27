import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [training, setTraining] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Metrike nisu dostupne. Trenirajte model prvo.");
        } else {
          throw new Error("Greška pri učitavanju metrika");
        }
      } else {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/train`, {
        method: "POST"
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Greška pri treniranju");
      }

      // Wait a bit then reload metrics
      setTimeout(() => {
        loadMetrics();
        setTraining(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
      setTraining(false);
    }
  };

  const chartData = metrics ? [
    { name: "Accuracy", value: metrics.accuracy, full: 1.0 },
    { name: "Precision", value: metrics.precision, full: 1.0 },
    { name: "Recall", value: metrics.recall, full: 1.0 },
    { name: "F1 Score", value: metrics.f1_score, full: 1.0 }
  ] : [];

  const pieData = metrics ? [
    { name: "Train", value: metrics.train_size },
    { name: "Test", value: metrics.test_size }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Metrike modela</h1>
            <p className="text-gray-400">Pregled performansi modela za detekciju lažnih vijesti</p>
          </div>
          <button
            onClick={handleTrain}
            disabled={training}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold hover:from-cyan-400 hover:to-green-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {training ? "Treniranje..." : "Treniraj model"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Učitavanje metrika...</div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : metrics ? (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <div className="text-gray-400 text-sm mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {(metrics.accuracy * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <div className="text-gray-400 text-sm mb-1">Precision</div>
                <div className="text-3xl font-bold text-green-400">
                  {(metrics.precision * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <div className="text-gray-400 text-sm mb-1">Recall</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {(metrics.recall * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <div className="text-gray-400 text-sm mb-1">F1 Score</div>
                <div className="text-3xl font-bold text-red-400">
                  {(metrics.f1_score * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Model Info */}
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Informacije o modelu</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Tip modela</div>
                  <div className="font-semibold">{metrics.model_type}</div>
                </div>
                <div>
                  <div className="text-gray-400">Ukupno primjera</div>
                  <div className="font-semibold">{metrics.total_samples}</div>
                </div>
                <div>
                  <div className="text-gray-400">Train set</div>
                  <div className="font-semibold">{metrics.train_size}</div>
                </div>
                <div>
                  <div className="text-gray-400">Test set</div>
                  <div className="font-semibold">{metrics.test_size}</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Metrike performansi</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => `${(value * 100).toFixed(2)}%`}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#06b6d4" name="Vrijednost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Raspodjela dataset-a</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}


