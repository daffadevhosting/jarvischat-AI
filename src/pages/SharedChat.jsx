// 🔗 File: SharedChat.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import ChatMessage from "../components/ChatMessage";

export default function SharedChat() {
  const { shareId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const snap = await getDoc(doc(db, "sharedChats", shareId));
        if (snap.exists()) {
          setMessages(snap.data().messages);
        } else {
          setMessages([{ role: "assistant", content: "❌ Chat tidak ditemukan." }]);
        }
      } catch (err) {
        console.error("Gagal fetch shared chat:", err);
        setMessages([{ role: "assistant", content: "❌ Terjadi kesalahan saat mengambil chat." }]);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [shareId]);

  if (loading) return <div className="text-white p-4">🔄 Memuat percakapan...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4">
      <h1 className="text-blue-400 text-2xl mb-4">📤 Percakapan Jarvis</h1>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <ChatMessage key={i} sender={m.role} text={m.content} />
        ))}
      </div>
    </div>
  );
}
