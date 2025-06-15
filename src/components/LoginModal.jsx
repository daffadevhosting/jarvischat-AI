// LoginModal.jsx
export default function LoginModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50  bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#1e293b] text-white backdrop-blur-lg backdrop-opacity-75 rounded-xl p-6 shadow-lg w-full max-w-sm text-center animate__animated animate__zoomIn">
        <h2 className="text-2xl font-bold mb-4">👋 Hai, sobat penasaran!</h2>
        <p className="mb-4 text-sm text-gray-300">
          Kamu sudah mencoba 2x sebagai anonim. Login yuk buat lanjut obrolan seru bareng Jarvis tanpa batasan!
        </p>
        <a type="button"
           href="/register"
          className="mt-4 bg-white text-gray-900 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
        > Masuk atau Daftar
        </a>
        <a
          onClick={onClose}
          href="#"
          className="mt-2 block text-blue-400 hover:underline text-sm"
        >
          Nanti saja
        </a>
      </div>
    </div>
  );
}
