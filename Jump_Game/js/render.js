// ========== render.js ==========

// ▼ プレイヤー画像
const playerSprite = new Image();
playerSprite.src = "./images/characters/player.png";

// ▼ 敵・ボス画像
import { enemySprite, bossSprite } from "./enemy.js";

// ▼ ブロック画像（3種類）
const blockImages = [];
for(let i=1;i<=3;i++){
  const img = new Image();
  img.src = `./images/characters/block${i}.png`;
  blockImages.push(img);
}

// ===== スプライト情報 =====
const PLAYER_FRAME_W = 34, PLAYER_FRAME_H = 48, PLAYER_FRAME_COUNT = 4;
const ENEMY_FRAME_W = 34, ENEMY_FRAME_H = 48, ENEMY_FRAME_COUNT = 4;
const BOSS_FRAME_W = 128, BOSS_FRAME_H = 128, BOSS_FRAME_COUNT = 2;

// ===== アニメ用タイマー =====
let playerFrameIndex = 0;
let playerFrameTimer = 0;
const PLAYER_FRAME_INTERVAL = 8;

export function render(ctx, cameraX, blocks, enemies, boss, player, HUD, isStageCleared, bgImage){

  ctx.clearRect(0,0,960,540);

  // ============================
  // 背景描画
  // ============================
  if(bgImage && bgImage.complete){
    ctx.drawImage(bgImage, -cameraX, 0, bgImage.width, bgImage.height);
  } else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0,0,960,540);
  }

  ctx.save();
  ctx.translate(-cameraX, 0);

  // ============================
  // ブロック描画
  // ============================
  for(const b of blocks){
    const tileCount = Math.ceil(b.w / 48);
    const img = blockImages[b.type ?? 0];
    for(let i=0;i<tileCount;i++){
      ctx.drawImage(img, b.x + i*48, b.y, 48, 48);
    }
  }

  // ============================
  // 敵描画
  // ============================
  for(const e of enemies){
    if(enemySprite.complete){
      ctx.save();
      if(e.dir === 1){
        ctx.translate(e.x + e.w, e.y);
        ctx.scale(-1,1);
        ctx.drawImage(enemySprite, e.frame*ENEMY_FRAME_W,0,ENEMY_FRAME_W,ENEMY_FRAME_H, 0,0,e.w,e.h);
      } else {
        ctx.drawImage(enemySprite, e.frame*ENEMY_FRAME_W,0,ENEMY_FRAME_W,ENEMY_FRAME_H, e.x,e.y,e.w,e.h);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(e.x,e.y,e.w,e.h);
    }
  }

  // ============================
  // ボス描画
  // ============================
  if(boss){
    if(bossSprite.complete){
      ctx.save();
      if(boss.dir === 1){
        ctx.translate(boss.x + boss.w, boss.y);
        ctx.scale(-1,1);
        ctx.drawImage(bossSprite, boss.frame*BOSS_FRAME_W,0,BOSS_FRAME_W,BOSS_FRAME_H, 0,0,boss.w,boss.h);
      } else {
        ctx.drawImage(bossSprite, boss.frame*BOSS_FRAME_W,0,BOSS_FRAME_W,BOSS_FRAME_H, boss.x,boss.y,boss.w,boss.h);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "purple";
      ctx.fillRect(boss.x,boss.y,boss.w,boss.h);
    }
  }

  // ============================
  // プレイヤー描画（★無敵点滅追加★）
  // ============================
  const isInvincible = HUD.invincible === true;

  // アニメーション更新
  if(player.vx !== 0){
    playerFrameTimer++;
    if(playerFrameTimer > PLAYER_FRAME_INTERVAL){
      playerFrameTimer = 0;
      playerFrameIndex = (playerFrameIndex + 1) % PLAYER_FRAME_COUNT;
    }
  } else {
    playerFrameIndex = 0;
  }

  // ★ 無敵中は点滅（100msごとに表示/非表示）
  if(isInvincible){
    const now = performance.now();
    if (Math.floor(now / 100) % 2 === 1) {
      // 奇数フレーム → 描画しない
      // （実際に透明になる）
      ctx.restore();
      drawHUD(ctx, HUD);
      return;
    }
  }

  // 通常描画
  if(player.vx < 0){
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(
      playerSprite,
      PLAYER_FRAME_W*playerFrameIndex, 0,
      PLAYER_FRAME_W, PLAYER_FRAME_H,
      -(player.x+player.w), player.y,
      player.w, player.h
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      playerSprite,
      PLAYER_FRAME_W*playerFrameIndex, 0,
      PLAYER_FRAME_W, PLAYER_FRAME_H,
      player.x, player.y,
      player.w, player.h
    );
  }

  ctx.restore();

  // ============================
  // HUD
  // ============================
  drawHUD(ctx, HUD);

  // ============================
  // ステージクリア
  // ============================
  if(isStageCleared){
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`ステージ ${HUD.stage} クリア！`, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.restore();
  }
}


// ============================
// HUD 描画（Canvas版）
// ============================
function drawHUD(ctx, HUD) {
  ctx.save();

  // 背景
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, ctx.canvas.width, 50);

  ctx.font = "24px 'Press Start 2P', sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const hudText = `Stage ${HUD.stage}   Score ${HUD.score}`;
  ctx.strokeText(hudText, 10, 10);
  ctx.fillText(hudText, 10, 10);

  // Lives（赤ゲージ）
  const lifeBarWidth = 30;
  const lifeBarHeight = 20;
  const spacing = 5;
  const startX = ctx.canvas.width - 10 - (lifeBarWidth + spacing) * HUD.lives;
  const startY = 15;

  for (let i = 0; i < HUD.lives; i++) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(startX + i * (lifeBarWidth + spacing), startY, lifeBarWidth, lifeBarHeight);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(startX + i * (lifeBarWidth + spacing), startY, lifeBarWidth, lifeBarHeight);
  }

  ctx.restore();
}
