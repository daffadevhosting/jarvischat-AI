// utils/voice.js

// 🧠 Dengarkan suara user (speech to text)
export const startListening = (onResult) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("🎙️ Browser kamu belum support voice recognition!");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onerror = (event) => {
    console.error("❌ Voice recognition error:", event.error);
  };

  recognition.start();
};

// 🗣️ Bicara (text to speech)
export const speak = (text, onEnd = () => {}) => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";

  // 🔄 Kadang voice belum siap saat getVoices pertama kali
  const setVoiceAndSpeak = () => {
    const voices = synth.getVoices();
    let selected = voices.find(v =>
      v.lang.startsWith("id") && /laki|male/i.test(v.name)
    );

    if (!selected) {
      selected = voices.find(v => v.lang.startsWith("id"));
    }

    if (selected) {
      utterance.voice = selected;
    } else {
      console.warn("🎙️ Suara cowok tidak ditemukan, pakai default.");
    }

    synth.speak(utterance);
  };

  utterance.onend = onEnd;

  // Jika getVoices belum ready, tunggu dulu
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }
};
