export function draw(ctx,W,H,lvl,camX,player,gameOver,gameWin){
  ctx.clearRect(0,0,W,H);
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#9be7ff'); g.addColorStop(1,'#7ec0ee');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  for(const obj of lvl){
    const sx=Math.round(obj.x-camX), sy=Math.round(obj.y);
    if(obj.type==='platform'){ ctx.fillStyle='#8B5A2B'; ctx.fillRect(sx,sy,obj.w,obj.h); ctx.fillStyle='#d9b086'; ctx.fillRect(sx,sy,obj.w,6); }
    else if(obj.type==='spike'){ for(let s=0;s<Math.ceil(obj.w/20);s++){ const px=sx+s*20; ctx.beginPath(); ctx.moveTo(px,sy+obj.h); ctx.lineTo(px+10,sy); ctx.lineTo(px+20,sy+obj.h); ctx.closePath(); ctx.fillStyle='#b00'; ctx.fill(); } }
    else if(obj.type==='enemy'){ ctx.fillStyle='#ff7b7b'; ctx.fillRect(sx,sy,obj.w,obj.h); }
    else if(obj.type==='boss'){ ctx.fillStyle='#6b2c91'; ctx.fillRect(sx,sy,obj.w,obj.h); ctx.fillStyle='#fff'; ctx.font='16px sans-serif'; ctx.fillText(`HP:${obj.hp??3}`,sx+obj.w/2-20,sy-8); }
    else if(obj.type==='goal'){ ctx.fillStyle='#0a0'; ctx.fillRect(sx,sy,obj.w,obj.h); }
  }

  const px=Math.round(player.x-camX);
  ctx.fillStyle='#FF4D4D'; ctx.fillRect(px,Math.round(player.y),player.w,player.h);

  if(gameOver){ ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(W/2-200,H/2-50,400,100); ctx.fillStyle='#fff'; ctx.font='22px sans-serif'; ctx.fillText('Game Over — Rでリスタート', W/2-170,H/2); }
  if(gameWin){ ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(W/2-200,H/2-50,400,100); ctx.fillStyle='#fff'; ctx.font='22px sans-serif'; ctx.fillText('You Win! リロードで再挑戦', W/2-140,H/2); }
}
