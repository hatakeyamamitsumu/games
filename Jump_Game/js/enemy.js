// ========== enemy.js ==========
import { ENEMY_SPEED, BOSS_SPEED, BOSS_HP } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";

// ▼ 敵スプライト
export const enemySprite = new Image();
enemySprite.src = "./images/characters/enemy1.png";

// ▼ ボススプライト
export const bossSprite = new Image();
bossSprite.src = "./images/characters/boss.png";

// 敵スプライト定数
const ENEMY_FRAME_W = 34;
const ENEMY_FRAME_H = 48;
const ENEMY_FRAME_COUNT = 4;

// ボススプライト定数
const BOSS_FRAME_W = 128;  // 256/2
const BOSS_FRAME_H = 128;
const BOSS_FRAME_COUNT = 2;

const GRAVITY = 0.5; // 敵用の重力
const MAX_FALL_SPEED = 10;

export function updateEnemies(enemies, blocks){
  for(let i = enemies.length - 1; i >= 0; i--){
    const e = enemies[i];

    // --- 横移動 ---
    e.x += e.dir * e.speed;

    // --- 横方向のブロック衝突で反転 ---
    for(const b of blocks){
      if(aabb(e, b)){
        e.dir *= -1;
        e.x += e.dir * 4;
      }
    }

    // --- 重力適用 ---
    e.vy = e.vy ?? 0;
    e.vy += GRAVITY;
    if(e.vy > MAX_FALL_SPEED) e.vy = MAX_FALL_SPEED;
    e.y += e.vy;

    // --- 足場判定 ---
    let onGround = false;
    for(const b of blocks){
      if(e.x + e.w > b.x && e.x < b.x + b.w &&
         e.y + e.h > b.y && e.y + e.h <= b.y + b.h){
        e.y = b.y - e.h;
        e.vy = 0;
        onGround = true;
      }
    }
    e.onGround = onGround;

    // --- 画面外に落ちたら削除 ---
    if(e.y > 600){ // 画面高さより下（適宜変更）
      enemies.splice(i, 1);
      continue;
    }

    // --- アニメ更新 ---
    e._frameTimer = (e._frameTimer ?? 0) + 1;
    const interval = e._frameInterval ?? 8;
    if(e._frameTimer >= interval){
      e._frameTimer = 0;
      e.frame = ((e.frame ?? 0) + 1) % ENEMY_FRAME_COUNT;
    }
  }
}


// ===== 敵踏み判定 =====
export function checkEnemyHit(enemies){
  for(let i=enemies.length-1;i>=0;i--){
    const e = enemies[i];
    if(aabb(player, e)){
      if(player.vy > 0){
        enemies.splice(i,1);
        player.vy = -8;
      } else {
        return "hit";
      }
    }
  }
  return null;
}

// ===== ボス更新 =====
export function updateBoss(boss, blocks){
  if(!boss) return;

  // プレイヤーに向かって移動
  boss.dir = (player.x > boss.x) ? 1 : -1;
  boss.x += boss.dir * boss.speed;

  // ブロックに当たれば反転
  for(const b of blocks){
    if(aabb(boss, b)){
      boss.dir *= -1;
      boss.x += boss.dir * 10;
    }
  }

  // アニメ更新（ボス用）
  boss._frameTimer = (boss._frameTimer ?? 0) + 1;
  const interval = boss._frameInterval ?? 12; // 遅め
  if(boss._frameTimer >= interval){
    boss._frameTimer = 0;
    boss._frame = ((boss._frame ?? 0) + 1) % BOSS_FRAME_COUNT;
  }
}

// ===== ボス判定 =====
export function checkBossHit(boss){
  if(!boss) return null;

  if(aabb(player, boss)){
    if(player.vy > 0){
      boss.hp--;
      player.vy = -12;
      if(boss.hp <= 0) return "dead";
    } else {
      return "hit";
    }
  }
  return null;
}
