// ========== enemy.js ==========
import { ENEMY_SPEED, BOSS_SPEED } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";

export function updateEnemies(enemies, blocks){
  for(const e of enemies){
    e.x += e.dir * e.speed;

    // ブロックに当たると反転
    for(const b of blocks){
      if(aabb(e,b)){
        e.dir *= -1;
        e.x += e.dir * 4;
      }
    }
  }
}

export function checkEnemyHit(enemies){
  for(let i=enemies.length-1;i>=0;i--){
    const e = enemies[i];
    if(aabb(player, e)){
      if(player.vy > 0){
        // 踏んで倒す
        enemies.splice(i,1);
        player.vy = -8;
      } else {
        return "hit"; // ダメージ
      }
    }
  }
  return null;
}

// ========== ボス ==========
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
}

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
