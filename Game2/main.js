// main.js
import { player, playerImg } from "./player.js";
import { enemies, spawnEnemy, updateEnemies, drawEnemies } from "./enemy.js";
import { stages } from "./stages.js";
import { showMessage } from "./ui.js";
import { GROUND_Y, GRAVITY } from "./constants.js";
import { preloadStageAssets, switchStage, bgImg, bgm } from "./stage.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

let keys = {};
let bgX = 0;
let playerX = 0; // ワールド上の進行量（ステージスクロール量）
let currentStageIndex = 0;
let gameStarted = false;
let playerControlLocked = false;
let score = 0;

// === フェード用 ===
let fadeOpacity = 0;
let isFading = false;
let fadeDirection = 1; // 1=暗転中, -1=明転中

// === HPとゲームオーバー管理 ===
let playerHP = 20;
const maxHP = 20;
let isGameOver = false;
let damageCooldown = 0; // ダメージ後の無敵時間（フレーム）

// === 固定ブロック専用配列（ワールド座標で持つ） ===
let blocks = [];

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// =========================
// プレイヤー更新
// =========================
function updatePlayer() {
  if (playerControlLocked || isGameOver) {
    player.vx = 0;
    return;
  }

  // --- 入力 ---
  if (keys["ArrowLeft"]) player.vx = -4;
  else if (keys["ArrowRight"]) player.vx = 4;
  else player.vx = 0;

  if (keys["Space"] && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  player.vy += GRAVITY;

  // ==== 可動範囲 ====
  const LEFT_LIMIT  = canvas.width * 0.3;
  const RIGHT_LIMIT = canvas.width * 0.7;

  // -----------------------------
  // ① とりあえずプレイヤーを動かす
  // -----------------------------
  player.x += player.vx;

  // -----------------------------
  // ② 可動範囲を超えたら world（playerX）を動かす
  // -----------------------------
  if (player.x > RIGHT_LIMIT) {
    const over = player.x - RIGHT_LIMIT;
    player.x = RIGHT_LIMIT;
    playerX += over;  // ← 背景を左へスクロール
  }

  if (player.x < LEFT_LIMIT) {
    const over = player.x - LEFT_LIMIT;
    player.x = LEFT_LIMIT;
    playerX += over;  // ← 背景を右へスクロール
  }

  // -----------------------------
  // ③ 横方向の衝突判定（画面座標＝block.x - playerX）
  // -----------------------------
  for (const b of blocks) {
    const bx = b.x - playerX;

    const isColliding =
      player.x < bx + b.w &&
      player.x + player.w > bx &&
      player.y < b.y + b.h &&
      player.y + player.h > b.y;

    if (isColliding) {
      if (player.vx > 0) player.x = bx - player.w; 
      else if (player.vx < 0) player.x = bx + b.w;

      player.vx = 0;
    }
  }

  // -----------------------------
  // ④ 縦方向移動
  // -----------------------------
  player.y += player.vy;
  let onGroundThisFrame = false;

  for (const b of blocks) {
    const bx = b.x - playerX;

    const isColliding =
      player.x < bx + b.w &&
      player.x + player.w > bx &&
      player.y < b.y + b.h &&
      player.y + player.h > b.y;

    if (isColliding) {
      // 上から着地
      if (player.vy > 0 && player.y + player.h - player.vy <= b.y) {
        player.y = b.y - player.h;
        player.vy = 0;
        onGroundThisFrame = true;
      }
    }
  }

  // 地面着地
  player.onGround = onGroundThisFrame || player.y + player.h >= GROUND_Y;

  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.vy = 0;
  }

  // --- アニメーション ---
  player.frameTimer++;
  if (player.frameTimer > 10) {
    player.frame = (player.frame + 1) % player.frameMax;
    player.frameTimer = 0;
  }

  // --- ダメージ無敵 ---
  if (damageCooldown > 0) damageCooldown--;
}

// =========================
// スコア描画
// =========================
function drawScore() {
  const fontSize = 28;
  ctx.font = `${fontSize}px Arial Black`;
  ctx.shadowColor = "black";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const gradient = ctx.createLinearGradient(0, 0, 0, fontSize);
  gradient.addColorStop(0, "orange");
  gradient.addColorStop(0.5, "yellow");
  gradient.addColorStop(1, "yellow");
  ctx.fillStyle = gradient;

  ctx.fillText(`Score: ${score}`, canvas.width - 160, 40);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.strokeText(`Score: ${score}`, canvas.width - 160, 40);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// =========================
// 背景描画
// =========================
function drawBackground() {
  const bgWidth = bgImg.width || canvas.width;
  // スクロール（ゆっくりにしたいなら *0.2 などをつける）
  if (player.vx > 0) bgX -= player.vx * 0.2;
  if (bgX <= -bgWidth) bgX = 0;

  // 背景を繰り返して描く（元のサイズのまま）
  ctx.drawImage(bgImg, bgX, 0);
  ctx.drawImage(bgImg, bgX + bgWidth, 0);

  // 地面
  ctx.fillStyle = "#8B5A2B";
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
}

// =========================
// プレイヤー描画
// =========================
function drawPlayer() {
  const frameWidth = 34;
  const frameHeight = 48;

  // 通常描画
  ctx.drawImage(
    playerImg,
    player.frame * frameWidth, 0, frameWidth, frameHeight,
    player.x, player.y, frameWidth, frameHeight
  );

  // ダメージ時の赤丸（短く一瞬だけ）
  if (damageCooldown > 0 && damageCooldown % 6 === 0) {
    const centerX = player.x + player.w / 2;
    const centerY = player.y + player.h / 2;
    const radius = Math.min(player.w, player.h) * 0.5; // 小さめ

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,0,0,0.7)";
    ctx.fill();
  }
}

// =========================
// HPバー描画
// =========================
function drawHPBar() {
  const barWidth = 300;  // HPバーの最大幅
  const barHeight = 32;  // 高さ
  const x = 20;
  const y = 20;

  const ratio = Math.max(0, playerHP / maxHP);
  const currentWidth = barWidth * ratio;

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

  const color =
    ratio > 0.6 ? "#00FF00" :
    ratio > 0.3 ? "#FFFF00" :
    "#FF0000";

  ctx.fillStyle = color;
  ctx.fillRect(x, y, currentWidth, barHeight);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barWidth, barHeight);
}

// =========================
// 敵との当たり判定（踏み判定付き）
// =========================
function checkPlayerEnemyCollision() {
  if (damageCooldown > 0 || isGameOver) return;

  enemies.forEach((enemy, index) => {
    const collide =
      player.x < enemy.x + enemy.w &&
      player.x + player.w > enemy.x &&
      player.y < enemy.y + enemy.h &&
      player.y + player.h > enemy.y;

    if (!collide) return;

    const playerBottom = player.y + player.h;
    const enemyTop = enemy.y;

    // === 上から踏んだ判定 ===
    if (player.vy > 0 && playerBottom - enemyTop < 15) {
      if (enemy.canBeStomped) {
        // 踏んで倒せる敵
        enemies.splice(index, 1);
        player.vy = -8;
        const points = enemy.scoreValue || 10;
        score += points;
      } else {
        // 踏んでも倒せない敵 → ダメージ
        playerHP--;
        damageCooldown = 60;
        if (playerHP <= 0) handleGameOver();
      }
    } else {
      // 横または下から当たった → ダメージ
      playerHP--;
      damageCooldown = 60;
      if (playerHP <= 0) handleGameOver();
    }
  });
}

// =========================
// 固定ブロック（blocks）の衝突判定
// blocks: ワールド座標で保存。描画/当たり判定では playerX を引く。
// =========================
function checkBlockCollision(playerX) {
  for (const b of blocks) {
    const drawX = b.x - playerX; // スクリーン座標

    // 画面外なら無視（ちょっと早めに無視して効率化）
    if (drawX + b.w < -50 || drawX > canvas.width + 50) continue;

    const collide =
      player.x < drawX + b.w &&
      player.x + player.w > drawX &&
      player.y < b.y + b.h &&
      player.y + player.h > b.y;

    if (!collide) continue;

    // 衝突方向の判定（簡易：前フレームの位置を参照）
    const prevBottom = player.y + player.h - player.vy;
    const prevTop = player.y - player.vy;
    const prevLeft = player.x - player.vx;
    const prevRight = player.x + player.w - player.vx;

    // 上から着地
    if (prevBottom <= b.y) {
      player.y = b.y - player.h;
      player.vy = 0;
      player.onGround = true;
      // 当たったら処理を終える（同フレームに左右処理しない）
      continue;
    }

    // 下からぶつかる（頭をぶつける）
    if (prevTop >= b.y + b.h) {
      player.y = b.y + b.h;
      player.vy = 0;
      continue;
    }

    // 左から衝突
    if (prevRight <= b.x - playerX) {
      player.x = drawX - player.w;
      continue;
    }

    // 右から衝突
    if (prevLeft >= b.x - playerX + b.w) {
      player.x = drawX + b.w;
      continue;
    }
  }
}

// =========================
// 固定ブロック描画
// =========================
import { enemyImages } from "./enemy.js";

function drawBlocks(playerX) {
  const blockImg = enemyImages.block;

  for (const b of blocks) {
    const drawX = Math.round(b.x - playerX);

    if (drawX + b.w < 0 || drawX > canvas.width) continue;

    if (blockImg.complete) {
      ctx.drawImage(blockImg, drawX, b.y, b.w, b.h);
    } else {
      ctx.fillStyle = "#7f5f3f";
      ctx.fillRect(drawX, b.y, b.w, b.h);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(drawX, b.y, b.w, b.h);
    }
  }
}



// =========================
// ゲームオーバー処理
// =========================
function handleGameOver() {
  isGameOver = true;
  playerControlLocked = true;
  showMessage("ゲームオーバー！", 2000);
  setTimeout(() => {
    location.reload(); // シンプルにリロードで再スタート
  }, 2500);
}

// =========================
// 敵・ブロック出現処理（ステージの spawn を参照）
// =========================
function handleEnemySpawns() {
  const stage = stages[currentStageIndex];
  stage.enemySpawns.forEach(spawn => {
    if (!spawn.spawned && playerX + canvas.width >= spawn.x) {
      const enemyY = spawn.y !== undefined ? spawn.y : null;

      if (spawn.type === "block") {
        // blocks にワールド座標で追加。デフォルトサイズは 48x48（必要なら spawn に w/h を追加してください）
        blocks.push({
          x: spawn.x,
          y: enemyY !== null ? enemyY : (GROUND_Y - 48),
          w: spawn.w || 48,
          h: spawn.h || 48
        });
      } else {
        // 通常の敵は spawnEnemy に任せる（spawnEnemy(type, customY, stageX) の第三引数を渡せる実装なら stageX を渡す）
        // ここでは spawnEnemy(type, y, stageX) を想定していない場合でも動くように既存の API を使います。
        spawnEnemy(spawn.type, enemyY);
      }

      spawn.spawned = true;
    }
  });
}

// =========================
// ステージ状態リセット
// =========================
function resetStageState() {
  player.x = window.innerWidth / 4;
  player.y = 360;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  playerX = 0;
  bgX = 0;
  enemies.length = 0;
  blocks.length = 0; // ← ブロックもリセット
}

// =========================
// ステージクリア判定
// =========================
function checkStageClear() {
  const stage = stages[currentStageIndex];
  if (playerControlLocked || isFading || isGameOver) return;
  if (playerX >= stage.length) {
    playerControlLocked = true;
    isFading = true;
    fadeDirection = 1;
    fadeOpacity = 0;
  }
}

// =========================
// フェードとステージ切替処理
// =========================
function handleFade() {
  if (!isFading) return;
  fadeOpacity += 0.005 * fadeDirection;

  if (fadeOpacity >= 1 && fadeDirection === 1) {
    fadeOpacity = 1;
    const nextStage = currentStageIndex + 1;
    if (nextStage < stages.length) {
      showMessage(`ステージ${stages[currentStageIndex].number}クリア！`, 1000);
      currentStageIndex = nextStage;
      switchStage(nextStage, player, resetStageState);
      fadeDirection = -1;
    } else {
      showMessage("ゲームクリア！", 3000);
      fadeDirection = 0;
      isFading = false;
      fadeOpacity = 1;
      playerControlLocked = true;
    }
  }

  if (fadeOpacity <= 0 && fadeDirection === -1) {
    fadeOpacity = 0;
    isFading = false;
    playerControlLocked = false;
  }

  ctx.fillStyle = `rgba(0,0,0,${fadeOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// =========================
// メインループ
// =========================
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  updatePlayer();
  updateEnemies();
  handleEnemySpawns();
  checkPlayerEnemyCollision();
  checkBlockCollision(playerX); // ← block 衝突（playerX 必要）
  checkStageClear();
  drawPlayer();
  drawEnemies();           // 敵描画（enemy.js 側）
  drawBlocks(playerX);     // block を描画（playerX を渡す）
  drawHPBar();
  drawScore();
  handleFade();

  requestAnimationFrame(loop);
}

// =========================
// ゲーム開始
// =========================
preloadStageAssets();
Promise.all([new Promise(r => playerImg.onload = r)]).then(() => {
  function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    bgm.currentTime = 0;
    bgm.play().catch(err => console.log("BGM再生ブロック:", err));
    loop();
  }
  document.addEventListener("click", startGame);
  document.addEventListener("keydown", startGame);
});
