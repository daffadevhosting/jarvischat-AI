import { useEffect, useState } from "react";

export default function Donasi() {
  const [nama, setNama] = useState("");
  const [amount, setAmount] = useState("");

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://app.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
  script.async = true;
  script.onload = () => console.log("✅ Midtrans Snap.js loaded");
  script.onerror = () => console.error("❌ Gagal load Snap.js dari Midtrans");

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://midtrans-backend.androidbutut.workers.dev/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseInt(amount),
          customer: { first_name: nama },
          items: [
            {
              id: "DONASI-" + Date.now(),
              name: "Donasi Kebaikan",
              quantity: 1,
              price: parseInt(amount),
            },
          ],
        }),
      });

      const data = await res.json();
      if (!data.token) {
        alert("Gagal memuat pembayaran.");
        console.error(data);
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: () => (window.location.href = "/success"),
        onPending: () => alert("Pembayaran pending. Cek email kamu ya!"),
        onError: () => alert("Oops, pembayaran gagal!"),
        onClose: () => alert("Kamu menutup popup sebelum menyelesaikan pembayaran."),
      });
    } catch (err) {
      alert("Terjadi kesalahan saat memproses donasi.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Donasi untuk Jarvis</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <div>
          <label htmlFor="nama" className="block mb-1 font-medium">Nama</label>
          <input
            type="text"
            id="nama"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block mb-1 font-medium">Jumlah Donasi (Rp)</label>
          <input
            type="number"
            id="amount"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1000}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold transition"
        >
          Donasi Sekarang 💖
        </button>
      </form>
    </div>
  );
}
