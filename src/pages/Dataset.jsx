import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dataset() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", text: "", label: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dataset`);
      if (!res.ok) throw new Error("Greška pri učitavanju dataset-a");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.text.trim()) {
      setError("Naslov i tekst su obavezni.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/dataset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Greška pri dodavanju");
      }

      const data = await res.json();
      setNewItem({ title: "", text: "", label: 0 });
      setShowAddForm(false);
      await loadDataset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const realCount = items.filter(item => item.label === 0).length;
  const fakeCount = items.filter(item => item.label === 1).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dataset</h1>
            <p className="text-gray-400">Pregled i upravljanje dataset-om za treniranje modela</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold hover:from-cyan-400 hover:to-green-400 transition-all"
          >
            {showAddForm ? "Otkaži" : "+ Dodaj novi item"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
            <div className="text-gray-400 text-sm mb-1">Ukupno primjera</div>
            <div className="text-3xl font-bold">{items.length}</div>
          </div>
          <div className="bg-green-900/20 backdrop-blur-lg rounded-xl border border-green-700/50 p-6">
            <div className="text-green-300 text-sm mb-1">Real News</div>
            <div className="text-3xl font-bold text-green-400">{realCount}</div>
          </div>
          <div className="bg-red-900/20 backdrop-blur-lg rounded-xl border border-red-700/50 p-6">
            <div className="text-red-300 text-sm mb-1">Fake News</div>
            <div className="text-3xl font-bold text-red-400">{fakeCount}</div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 mb-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Dodaj novi item u dataset</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Naslov</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tekst</label>
                <textarea
                  rows={4}
                  value={newItem.text}
                  onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Labela</label>
                <select
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value={0}>Real News (0)</option>
                  <option value={1}>Fake News (1)</option>
                </select>
              </div>
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold hover:from-cyan-400 hover:to-green-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Dodavanje..." : "Dodaj u dataset"}
              </button>
            </form>
          </div>
        )}

        {/* Dataset Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Učitavanje...</div>
        ) : (
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Naslov</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tekst</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Labela</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 text-sm">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-md truncate">
                        {item.text}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.label === 1
                              ? "bg-red-900/30 text-red-200 border border-red-700"
                              : "bg-green-900/30 text-green-200 border border-green-700"
                          }`}
                        >
                          {item.label === 1 ? "FAKE" : "REAL"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


