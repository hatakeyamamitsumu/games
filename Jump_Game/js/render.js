// ========== render.js ==========

// ▼ プレイヤー画像
const playerSprite = new Image();
playerSprite.src = "./images/characters/player.png";

// ▼ 敵・ボス画像
import { enemySprite, bossSprite, needleSprite, jumpEnemySprite } from "./enemy.js"; // ← jumpEnemySprite追加

// ▼ ブロック画像（3種類）
const blockImages = [];
for (let i = 1; i <= 3; i++) {
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

export function render(ctx, cameraX, blocks, enemies, boss, player, HUD, isStageCleared, bgImage) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // ============================
  // 背景描画
  // ============================
  if (bgImage && bgImage.complete) {
    ctx.drawImage(bgImage, -cameraX, 0, bgImage.width, bgImage.height);
  } else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  ctx.save();
  ctx.translate(-cameraX, 0);

  // ============================
  // ブロック描画
  // ============================
  for (const b of blocks) {
    const tileCount = Math.ceil(b.w / 48);
    const img = blockImages[b.type ?? 0];
    for (let i = 0; i < tileCount; i++) {
      ctx.drawImage(img, b.x + i * 48, b.y, 48, 48);
    }
  }

  // ============================
  // 敵描画
  // ============================
  for (const e of enemies) {
    let sprite, frameW, frameH;
    let frameCount = ENEMY_FRAME_COUNT; // デフォルト

    if (e.type === 'needle') {
      sprite = needleSprite;
      frameW = 34;
      frameH = 48;
      frameCount = 4;
    } else if (e.type === 'jump') {
      sprite = jumpEnemySprite;  // ← 新しい敵用スプライト
      frameW = 34;
      frameH = 48;
      frameCount = 4;
    } else {
      sprite = enemySprite;
      frameW = 34;
      frameH = 48;
      frameCount = 4;
    }

    if (sprite.complete) {
      ctx.save();
      if (e.dir === 1) {
        ctx.translate(e.x + e.w, e.y);
        ctx.scale(-1, 1);
        ctx.drawImage(
          sprite,
          (e.frame ?? 0) * frameW, 0,
          frameW, frameH,
          0, 0, e.w, e.h
        );
      } else {
        ctx.drawImage(
          sprite,
          (e.frame ?? 0) * frameW, 0,
          frameW, frameH,
          e.x, e.y, e.w, e.h
        );
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(e.x, e.y, e.w, e.h);
    }
  }

  // ============================
  // ボス描画
  // ============================
  if (boss) {
    if (bossSprite.complete) {
      ctx.save();
      if (boss.dir === 1) {
        ctx.translate(boss.x + boss.w, boss.y);
        ctx.scale(-1, 1);
        ctx.drawImage(
          bossSprite,
          boss.frame * BOSS_FRAME_W, 0,
          BOSS_FRAME_W, BOSS_FRAME_H,
          0, 0, boss.w, boss.h
        );
      } else {
        ctx.drawImage(
          bossSprite,
          boss.frame * BOSS_FRAME_W, 0,
          BOSS_FRAME_W, BOSS_FRAME_H,
          boss.x, boss.y, boss.w, boss.h
        );
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "purple";
      ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
    }
  }

  // ============================
  // プレイヤー描画（無敵点滅対応）
  // ============================
  const isInvincible = HUD.invincible === true;

  if (player.vx !== 0) {
    playerFrameTimer++;
    if (playerFrameTimer > PLAYER_FRAME_INTERVAL) {
      playerFrameTimer = 0;
      playerFrameIndex = (playerFrameIndex + 1) % PLAYER_FRAME_COUNT;
    }
  } else {
    playerFrameIndex = 0;
  }

  let skipDraw = false;
  if (isInvincible) {
    const now = performance.now();
    if (Math.floor(now / 100) % 2 === 1) skipDraw = true;
  }

  if (!skipDraw) {
    if (player.vx < 0) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        playerSprite,
        PLAYER_FRAME_W * playerFrameIndex, 0,
        PLAYER_FRAME_W, PLAYER_FRAME_H,
        -(player.x + player.w), player.y,
        player.w, player.h
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        playerSprite,
        PLAYER_FRAME_W * playerFrameIndex, 0,
        PLAYER_FRAME_W, PLAYER_FRAME_H,
        player.x, player.y,
        player.w, player.h
      );
    }
  }

  ctx.restore();

  // ============================
  // HUD描画
  // ============================
  drawHUD(ctx, HUD);

  // ============================
  // ステージクリア表示
  // ============================
  if (isStageCleared) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`ステージ ${HUD.stage} クリア！`, ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }

  // ============================
  // ゲームオーバー表示
  // ============================
  if (HUD.lives <= 0) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#FF0000";
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }
}

// ============================
// HUD描画（横一列バージョン）
// ============================
function drawHUD(ctx, HUD) {
  ctx.save();

  // ステージ・スコア表示（左上）
  ctx.font = "24px 'Press Start 2P', sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const hudText = `Stage ${HUD.stage}   Score ${HUD.score}`;
  ctx.strokeText(hudText, 10, 10);
  ctx.fillText(hudText, 10, 10);

  // ===== HP（右上 横一列） =====
  if (HUD.hp !== undefined && HUD.maxHp !== undefined) {
    const barWidth = 20;
    const barHeight = 20;
    const spacing = 5;

    ctx.font = "18px 'Press Start 2P', sans-serif";

    const barsWidth = HUD.maxHp * (barWidth + spacing);
    const labelWidth = 40;
    const totalWidth = barsWidth + labelWidth;

    let x = ctx.canvas.width - totalWidth - 10;
    const y = 70;

    ctx.fillStyle = "#00FF00";
    ctx.fillText("HP", x, y);
    x += labelWidth;

    for (let i = 0; i < HUD.maxHp; i++) {
      ctx.fillStyle = i < HUD.hp ? "#00FF00" : "#555555";
      ctx.fillRect(x + i * (barWidth + spacing), y, barWidth, barHeight);
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(x + i * (barWidth + spacing), y, barWidth, barHeight);
    }
  }

  // ===== Lives（右上 横一列） =====
  if (HUD.lives !== undefined) {
    const barWidth = 30;
    const barHeight = 20;
    const spacing = 5;
    ctx.font = "18px 'Press Start 2P', sans-serif";
    const totalWidth = HUD.lives * (barWidth + spacing) + 50;
    let x = ctx.canvas.width - totalWidth - 10;
    const y = 40;
    ctx.fillStyle = "#FF0000";
    ctx.fillText("LIVES", x, y);
    x += 60;

    for (let i = 0; i < HUD.lives; i++) {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(x + i * (barWidth + spacing), y, barWidth, barHeight);
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(x + i * (barWidth + spacing), y, barWidth, barHeight);
    }
  }

  ctx.restore();
}
