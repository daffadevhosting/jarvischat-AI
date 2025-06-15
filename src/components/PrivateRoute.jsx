import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import BotSpinner from "../assets/jarvis-loading.png";

export default function PrivateRoute() {
  const [user, loading] = useAuthState(auth);

if (loading) {
  return (
    <div className="h-full w-full flex flex-col text-center md:items-center md:justify-center bg-[#0f172a] overflow-hidden animate-pulse text-white p-4">
      <img
        src={BotSpinner}
        alt="Jarvis loading"
        className="w-24 h-24 mb-4 animate-spin-slow"
      />
      <p className="text-xl font-mono text-blue-400">Jarvis sedang bangun dari servernya...</p>
  <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      <p className="text-sm text-gray-400 mt-2">Menginisialisasi sistem Jarvis-AI...</p>
    </div>
  );
}
  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
}
