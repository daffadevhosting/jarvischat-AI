import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import ConfettiExplosion from "react-confetti-explosion";

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 🎉 Confetti */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <ConfettiExplosion particleCount={250} duration={3500} />
      </div>

      <div className="z-20 text-center">
        <FiCheckCircle className="text-green-400 text-6xl mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Terima kasih banyak, Dermawan Hebat! 🙏</h1>
        <p className="text-gray-300 mb-6">
          Dukunganmu adalah bahan bakar semangat kami.  
          <br />Jarvis bakal makin canggih karena kamu! 💖
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          <FiArrowLeft className="mr-2" /> Kembali ke Dashboard
        </Link>
      </div>

      <footer className="mt-10 text-sm text-gray-500 z-20">
        Powered by Midtrans & Dibuat oleh Endang • 2025
      </footer>
    </div>
  );
}
