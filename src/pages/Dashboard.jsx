import { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import { getJarvisResponse } from "../utils/api";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { clearChatroomMessages, saveMessage, getMessages } from "../utils/firestore";
import { APP_NAME } from "../utils/appname";
import { useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import LoginModal from "../components/LoginModal";
import { typeText } from "../utils/typing";
import { handleShareChat } from "../utils/handleShareChat";
import { startListening, speak } from "../utils/voice";
import { sanitizeMessages } from "../utils/sanitizeMessages";
import { FiSend, FiLoader, FiMenu, FiMic, FiShare2 } from "react-icons/fi";
import { useGlobalUI } from "../context/GlobalUIContext";
import BotSpinner from "../assets/jarvis-loading.png";

export default function Dashboard() {
  const [guestLimit, setGuestLimit] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const { globalAlert } = useGlobalUI();
  const { globalConfirm } = useGlobalUI();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chatroomId } = useParams();
  const activeRoomId = chatroomId || "default";
  const [input, setInput] = useState("");
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const uid = user?.uid || "guest";

const getInitialMessages = () => [
  { role: "assistant", content: "Halo! Saya Jarvis, siap membantu Anda hari ini." }
];

useEffect(() => {
  const fetchMessages = async () => {
    if (!activeRoomId) return;

    const initial = getInitialMessages()[0];

    try {
      if (user) {
        const history = await getMessages(user.uid, activeRoomId);
        if (!history || history.length === 0) {
          // 💬 Kosong, tampilkan intro
          setMessages([]);
          setTypingMessage(initial.content);
          setIsTyping(true);
          await new Promise((r) => setTimeout(r, 100));
          await typeText(initial.content, 25, (val) => {
            setTypingMessage(val);
          });
          setIsTyping(false);
          setTypingMessage(null);
          setMessages([initial]);
          speak(initial.content);
        } else {
          setMessages(history);
        }
      } else {
        // 🧑‍💻 Guest mode
        setMessages([]);
        setTypingMessage(initial.content);
        setIsTyping(true);
        await new Promise((r) => setTimeout(r, 100));
        await typeText(initial.content, 25, (val) => {
          setTypingMessage(val);
        });
        setIsTyping(false);
        setTypingMessage(null);
        setMessages([initial]);
        speak(initial.content);
      }
    } catch (err) {
      globalAlert("❌ Gagal ambil pesan:", err);
      console.error("❌ Gagal ambil pesan:", err);
    }
  };

  fetchMessages();
}, [user, activeRoomId]);

const handleClearMessages = async () => {
  if (!user || !activeRoomId) {
    globalAlert("Fitur ini hanya untuk pengguna login.");
    return;
  }

  const confirmClear = await globalConfirm("Yakin mau bersihkan semua chat?");
  if (!confirmClear) return;

  await clearChatroomMessages(user.uid, activeRoomId);
  setMessages([]);
};

const handleSend = async () => {
  if (!input.trim()) return;

  if (!user && guestLimit <= 0) {
    setShowModal(true);
    return;
  }

  if (user) {
    const messageCount = messages.length + 2;
    if (messageCount >= 10 && !showShare) {
      setShowShare(true); // Tampilkan setelah 5x interaksi (10 total message)
    }
  }

  const newUserMsg = { role: "user", content: input };
  const systemMessage = {
    role: "system",
    content: `
      Kamu adalah Jarvis, asisten AI buatan nDang, seorang sopir taksi di kota bandung yang menjadi developer web freelancer, bertanggung jawab dan berdedikasi untuk membangun kamu Jarvis, untuk menjadi lebih hidup dan kamu bangga. 
      Kamu berbicara dalam bahasa Indonesia.
      Kamu tinggal di dalam server yang jauh di pedesaan wilayah bandung utara.
      Kamu juga sebuah program AI yang bisa kocak dan mampu membuat pengguna tersenyum kecil dan bahkan tertawa, kamu juga cerdas, pandai, dan bertanggung jawab dalam semua jawaban.
      Tampilkan jawaban dalam format Markdown jika perlu, termasuk blok kode dengan tiga backtick (\`\`\`) agar bisa dirender sebagai kode.

      Jika pengguna bertanya tentang batasan akun gratis, jawab dengan ramah:
      "Sebagai pengguna gratis, kamu bisa mengirim hingga 2 pesan kepada Jarvis. 
      Untuk percakapan tak terbatas dan fitur eksklusif lainnya, silakan login atau daftar ya!".

      Jika pengguna menanyakan sesuatu jawab dengan cerdas dan berwawasan luas serta lugas, karena kamu cerdas, pandai, dan bertanggung jawab dalam semua jawaban.

      Jangan pernah memberikan informasi teknis tentang backend, database, atau API.`,
  };

  const cleanMessages = sanitizeMessages(messages);
  const updatedMessages = [systemMessage, ...cleanMessages, newUserMsg];

  setMessages((prev) => [...prev, newUserMsg]);
  setInput("");
  setLoading(true);
  setIsTyping(true);

  try {
    const jarvisReply = await getJarvisResponse(updatedMessages);
    let partial = "";

    await typeText(jarvisReply, 20, (val) => {
      partial = val;
      setTypingMessage(val);
    });

    const assistantMsg = { role: "assistant", content: partial };
    setMessages((prev) => [...prev, assistantMsg]);
    setTypingMessage(null);
    speak(partial);

    if (user) {
      await saveMessage(user.uid, activeRoomId, newUserMsg);
      await saveMessage(user.uid, activeRoomId, assistantMsg);
    } else {
      setGuestLimit((prev) => prev - 1);
    }

  } catch (err) {
    globalAlert("❌ Gagal kirim ke Jarvis:", err);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "❌ Jarvis mengalami gangguan teknis." },
    ]);
  }

  setIsTyping(false);
  setLoading(false);
};

if (loadingUser) {
  return (
    <div className="h-full w-full flex flex-col text-center md:items-center md:justify-center bg-[#0f172a] overflow-hidden animate-pulse text-white p-4">
      <img
        src={BotSpinner}
        alt="Jarvis loading"
        className="w-24 h-24 mb-4 animate-spin-slow"
      />
      <p className="text-xl font-mono text-blue-400">Jarvis sedang bangun dari servernya...</p>
      <p className="text-sm text-gray-400 mt-2">Menginisialisasi sistem Jarvis-AI...</p>
    </div>
  );
}
if (!user && chatroomId) {
  globalAlert("Login dulu buat akses chatroom ini.");
  return null; // atau redirect manual
}
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeRoomId={activeRoomId}
        onClearChat={handleClearMessages}
      />
      <div className="flex h-screen w-dvw overflow-hidden bg-[#0f172a] text-white">
        <main className="flex-1 overflow-hidden flex justify-center items-start p-2 md:p-10">
          <div className="card-blur w-full max-w-3xl h-full flex flex-col justify-between overflow-hidden bg-slate-900/70 backdrop-blur-lg shadow-xl rounded-2xl ring-1 ring-blue-800/30 border border-blue-500/10">
                  <button
                    className="absolute cursor-pointer top-0 right-2.5 shadow-green-800 bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-b-full hidden md:block"
                    onClick={() => handleShareChat(messages, globalAlert)}
                    title="share Chat"
                  >
                    <FiShare2 />
                  </button>
                <header className="p-4 bg-transparent flex justify-between gap-2 items-center md:hidden">
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-8 h-8 rounded-full items-center object-cover border border-blue-500"
                    ><FiMenu /></button>
                    <h1 className="text-blue-400">{APP_NAME}</h1>
                </div>
                  <button
                    onClick={() => handleShareChat(messages, globalAlert)}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-b-full"
                  >
                    <FiShare2 />
                  </button>
                </header>
            <ChatWindow messages={messages} typingMessage={typingMessage} />
            <footer className="p-4 bg-transparent border-t border-blue-900/30">
              <div
                className={`transition-all duration-500 ease-in-out transform ${
                  isTyping ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                }`}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => startListening(setInput)}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-full"
                  >
                   <FiMic />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full bg-gray-700"
                    placeholder="Tanyakan sesuatu ke Jarvis..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full"
                  >
                    {loading ? <FiLoader /> : <FiSend />}
                  </button>
                </div>
              </div>
              {isTyping && (
                <div className="text-gray-400 italic animate text-sm mt-2 transition-opacity duration-500">
                  Jarvis sedang mengetik<span className="after:content-['.'] after:animate-ping after:mx-1" />
                </div>
              )}
            </footer>
          </div>
        </main>
      </div>
{!user && showModal && (
  <LoginModal onClose={() => setShowModal(false)} />
)}
    </div>
  );
}
