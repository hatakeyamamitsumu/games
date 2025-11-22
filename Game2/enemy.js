import { ctx, canvas, GROUND_Y, worldSpeed,isScrolling } from "./globals.js";

// =======================
// 画像読み込み
// =======================
const enemyImages = {
  type1: new Image(),
  type2: new Image(),
  type3: new Image(),
  boss: new Image(),
  block: new Image(),
};

enemyImages.type1.src = "./images/characters/enemy1.png";
enemyImages.type2.src = "./images/characters/enemy2.png";
enemyImages.type3.src = "./images/characters/enemy3.png";
enemyImages.boss.src  = "./images/characters/boss.png";
enemyImages.block.src = "./images/characters/block1.png";

// =======================
// 敵リスト
// =======================
export const enemies = [];

// =======================
// 敵タイプ設定
// =======================
const ENEMY_TYPES = {
  type1: { width: 34, height: 48, frames: 4, frameInterval: 8, speed: 1.0, score: 10, canBeStomped: true },
  type2: { width: 34, height: 48, frames: 4, frameInterval: 8, speed: 0.8, score: 20, canBeStomped: true },
  type3: { width: 34, height: 48, frames: 4, frameInterval: 8, speed: 1.2, score: 15, canBeStomped: false },
  boss:  { width: 128, height: 128, frames: 2, frameInterval: 20, speed: 0.4, hp: 20, score: 50, canBeStomped: false },

  // ★ block は「速度0」「固定物」として扱う
  block: { width: 48, height: 48, frames: 1, frameInterval: 0, speed: 0, canBeStomped: false },
};

// =======================
// 敵生成
// =======================
export function spawnEnemy(type = "type1", customY = null, stageX = null) {
  const cfg = ENEMY_TYPES[type];
  if (!cfg) return;

  const x = stageX !== null ? stageX : canvas.width + 50;
  const y = customY !== null ? customY : GROUND_Y - cfg.height;

  enemies.push({
    type,
    x,
    y,
    baseY: y,
    w: cfg.width,
    h: cfg.height,
    frame: 0,
    frameTimer: 0,
    hp: cfg.hp || 1,
    alive: true,
    attackTimer: 0,
    scoreValue: cfg.score,
    canBeStomped: cfg.canBeStomped,
  });
}

// =======================
// 敵更新（ワールド座標）
// =======================
// スクロール中かどうかのフラグを作る


export function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const cfg = ENEMY_TYPES[e.type];

    if (!e.alive) {
      enemies.splice(i, 1);
      continue;
    }

    // ★ ブロック以外は自力移動
    if (e.type !== "block") {
      e.x -= cfg.speed;         // 自力移動

      if (isScrolling) {
        e.x -= worldSpeed*10;      // ★ スクロール中だけ追加移動
      }
    }

    // ボスの上下移動
    if (e.type === "boss") {
      e.attackTimer++;
      e.y = e.baseY - Math.sin(e.attackTimer / 30) * 20;
    }

    // アニメーション
    if (cfg.frames > 1) {
      e.frameTimer++;
      if (e.frameTimer >= cfg.frameInterval) {
        e.frameTimer = 0;
        e.frame = (e.frame + 1) % cfg.frames;
      }
    }

    // 画面外削除
    if (e.x + e.w < 0 && e.type !== "block") {
      enemies.splice(i, 1);
    }
  }
}

export function drawEnemies(playerX = 0) {
  for (const e of enemies) {
    const cfg = ENEMY_TYPES[e.type];
    const img = enemyImages[e.type];

    if (!img.complete) continue;

    const drawX = e.x - playerX;

    ctx.drawImage(
      img,
      e.frame * cfg.width, 0, cfg.width, cfg.height,
      drawX, e.y, e.w, e.h
    );
  }
}








export { enemyImages };
