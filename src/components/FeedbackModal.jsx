// src/components/FeedbackModal.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { useGlobalUI } from "../context/GlobalUIContext";
import { getLocalFingerprint } from "../utils/fingerprint";

export default function FeedbackModal({ isOpen, onClose }) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const [nama, setNama] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { globalAlert } = useGlobalUI();

  useEffect(() => {
    const checkSubmission = async () => {
      const fingerprint = getLocalFingerprint();
      const snap = await getDoc(doc(db, "feedbacks", fingerprint));
      if (snap.exists()) {
        setHasSubmitted(true);
      }
    };
    checkSubmission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) return globalAlert("Nama tidak boleh kosong!");
    if (!message.trim()) return globalAlert("Isi pesan tidak boleh kosong!");
    if (!rating) return globalAlert("Silakan beri bintang dulu!");

    try {
      const fingerprint = getLocalFingerprint();
      const snap = await getDoc(doc(db, "feedbacks", fingerprint));
      if (snap.exists()) {
        globalAlert("🙏 Kamu sudah pernah mengirim saran sebelumnya.");
        return;
      }

      // Kirim ke Telegram
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📣 *Saran/Kritik Baru!*
Dari: ${nama}
"${message}"
⭐ Bintang: ${rating}`,
        }),
      });

      // Simpan ke Firestore
      await setDoc(doc(db, "feedbacks", fingerprint), {
        nama,
        message,
        rating,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Gagal kirim feedback:", err);
      globalAlert("❌ Gagal mengirim feedback. Coba lagi nanti.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed p-4 inset-0 bg-black/50 backdrop-blur-md bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-xl max-w-md w-full shadow-2xl">
        {submitted ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-400">Terima kasih! 🙏</h2>
            <p className="text-sm mt-2 text-gray-300">
              Saran, kritik, dan donasi kamu sangat berarti bagi pengembangan Jarvis.
            </p>
            <div className="mt-4 text-yellow-400 text-lg">{'⭐'.repeat(rating)}</div>
            <button onClick={onClose} className="mt-6 cursor-pointer bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Tutup
            </button>
          </div>
        ) : hasSubmitted ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-yellow-400">Kamu sudah pernah mengirim 🙌</h2>
            <button onClick={onClose} className="mt-4 cursor-pointer bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Saran & Kritik</h2>
            <input
              className="w-full bg-gray-800 p-2 mb-3 rounded"
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <textarea
              className="w-full bg-gray-800 p-2 mb-3 rounded"
              rows="4"
              placeholder="Tulis saran atau kritik kamu di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <label className="block mb-2">Berikan bintang untuk Jarvis:</label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 transition py-2 rounded"
            >
              Kirim
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
