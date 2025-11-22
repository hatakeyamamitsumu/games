// ========== input.js ==========
export const keys = { left:false, right:false, jump:false };

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
