export const keys = { left:false, right:false, jump:false };

// ===== キーボード操作 =====
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowLeft") keys.left = true;
  if(e.key==="ArrowRight") keys.right = true;
  if(e.key==="ArrowUp" || e.key===" ") keys.jump = true;
});
document.addEventListener("keyup", e=>{
  if(e.key==="ArrowLeft") keys.left = false;
  if(e.key==="ArrowRight") keys.right = false;
  if(e.key==="ArrowUp" || e.key===" ") keys.jump = false;
});

// ===== タッチ・マウス操作 =====
const btnIds = ["left","right","jump"];
btnIds.forEach(id => {
  const btn = document.getElementById(id);

  const setKey = value => e => {
    e.preventDefault();
    keys[id] = value;
  };

  // マウス
  btn.addEventListener("mousedown", setKey(true));
  btn.addEventListener("mouseup", setKey(false));
  btn.addEventListener("mouseleave", setKey(false));

  // タッチ
  btn.addEventListener("touchstart", setKey(true), { passive:false });
  btn.addEventListener("touchend", setKey(false), { passive:false });
  btn.addEventListener("touchcancel", setKey(false), { passive:false });
});

// ===== 全体のスクロール・ズーム無効化 =====
document.addEventListener("touchmove", e=>e.preventDefault(), { passive:false });
document.addEventListener("gesturestart", e=>e.preventDefault());
