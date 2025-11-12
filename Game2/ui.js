// =========================
// メッセージ表示（共通UI）
// =========================
const messageDiv = document.createElement("div");
messageDiv.style.position = "absolute";
messageDiv.style.top = "50%"; // ← 縦方向の中央
messageDiv.style.left = "50%"; // ← 横方向の中央
messageDiv.style.transform = "translate(-50%, -50%)"; // ← 完全中央寄せ
messageDiv.style.fontSize = "64px"; // ← 文字を大きく
messageDiv.style.fontWeight = "bold";
messageDiv.style.color = "white"; // ← 白文字
messageDiv.style.textShadow = "4px 4px 10px black"; // ← 輪郭で見やすく
messageDiv.style.background = "rgba(0, 0, 0, 0.4)"; // ← 半透明背景
messageDiv.style.padding = "20px 40px";
messageDiv.style.borderRadius = "20px";
messageDiv.style.zIndex = "9999";
messageDiv.style.pointerEvents = "none";
messageDiv.style.display = "none";
document.body.appendChild(messageDiv);

export function showMessage(text, duration = 2000) {
  messageDiv.textContent = text;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, duration);
}
