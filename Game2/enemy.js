import { ctx, canvas, GROUND_Y, worldSpeed } from "./globals.js";

const enemyImages = {
  type1: new Image(),
  type2: new Image(),
  type3: new Image(),
  boss: new Image(),
};

enemyImages.type1.src = "./images/characters/enemy1.png";
enemyImages.type2.src = "./images/characters/enemy2.png";
enemyImages.type3.src = "./images/characters/enemy3.png";
enemyImages.boss.src  = "./images/characters/boss.png";

export const enemies = [];

// 敵タイプごとの設定
const ENEMY_TYPES = {
  type1: { width: 34, height: 48, frames: 4, frameInterval: 8, speed: 1.0, score: 10, canBeStomped: true },
  type2: { width: 34, height: 48, frames: 4, frameInterval: 8, speed: 0.8, score: 20, canBeStomped: true },
  type3: { width: 34, height: 48, frames: 4, frameInterval: 8, speed: 1.2, score: 15, canBeStomped: false }, // 踏んでも倒せない
  boss:  { width: 128, height: 128, frames: 2, frameInterval: 20, speed: 0.4, hp: 20, score: 50, canBeStomped: false },
};

export function spawnEnemy(type = null, customY = null) {
  const keys = Object.keys(ENEMY_TYPES);
  const selectedType = type || keys[Math.floor(Math.random() * keys.length)];
  const cfg = ENEMY_TYPES[selectedType];

  let enemyY = customY !== null ? customY : GROUND_Y - cfg.height;
  if (selectedType !== "boss" && customY === null) enemyY = 70;

  enemies.push({
    type: selectedType,
    x: canvas.width + 50,
    y: enemyY,
    baseY: enemyY,
    w: cfg.width,
    h: cfg.height,
    frame: 0,
    frameTimer: 0,
    hp: cfg.hp || 1,
    alive: true,
    attackTimer: 0,
    scoreValue: cfg.score,
    canBeStomped: cfg.canBeStomped,  // ここで設定
  });
}


export function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const cfg = ENEMY_TYPES[e.type];

    if (!e.alive) {
      enemies.splice(i, 1);
      continue;
    }

    e.x -= worldSpeed * cfg.speed;

    if (e.type === "boss") {
      e.attackTimer++;
      e.y = e.baseY - Math.sin(e.attackTimer / 30) * 20;
    }

    e.frameTimer++;
    if (e.frameTimer >= cfg.frameInterval) {
      e.frameTimer = 0;
      e.frame = (e.frame + 1) % cfg.frames;
    }

    if (e.x + e.w < 0) enemies.splice(i, 1);
  }
}

export function drawEnemies() {
  for (const e of enemies) {
    const cfg = ENEMY_TYPES[e.type];
    const img = enemyImages[e.type];
    if (!img.complete) continue;

    ctx.drawImage(img, e.frame * cfg.width, 0, cfg.width, cfg.height, e.x, e.y, e.w, e.h);
  }
}
