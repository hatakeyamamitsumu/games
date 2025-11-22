// ========== render.js ==========
export function render(ctx, cameraX, blocks, enemies, boss, player, HUD, isStageCleared){

  ctx.clearRect(0,0,960,540);

  // 背景
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0,0,960,540);

  ctx.save();
  ctx.translate(-cameraX, 0);

  // ブロック
  ctx.fillStyle = "#654321";
  for(const b of blocks){
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }

  // 敵
  ctx.fillStyle = "red";
  for(const e of enemies){
    ctx.fillRect(e.x, e.y, e.w, e.h);
  }

  // ボス
  if(boss){
    ctx.fillStyle = "purple";
    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
  }

  // プレイヤー
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.restore();

  // HUD（左上）
  HUD.textContent = `Stage ${HUD.stage} / Score ${HUD.score} / Lives ${HUD.lives}`;


  // ============================
  // ★ ステージクリア画面描画 ★
  // ============================
  if(isStageCleared){
    ctx.save();

    // 少し暗くして強調
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      `ステージ ${HUD.stage} クリア！`,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2
    );

    ctx.restore();
  }
}
