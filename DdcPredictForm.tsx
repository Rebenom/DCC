"use client";

import { FormEvent, useState } from "react";

type Prediction = { rank: number; ddc: string; probability: number };
type ApiResult = {
  ddc: string;
  confidence: number;
  needs_review: boolean;
  note?: string | null;
  known_terms: number;
  top_predictions: Prediction[];
  model_warning?: string;
};

const API_URL = process.env.NEXT_PUBLIC_DDC_API_URL;

export default function DdcPredictForm() {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hasil, setHasil] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setHasil(null);
    setLoading(true);
    try {
      if (!API_URL) throw new Error("NEXT_PUBLIC_DDC_API_URL belum diatur.");
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi, top_k: 3 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `API error ${response.status}`);
      setHasil(data as ApiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghubungi API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-5 rounded-2xl border p-6">
      <div>
        <h1 className="text-2xl font-bold">Klasifikasi Buku DDC</h1>
        <p className="mt-1 text-sm text-gray-600">Masukkan informasi buku untuk memperoleh saran nomor DDC.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="font-medium">Judul buku</span>
          <input className="w-full rounded-lg border p-3" value={judul} onChange={e => setJudul(e.target.value)} required maxLength={255} />
        </label>
        <label className="block space-y-1">
          <span className="font-medium">Deskripsi buku</span>
          <textarea className="w-full rounded-lg border p-3" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={5} maxLength={5000} placeholder="Ringkasan atau subjek buku" />
        </label>
        <button className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={loading}>
          {loading ? "Memproses..." : "Prediksi nomor DDC"}
        </button>
      </form>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {hasil && (
        <div className="space-y-3 rounded-xl bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">Hasil prediksi</h2>
          <p>Nomor DDC: <strong>{hasil.ddc}</strong></p>
          <p>Confidence: <strong>{(hasil.confidence * 100).toFixed(2)}%</strong></p>
          <p>Kata yang dikenali TF-IDF: {hasil.known_terms}</p>
          {hasil.needs_review && <p className="text-amber-800">Perlu verifikasi pustakawan: {hasil.note ?? "Hasil perlu diperiksa."}</p>}
          {hasil.model_warning && <p className="text-red-700">Peringatan model: {hasil.model_warning}</p>}
          <h3 className="font-medium">3 kandidat teratas</h3>
          <ol className="list-inside list-decimal space-y-1">
            {hasil.top_predictions.map(item => <li key={`${item.rank}-${item.ddc}`}>{item.ddc} — {(item.probability * 100).toFixed(2)}%</li>)}
          </ol>
          <p className="text-xs text-gray-600">Confidence adalah probabilitas model, bukan jaminan prediksi benar. Verifikasi hasil sebelum menetapkan nomor katalog.</p>
        </div>
      )}
    </section>
  );
}
