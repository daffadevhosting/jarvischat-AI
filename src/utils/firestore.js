import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// ✅ Buat chatroom baru
export const createChatroom = async (userId, name) => {
  const chatroomRef = collection(db, "users", userId, "chatrooms");
  const newRoom = await addDoc(chatroomRef, {
    name,
    createdAt: serverTimestamp(),
  });
  return newRoom.id;
};

// ✅ Rename chatroom
export const renameChatroom = async (userId, roomId, newName) => {
  const ref = doc(db, "users", userId, "chatrooms", roomId);
  await updateDoc(ref, { name: newName });
};

// ✅ Ambil semua chatroom milik user
export const getChatrooms = async (userId) => {
  const chatroomRef = collection(db, "users", userId, "chatrooms");
  const snapshot = await getDocs(query(chatroomRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ✅ Ambil pesan dari chatroom
export const getMessages = async (userId, chatroomId) => {
  const messagesRef = collection(db, "users", userId, "chatrooms", chatroomId, "messages");
  const snapshot = await getDocs(query(messagesRef, orderBy("timestamp", "asc")));
  return snapshot.docs.map((doc) => doc.data());
};

// 🗑️ Delete chatroom (and its messages)
export const deleteChatroom = async (userId, roomId) => {
  const roomRef = doc(db, "users", userId, "chatrooms", roomId);
  const messagesRef = collection(db, "users", userId, "chatrooms", roomId, "messages");

  // Hapus semua pesan
  const snapshot = await getDocs(messagesRef);
  const deletions = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletions);

  // Hapus chatroom
  await deleteDoc(roomRef);
};

// ✅ Simpan pesan ke chatroom dengan validasi & logging
export const saveMessage = async (userId, chatroomId, message) => {
  if (!userId || !chatroomId || !message?.role || !message?.content) {
    console.warn("⛔ saveMessage dibatalkan. Data tidak lengkap:", {
      userId,
      chatroomId,
      message,
    });
    return;
  }

  try {
    const messagesRef = collection(
      db,
      "users",
      userId,
      "chatrooms",
      chatroomId,
      "messages"
    );

    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Gagal menyimpan pesan ke Firestore:", err);
  }
};

// 🗑️ bersihkan chatroom
export const clearChatroomMessages = async (userId, chatroomId) => {
  const messagesRef = collection(db, "users", userId, "chatrooms", chatroomId, "messages");
  const snapshot = await getDocs(messagesRef);

  const deletions = snapshot.docs.map((docItem) =>
    deleteDoc(doc(db, "users", userId, "chatrooms", chatroomId, "messages", docItem.id))
  );

  await Promise.all(deletions);
  console.log(`🧹 Semua pesan di room '${chatroomId}' telah dibersihkan.`);
};