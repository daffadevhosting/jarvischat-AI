import ReactMarkdown from "react-markdown";
import BotLogo from "../assets/logo.png";
import UserAvatar from "../assets/user.png";

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";
  const avatar = isUser ? UserAvatar : BotLogo;

  return (
    <div className={`flex my-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-2 max-w-md ${isUser ? "flex-row-reverse" : ""}`}>
        
        {/* Avatar */}
        <img
          src={avatar}
          alt={isUser ? "User Avatar" : "Jarvis Logo"}
          className="w-8 h-8 rounded-full border border-blue-500 shadow-sm"
        />

        {/* Balon chat */}
        <div
          className={`px-4 py-2 rounded-2xl text-sm shadow-md
            ${isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-blue-900 text-gray-200 rounded-bl-none"
            }
          `}
        >
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
