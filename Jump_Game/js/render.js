// ========== render.js ==========

// ▼ プレイヤー画像
const playerSprite = new Image();
playerSprite.src = "./images/characters/player.png";

// ▼ アイテム画像（回復）
const healItemSprite = new Image();
healItemSprite.src = "./images/characters/item1.png";

// ▼ アイテム画像（回復）
const liveItemSprite = new Image();
liveItemSprite.src = "./images/characters/item2.png";



// ▼ 敵・ボス画像
import { 
  enemySprite, 
  bossSprite, 
  needleSprite, 
  jumpEnemySprite, 
  flyEnemySprite,
  rushEnemySprite,
  enemyJumperSprite,
  wanderEnemySprite,
  seekerEnemySprite,
  chaserEnemySprite,
  phaserEnemySprite,

} from "./enemy.js";

// ▼ ブロック画像（1〜33）
const blockImages = [];
for (let i = 1; i <= 33; i++) {
  const img = new Image();
  img.src = `./images/characters/block${i}.png`;
  blockImages.push(img);
}

// ===== スプライト情報 =====
const PLAYER_FRAME_W = 34, PLAYER_FRAME_H = 48, PLAYER_FRAME_COUNT = 4;
const ENEMY_FRAME_W  = 34, ENEMY_FRAME_H  = 48, ENEMY_FRAME_COUNT  = 4;
const BOSS_FRAME_W   = 128, BOSS_FRAME_H  = 128;

// ===== アニメ用タイマー =====
let playerFrameIndex = 0;
let playerFrameTimer = 0;
const PLAYER_FRAME_INTERVAL = 8;

/**
 * render
 */
export function render(
  ctx,
  cameraX,
  blocks,
  enemies,
  boss,
  player,
  HUD,
  isStageCleared,
  bgImage
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // ============================
  // 背景描画
  // ============================
  if (bgImage && bgImage.complete) {
    ctx.drawImage(bgImage, -cameraX*0.2, 0, bgImage.width, bgImage.height);
  } else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  ctx.save();
  ctx.translate(-cameraX, 0);





  for (const e of enemies) {
  if (e.visible === false) continue;
  if (e.alive === false) continue; // ★重要

  // =====================
  // 回復アイテム
  // =====================
  if (e.type === "heal") {
    if (healItemSprite.complete) {
      ctx.drawImage(
        healItemSprite,
        e.x,
        e.y,
        e.w,
        e.h
      );
    }
    continue;
  }
    // =====================
  // 回復アイテム
  // =====================
  if (e.type === "live") {
    if (liveItemSprite.complete) {
      ctx.drawImage(
        liveItemSprite,
        e.x,
        e.y,
        e.w,
        e.h
      );
    }
    continue;
  }

  // =====================
  // 通常の敵
  // =====================
  let sprite;
  switch (e.type) {
    case "needle":  sprite = needleSprite; break;
    case "jump":    sprite = jumpEnemySprite; break;
    case "fly":     sprite = flyEnemySprite; break;
    case "rush":    sprite = rushEnemySprite; break;
    case "jumper":  sprite = enemyJumperSprite; break;
    case "wander":  sprite = wanderEnemySprite; break;
    case "seeker":  sprite = seekerEnemySprite; break;
    case "chaser":  sprite = chaserEnemySprite; break;
    case "phaser":  sprite = phaserEnemySprite; break;
    default:        sprite = enemySprite;
  }

  if (!sprite.complete) {
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y, e.w, e.h);
    continue;
  }

  const frame = (e.frame ?? 0) * ENEMY_FRAME_W;

  ctx.save();
  if (e.dir === 1) {
    ctx.translate(e.x + e.w, e.y);
    ctx.scale(-1, 1);
    ctx.drawImage(
      sprite,
      frame, 0,
      ENEMY_FRAME_W, ENEMY_FRAME_H,
      0, 0,
      e.w, e.h
    );
  } else {
    ctx.drawImage(
      sprite,
      frame, 0,
      ENEMY_FRAME_W, ENEMY_FRAME_H,
      e.x, e.y,
      e.w, e.h
    );
  }
  ctx.restore();
}


  // ============================
  // ボス描画
  // ============================
  if (boss && bossSprite.complete) {
    ctx.save();
    if (boss.dir === 1) {
      ctx.translate(boss.x + boss.w, boss.y);
      ctx.scale(-1, 1);
      ctx.drawImage(bossSprite, boss.frame * BOSS_FRAME_W, 0, BOSS_FRAME_W, BOSS_FRAME_H, 0, 0, boss.w, boss.h);
    } else {
      ctx.drawImage(bossSprite, boss.frame * BOSS_FRAME_W, 0, BOSS_FRAME_W, BOSS_FRAME_H, boss.x, boss.y, boss.w, boss.h);
    }
    ctx.restore();
  }
// ============================
// HUD描画
// ============================
function drawHUD(ctx, HUD) {
  ctx.save();

  ctx.font = "24px 'Press Start 2P', sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;

ctx.strokeText(`Stage ${HUD.stage}   Score ${HUD.score}`, 10, 30);
ctx.fillText(`Stage ${HUD.stage}   Score ${HUD.score}`, 10, 30);

  // HP
  if (HUD.hp != null) {
    const y = 70;
    let x = ctx.canvas.width - (HUD.maxHp * 25 + 60);
    ctx.fillStyle = "#0f0";
    ctx.fillText("HP", x, y);
    x += 40;

    for (let i = 0; i < HUD.maxHp; i++) {
      ctx.fillStyle = i < HUD.hp ? "#0f0" : "#555";
      ctx.fillRect(x + i * 25, y, 20, 20);
    }
  }

  // Lives
  if (HUD.lives != null) {
    const y = 40;
    let x = ctx.canvas.width - (HUD.lives * 35 + 70);
    ctx.fillStyle = "#f00";
    ctx.fillText("LIVES", x, y);
    x += 60;

    for (let i = 0; i < HUD.lives; i++) {
      ctx.fillRect(x + i * 35, y, 30, 20);
    }
  }

  ctx.restore();
}

  // ============================
  // プレイヤー描画（無敵点滅）
  // ============================
  if (player.vx !== 0) {
    playerFrameTimer++;
    if (playerFrameTimer > PLAYER_FRAME_INTERVAL) {
      playerFrameTimer = 0;
      playerFrameIndex = (playerFrameIndex + 1) % PLAYER_FRAME_COUNT;
    }
  } else {
    playerFrameIndex = 0;
  }

  const invincible = HUD.invincible === true;
  const blink = invincible && Math.floor(performance.now() / 100) % 2 === 1;

  if (!blink) {
    if (player.vx < 0) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        playerSprite,
        PLAYER_FRAME_W * playerFrameIndex,
        0,
        PLAYER_FRAME_W,
        PLAYER_FRAME_H,
        -(player.x + player.w),
        player.y,
        player.w,
        player.h
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        playerSprite,
        PLAYER_FRAME_W * playerFrameIndex,
        0,
        PLAYER_FRAME_W,
        PLAYER_FRAME_H,
        player.x,
        player.y,
        player.w,
        player.h
      );
    }
  }


  // ============================
  // ブロック描画
  // ============================
  for (const b of blocks) {
    const tileCount = Math.ceil(b.w / 48);
    const img = blockImages[b.type - 1] ?? blockImages[0];

    if (img.complete) {
      for (let i = 0; i < tileCount; i++) {
        ctx.drawImage(img, b.x + i * 48, b.y, 48, 48);
      }
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  }
ctx.restore();


// ============================
// STAGE CLEAR
// ============================
if (isStageCleared) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "48px 'Press Start 2P', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `STAGE ${HUD.stage} CLEAR!`,
    ctx.canvas.width / 2,
    ctx.canvas.height / 2
  );
  ctx.textAlign = "left";
  ctx.restore();
}

// ============================
// GAME OVER
// ============================
if (HUD.lives <= 0) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#ff3333";
  ctx.font = "48px 'Press Start 2P', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "GAME OVER",
    ctx.canvas.width / 2,
    ctx.canvas.height / 2
  );

  ctx.font = "20px 'Press Start 2P', sans-serif";
  ctx.fillStyle = "#fff";


  ctx.textAlign = "left";
  ctx.restore();
}

drawHUD(ctx, HUD);

}