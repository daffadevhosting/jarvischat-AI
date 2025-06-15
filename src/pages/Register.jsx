import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { sendTelegramMessage } from "../utils/telegram";
import { useGlobalUI } from "../context/GlobalUIContext";

export default function Register() {
const { globalAlert } = useGlobalUI();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(userCred.user);
      globalAlert("📩 Verifikasi email dikirim. Silakan cek inbox kamu.");
      sendTelegramMessage(`🆕 *Pendaftaran baru!*\n📧 ${email}\n✅ Email dikirim untuk verifikasi\n🕒 ${new Date().toLocaleString()}`);
      navigate("/");
    } catch (err) {
      globalAlert(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-gray-900 text-white">
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg max-w-md w-full border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">Daftar ke Jarvis</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white font-semibold py-3 rounded shadow-lg"
        >
          Daftar
        </button>

        <p className="text-center mt-4 text-sm text-gray-300">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
