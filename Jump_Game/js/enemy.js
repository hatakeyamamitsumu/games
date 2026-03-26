// ========== enemy.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";
import { SCREEN_H } from "./config.js";
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

export const thunderEnemySprite = new Image();
thunderEnemySprite.src = "./images/characters/enemy10.png";

export const hover8EnemySprite = new Image();
hover8EnemySprite.src = "./images/characters/enemy11.png";

export const smokeBallEnemySprite = new Image();
smokeBallEnemySprite.src = "./images/characters/enemy12.png";

export const smokeFloatEnemySprite = new Image();
smokeFloatEnemySprite.src = "./images/characters/enemy13.png";

export const ballEnemySprite = new Image();
ballEnemySprite.src = "./images/characters/enemy14.png";

export const phasePlatformEnemySprite = new Image();
phasePlatformEnemySprite.src = "./images/characters/enemy15.png";

export const bossSprite = new Image();
bossSprite.src = "./images/characters/boss.png";


export const healItemSprite = new Image();
healItemSprite.src = "./images/characters/item1.png";

export const liveItemSprite = new Image();
liveItemSprite.src = "./images/characters/item2.png";
// ===== 定数 =====
const ENEMY_FRAME_COUNT = 4;
const BOSS_FRAME_COUNT = 4;
function isEnemySolidBlock(b) {
  // 敵が当たる通常ブロックのみ true
  if (b.type >= 13 && b.type <= 33) return false;
  return true;
}
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
    if (!isEnemySolidBlock(b)) continue;
    if (!aabb(e, b)) continue;

    const top = (e.y + e.h) - b.y;
    const bottom = (b.y + b.h) - e.y;

    if (top < bottom && e.vy > 0) {
      e.y = b.y - e.h;
      e.vy *= -1;
    } else if (bottom <= top && e.vy < 0) {
      e.y = b.y + b.h;
      e.vy *= -1;
    }
  }

  if (e.y < 0 || e.y + e.h > 480) e.vy *= -1;
  if (e.x + e.w < 0) enemies.splice(i, 1);

  animate(e);
  continue;
}

// --------------------------------
// jump：ふんわり跳ねる
// --------------------------------
if (e.type === "jump") {
  const GRAVITY = 0.1;
  const MAX_FALL = 6;
  const JUMP_POWER = -5;

  e.vy = (e.vy ?? 0) + GRAVITY;
  if (e.vy > MAX_FALL) e.vy = MAX_FALL;

  e.x += e.dir * e.speed;
  e.y += e.vy;

  for (const b of blocks) {
    if (!isEnemySolidBlock(b)) continue;
    if (!aabb(e, b)) continue;

    const overlaps = {
      l: (e.x + e.w) - b.x,
      r: (b.x + b.w) - e.x,
      t: (e.y + e.h) - b.y,
      b: (b.y + b.h) - e.y,
    };
    const m = Math.min(overlaps.l, overlaps.r, overlaps.t, overlaps.b);

    if (m === overlaps.t) {
      e.y = b.y - e.h;
      e.vy = JUMP_POWER;
    } else if (m === overlaps.l || m === overlaps.r) {
      e.dir *= -1;
    }
  }

  animate(e);
  continue;
}

// --------------------------------
// needle：固定
// --------------------------------
if (e.type === "needle") {

  // ===== 初期化 =====
  e.baseY = e.baseY ?? e.y;     // 元の位置を保存
  e.timer = e.timer ?? 0;
  e.state = e.state ?? "down";  // "up" or "down"

  e.timer++;

  // ===== 動き制御 =====
  if (e.state === "down" && e.timer > 120) {
    e.y = e.baseY - 48;   // 16px 上に出す（1コマ分）
    e.state = "up";
    e.timer = 0;
  }

  else if (e.state === "up" && e.timer > 60) {
    e.y = e.baseY;        // 元に戻す
    e.state = "down";
    e.timer = 0;
  }

  animate(e);
  continue;
}


// --------------------------------
// rush：待って突進
// --------------------------------
if (e.type === "rush") {
  e.wait = e.wait ?? 120;
  e.dir = -1;

  if (e.wait > 0) e.wait--;
  else e.x -= e.speed;

  if (e.x + e.w < 0) enemies.splice(i, 1);

  animate(e);
  continue;
}

// --------------------------------
// jumper：ジャンプ繰り返し
// --------------------------------
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

  animate(e);
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
    if (!isEnemySolidBlock(b)) continue;
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
// seeker：横追尾＋上下ふわふわ（安定版）
// --------------------------------
if (e.type === "seeker") {

  const cx = player.x + player.w / 2;
  const ex = e.x + e.w / 2;

  const dx = cx - ex;
  const speed = e.speed ?? 1;

  // ★ 一定距離以上あるときだけ移動
  if (Math.abs(dx) > speed) {
    e.x += Math.sign(dx) * speed;
    e.dir = dx > 0 ? 1 : -1;
  }

  // 上下ふわふわ
  e.float = (e.float ?? 0) + 0.05;
  e.y += Math.sin(e.float) * 2;

  // 画面外削除
  if (e.y > 600 || e.y < -100)
    enemies.splice(i, 1);

  animate(e);
  continue;
}


// --------------------------------
// phaser：消えたり現れたり
// --------------------------------
if (e.type === "phaser") {
  e.visible = e.visible ?? true;
  e.timer = (e.timer ?? 90) - 1;
  e.speed = e.speed ?? 1;
  e.dir = e.dir ?? -1;

  if (e.timer <= 0) {
    e.visible = !e.visible;
    e.timer = 180;
  }

  if (e.visible) {
    e.x += e.dir * e.speed;
  }

  for (const b of blocks) {
    if (!isEnemySolidBlock(b)) continue;
    if (aabb(e, b)) {
      e.dir *= -1;
      e.x += e.dir * 4;
    }
  }

  if (e.x < -200 || e.x > 2600) enemies.splice(i, 1);
  if (e.visible) animate(e);

  continue;
}
// --------------------------------
// enemy13：消える足場
// --------------------------------
if (e.type === "phasePlatform") {

  e.visible = e.visible ?? true;
  e.timer = (e.timer ?? 90) - 1;

  if (e.timer <= 0) {
    e.visible = !e.visible;
    e.timer = 90;
  }

  // 動かないので x は変更しない

  // 表示中だけ当たり判定あり
  if (e.visible) {
    e.solid = true;   // ←これ重要
    animate(e);
  } else {
    e.solid = false;  // ←すり抜け
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
  const d = Math.hypot(dx, dy);

  e.speed = e.speed ?? 1.3;

  if (d > 0.5) {
    const ax = (dx / d) * 0.2;
    const ay = (dy / d) * 0.2;

    e.vx = (e.vx ?? 0) * 0.9 + ax;
    e.vy = (e.vy ?? 0) * 0.9 + ay;

    e.x += e.vx;
    e.y += e.vy;
  }

  if (Math.abs(e.vx) > 0.05)
    e.dir = e.vx > 0 ? 1 : -1;

  animate(e);
  continue;
}

// --------------------------------
// thunder：上から下に落ちる敵
// --------------------------------
if (e.type === "thunder") {
  // 初期化
  e.vy = e.vy ?? e.speed ?? 3;
  e.frame = e.frame ?? 0;
  e.frameCount = e.frameCount ?? 0;
  e.respawnY = e.respawnY ?? -e.h;  // 再出現位置
  e.respawnX = e.respawnX ?? e.x;   // 出現X固定

  // 下方向に移動
  e.y += e.vy;

  // スプライトアニメーション
  e.frameCount++;
  if (e.frameCount % 8 === 0) e.frame = (e.frame + 1) % 4;

  // ブロックにぶつかったらリセット
  for (const b of blocks) {
    if (!aabb(e, b)) continue;

    // ぶつかったら上から再出現
    e.y = e.respawnY;
    e.x = e.respawnX;
    break;
  }

  // 画面下まで行ったら上から再出現
  if (e.y > SCREEN_H) {
    e.y = e.respawnY;
    e.x = e.respawnX;
  }

  animate(e);
  continue;
}
// --------------------------------
// smokeFloat：大きく揺れながら漂う煙
// --------------------------------
if (e.type === "smokeFloat") {

  // 初期化
  if (!e.initialized) {
    e.startX = e.x;
    e.startY = e.y;

    e.t = Math.random() * Math.PI * 2;

    e.initialized = true;
  }

  // 時間
  e.t += 0.03;

  // 大きな揺れ（ここがポイント）
  const ampX = 80; // 横の揺れ（大きく）
  const ampY = 30; // 縦の揺れ

  // 8の字っぽくしないために周期をズラす
  const offsetX = Math.sin(e.t) * ampX;
  const offsetY = Math.sin(e.t * 0.6) * ampY;

  // ゆっくり下に流す（煙っぽさ）
  e.startY += 0.2;

  // 位置更新
  e.x = e.startX + offsetX;
  e.y = e.startY + offsetY;

  // 一定距離でリセット
  if (e.startY > e.y + 200) {
    e.startY = e.y;
  }

  animate(e);
  continue;
}
// --------------------------------
// smokeBall：放物線で落ちる煙
// --------------------------------
if (e.type === "smokeBall") {

  // 初期化
  if (!e.initialized) {
    e.startX = e.x;
    e.startY = e.y;

    e.vx = (Math.random() - 0.5) * 2; // 横に流れる
    e.vy = -2;                        // 少し上に出てから落ちる

    e.gravity = 0.08;                 // ゆるめの重力
    e.initialized = true;
  }

  // 重力
  e.vy += e.gravity;

  // 移動
  e.x += e.vx;
  e.y += e.vy;

  // 画面外でリセット
  if (e.y > e.startY + 200) {
    e.x = e.startX;
    e.y = e.startY;

    e.vx = (Math.random() - 0.5) * 2;
    e.vy = -2;
  }

  animate(e);
  continue;
}
// --------------------------------
// ballEnemy：配置位置から放物線で飛ぶ敵
// --------------------------------
if (e.type === "ball") {

  // --- 初回だけ保存 ---
  e.startX = e.startX ?? e.x;
  e.startY = e.startY ?? e.y;
  e.startVX = e.startVX ?? (e.speedX ?? -4);
  e.startVY = e.startVY ?? (e.speedY ?? -6);
  e.gravity = e.gravity ?? 0.1;

  e.frame = e.frame ?? 0;
  e.frameCount = e.frameCount ?? 0;

  // --- 初回だけ速度セット ---
  e.vx = e.vx ?? e.startVX;
  e.vy = e.vy ?? e.startVY;

  // --- 物理更新 ---
  e.vy += e.gravity;
  e.x += e.vx;
  e.y += e.vy;

  // --- アニメーション ---
  e.frameCount++;
  if (e.frameCount % 8 === 0) {
    e.frame = (e.frame + 1) % 4;
  }

  // --- 衝突判定 ---
  let hit = false;
  for (const b of blocks) {
    if (!aabb(e, b)) continue;
    hit = true;
    break;
  }

  // --- 衝突 or 画面外で完全リセット ---
  if (hit || e.y > SCREEN_H || e.x < -e.w) {
    e.x = e.startX;
    e.y = e.startY;
    e.vx = e.startVX;
    e.vy = e.startVY;
  }

  animate(e);
  continue;
}

// --------------------------------
// enemy12：その場で8の字ホバリング
// --------------------------------
if (e.type === "hover8") {

  if (e.baseX === undefined) {
    e.baseX = e.x;
    e.baseY = e.y;
    e.t = 0;
  }

  e.t += 0.05;

const ampX = 60; // 横に大きく
const ampY = 40; // 縦に大きく

  e.x = e.baseX + Math.sin(e.t) * ampX;
  e.y = e.baseY + Math.sin(e.t * 2) * ampY;

  continue; // ←これ超重要
}



// --------------------------------
// heal / live：アイテム
// --------------------------------
if (e.type === "heal" || e.type === "live") {
  continue;
}

// --------------------------------
// 通常敵
// --------------------------------
else {
  e.x += e.dir * e.speed;

  for (const b of blocks) {
    if (!isEnemySolidBlock(b)) continue;
    if (aabb(e, b)) {
      e.dir *= -1;
      e.x += e.dir * 4;
    }
  }

  e.vy = (e.vy ?? 0) + 0.5;
  if (e.vy > 10) e.vy = 10;
  e.y += e.vy;

  let onGround = false;
  for (const b of blocks) {
    if (!isEnemySolidBlock(b)) continue;
    if (
      e.x + e.w > b.x &&
      e.x < b.x + b.w &&
      e.y + e.h > b.y &&
      e.y + e.h <= b.y + b.h
    ) {
      e.y = b.y - e.h;
      e.vy = 0;
      onGround = true;
    }
  }
  e.onGround = onGround;

  if (e.type === undefined && e.y > 600) {
    enemies.splice(i, 1);
    continue;
  }
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
        enemies.splice(i, 1);
        return "1up";           // main.js に知らせるだけ
      }

// ============================
// 上から踏んだ判定
// ============================
if (player.vy > 0) {

  // 踏んでもダメージになる敵
  if (
    e.type === "needle" ||
    e.type === "jumper" ||
    e.type === "thunder" ||
    e.type === "ball"
  ) {
    return "hit";
  }
  // ★ 足場タイプ
  if (e.type === "phasePlatform") {
    player.y = e.y - player.h; // 上に乗せる
    player.vy = 0;
    player.onGround = true;    // ←これ重要
    return null;
  }
  // それ以外は倒せる
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




// ===== ボス更新（完全安定版） =====
export function updateBoss(boss, blocks) {
  if (!boss) return;

  // -----------------------------
  // 中心座標を使用
  // -----------------------------
  const bossCenter = boss.x + boss.w / 2;
  const playerCenter = player.x + player.w / 2;

  const dx = playerCenter - bossCenter;

  // -----------------------------
  // 速度ベクトル方式（滑らか）
  // -----------------------------
  const accel = 0.4;           // 加速力
  const maxSpeed = boss.speed ?? 3;

  boss.vx = boss.vx ?? 0;

  // プレイヤー方向へ加速
  if (Math.abs(dx) > 4) {
    boss.vx += Math.sign(dx) * accel;
  }

  // 最大速度制限
  if (boss.vx > maxSpeed) boss.vx = maxSpeed;
  if (boss.vx < -maxSpeed) boss.vx = -maxSpeed;

  // 位置更新
  boss.x += boss.vx;

  // 向き更新（ほぼ止まってるときは変えない）
  if (Math.abs(boss.vx) > 0.2) {
    boss.dir = boss.vx > 0 ? 1 : -1;
  }

  // -----------------------------
  // ブロック衝突（めり込み防止）
  // -----------------------------
  for (const b of blocks) {
    if (aabb(boss, b)) {

      if (boss.vx > 0) {
        boss.x = b.x - boss.w;
      } else if (boss.vx < 0) {
        boss.x = b.x + b.w;
      }

      boss.vx *= -0.5; // 反発＋減速（暴れ防止）
    }
  }

  // -----------------------------
  // 微小震え防止
  // -----------------------------
  if (Math.abs(boss.vx) < 0.05) {
    boss.vx = 0;
  }

  // -----------------------------
  // アニメ更新
  // -----------------------------
  boss._frameTimer = (boss._frameTimer ?? 0) + 1;
  const interval = boss._frameInterval ?? 12;

  if (boss._frameTimer >= interval) {
    boss._frameTimer = 0;
    boss.frame = ((boss.frame ?? 0) + 1) % BOSS_FRAME_COUNT;
  }
}



// ===== ボス当たり判定 =====
export function checkBossHit(boss) {
  if (!boss) return null;

  if (aabb(player, boss)) {

    if (player.vy > 0) {
      boss.hp--;

      // ▼ 上方向に強く跳ねる
      player.vy = -20;

      // ▼ 横にもノックバックさせる
      if (player.x < boss.x) {
        player.vx = -20;   // 左側から踏んだ
      } else {
        player.vx = 20;    // 右側から踏んだ
      }

      if (boss.hp <= 0) return "dead";

    } else {
      return "hit";
    }
  }

  return null;
}
