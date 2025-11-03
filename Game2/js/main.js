// ===========================
// main.js（スプライト対応版）
// ===========================
import { keys, setupInput } from './input.js';
import { aabb, GRAVITY, FRICTION } from './physics.js';
import { levels, resetLevel } from './level.js';
import { player } from './player.js';
import { draw } from './render.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

let camX = 0;
let currentLevel = 0;
let gameOver = false;
let gameWin = false;
let lvl = [];

// -----------------------------------
// 初期化
// -----------------------------------
function init() {
  setupInput();
  const reset = resetLevel(0, player);
  lvl = reset.data;
  currentLevel = reset.levelIndex;

  // プレイヤー初期位置リセット
  player.x = 100;
  player.y = 100;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.frame = 0;
  player.frameTimer = 0;
  player.facing = 1;

  gameOver = false;
  gameWin = false;
}
init();

// -----------------------------------
// ゲーム更新処理
// -----------------------------------
function update() {
  if (gameOver || gameWin) return;

  // リスタート
  if (keys['KeyR']) init();

  // --- 移動入力 ---
  if (keys['ArrowLeft']) {
    player.vx -= 0.9;
    player.facing = -1; // 左向き
  }
  if (keys['ArrowRight']) {
    player.vx += 0.95;
    player.facing = 1; // 右向き
  }
  if ((keys['Space'] || keys['ArrowUp']) && player.onGround) {
    player.vy = -18;
    player.onGround = false;
  }

  // --- 物理処理 ---
  player.vy += GRAVITY;
  player.vx *= FRICTION;
  player.vx = Math.max(Math.min(player.vx, 10), -10);
  player.vy = Math.max(Math.min(player.vy, 30), -30);
  player.x += player.vx;
  player.y += player.vy;

  // --- カメラ処理 ---
  const lvlData = levels[currentLevel];
  camX = player.x - W * 0.35;
  camX = Math.max(0, Math.min(camX, lvlData.width - W));
  player.onGround = false;

  // -----------------------------------
  // 当たり判定・ゲームロジック
  // -----------------------------------
  for (let i = lvl.length - 1; i >= 0; i--) {
    const obj = lvl[i];

    // === 地形衝突 ===
    if (obj.type === 'platform' || obj.type === 'goal') {
      if (aabb(player, obj)) {
        const px = (player.x + player.w / 2) - (obj.x + obj.w / 2);
        const py = (player.y + player.h / 2) - (obj.y + obj.h / 2);
        const overlapX = (player.w + obj.w) / 2 - Math.abs(px);
        const overlapY = (player.h + obj.h) / 2 - Math.abs(py);
        if (overlapX > 0 && overlapY > 0) {
          if (overlapY < overlapX) {
            if (py > 0) { // 下から衝突
              player.y += overlapY;
              player.vy = 0;
            } else { // 上に乗る
              player.y -= overlapY;
              player.vy = 0;
              player.onGround = true;
            }
          } else {
            if (px > 0) { player.x += overlapX; player.vx = 0; }
            else { player.x -= overlapX; player.vx = 0; }
          }
        }
      }
    }

    // === トゲ ===
    if (obj.type === 'spike' && aabb(player, obj)) gameOver = true;

    // === 敵 ===
    if (obj.type === 'enemy') {
      if (aabb(player, obj)) {
        const playerBottom = player.y + player.h;
        if (player.vy > 0 && playerBottom - obj.y < 15) {
          lvl.splice(i, 1); // 敵消滅
          player.vy = -12;  // バウンド
        } else {
          gameOver = true;
        }
      }
    }

    // === ボス ===
    if (obj.type === 'boss') {
      if (aabb(player, obj)) {
        if (obj.hp === undefined) obj.hp = 3;
        const playerBottom = player.y + player.h;
        const bossTop = obj.y;
        const fromAbove = player.vy > 0 && playerBottom - bossTop < player.h / 2;
        if (fromAbove) {
          obj.hp -= 1;
          player.vy = -14;
          if (obj.hp <= 0) {
            lvl[i] = { type: 'platform', x: obj.x, y: obj.y + obj.h - 18, w: obj.w, h: 18 };
          }
        } else if (obj.hp > 0) {
          gameOver = true;
        }
      }
    }

    // === ゴール ===
    if (obj.type === 'goal') {
      if (aabb(player, { x: obj.x - 10, y: obj.y - 10, w: obj.w + 20, h: obj.h + 20 })) {
        if (currentLevel < levels.length - 1) {
          const reset = resetLevel(currentLevel + 1, player);
          lvl = reset.data;
          currentLevel = reset.levelIndex;
        } else {
          gameWin = true;
        }
      }
    }
  }

  // === 落下で死亡 ===
  if (player.y > H + 200) gameOver = true;
}

// -----------------------------------
// メインループ
// -----------------------------------
function loop() {
  update();
  draw(ctx, W, H, lvl, camX, player, gameOver, gameWin);
  requestAnimationFrame(loop);
}
loop();
