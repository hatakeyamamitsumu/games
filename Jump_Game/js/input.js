// ========== input.js ==========
export const keys = { left:false, right:false, jump:false };

// ===== キーボード =====
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp" || e.key === " ") keys.jump = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp" || e.key === " ") keys.jump = false;
});

// ===== マウス / タッチ =====
const btnIds = ["left", "right", "jump"];
btnIds.forEach(id => {
  const btn = document.getElementById(id);

  // PCマウス用
  btn.addEventListener("mousedown", () => keys[id] = true);
  btn.addEventListener("mouseup", () => keys[id] = false);
  btn.addEventListener("mouseleave", () => keys[id] = false);

  // スマホタッチ用
  btn.addEventListener("touchstart", e => {
    e.preventDefault(); // 画面スクロールやズームを防ぐ
    keys[id] = true;
  }, { passive: false });

  btn.addEventListener("touchend", e => {
    e.preventDefault();
    keys[id] = false;
  });

  btn.addEventListener("touchcancel", e => {
    e.preventDefault();
    keys[id] = false;
  });
});

// ===== 押しっぱなし対応確認 =====
// updatePlayer で keys.left / keys.right / keys.jump が true の間ずっと移動・ジャンプする
