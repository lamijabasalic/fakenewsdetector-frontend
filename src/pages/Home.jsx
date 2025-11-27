import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Home() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!title.trim() && !text.trim()) {
      setError("Unesite barem naslov ili tekst vijesti.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, text })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Greška pri komunikaciji sa serverom.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Došlo je do greške. Provjerite da li je backend pokrenut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Bosnian Fake News Detector</h1>
          <p className="text-gray-400">
            Sistem za detekciju lažnih vijesti na bosanskom jeziku koristeći AI i NLP tehnologije.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-2">Provjeri vijest</h2>
            <p className="text-gray-400 text-sm mb-6">
              Unesi naslov i/ili tekst vijesti kako bi sistem procijenio da li je vijest vjerovatno lažna ili stvarna.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Naslov vijesti
                </label>
                <input
                  type="text"
                  placeholder="npr. Vlada tajno zabranila korištenje interneta nakon ponoći"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tekst vijesti
                </label>
                <textarea
                  rows={6}
                  placeholder="Kopiraj sadržaj vijesti ili njen ključni dio..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y"
                />
              </div>
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold hover:from-cyan-400 hover:to-green-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Analiziram..." : "Analiziraj vijest"}
              </button>
            </form>
          </div>

          {/* Result Card */}
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-2">Rezultat analize</h2>
            {!result && (
              <div className="text-gray-400 text-sm mt-4">
                <p>
                  Rezultat će se pojaviti ovdje nakon što pošalješ vijest na analizu.
                  Sistem koristi modele obučene na podacima portala{" "}
                  <strong className="text-cyan-400">raskrinkavanje.ba</strong> i prilagođene za bosanski jezik.
                </p>
              </div>
            )}

            {result && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      result.label === "FAKE"
                        ? "bg-red-900/30 text-red-200 border border-red-700"
                        : "bg-green-900/30 text-green-200 border border-green-700"
                    }`}
                  >
                    {result.label} NEWS
                  </span>
                  <span className="text-sm text-gray-400">
                    Povjerenje: {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Vjerovatnoća</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>FAKE</span>
                      <span>{(result.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${result.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>REAL</span>
                      <span>{((1 - result.probability) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(1 - result.probability) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Objašnjenje</h3>
                  <p className="text-sm text-gray-300">{result.explanation}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 text-xs text-gray-300">
                  <strong>Napomena:</strong> Rezultat je procjena modela i ne predstavlja službenu verifikaciju.
                  Preporučujemo da uvijek provjeriš izvor, datum objave i da uporediš informaciju sa više kredibilnih medija.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


