// ========== enemy.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";

// ===== スプライト =====
export const enemySprite = new Image();
enemySprite.src = "./images/characters/enemy1.png";

export const needleSprite = new Image();
needleSprite.src = "./images/characters/needle.png";

export const jumpEnemySprite = new Image();
jumpEnemySprite.src = "./images/characters/enemy2.png";

export const flyEnemySprite = new Image();
flyEnemySprite.src = "./images/characters/enemy3.png";

export const rushEnemySprite = new Image();
rushEnemySprite.src = "./images/characters/enemy4.png";

export const enemyJumperSprite = new Image();
enemyJumperSprite.src = "./images/characters/enemy5.png";

export const wanderEnemySprite = new Image();
wanderEnemySprite.src = "./images/characters/enemy6.png";

export const seekerEnemySprite = new Image();
seekerEnemySprite.src = "./images/characters/enemy7.png";

export const chaserEnemySprite = new Image();
chaserEnemySprite.src = "./images/characters/enemy8.png";

export const phaserEnemySprite = new Image();
phaserEnemySprite.src = "./images/characters/enemy9.png";

export const bossSprite = new Image();
bossSprite.src = "./images/characters/boss.png";


export const healItemSprite = new Image();
healItemSprite.src = "./images/characters/item1.png";

export const liveItemSprite = new Image();
liveItemSprite.src = "./images/characters/item2.png";
// ===== 定数 =====
const ENEMY_FRAME_COUNT = 4;
const BOSS_FRAME_COUNT = 2;

// ===== 敵更新 =====
export function updateEnemies(enemies, blocks) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    // --------------------------------
    // fly：ふわふわ上下移動
    // --------------------------------
    if (e.type === "fly") {
      e.dir = -1;
      e.x += e.dir * e.speed;

      e.vy = e.vy ?? 1;
      e.y += e.vy;

      for (const b of blocks) {
        if (!aabb(e, b)) continue;
        const top = (e.y + e.h) - b.y;
        const bottom = (b.y + b.h) - e.y;
        if (top < bottom && e.vy > 0) { e.y = b.y - e.h; e.vy *= -1; }
        else if (bottom <= top && e.vy < 0) { e.y = b.y + b.h; e.vy *= -1; }
      }

      if (e.y < 0 || e.y + e.h > 480) e.vy *= -1;
      if (e.x + e.w < 0) enemies.splice(i, 1);

      animate(e);
      continue;
    }

    // --------------------------------
    // jump：跳ねる
    // --------------------------------
    if (e.type === "jump") {
      e.vy = (e.vy ?? 0) + 0.5;
      if (e.vy > 10) e.vy = 10;

      e.x += e.dir * e.speed;
      e.y += e.vy;

      for (const b of blocks) {
        if (!aabb(e, b)) continue;
        const overlaps = {
          l: (e.x + e.w) - b.x,
          r: (b.x + b.w) - e.x,
          t: (e.y + e.h) - b.y,
          b: (b.y + b.h) - e.y,
        };
        const m = Math.min(overlaps.l, overlaps.r, overlaps.t, overlaps.b);
        if (m === overlaps.t) { e.y = b.y - e.h; e.vy = -8; }
        else if (m === overlaps.l || m === overlaps.r) e.dir *= -1;
      }

      animate(e);
      continue;
    }

    // --------------------------------
    // needle：固定
    // --------------------------------
    if (e.type === "needle") continue;

// --------------------------------
// rush：待って突進
// --------------------------------
if (e.type === "rush") {
  e.wait = e.wait ?? 120;

  e.dir = -1; // ★ 常に左向き

  if (e.wait > 0) {
    e.wait--;
  } else {
    e.x -= e.speed;
  }

  if (e.x + e.w < 0) enemies.splice(i, 1);

  animate(e);
  continue;
}



        // ------------------------------------------------
    // ジャンプ繰り返し敵（jumper）
    // ------------------------------------------------
    else if (e.type === "jumper") {
      e.vy = e.vy ?? 0;
      e.baseY = e.baseY ?? e.y;
      e.vy += 0.5;
      if (e.vy > 10) e.vy = 10;
      e.y += e.vy;

      if (e.y >= e.baseY) {
        e.y = e.baseY;
        e.vy = -10;
      }

      if (e.y > 600) {
        enemies.splice(i, 1);
        continue;
      }

      e._frameTimer = (e._frameTimer ?? 0) + 1;
      const interval = e._frameInterval ?? 8;
      if (e._frameTimer >= interval) {
        e._frameTimer = 0;
        e.frame = ((e.frame ?? 0) + 1) % ENEMY_FRAME_COUNT;
      }

      continue;
    }
    // --------------------------------
    // wander：徘徊
    // --------------------------------
    if (e.type === "wander") {
      e.dir = e.dir ?? (Math.random() < 0.5 ? -1 : 1);
      e.speed = e.speed ?? 1;
      e.timer = (e.timer ?? 60) - 1;

      if (e.timer <= 0) {
        e.dir = Math.random() < 0.5 ? -1 : 1;
        e.timer = 40 + Math.random() * 60;
      }

      e.x += e.dir * e.speed;

      e.vy = (e.vy ?? 0) + 0.5;
      e.y += e.vy;

      for (const b of blocks) {
        if (aabb(e, b)) {
          e.y = b.y - e.h;
          e.vy = 0;
        }
      }

      if (e.y > 600) enemies.splice(i, 1);
      animate(e);
      continue;
    }

    // --------------------------------
    // seeker：横追尾＋浮遊
    // --------------------------------
    if (e.type === "seeker") {
      const cx = player.x + player.w / 2;
      const ex = e.x + e.w / 2;
      e.x += (cx > ex ? 1 : -1) * (e.speed ?? 1);
      e.dir = cx >= ex ? 1 : -1;

      e.float = (e.float ?? 0) + 0.05;
      e.y += Math.sin(e.float) * 2;

      if (e.y > 600 || e.y < -100) enemies.splice(i, 1);
      animate(e);
      continue;
    }
// --------------------------------
// phaser：消えたり現れたりする敵
// --------------------------------
if (e.type === "phaser") {

  // 初期化
  e.visible = e.visible ?? true;
  e.timer   = e.timer   ?? 90;
  e.speed   = e.speed   ?? 1;
  e.dir     = e.dir     ?? -1;

  // ★ ここが超重要：必ず毎フレーム減らす
  e.timer--;

  // 可視状態の切り替え
  if (e.timer <= 0) {
    e.visible = !e.visible;
    e.timer = 90;
  }

  // 見えているときだけ移動
  if (e.visible) {
    e.x += e.dir * e.speed;
  }

  // 壁反転（visible関係なしでもOK）
  for (const b of blocks) {
    if (aabb(e, b)) {
      e.dir *= -1;
      e.x += e.dir * 4;
    }
  }

  // 画面外削除
  if (e.x < -200 || e.x > 2600) {
    enemies.splice(i, 1);
  }

  // アニメは見えている時だけ
  if (e.visible) {
    animate(e);
  }

  continue;
}


    // --------------------------------
    // chaser：全方向追尾
    // --------------------------------
    if (e.type === "chaser") {
      const px = player.x + player.w / 2;
      const py = player.y + player.h / 2;
      const ex = e.x + e.w / 2;
      const ey = e.y + e.h / 2;

      const dx = px - ex;
      const dy = py - ey;
      const d = Math.hypot(dx, dy) || 1;

      e.speed = e.speed ?? 1.3;
      e.x += (dx / d) * e.speed;
      e.y += (dy / d) * e.speed;
      e.dir = dx >= 0 ? 1 : -1;

      if (e.x < -200 || e.x > 2600 || e.y < -200 || e.y > 800)
        enemies.splice(i, 1);

      animate(e);
      continue;
    }
// ★ 回復アイテム
    if (e.type === "heal") {
      // 動かない・重力なし
      continue;
    }
// ★ 回復アイテム
    if (e.type === "live") {
      // 動かない・重力なし
      continue;
    }
// ------------------------------------------------
    // 通常敵
    // ------------------------------------------------
    else {
      e.x += e.dir * e.speed;

      for (const b of blocks) {
        if (aabb(e, b)) { e.dir *= -1; e.x += e.dir * 4; }
      }

      e.vy = e.vy ?? 0;
      e.vy += 0.5;
      if (e.vy > 10) e.vy = 10;
      e.y += e.vy;

      let onGround = false;
      for (const b of blocks) {
        if (e.x + e.w > b.x && e.x < b.x + b.w &&
            e.y + e.h > b.y && e.y + e.h <= b.y + b.h) {
          e.y = b.y - e.h;
          e.vy = 0;
          onGround = true;
        }
      }
      e.onGround = onGround;

      if (e.type === undefined && e.y > 600) { enemies.splice(i, 1); continue; }
    }

    // --- アニメ更新 ---
    e._frameTimer = (e._frameTimer ?? 0) + 1;
    const interval = e._frameInterval ?? 8;
    if (e._frameTimer >= interval) {
      e._frameTimer = 0;
      e.frame = ((e.frame ?? 0) + 1) % ENEMY_FRAME_COUNT;
    }
  }
}

// ===== 共通アニメ =====
function animate(e) {
  e._frameTimer = (e._frameTimer ?? 0) + 1;
  if (e._frameTimer >= (e._frameInterval ?? 8)) {
    e._frameTimer = 0;
    e.frame = ((e.frame ?? 0) + 1) % ENEMY_FRAME_COUNT;
  }
}


// ==================================================
// 敵踏み判定
// ==================================================
export function checkEnemyHit(enemies) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    // 見えない敵は当たり判定なし
    if (e.visible === false) continue;

    if (aabb(player, e)) {

      // ============================
      // 回復アイテム
      // ============================
      if (e.type === "heal") {
        player.hp = Math.min(player.hp + 1, player.maxHp);
        enemies.splice(i, 1);   // 消す
        return null;            // ダメージ扱いにしない
      }
      if (e.type === "live") {
        player.hp = Math.min(player.hp + 5, player.maxHp);
        enemies.splice(i, 1);   // 消す
        return null;            // ダメージ扱いにしない
      }

      // ============================
      // 上から踏んだ判定
      // ============================
      if (player.vy > 0) {
        if (e.type === "needle") return "hit";

        if (e.type === "jumper") {
          player.vy = -10;
          continue;
        }

        enemies.splice(i, 1);
        player.vy = -10;
        continue;
      }

      // ============================
      // 横・下から当たった
      // ============================
      return "hit";
    }
  }
  return null;
}



// ===== ボス更新 =====
export function updateBoss(boss, blocks) {
  if (!boss) return;

  boss.dir = (player.x > boss.x) ? 1 : -1;
  boss.x += boss.dir * boss.speed;

  for (const b of blocks) {
    if (aabb(boss, b)) { boss.dir *= -1; boss.x += boss.dir * 10; }
  }

  boss._frameTimer = (boss._frameTimer ?? 0) + 1;
  const interval = boss._frameInterval ?? 12;
  if (boss._frameTimer >= interval) {
    boss._frameTimer = 0;
    boss._frame = ((boss._frame ?? 0) + 1) % BOSS_FRAME_COUNT;
  }
}

// ===== ボス当たり判定 =====
export function checkBossHit(boss) {
  if (!boss) return null;

  if (aabb(player, boss)) {
    if (player.vy > 0) {
      boss.hp--;
      player.vy = -12;
      if (boss.hp <= 0) return "dead";
    } else {
      return "hit";
    }
  }
  return null;
}