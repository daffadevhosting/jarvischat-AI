// src/components/ModalSaran.jsx
import { useState } from "react";
import { useGlobalUI } from "../context/GlobalUIContext";

export default function ModalSaran({ isOpen, onClose }) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const { globalAlert } = useGlobalUI();

  const handleKirim = async () => {
    if (!nama.trim()) return globalAlert("Nama tidak boleh kosong!");
    if (!pesan.trim()) return globalAlert("Isi pesan tidak boleh kosong!");

    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📣 *Saran/Kritik Baru!*\n\n👤 Nama: ${nama || "Anonim"}\n💬 Pesan:\n${pesan}`,
          parse_mode: "Markdown",
        }),
      });

      const data = await response.json();
      if (!data.ok) throw new Error("Telegram gagal");

      globalAlert("✅ Saran berhasil dikirim!");
      setNama("");
      setPesan("");
      onClose(); // Tutup modal
    } catch (err) {
      console.error(err);
      globalAlert("❌ Gagal mengirim saran.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-lg w-full max-w-fit p-6 shadow-xl animate-fade-in">
        <h2 className="text-xl font-bold mb-4">💡 Saran & Kritik</h2>
        <input
          type="text"
          placeholder="Nama (opsional)"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <textarea
          placeholder="Tulis saran atau kritik kamu..."
          className="w-full h-32 px-4 py-2 border rounded mb-4"
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-black">
            Batal
          </button>
          <button
            onClick={handleKirim}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}
