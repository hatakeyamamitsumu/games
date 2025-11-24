import { ENEMY_SPEED, BOSS_SPEED } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";

// ===== 敵スプライト =====
export const enemySprite = new Image();
enemySprite.src = "./images/characters/enemy1.png";

// スプライト定数
const FRAME_W = 34;
const FRAME_H = 48;
const FRAME_COUNT = 4;

// ===== 敵の移動とアニメ更新 =====
export function updateEnemies(enemies, blocks){
  for(const e of enemies){
    // 移動
    e.x += e.dir * e.speed;

    // ブロックに当たると反転
    for(const b of blocks){
      if(aabb(e,b)){
        e.dir *= -1;
        e.x += e.dir * 4;
      }
    }

    // アニメ更新
    e._frameTimer = (e._frameTimer ?? 0) + 1;
    const interval = e._frameInterval ?? 8;
    if(e._frameTimer >= interval){
      e._frameTimer = 0;
      e.frame = ((e.frame ?? 0) + 1) % FRAME_COUNT;
    }
  }
}

// ===== プレイヤーとの当たり判定 =====
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

// ===== ボス移動 =====
export function updateBoss(boss, blocks){
  if(!boss) return;

  boss.dir = (player.x > boss.x) ? 1 : -1;
  boss.x += boss.dir * boss.speed;

  for(const b of blocks){
    if(aabb(boss, b)){
      boss.dir *= -1;
      boss.x += boss.dir * 10;
    }
  }
}

// ===== ボス当たり判定 =====
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

// ===== 敵作成用補助 =====
export function makeEnemy(x, y, opts = {}){
  return {
    x, y,
    w: opts.w ?? FRAME_W,
    h: opts.h ?? FRAME_H,
    dir: opts.dir ?? -1,
    speed: opts.speed ?? ENEMY_SPEED,
    frame: 0,
    _frameTimer: 0,
    _frameInterval: opts.frameInterval ?? 8
  };
}
