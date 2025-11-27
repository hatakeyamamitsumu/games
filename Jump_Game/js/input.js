// ========== input.js ==========
export const keys = { left:false, right:false, jump:false };

// --- キーボード ---
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

// --- マウス / タッチボタン対応 ---
function setupButton(btnId, keyName){
  const btn = document.getElementById(btnId);
  if(!btn) return;

  // マウスクリック
  btn.addEventListener("mousedown",   ()=>keys[keyName]=true);
  btn.addEventListener("mouseup",     ()=>keys[keyName]=false);
  btn.addEventListener("mouseleave",  ()=>keys[keyName]=false);

  // タッチ
  btn.addEventListener("touchstart",  e=>{ keys[keyName]=true; e.preventDefault(); });
  btn.addEventListener("touchend",    e=>{ keys[keyName]=false; e.preventDefault(); });
}

setupButton("left", "left");
setupButton("right", "right");
setupButton("jump", "jump");
