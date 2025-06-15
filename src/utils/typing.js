export const typeText = async (text, delay = 30, onUpdate) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    // DEBUGGING DI SINI console.log("🟡 Typing:", result);
    onUpdate(result);
    await new Promise((r) => setTimeout(r, delay));
  }
  return result;
};
