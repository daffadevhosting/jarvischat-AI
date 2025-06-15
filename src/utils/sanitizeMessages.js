export function sanitizeMessages(messages) {
  return messages
    .filter((msg) => msg && msg.role && msg.content) // buang null/kosong
    .map(({ role, content }) => ({
      role,
      content,
    }));
}
