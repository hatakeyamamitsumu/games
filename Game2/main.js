// main.js
import { player, playerImg } from "./player.js";
import { enemies, spawnEnemy, updateEnemies, drawEnemies, enemyImages } from "./enemy.js";
import { stages } from "./stages.js";
import { showMessage } from "./ui.js";
import { GROUND_Y, GRAVITY } from "./constants.js";
import { preloadStageAssets, switchStage, bgImg, bgm } from "./stage.js";

// =========================
// キャンバス
// =========================
export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

// =========================
// ゲーム状態
// =========================
let keys = {};
let bgX = 0;
let playerX = 0; // ワールド上の進行量
let currentStageIndex = 0;
let gameStarted = false;
let playerControlLocked = false;
let score = 0;

// フェード用
let fadeOpacity = 0;
let isFading = false;
let fadeDirection = 1; // 1=暗転中, -1=明転中

// HP管理
let playerHP = 20;
const maxHP = 20;
let isGameOver = false;
let damageCooldown = 0;

// ブロック配列（ワールド座標）
let blocks = [];

// ブロックスクロール倍率（1=プレイヤーと同じ、0=固定）
const BLOCK_SCROLL_FACTOR = 0.2;

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

  // 入力
  if (keys["ArrowLeft"]) player.vx = -4;
  else if (keys["ArrowRight"]) player.vx = 4;
  else player.vx = 0;

  if (keys["Space"] && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  player.vy += GRAVITY;

  // 可動範囲
  const LEFT_LIMIT  = canvas.width * 0.3;
  const RIGHT_LIMIT = canvas.width * 0.7;

  // ① プレイヤー移動
  player.x += player.vx;

  // ② 可動範囲超過 → world スクロール
  if (player.x > RIGHT_LIMIT) {
    const over = player.x - RIGHT_LIMIT;
    player.x = RIGHT_LIMIT;
    playerX += over;
  }

  if (player.x < LEFT_LIMIT) {
    const over = player.x - LEFT_LIMIT;
    player.x = LEFT_LIMIT;
    playerX += over;
  }

  // ③ 横方向ブロック衝突
  for (const b of blocks) {
    const bx = b.x - playerX * BLOCK_SCROLL_FACTOR;

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

  // ④ 縦方向移動
  player.y += player.vy;
  let onGroundThisFrame = false;

  for (const b of blocks) {
    const bx = b.x - playerX * BLOCK_SCROLL_FACTOR;

    const isColliding =
      player.x < bx + b.w &&
      player.x + player.w > bx &&
      player.y < b.y + b.h &&
      player.y + player.h > b.y;

    if (isColliding) {
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

  // アニメーション
  player.frameTimer++;
  if (player.frameTimer > 10) {
    player.frame = (player.frame + 1) % player.frameMax;
    player.frameTimer = 0;
  }

  // ダメージ無敵
  if (damageCooldown > 0) damageCooldown--;
}

// =========================
// ブロック衝突判定（縦横）
function checkBlockCollision(playerX) {
  for (const b of blocks) {
    const drawX = b.x - playerX * BLOCK_SCROLL_FACTOR;

    if (drawX + b.w < -50 || drawX > canvas.width + 50) continue;

    const collide =
      player.x < drawX + b.w &&
      player.x + player.w > drawX &&
      player.y < b.y + b.h &&
      player.y + player.h > b.y;

    if (!collide) continue;

    const prevBottom = player.y + player.h - player.vy;
    const prevTop    = player.y - player.vy;
    const prevLeft   = player.x - player.vx;
    const prevRight  = player.x + player.w - player.vx;

    if (prevBottom <= b.y) {
      player.y = b.y - player.h;
      player.vy = 0;
      player.onGround = true;
      continue;
    }

    if (prevTop >= b.y + b.h) {
      player.y = b.y + b.h;
      player.vy = 0;
      continue;
    }

    if (prevRight <= drawX) {
      player.x = drawX - player.w;
      continue;
    }

    if (prevLeft >= drawX + b.w) {
      player.x = drawX + b.w;
      continue;
    }
  }
}

// =========================
// スコア描画
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
// HPバー描画
function drawHPBar() {
  const barWidth = 300;
  const barHeight = 32;
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
// 背景描画
function drawBackground() {
  const bgWidth = bgImg.width || canvas.width;

  if (player.vx > 0) bgX -= player.vx * 0.2;
  if (player.vx < 0) bgX -= player.vx * 0.2; // 左移動も少しスクロール
  if (bgX <= -bgWidth) bgX = 0;
  if (bgX >= bgWidth) bgX = 0;

  ctx.drawImage(bgImg, bgX, 0);
  ctx.drawImage(bgImg, bgX + bgWidth, 0);

  // 地面
  ctx.fillStyle = "#8B5A2B";
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
}

// =========================
// プレイヤー描画
function drawPlayer() {
  const frameWidth = 34;
  const frameHeight = 48;

  ctx.drawImage(
    playerImg,
    player.frame * frameWidth, 0, frameWidth, frameHeight,
    player.x, player.y, frameWidth, frameHeight
  );

  if (damageCooldown > 0 && damageCooldown % 6 === 0) {
    const centerX = player.x + player.w / 2;
    const centerY = player.y + player.h / 2;
    const radius = Math.min(player.w, player.h) * 0.5;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,0,0,0.7)";
    ctx.fill();
  }
}

// =========================
// ブロック描画
export function drawBlocks(playerX = 0) {
  const blockImg = enemyImages.block;

  for (const b of blocks) {
    const drawX = Math.round(b.x - playerX * BLOCK_SCROLL_FACTOR);

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
// 敵衝突判定（踏み判定含む）
function checkPlayerEnemyCollision(playerX = 0, scrollFactor = 0.2) {
  if (damageCooldown > 0 || isGameOver) return;

  enemies.forEach((enemy, index) => {
    const enemyScreenX = enemy.x - playerX * scrollFactor * 10; // 描画と同じ座標に補正

    const collide =
      player.x < enemyScreenX + enemy.w &&
      player.x + player.w > enemyScreenX &&
      player.y < enemy.y + enemy.h &&
      player.y + player.h > enemy.y;

    if (!collide) return;

    const playerBottom = player.y + player.h;
    const enemyTop = enemy.y;

    if (player.vy > 0 && playerBottom - enemyTop < 15) {
      if (enemy.canBeStomped) {
        enemies.splice(index, 1);
        player.vy = -8;
        score += enemy.scoreValue || 10;
      } else {
        playerHP--;
        damageCooldown = 60;
        if (playerHP <= 0) handleGameOver();
      }
    } else {
      playerHP--;
      damageCooldown = 60;
      if (playerHP <= 0) handleGameOver();
    }
  });
}

// =========================
// 敵・ブロック出現処理
function handleEnemySpawns() {
  const stage = stages[currentStageIndex];
  stage.enemySpawns.forEach(spawn => {
    if (!spawn.spawned && playerX + canvas.width >= spawn.x) {
      const enemyY = spawn.y !== undefined ? spawn.y : null;

      if (spawn.type === "block") {
        blocks.push({
          x: spawn.x,
          y: enemyY !== null ? enemyY : (GROUND_Y - 48),
          w: spawn.w || 48,
          h: spawn.h || 48
        });
      } else {
        spawnEnemy(spawn.type, enemyY);
      }

      spawn.spawned = true;
    }
  });
}

// =========================
// ステージクリア判定
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
// フェード処理
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
// ゲームオーバー
function handleGameOver() {
  isGameOver = true;
  playerControlLocked = true;
  showMessage("ゲームオーバー！", 2000);
  setTimeout(() => location.reload(), 2500);
}

// =========================
// ステージリセット
function resetStageState() {
  player.x = window.innerWidth / 4;
  player.y = 360;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  playerX = 0;
  bgX = 0;
  enemies.length = 0;
  blocks.length = 0;
}

// =========================
// メインループ
let lastPlayerX = 0;   // ループ外で宣言しておく
let isScrolling = false;  // グローバル or export して使う

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ============================
  // ★ スクロール判定を追加
  // ============================
  if (playerX > lastPlayerX) {
    isScrolling = true;   // → スクロール中！
  } else {
    isScrolling = false;  // → 停止中
  }
  lastPlayerX = playerX;
  // ============================

  drawBackground();
  updatePlayer();
  updateEnemies();         // ← isScrolling の結果に合わせて速度を変える
  handleEnemySpawns();
  checkPlayerEnemyCollision();
  checkBlockCollision(playerX);
  checkStageClear();
  drawPlayer();
  drawEnemies();
  drawBlocks(playerX);
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
