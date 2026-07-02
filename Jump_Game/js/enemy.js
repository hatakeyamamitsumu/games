// ========== enemy.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";
import { aabb } from "./physics.js";
import { player } from "./player.js";
import { SCREEN_H } from "./config.js";
import { SCREEN_W } from "./config.js";
// ===== スプライト =====
export const enemySprite = new Image();
enemySprite.src = "./images/characters/enemy1.png";

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

export const needleEnemySprite = new Image();
needleEnemySprite.src = "./images/characters/enemy16.png";

export const needleDownEnemySprite = new Image();
needleDownEnemySprite.src = "./images/characters/enemy17.png";

export const fishEnemySprite = new Image();
fishEnemySprite.src = "./images/characters/enemy18.png";



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
// fish：左右に放物線ジャンプ
// --------------------------------
if (e.type === "fish") {

  const GRAVITY   = 0.1;
  const MAX_FALL  = 8;
  const JUMP_POWER = -8;

  // ===== 初期化 =====
  if (!e.initialized) {
    e.initialized = true;

    e.baseX = e.x;          // 中心位置
    e.baseY = e.y + 100;    // 海面
    e.dir = -1;             // 最初は左へ
    e.speed = 2;
    e.vy = JUMP_POWER;
  }

  // ===== 横移動 =====
e.x += e.dir * e.speed * 0.3;

  // ===== 重力 =====
  e.vy += GRAVITY;
  if (e.vy > MAX_FALL) e.vy = MAX_FALL;

  // ===== 縦移動 =====
  e.y += e.vy;

  // ===== 海面に戻ったら再ジャンプ =====
  if (e.y >= e.baseY) {

    // 海面に戻す
    e.y = e.baseY;

    // ジャンプ
    e.vy = JUMP_POWER;

    // 左右反転
    e.dir *= -1;
  }

  // ===== アニメーション =====
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
// needleDown：上から下に突き刺す
// --------------------------------
if (e.type === "needleDown") {

  // ===== 初期化 =====
  e.baseY = e.baseY ?? e.y;     // 天井位置を保存
  e.timer = e.timer ?? 0;
  e.state = e.state ?? "up";    // "up" or "down"

  e.timer++;

  // ===== 動き制御 =====
  if (e.state === "up" && e.timer > 120) {
    e.y = e.baseY + 48;   // 下に出す
    e.state = "down";
    e.timer = 0;
  }

  else if (e.state === "down" && e.timer > 60) {
    e.y = e.baseY;        // 天井に戻る
    e.state = "up";
    e.timer = 0;
  }

  animate(e);
  continue;
}

// --------------------------------
// rush：近づいたら待って突進
// --------------------------------
if (e.type === "rush") {

  e.state = e.state ?? "idle"; // idle → wait → rush
  e.wait = e.wait ?? 60;
  e.dir = -1;

  // プレイヤーとの距離
  const dx = Math.abs(player.x - e.x);

  // ===== 未起動 =====
  if (e.state === "idle") {
    if (dx < 800) {  // ← 検知距離（調整可）
      e.state = "wait";
    }
  }

  // ===== 待機 =====
  else if (e.state === "wait") {
    if (e.wait > 0) {
      e.wait--;
    } else {
      e.state = "rush";
    }
  }

  // ===== 突進 =====
  else if (e.state === "rush") {
    e.x -= e.speed;
  }

  if (e.x + e.w < 0) enemies.splice(i, 1);

  animate(e);
  continue;
}

// --------------------------------
// jumper：ジャンプ繰り返し
// --------------------------------
if (e.type === "jumper") {
  e.vy = e.vy ?? 0;
  e.baseY = e.baseY ?? e.y;

  e.vy += 0.18;
  if (e.vy > 2) e.vy = 2; // ← 効く値にする

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

  // ★ 段差チェック（追加）
  let frontX = e.x + (e.dir === 1 ? e.w + 1 : -1);
  let footY = e.y + e.h + 2;

  let hasGround = false;
  for (const b of blocks) {
    if (!isEnemySolidBlock(b)) continue;

    if (
      frontX >= b.x &&
      frontX <= b.x + b.w &&
      footY >= b.y &&
      footY <= b.y + b.h
    ) {
      hasGround = true;
      break;
    }
  }

  if (!hasGround) {
    e.dir *= -1;
  }

  // 横移動
  e.x += e.dir * e.speed;

  // 重力
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

  // 初期化
  if (e.visible === undefined) e.visible = true;
  if (e.timer === undefined) e.timer = 90;
  if (e.speed === undefined) e.speed = 1;
  if (e.dir === undefined) e.dir = -1;

  // タイマー
  e.timer--;

  if (e.timer <= 0) {
    e.visible = !e.visible;
    e.timer = 180;
  }

  // 見えてるときだけ移動
  if (e.visible) {
    e.x += e.dir * e.speed;
  }

  // 見えてるときだけ当たり判定
  if (e.visible) {
    for (const b of blocks) {
      if (!isEnemySolidBlock(b)) continue;

      if (aabb(e, b)) {
        e.dir *= -1;
        e.x += e.dir * 4;
        break; // ← これ重要（多重反転防止）
      }
    }
  }

  // プレイヤーから遠い敵は「処理スキップ」（削除しない）
  if (Math.abs(e.x - player.x) > 1200) {
    continue;
  }

  // 削除範囲をステージに合わせて拡張
  if (e.x < -500 || e.x > 6000) {
    enemies.splice(i, 1);
    continue;
  }

  // アニメーション
  if (e.visible) {
    animate(e);
  }

  continue;
}

// --------------------------------
// phasePlatform：消える＋当たると跳ねる足場
// --------------------------------
if (e.type === "phasePlatform") {

  // ===== 初期化 =====
  e.visible = e.visible ?? true;
  e.timer   = (e.timer ?? 90) - 1;

  // ===== 表示ON/OFF =====
  if (e.timer <= 0) {
    e.visible = !e.visible;
    e.timer = 90;
  }

  // ===== 表示中だけ当たり判定 =====
  e.solid = e.visible;

  // ===== どこからでも当たれば跳ねる =====
  if (e.visible && aabb(player, e)) {
    player.vy = -10; // ←ジャンプ力（調整OK）
  }

  // ===== アニメ =====
  if (e.visible) animate(e);

  continue;
}
// --------------------------------
// chaser：近づいたら追尾
// --------------------------------
if (e.type === "chaser") {

  e.active = e.active ?? false; // ← 追加：起動フラグ

  const px = player.x + player.w / 2;
  const py = player.y + player.h / 2;
  const ex = e.x + e.w / 2;
  const ey = e.y + e.h / 2;

  const dx = px - ex;
  const dy = py - ey;
  const d = Math.hypot(dx, dy);

  // ===== 未起動 =====
  if (!e.active) {
    if (d < 800) {   // ← 検知距離（調整可）
      e.active = true;
    } else {
      continue; // ← 完全停止
    }
  }

  // ===== 追尾 =====
  if (d > 0.5) {
    const ax = (dx / d) * 0.15;
    const ay = (dy / d) * 0.15;

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
  e.respawnY = e.respawnY ?? -e.h;
  e.respawnX = e.respawnX ?? e.x;

  e.wait = e.wait ?? 0;   // ← 追加：待機時間

  // ===== 待機中 =====
  if (e.wait > 0) {
    e.wait--;
    continue;  // 動かない
  }

  // 下方向に移動
  e.y += e.vy;

  // アニメーション
  e.frameCount++;
  if (e.frameCount % 8 === 0) e.frame = (e.frame + 1) % 4;

  // ブロックに衝突
  for (const b of blocks) {
    if (!aabb(e, b)) continue;

    e.y = e.respawnY;
    e.x = e.respawnX;
    e.wait = 60;  // ← 1秒待つ（60fps想定）
    break;
  }

  // 画面外
  if (e.y > SCREEN_H) {
    e.y = e.respawnY;
    e.x = e.respawnX;
    e.wait = 60;  // ← 同じく待つ
  }

  animate(e);
  continue;
}

// --------------------------------
// smokeFloat：大きく揺れながら漂う煙
// --------------------------------
if (e.type === "smokeFloat") {

  if (!e.initialized) {
    e.startX = e.x;
    e.startY = e.y;

    e.vx = (Math.random() - 0.5) * 3;
    e.vy = -1.5;

    e.gravity = 0.02;

    e.t = 0; // 揺れ用
    e.initialized = true;
  }

  e.t += 0.04;

  // 重力
  e.vy += e.gravity;

  // ★ 横揺れ（メイン）
  const sway = Math.sin(e.t) * 3;

  // ★ ランダム揺れ
  const noise = (Math.random() - 0.5) * 0.5;

  e.x += e.vx + sway + noise;
  e.y += e.vy;

  // リセット
  if (e.y > e.startY + 180) {
    e.x = e.startX;
    e.y = e.startY;

    e.vx = (Math.random() - 0.5) * 2;
    e.vy = -1.5;
    e.t = 0;
  }

  animate(e);
  continue;
}

// --------------------------------
// smokeBall：放物線で落ちる煙
// --------------------------------
if (e.type === "smokeBall") {

  if (!e.initialized) {
    e.startX = e.x;
    e.startY = e.y;

    e.vx = (Math.random() - 0.5) * 3;
    e.vy = -4;

    e.gravity = 0.05;

    e.t = 0;
    e.initialized = true;
  }

  e.t += 0.08;

  // 重力
  e.vy += e.gravity;

  // ★ 横ブレ（控えめ）
  const sway = Math.sin(e.t) * 1.5;

  e.x += e.vx + sway;
  e.y += e.vy;

  // リセット
  if (e.y > e.startY + 200) {
    e.x = e.startX;
    e.y = e.startY;

    e.vx = (Math.random() - 0.5) * 3;
    e.vy = -4;
    e.t = 0;
  }

  animate(e);
  continue;
}
// --------------------------------
// ballEnemy：配置位置から放物線で飛ぶ敵
// --------------------------------
if (e.type === "ball") {

  const slow = 0.6;

  e.startX = e.startX ?? e.x;
  e.startY = e.startY ?? e.y;

  e.startVX = e.startVX ?? (e.speedX ?? -4) * slow;
  e.startVY = e.startVY ?? (e.speedY ?? -6) * slow;

  e.gravity = e.gravity ?? 0.1 * slow;

  e.frame = e.frame ?? 0;
  e.frameCount = e.frameCount ?? 0;

  e.vx = e.vx ?? e.startVX;
  e.vy = e.vy ?? e.startVY;

  e.wait = e.wait ?? 0;
  e.isWaiting = e.isWaiting ?? false;

  // ===== 待機中 =====
  if (e.isWaiting) {
    e.wait--;

    if (e.wait <= 0) {
      // ★ ここで初めて再出現
      e.x = e.startX;
      e.y = e.startY;
      e.vx = e.startVX;
      e.vy = e.startVY;
      e.isWaiting = false;
    }

    continue;
  }

  // --- 通常移動 ---
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

  // --- 消滅処理 ---
  if (hit || e.y > SCREEN_H || e.x < -e.w) {

    // ★ 画面外へ退避（見えなくする）
    e.x = -9999;
    e.y = -9999;

    // ★ 待機開始
    e.wait = 60; // 1秒
    e.isWaiting = true;
  }

  animate(e);
  continue;
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
  // 煙,弾は当たり判定なし
  // ============================
  if (e.type === "smokeFloat" || e.type === "smokeBall" ||  e.type === "ball" ) {
    continue;
  }

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

    // ▼ 上から踏んだ場合
    if (player.vy > 0) {
      boss.hp--;

      // ===== プレイヤー =====
      player.vy = -20;

      if (player.x < boss.x) {
        player.vx = -20;
        boss.vx = 20;   // 右へ強くノックバック
      } else {
        player.vx = 20;
        boss.vx = -20;  // 左へ強くノックバック
      }

      // ▼ 上方向にも強く吹っ飛ばす
      boss.vy = -20;

      // ▼ 撃破判定
      if (boss.hp <= 0) return "dead";

    } else {
      // 横・下から当たった
      return "hit";
    }
  }

  return null;
}