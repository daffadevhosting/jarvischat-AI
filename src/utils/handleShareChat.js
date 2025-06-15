// File: handleShareChat.js
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const handleShareChat = async (messages, globalAlert) => {
  const shareId = uuidv4();
  try {
    await setDoc(doc(db, "sharedChats", shareId), {
      createdAt: serverTimestamp(),
      messages,
    });

    const url = `${window.location.origin}/share/${shareId}`;
    await navigator.clipboard.writeText(url);
    globalAlert("✅ Link chat disalin ke clipboard!", url);
  } catch (err) {
    console.error("❌ Gagal membagikan chat:", err);
    globalAlert("❌ Gagal membagikan chat");
  }
};

