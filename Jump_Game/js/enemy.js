// ========== enemy.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";

// ▼ スプライト
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

export const bossSprite = new Image();
bossSprite.src = "./images/characters/boss.png";

// ===== フレーム定数 =====
const ENEMY_FRAME_COUNT = 4;
const BOSS_FRAME_COUNT = 2;

// ===== 敵更新 =====
export function updateEnemies(enemies, blocks) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    // ------------------------------------------------
    // 空中をふわふわ飛ぶ敵（fly）
    // ------------------------------------------------
    if (e.type === "fly") {
      e.dir = -1;
      e.x += e.dir * e.speed;

      if (e.x + e.w < 0 || e.x > 2400) {
        enemies.splice(i, 1);
        continue;
      }

      e.vy = e.vy ?? 1;
      e.y += e.vy;

      for (const b of blocks) {
        if (!aabb(e, b)) continue;
        const overlapTop = (e.y + e.h) - b.y;
        const overlapBottom = (b.y + b.h) - e.y;

        if (overlapTop < overlapBottom && e.vy > 0) {
          e.y = b.y - e.h;
          e.vy *= -1;
        } else if (overlapBottom <= overlapTop && e.vy < 0) {
          e.y = b.y + b.h;
          e.vy *= -1;
        }
      }

      if (e.y < 0) { e.y = 0; e.vy *= -1; }
      else if (e.y + e.h > 480) { e.y = 480 - e.h; e.vy *= -1; }
    }

    // ------------------------------------------------
    // 跳ねる敵（jump）
    // ------------------------------------------------
    else if (e.type === "jump") {
      e.vy = e.vy ?? 0;
      e.vy += 0.5;
      if (e.vy > 10) e.vy = 10;

      e.x += e.dir * e.speed;
      e.y += e.vy;

      for (const b of blocks) {
        if (!aabb(e, b)) continue;

        const overlapLeft   = (e.x + e.w) - b.x;
        const overlapRight  = (b.x + b.w) - e.x;
        const overlapTop    = (e.y + e.h) - b.y;
        const overlapBottom = (b.y + b.h) - e.y;

        const min = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (min === overlapTop) { e.y = b.y - e.h; e.vy = -8; }
        else if (min === overlapBottom) { e.y = b.y + b.h; if (e.vy < 0) e.vy = 0; }
        else if (min === overlapLeft) { e.x = b.x - e.w; e.dir *= -1; }
        else if (min === overlapRight) { e.x = b.x + b.w; e.dir *= -1; }
      }
    }

    // ------------------------------------------------
    // 針（needle）＝固定
    // ------------------------------------------------
    else if (e.type === "needle") {
      // 動かない
    }

    // ------------------------------------------------
    // rush敵
    // ------------------------------------------------
    else if (e.type === "rush") {
      e.wait = e.wait ?? 120;
      if (e.wait > 0) e.wait--;
      else e.x -= e.speed;

      if (e.x + e.w < 0) {
        enemies.splice(i, 1);
        continue;
      }
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

    // ------------------------------------------------
    // wander敵
    // ------------------------------------------------
    else if (e.type === "wander") {
      e.vy = e.vy ?? 0;
      e.state = e.state ?? "walk";
      e.timer = e.timer ?? 60;
      e.dir = e.dir ?? (Math.random() < 0.5 ? -1 : 1);
      e.speed = e.speed ?? 1;

      e.timer--;
      if (e.timer <= 0) {
        const r = Math.random();
        if (r < 0.6) { e.state = "walk"; e.dir = (Math.random() < 0.5 ? -1 : 1); e.timer = 40 + Math.random() * 60; }
        else { e.state = "stop"; e.timer = 20 + Math.random() * 40; }
      }

      if (e.state === "walk") e.x += e.dir * e.speed;

      for (const b of blocks) {
        if (aabb(e, b)) { e.dir *= -1; e.x += e.dir * 3; }
      }

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

      if (e.y > 600) { enemies.splice(i, 1); continue; }
    }

    // ------------------------------------------------
    // seeker敵
    // ------------------------------------------------
    else if (e.type === "seeker") {
      const chaseSpeed = e.speed ?? 1;
      const floatAmplitude = 10;
      const floatSpeed = 0.05;

      // 水平方向追尾
      if (player.x + player.w/2 > e.x + e.w/2) e.x += chaseSpeed;
      else if (player.x + player.w/2 < e.x + e.w/2) e.x -= chaseSpeed;

      // 進行方向
      e.dir = (player.x + player.w/2 >= e.x + e.w/2) ? 1 : -1;

      // Y方向重力＋ふわふわ
      e.vy = e.vy ?? 0;
      e.vy += 0.5;
      if (e.vy > 10) e.vy = 10;

      e.floatOffset = e.floatOffset ?? Math.random() * 1000;
      e.y += e.vy + Math.sin(e.floatOffset) * floatAmplitude;
      e.floatOffset += floatSpeed;

      // ブロック衝突判定
      for (const b of blocks) {
        if (!aabb(e, b)) continue;

        const overlapLeft   = (e.x + e.w) - b.x;
        const overlapRight  = (b.x + b.w) - e.x;
        const overlapTop    = (e.y + e.h) - b.y;
        const overlapBottom = (b.y + b.h) - e.y;
        const min = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (min === overlapTop) { e.y = b.y - e.h; e.vy = 0; }
        else if (min === overlapBottom) { e.y = b.y + b.h; if (e.vy < 0) e.vy = 0; }
        else if (min === overlapLeft) { e.x = b.x - e.w; }
        else if (min === overlapRight) { e.x = b.x + b.w; }
      }

      // 画面外で削除
      if (e.y > 600 || e.y < -50) { enemies.splice(i, 1); continue; }

      // アニメ更新
      e._frameTimer = (e._frameTimer ?? 0) + 1;
      const interval = e._frameInterval ?? 8;
      if (e._frameTimer >= interval) {
        e._frameTimer = 0;
        e.frame = ((e.frame ?? 0) + 1) % ENEMY_FRAME_COUNT;
      }

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

// ===== 敵踏み判定 =====
export function checkEnemyHit(enemies) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (aabb(player, e)) {
      if (player.vy > 0) {
        if (e.type === "needle") return "hit";

        if (e.type === "jumper") { player.vy = -10; continue; }

        enemies.splice(i, 1);
        player.vy = -10;
        continue;
      }
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