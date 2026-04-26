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
// ▼ ステージ別・近景背景
const bgNearImages = [
  null, // stage 0 は使わない
  (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near1.png";
    return img;
  })(),
  (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near2.png";
    return img;
  })(),
  (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near3.png";
    return img;
  })(),
    (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near4.png";
    return img;
  })(),
    (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near5.png";
    return img;
  })(),
    (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near6.png";
    return img;
  })(),
    (() => {
    const img = new Image();
    img.src = "./images/graphics/background_near7.png";
    return img;
  })(),
];
// 例：render.js 上部でロード済み
const bgNearNearImages = [
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near1.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near2.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near3.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near4.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near5.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near6.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/background_near_near7.png"; return i; })(),
];

//前景
const fgImages = [
  null,
  (() => { const i = new Image(); i.src = "./images/graphics/foreground1.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/foreground2.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/foreground3.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/foreground4.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/foreground5.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/foreground6.png"; return i; })(),
  (() => { const i = new Image(); i.src = "./images/graphics/foreground7.png"; return i; })(),
];

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
  thunderEnemySprite,
  ballEnemySprite,
  hover8EnemySprite,
  phasePlatformEnemySprite,
  smokeBallEnemySprite,
  smokeFloatEnemySprite
} from "./enemy.js";

// ▼ ブロック画像（1〜59）
const blockImages = [];
for (let i = 1; i <= 59; i++) {
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
  bgImage,
  stage
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

// ============================
// 背景描画（3重スクロール）
// ============================

// 共通：横タイル描画
function drawParallax(image, rate) {
  if (!image || !image.complete) return;

  const w = image.width;
  const h = image.height;

  let x = (-cameraX * rate) % w;
  if (x > 0) x -= w;

  for (; x < ctx.canvas.width; x += w) {
    ctx.drawImage(image, x, 0, w, h);
  }
}

// ▼ 遠景
if (bgImage && bgImage.complete) {
  drawParallax(bgImage, 0.05);
} else {
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// ▼ 中間近景（これが消えてた原因）
const bgNear = bgNearImages[stage];
drawParallax(bgNear, 0.2);

// ▼ 最近景（さらに手前）
const bgNearNear = bgNearNearImages[stage - 1];
drawParallax(bgNearNear, 1.0);
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
    case "thunder": sprite = thunderEnemySprite; break;
    case "ball":    sprite = ballEnemySprite; break;
    case "hover8":  sprite = hover8EnemySprite; break;
    case "phasePlatform":  sprite = phasePlatformEnemySprite; break;
    case "smokeBall":  sprite = smokeBallEnemySprite; break;
    case "smokeFloat":  sprite = smokeFloatEnemySprite; break;

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
  const scale = 1.0;

  const drawW = boss.w * scale;
  const drawH = boss.h * scale;
  const drawY = boss.y - (drawH - boss.h) / 2;

  ctx.save();

  if (boss.dir === 1) {
    ctx.translate(boss.x + boss.w / 2, 0);
    ctx.scale(-1, 1);

    const drawX = -drawW / 2;

    ctx.drawImage(
      bossSprite,
      boss.frame * BOSS_FRAME_W,
      0,
      BOSS_FRAME_W,
      BOSS_FRAME_H,
      drawX,
      drawY,
      drawW,
      drawH
    );

  } else {
    const drawX = boss.x - (drawW - boss.w) / 2;

    ctx.drawImage(
      bossSprite,
      boss.frame * BOSS_FRAME_W,
      0,
      BOSS_FRAME_W,
      BOSS_FRAME_H,
      drawX,
      drawY,
      drawW,
      drawH
    );
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

ctx.strokeText(`Stage ${HUD.stage}   Score ${HUD.score}`, 130, 30);
ctx.fillText(`Stage ${HUD.stage}   Score ${HUD.score}`, 130, 30);

  // HP
  if (HUD.hp != null) {
    const y = 70;
    let x = ctx.canvas.width -120 - (HUD.maxHp * 25 + 60);
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
    let x = ctx.canvas.width -120 - (HUD.lives * 35 + 70);
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
// ダメージビープ音
// ============================
let audioCtx = null;

function playDamageBeep() {

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const now = audioCtx.currentTime;

  // 波形
  osc.type = "square";

  // 少し高めからスタートして下げる
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

gain.gain.setValueAtTime(0.3, now);
gain.gain.exponentialRampToValueAtTime(0.05, now + 0.3);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}


// ============================
// プレイヤー描画（無敵点滅＋ダメージ音検知）
// ============================

// ▼ 無敵開始検知用
if (!player._prevInvincible) player._prevInvincible = false;

// 無敵開始の瞬間を検出
if (HUD.invincible && !player._prevInvincible) {
  playDamageBeep();
}

player._prevInvincible = HUD.invincible;


// ============================
// プレイヤー描画
// ============================

// ---------- アニメ更新 ----------
if (player.vx !== 0) {
  playerFrameTimer++;
  if (playerFrameTimer > PLAYER_FRAME_INTERVAL) {
    playerFrameTimer = 0;
    playerFrameIndex = (playerFrameIndex + 1) % PLAYER_FRAME_COUNT;
  }
} else {
  playerFrameIndex = 0;
}


// ---------- 無敵点滅 ----------
const invincible = HUD.invincible === true;
const blink =
  invincible &&
  Math.floor(performance.now() / 100) % 2 === 1;


// ============================
// スプライト描画
// ============================
if (!player.isHidden && !blink) {

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
// 白フラッシュ（消失・出現）
// ============================
if (player.flashTimer > 0) {
  ctx.save();

ctx.globalCompositeOperation = "lighter";

const cx = player.x + player.w / 2;
const cy = player.y + player.h / 2;
const r  = player.w * 1.2;

// ★ 放射グラデーション
const grad = ctx.createRadialGradient(
  cx, cy, r * 0.1,   // 内側
  cx, cy, r          // 外側
);

grad.addColorStop(0, "rgba(255,255,255,0.9)");
grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
grad.addColorStop(1, "rgba(255,255,255,0)");

ctx.fillStyle = grad;

ctx.beginPath();
ctx.arc(cx, cy, r, 0, Math.PI * 2);
ctx.fill();

ctx.restore();
}



// ============================
// ブロック描画
// ============================
for (const b of blocks) {

  // ▼ バネだけ特別処理
  if (b.type === 6) {

    let offset = 0;

    if (b.compress > 0) {
      offset = 8; // 縮む量
    }

    ctx.drawImage(
      blockImages[b.type - 1],
      b.x,
      b.y + offset,
      48,
      48 - offset
    );

    continue; // ← 他の処理をスキップ
  }

  // ▼ 通常ブロック
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
// 最前面スクロール
// ============================
const fg = fgImages[stage];

if (fg && fg.complete) {

  const w = fg.width;

  let x = (-cameraX) % w;
  if (x > 0) x -= w;

  for (; x < ctx.canvas.width; x += w) {
    ctx.drawImage(fg, x, 0);
  }
}
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