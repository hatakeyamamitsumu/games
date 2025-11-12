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
let playerX = 0;
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

  if (keys["ArrowLeft"]) player.vx = -4;
  else if (keys["ArrowRight"]) player.vx = 4;
  else player.vx = 0;

  if (keys["Space"] && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  // === ★ 移動範囲を画面中央1/3に制限 ===
  const centerStart = canvas.width / 3;
  const centerEnd = canvas.width * 2 / 3;
  if (player.x < centerStart) player.x = centerStart;
  if (player.x + player.w > centerEnd) player.x = centerEnd - player.w;
  // =====================================

  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  player.frameTimer++;
  if (player.frameTimer > 10) {
    player.frame = (player.frame + 1) % player.frameMax;
    player.frameTimer = 0;
  }

  playerX += Math.max(player.vx, 0);

  // === ダメージ無敵時間の減少 ===
  if (damageCooldown > 0) damageCooldown--;
}
// =========================
// スコア描画
// =========================
function drawScore() {
  const fontSize = 28;
  ctx.font = `${fontSize}px Arial Black`;
  
  // 文字の影
  ctx.shadowColor = "black";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // グラデーションを作る
  const gradient = ctx.createLinearGradient(0, 0, 0, fontSize);
  gradient.addColorStop(0, "orange");
  gradient.addColorStop(0.5, "yellow");
  gradient.addColorStop(1, "yellow");
  ctx.fillStyle = gradient;
  
  // スコアを描画
  ctx.fillText(`Score: ${score}`, canvas.width - 160, 40);
  
  // アウトライン（縁取り）
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.strokeText(`Score: ${score}`, canvas.width - 160, 40);

  // 影をリセット（他の描画に影が影響しないように）
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// =========================
// 背景描画
// =========================
function drawBackground() {
  const bgWidth = bgImg.width;
  const bgHeight = bgImg.height;

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

  // ダメージ時の赤丸（パッと一瞬だけ）
  if (damageCooldown > 0) {
    const centerX = player.x + player.w / 2;
    const centerY = player.y + player.h / 2;
    const radius = Math.max(player.w, player.h) / 2;

    // 一瞬だけ表示：damageCooldown が偶数フレームのときだけ描画
    if (damageCooldown % 4 === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,0,0,0.6)"; // 半透明赤
      ctx.fill();
    }
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

  // HP割合
  const ratio = Math.max(0, playerHP / maxHP);
  const currentWidth = barWidth * ratio;

  // 背景（灰色）
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

  // 残量バーの色（緑→黄→赤）
  const color =
    ratio > 0.6 ? "#00FF00" :
    ratio > 0.3 ? "#FFFF00" :
    "#FF0000";

  ctx.fillStyle = color;
  ctx.fillRect(x, y, currentWidth, barHeight);

  // 外枠
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

    if (collide) {
      const playerBottom = player.y + player.h;
      const enemyTop = enemy.y;

      // === 上から踏んだ判定 ===
      if (player.vy > 0 && playerBottom - enemyTop < 15) {
        if (enemy.canBeStomped) {
          // 踏んで倒せる敵の場合
          enemies.splice(index, 1);
          player.vy = -8;

          // スコア加算（敵ごとに値を変えられる）
          const points = enemy.scoreValue || 10;
          score += points;

          // （任意）エフェクトやメッセージも追加可
          // showMessage(`+${points}点！`, 500);
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
    }
  });
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
// 敵スポーン処理
// =========================
function handleEnemySpawns() {
  const stage = stages[currentStageIndex];
  stage.enemySpawns.forEach(spawn => {
    if (!spawn.spawned && playerX + canvas.width >= spawn.x) {
      const enemyY = spawn.y !== undefined ? spawn.y : null;
      spawnEnemy(spawn.type, enemyY);
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
  checkStageClear();
  drawPlayer();
  drawEnemies();
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
