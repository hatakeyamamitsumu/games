// ========== main.js ==========
import { SCREEN_W, SCREEN_H } from "./config.js";
import { player, updatePlayer, resetPlayer } from "./player.js";
import {
  updateEnemies, checkEnemyHit,
  updateBoss, checkBossHit
} from "./enemy.js";
import { loadStage, stage } from "./stage.js";
import { render } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== グローバル変数 =====
let blocks = [];
let enemies = [];
let boss = null;

let score = 0;
let lives = 3;
let cameraX = 0;

// 無敵時間フラグ
let invincible = false;
let invincibleTimer = 0;

// ===== ステージクリア関連 =====
let isStageCleared = false;
let clearTimer = 0;

// ===== BGM管理（通常BGM & クリアBGM） =====
let bgm = new Audio();
bgm.loop = true;
bgm.volume = 0.5;

let clearBGM = new Audio();
clearBGM.loop = false;
clearBGM.volume = 0.7;

// ▼ 通常BGM
function playBGM(stageNumber) {
  const url = `./sounds/BGM/bgm${stageNumber + 1}.mp3`;
  bgm.src = url;
  bgm.pause();
  bgm.currentTime = 0;
  bgm.play().catch(_ => console.log("BGM再生待ち（タップ必要）"));
}

// ▼ クリアBGM
function playClearBGM(stageNumber) {
  const url = `./sounds/BGM/clear_bgm${stageNumber + 1}.mp3`;
  clearBGM.src = url;
  clearBGM.pause();
  clearBGM.currentTime = 0;
  clearBGM.play().catch(_ => console.log("クリアBGM再生待ち（タップ必要）"));
}

// ===== 背景管理 =====
let bgImage = new Image();

function loadBackground(stageNumber) {
  bgImage.src = `./images/graphics/background${stageNumber + 1}.png`;
}

// ===== ステージ開始 =====
function startStage(s) {
  const data = loadStage(s);

  blocks = data.blocks;
  enemies = data.enemies;
  boss = data.boss;

  resetPlayer();

  // クリア状態解除
  isStageCleared = false;

  // クリアBGM停止
  clearBGM.pause();
  clearBGM.currentTime = 0;

  // 通常BGM再生
  playBGM(s);

  // 背景画像読み込み
  loadBackground(s);

  // 無敵解除
  invincible = false;
}

startStage(0);

// ===== メインループ =====
function loop() {
  // 描画用HUDオブジェクト
  const hudData = {
    stage: stage + 1,
    score: score,
    lives: lives,
    invincible: invincible
  };

  // ★★ ステージクリア演出中 ★★
  if (isStageCleared) {
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);

    // 5秒後に次ステージへ
    if (performance.now() - clearTimer > 5000) {
      startStage(stage + 1);
    }

    requestAnimationFrame(loop);
    return;
  }

  // ===== ゲームオーバー =====
  if (lives <= 0) {
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);
    requestAnimationFrame(loop);
    return;
  }

  // ===== 通常更新 =====
  updatePlayer(blocks);
  updateEnemies(enemies, blocks);
  updateBoss(boss, blocks);

  // ===== 無敵時間の更新 =====
  if (invincible && performance.now() - invincibleTimer > 1500) {
    invincible = false;
  }

  // ===== 当たり判定（無敵中は無効） =====
  if (!invincible) {

    if (checkEnemyHit(enemies) === "hit") {
      lives--;
      invincible = true;
      invincibleTimer = performance.now();
    }

    const bossState = checkBossHit(boss);
    if (bossState === "hit") {
      lives--;
      invincible = true;
      invincibleTimer = performance.now();
    }

    if (bossState === "dead") {
      score += 1000;
      bgm.pause();
      playClearBGM(stage);

      isStageCleared = true;
      clearTimer = performance.now();
    }
  }

  // ===== ゴール判定 =====
  if (player.x > 1800) {
    score += 500;
    bgm.pause();
    playClearBGM(stage);

    isStageCleared = true;
    clearTimer = performance.now();
  }

  // ===== カメラ動作 =====
  cameraX = player.x - 200;
  if (cameraX < 0) cameraX = 0;

  // ===== 描画 =====
  render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);

  requestAnimationFrame(loop);
}

loop();
