import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { sendTelegramMessage } from "../utils/telegram";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);

    sendTelegramMessage(`🔐 *Login baru!*\n📧 ${email}\n🕒 ${new Date().toLocaleString()}`);

    if (!userCred.user.emailVerified) {
      setError("⚠️ Email belum diverifikasi. Silakan cek email kamu.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(userCred.user));
    navigate("/");
  } catch (err) {
    console.error("Login error:", err.message); // 👈 Debug error
    setError(err.message);
  }
};

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white">
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg max-w-md w-full border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">Login ke Jarvis</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white font-semibold py-3 rounded shadow-lg"
        >
          Masuk
        </button>

        <p className="text-center mt-4 text-sm text-gray-300">
          Belum punya akun?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
