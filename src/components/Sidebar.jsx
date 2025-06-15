import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getChatrooms, createChatroom, renameChatroom, deleteChatroom } from "../utils/firestore";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { APP_NAME } from "../utils/appname";
import {
  FiLogOut,
  FiPlusCircle,
  FiMessageCircle, FiDatabase,
  FiClock, FiLogIn, FiMail,
  FiGift, FiEdit, FiTrash, FiX
} from "react-icons/fi";
import BotLogo from "../assets/logo.png";
import { useGlobalUI } from "../context/GlobalUIContext";
import SocialShare from "../components/SocialShare";
import ModalSaran from "../components/FeedbackModal";

export const Sidebar = ({
  isOpen,
  setIsOpen,
  activeRoomId,
  user,
  onClearChat
}) => {
  const { globalAlert } = useGlobalUI();
  const { globalConfirm } = useGlobalUI();
  const [chatrooms, setChatrooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnDashboard = location.pathname === "/";
  const currentRoomId = location.pathname.split("/").pop();
  const [showSaranModal, setShowSaranModal] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      if (user) {
        const rooms = await getChatrooms(user.uid);
        setChatrooms(rooms);
      }
    };
    loadRooms();
  }, [user]);

  const handleCreateRoom = async () => {
    if (!user) {
      await globalAlert("🚫 Fitur ini hanya untuk pengguna login.");
      return;
    }

    const name = prompt("Nama chatroom:");
    if (!name) return;

    try {
      const roomId = await createChatroom(user.uid, name);
      globalAlert("✅ Room baru berhasil dibuat:", roomId);
      navigate(`/j/c/${roomId}`);
      const rooms = await getChatrooms(user.uid);
      setChatrooms(rooms);
    } catch (err) {
      globalAlert("❌ Gagal buat room:", err);
    }
  };

  const handleLogout = async () => {
    if (!user) return; // udah amanin

    const confirmed = await globalConfirm("Yakin mau logout sekarang?");
    if (!confirmed) return;

    await signOut(auth);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div>
      <ModalSaran isOpen={showSaranModal} onClose={() => setShowSaranModal(false)} />
    <aside
      className={`
        fixed md:static top-0 left-0 h-full z-10
        w-64 bg-[#0f172a] p-4 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:block
      `}
    >
      <div className="text-2xl font-bold mb-10 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={BotLogo}
            alt="Bot Logo"
            className="w-10 h-10 rounded-full object-cover border border-blue-500"
          />
          <span className="text-blue-400">{APP_NAME}</span>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(false)}><FiX /></button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-400">Logged in as:</div>
        <div className="font-semibold text-blue-300 truncate">
          {user?.email || "👤 Anonim"}
        </div>
      </div>

      <nav className="flex flex-col gap-4 flex-1 text-sm">
        <Link to="/"
          title="Free Chat"
          className={`p-2 rounded flex items-center gap-2 transition ${
            isOnDashboard ? "bg-blue-700" : "hover:bg-gray-700"
          }`}>
          <FiMessageCircle /> Chat
        </Link>
        <ul className="space-y-2">
          {chatrooms.map((room) => (
            <li
              key={room.id}
              className={`p-2 rounded flex justify-between items-center ${
                currentRoomId === activeRoomId ? "bg-blue-700" : "hover:bg-gray-700"
              }`}
            >
              <span onClick={() => navigate(`/j/c/${room.id}`)} className="cursor-pointer flex justify-items-start gap-2 items-center" title={room.name}>
               <FiDatabase /> {room.name}
              </span>

              <div className="flex gap-2 text-sm">
                <button className="cursor-pointer"
                  onClick={async () => {
                    const newName = prompt("Ganti nama chatroom:", room.name);
                    if (newName && user) {
                      await renameChatroom(user.uid, room.id, newName);
                      const updated = await getChatrooms(user.uid);
                      setChatrooms(updated);
                    }
                  }}
                  title="Rename"
                >
                  <FiEdit />
                </button>

                <button className="cursor-pointer"
                  onClick={async () => {
                    if (globalConfirm("Yakin hapus chatroom ini?")) {
                      await deleteChatroom(user.uid, room.id);
                      const updated = await getChatrooms(user.uid);
                      setChatrooms(updated);
                      navigate("/"); // back to safe route
                    }
                  }}
                  title="Delete"
                >
                  <FiTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
            <button
              title="Create Chat Room"
              onClick={handleCreateRoom}
              className="cursor-pointer flex items-center gap-2 hover:text-blue-400 transition text-left"
            >
              <FiPlusCircle /> Buat Room
            </button>
            <button
              title="History Chat"
              onClick={async () => {
                if (!user) {
                  await globalAlert("🚫 Fitur ini hanya untuk pengguna login.");
                  return;
                }
                globalAlert("📜 Riwayat masih dalam pengembangan.");
              }}
              className="cursor-pointer flex items-center gap-2 hover:text-blue-400 transition text-left"
            >
              <FiClock /> Riwayat
            </button>
            <button className="cursor-pointer flex items-center gap-2 hover:text-red-500 transition text-left" title="Clear Chat" onClick={onClearChat}>
              <FiTrash /> Bersihkan Chat
            </button>
      </nav>
<div className="flex justify-self-start"><SocialShare /></div>     
      <div className="absolute flex justify-items-center-safe gap-2 bottom-4 left-4 right-4">
        {user && (
          <button type="button"
            onClick={handleLogout}
            className="mt-2 cursor-pointer bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FiLogOut />
          </button>
        )} {!user && (
          <a type="button"
            href="/login"
          className="mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          title="Login ke Jarvis"
          >
            <FiLogIn />
          </a>
        )}
        <a type="button"
          href="/donate"
          className="mt-2 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
          title="Donasi Dermawan"
        >
          <FiGift /> Donate
        </a>
        <button
          onClick={() => setShowSaranModal(true)}
          className="mt-2 cursor-pointer flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
          title="Saran & Kritik"
        >
          <FiMail />
        </button>
      </div>
    </aside>
    </div>
    
  );
};

