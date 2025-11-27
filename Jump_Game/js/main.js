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

// ===== スマホ操作フラグ =====
let leftPressed = false;
let rightPressed = false;
let jumpPressed = false;

// ===== ボタンイベント設定 =====
document.getElementById('left').addEventListener('touchstart', e => { e.preventDefault(); leftPressed = true; });
document.getElementById('left').addEventListener('touchend', e => { e.preventDefault(); leftPressed = false; });

document.getElementById('right').addEventListener('touchstart', e => { e.preventDefault(); rightPressed = true; });
document.getElementById('right').addEventListener('touchend', e => { e.preventDefault(); rightPressed = false; });

document.getElementById('jump').addEventListener('touchstart', e => { e.preventDefault(); jumpPressed = true; });
document.getElementById('jump').addEventListener('touchend', e => { e.preventDefault(); jumpPressed = false; });

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

// ===== フリーズ管理 =====
let isPaused = false;

// ===== プレイヤーHP =====
player.maxHp = 3;
player.hp = player.maxHp;

// ===== ステージクリア関連 =====
let isStageCleared = false;
let clearTimer = 0;

// ===== BGM管理 =====
let bgm = new Audio();
bgm.loop = true;
bgm.volume = 0.5;

let clearBGM = new Audio();
clearBGM.loop = false;
clearBGM.volume = 0.7;

function playBGM(stageNumber) {
  const url = `./sounds/BGM/bgm${stageNumber + 1}.mp3`;
  bgm.src = url;
  bgm.pause();
  bgm.currentTime = 0;
  bgm.play().catch(_ => console.log("BGM再生待ち（タップ必要）"));
}

function playClearBGM(stageNumber) {
  const url = `./sounds/BGM/clear_bgm${stageNumber + 1}.mp3`;
  clearBGM.src = url;
  clearBGM.pause();
  clearBGM.currentTime = 0;
  clearBGM.play().catch(_ => console.log("クリアBGM再生待ち（タップ必要）"));
}

let gameoverBGM = new Audio();
gameoverBGM.loop = false;
gameoverBGM.volume = 0.7;

function playGameoverBGM() {
  const url = "./sounds/BGM/gameover_bgm1.mp3";
  gameoverBGM.src = url;
  gameoverBGM.pause();
  gameoverBGM.currentTime = 0;
  gameoverBGM.play().catch(_ => console.log("GAME OVER BGM再生待ち"));
}

function fadeOutAudio(audio, duration = 1000) {
  const fadeSteps = 20;
  const fadeInterval = duration / fadeSteps;
  let volume = audio.volume;

  const fadeTimer = setInterval(() => {
    volume -= 1 / fadeSteps;
    if (volume <= 0) {
      audio.volume = 0;
      audio.pause();
      clearInterval(fadeTimer);
    } else {
      audio.volume = volume;
    }
  }, fadeInterval);
}

// ===== 背景 =====
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
  player.hp = player.maxHp;

  isStageCleared = false;

  clearBGM.pause();
  clearBGM.currentTime = 0;
  playBGM(s);

  loadBackground(s);

  invincible = false;
}

// ===== プレイヤー死亡 / ダメージ処理 =====
function takeDamage(amount = 1) {
  if (invincible || isPaused) return;

  player.hp -= amount;
  if (player.hp <= 0) {
    killPlayer();
  } else {
    invincible = true;
    invincibleTimer = performance.now();
  }
}

function killPlayer() {
  lives--;

  if (lives > 0) {
    fadeOutAudio(bgm, 1000);

    isPaused = true;
    invincible = true;
    player.hp = player.maxHp;

    setTimeout(() => {
      startStage(stage);
      bgm.volume = 0.5;
      invincible = false;
      isPaused = false;
    }, 3000);

  } else {
    console.log("GAME OVER");

    fadeOutAudio(bgm, 1000);
    clearBGM.pause();

    setTimeout(() => {
      playGameoverBGM();
    }, 1000);
  }
}

startStage(0);

// ===== メインループ =====
function loop() {
  const hudData = {
    stage: stage + 1,
    score: score,
    lives: lives,
    hp: player.hp,
    maxHp: player.maxHp,
    invincible: invincible
  };

  if (isStageCleared) {
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, true, bgImage);
    if (performance.now() - clearTimer > 5000) startStage(stage + 1);
    requestAnimationFrame(loop);
    return;
  }

  if (lives <= 0) {
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, false, bgImage);
    requestAnimationFrame(loop);
    return;
  }

  if (isPaused) {
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);
    requestAnimationFrame(loop);
    return;
  }

  // ===== ★ スマホ操作反映 ★
  if(leftPressed) player.vx = -player.speed;
  else if(rightPressed) player.vx = player.speed;
  else player.vx = 0;

  if(jumpPressed && player.onGround) {
    player.vy = -player.jumpPower;
    player.onGround = false;
  }

  updatePlayer(blocks);
  updateEnemies(enemies, blocks);
  updateBoss(boss, blocks);

  if (invincible && performance.now() - invincibleTimer > 1500) invincible = false;

  if (player.y > SCREEN_H) {
    killPlayer();
    requestAnimationFrame(loop);
    return;
  }

  if (!invincible) {
    if (checkEnemyHit(enemies) === "hit") takeDamage(1);

    const bossState = checkBossHit(boss);
    if (bossState === "hit") takeDamage(1);

    if (bossState === "dead") {
      score += 1000;
      bgm.pause();
      playClearBGM(stage);

      isStageCleared = true;
      clearTimer = performance.now();
    }
  }

  if (player.x > 1800) {
    score += 500;
    bgm.pause();
    playClearBGM(stage);

    isStageCleared = true;
    clearTimer = performance.now();
  }

  cameraX = player.x - 200;
  if (cameraX < 0) cameraX = 0;

  render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);

  requestAnimationFrame(loop);
}

loop();
