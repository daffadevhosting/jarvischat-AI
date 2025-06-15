import { useRef, useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import SocialShare from "../components/SocialShare";

export default function ChatWindow({ messages, typingMessage }) {
  const bottomRef = useRef();
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 bg-transparent custom-scrollbar">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} sender={msg.role} text={msg.content} />
      ))}
      {showShare && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-sm text-gray-400 mb-2">Bagikan pengalamanmu ngobrol sama Jarvis!</p>
          <SocialShare />
        </div>
      )}
      {typingMessage && (
        <ChatMessage sender="assistant" text={typingMessage} />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
