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

export const flyEnemySprite = new Image();        // 空中ふわふわ敵
flyEnemySprite.src = "./images/characters/enemy3.png";

export const rushEnemySprite = new Image();       // 新しいrush敵
rushEnemySprite.src = "./images/characters/enemy4.png";

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
    // 空中をふらふら飛ぶ敵（fly）
    // ------------------------------------------------
    if (e.type === "fly") {
      e.dir = -1;
      e.x += e.dir * e.speed;

      // 画面外で削除
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
    // 新しいrush敵
    // ------------------------------------------------
    else if (e.type === "rush") {
      // 初回出現で停止
      e.wait = e.wait ?? 120; // 60フレーム=1秒
      if (e.wait > 0) {
        e.wait--;
      } else {
        // 左に高速移動
        e.x -= e.speed;
      }

      // 画面外で削除
      if (e.x + e.w < 0) {
        enemies.splice(i, 1);
        continue;
      }
    }

    // ------------------------------------------------
    // 通常の歩く敵
    // ------------------------------------------------
    else {
      e.x += e.dir * e.speed;

      for (const b of blocks) {
        if (aabb(e, b)) {
          e.dir *= -1;
          e.x += e.dir * 4;
        }
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
    }

    // ▼通常敵のみ 落下削除
    if (e.type === undefined && e.y > 600) {
      enemies.splice(i, 1);
      continue;
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
    if (aabb(boss, b)) {
      boss.dir *= -1;
      boss.x += boss.dir * 10;
    }
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
