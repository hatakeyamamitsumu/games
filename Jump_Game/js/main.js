// ========== main.js ==========
import { SCREEN_H } from "./config.js";
import { player, resetPlayer } from "./player.js";
import { updateEnemies, checkEnemyHit, updateBoss, checkBossHit } from "./enemy.js";
import { loadStage, stage, LEVELS } from "./stage.js";
import { render } from "./render.js";

const totalStages = LEVELS.length;

// ===== canvas =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== グローバル変数 =====
let blocks = [], enemies = [], boss = null;
let score = 0, lives = 3, cameraX = 0;
let invincible = false, invincibleTimer = 0;
let isPaused = false, isStageCleared = false, clearTimer = 0;
let isGameEnding = false;

// ===== キー & ボタン =====
const keys = { left:false, right:false, jump:false };
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");
const btnJump = document.getElementById("jump");

// タッチ & マウス対応
[[btnLeft,'left'],[btnRight,'right'],[btnJump,'jump']].forEach(([btn,key])=>{
  ['mousedown','touchstart'].forEach(evt=>{
    btn.addEventListener(evt, e=>{
      if(e.type==='touchstart') e.preventDefault();
      keys[key]=true;
    });
  });
  ['mouseup','mouseleave','touchend'].forEach(evt=>{
    btn.addEventListener(evt, e=>{
      if(e.type==='touchend') e.preventDefault();
      keys[key]=false;
    });
  });
});

// キーボード
window.addEventListener("keydown", e=>{
  if(e.code==="ArrowLeft") keys.left=true;
  if(e.code==="ArrowRight") keys.right=true;
  if(e.code==="Space") keys.jump=true;
});
window.addEventListener("keyup", e=>{
  if(e.code==="ArrowLeft") keys.left=false;
  if(e.code==="ArrowRight") keys.right=false;
  if(e.code==="Space") keys.jump=false;
});

// ===== BGM =====
let bgm = new Audio(), clearBGM = new Audio(), gameoverBGM = new Audio();
bgm.loop = true; bgm.volume = 0.5;
clearBGM.loop = false; clearBGM.volume = 0.7;
gameoverBGM.loop = false; gameoverBGM.volume = 0.7;

function playAudio(audio, src){
  audio.src = src;
  audio.pause();
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

function playBGM(stageNumber){ playAudio(bgm, `./sounds/BGM/bgm${stageNumber+1}.mp3`); }
function playClearBGM(stageNumber){ playAudio(clearBGM, `./sounds/BGM/clear_bgm${stageNumber+1}.mp3`); }
function playGameoverBGM(){ playAudio(gameoverBGM, "./sounds/BGM/gameover_bgm1.mp3"); }

function fadeOutAudio(audio,duration=1000){
  const steps=20, interval=duration/steps;
  let vol = audio.volume;
  const timer = setInterval(()=>{
    vol -= 1/steps;
    if(vol <= 0){ audio.volume=0; audio.pause(); clearInterval(timer); }
    else audio.volume = vol;
  }, interval);
}

// ===== 背景 =====
let bgImage = new Image();
function loadBackground(stageNumber){ bgImage.src = `./images/graphics/background${stageNumber+1}.png`; }

// ===== ステージ開始 =====
function startStage(s){
  if(s >= totalStages){
    showEndingScreen();
    return;
  }

  const data = loadStage(s);
  blocks = data.blocks;
  enemies = data.enemies;
  boss = data.boss;

  // 初期化：落ちる床(type:5) の初期位置等をセットしておく
  for (const b of blocks) {
    if (b.type === 5) {
      b.initX = b.initX ?? b.x;
      b.initY = b.initY ?? b.y;
      b.fall = false;
      b.vy = 0;
      b.timer = 0;
      b.resetDelay = b.resetDelay ?? 180; // フレーム数（180 ≒ 3秒）
    }
    if (b.type === 4) { // 動く床の初期化
      b.startX = b.startX ?? b.x;
      b.dir = b.dir ?? 1;
      b.speed = b.speed ?? 2;
      b.range = b.range ?? 200;
    }
  }

  resetPlayer();
  player.hp = player.maxHp;
  isStageCleared = false;
  invincible = false;
  isGameEnding = false;

  playBGM(s);
  loadBackground(s);
}

// ===== プレイヤーダメージ / 死亡 =====
function takeDamage(amount=1){
  if(invincible || isPaused) return;
  player.hp -= amount;
  if(player.hp <= 0) killPlayer();
  else { invincible=true; invincibleTimer=performance.now(); }
}

function killPlayer(){
  lives--;
  fadeOutAudio(bgm,1000);

  if(lives>0){
    isPaused = true;
    invincible = true;
    player.hp = player.maxHp;

    setTimeout(()=>{
      startStage(stage);
      bgm.volume = 0.5;
      invincible = false;
      isPaused = false;
    },3000);
  } else {
    clearBGM.pause();
    setTimeout(()=>playGameoverBGM(),1000);
  }
}

// ===== タイトル & エンディング =====
const startButton = document.getElementById("startButton");
const titleScreen = document.getElementById("titleScreen");

const endingScreen = document.createElement("div");
endingScreen.id = "endingScreen";
endingScreen.innerHTML = `<div class="endingText">Congratulations!</div>`;
document.body.appendChild(endingScreen);

const style = document.createElement("style");
style.textContent = `
#endingScreen {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: linear-gradient(45deg, #ff66aa, #ffaa44);
  color: white;
  font-size: 3em;
  z-index: 3000;
  text-align: center;
}
.endingText {
  animation: glow 1.5s ease-in-out infinite alternate;
}
@keyframes glow {
  0%   { text-shadow: 0 0 4px #fff; }
  100% { text-shadow: 0 0 20px #fff; }
}
`;
document.head.appendChild(style);

startButton.addEventListener("click", ()=>{
  titleScreen.style.display = "none";
  document.getElementById("hud").style.display = "block";
  score = 0;
  lives = 3;
  startStage(0);
  bgm.play().catch(()=>{});
  loop();
});

function showEndingScreen(){
  isGameEnding = true;
  endingScreen.style.display = "flex";
  fadeOutAudio(bgm,1000);
  clearBGM.pause();
}

// ===== AABB 衝突判定（ブロックとオブジェクト e の衝突を解決） =====
function handleBlockCollision(e, b) {
  // e: オブジェクト（player または enemy）
  // b: ブロック（type フラグを持つ）
  const ex1 = e.x, ex2 = e.x + e.w;
  const ey1 = e.y, ey2 = e.y + e.h;
  const bx1 = b.x, bx2 = b.x + b.w;
  const by1 = b.y, by2 = b.y + b.h;

  // 衝突していなければ何もしない
  if (ex2 <= bx1 || ex1 >= bx2 || ey2 <= by1 || ey1 >= by2) return;

  const overlapX = Math.min(ex2 - bx1, bx2 - ex1);
  const overlapY = Math.min(ey2 - by1, by2 - ey1);

  if (overlapY < overlapX) {
    // ===== Y方向の衝突 =====

    // --- 上から衝突（e がブロックの上にいる） ---
    if (ey2 - by1 <= by2 - ey1) {

      // ===== 通常の床処理 =====
      e.y = by1 - e.h;
      e.vy = 0;
      e.onGround = true;

      // 動く床(type 4)なら横へ押し出す
      if (b.type === 4) {
        e.x += b.dir * b.speed;
      }

      // ===== 落ちる床 (type:5) の落下開始 =====
      if (b.type === 5 && !b.fall) {
        b.fall = true;
        b.vy = 0;
        b.timer = 0;
      }

      // ===== 跳ねる床 (type:6) =====
      if (b.type === 6 && e === player) {
        e.vy = -20;  // ★ ジャンプ力
        e.onGround = false;
      }

    } else {
      // --- 下からぶつかった（頭をぶつけた） ---
      e.y = by2;
      if (e.vy < 0) e.vy = 0;
    }

  } else {
    // ===== X方向の衝突（左右） =====
    if (ex2 - bx1 < bx2 - ex1) {
      // 左から衝突
      e.x = bx1 - e.w;
      if (b.type === 4) e.x += b.dir * b.speed;
    } else {
      // 右から衝突
      e.x = bx2;
      if (b.type === 4) e.x += b.dir * b.speed;
    }

    e.vx = 0; // 水平速度を止める
  }
}


// ===== メインループ =====
function loop() {
  const hudData = {
    stage: stage + 1,
    score,
    lives,
    hp: player.hp,
    maxHp: player.maxHp,
    invincible
  };

  // ====== 先に描画する（HUD が必ず表示される）======
  render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);

  // 停止中は描画だけ続ける
  if (isStageCleared || lives <= 0 || isPaused || isGameEnding) {
    if (isStageCleared && performance.now() - clearTimer > 5000) {
      startStage(stage + 1);
    }
    requestAnimationFrame(loop);
    return;
  }

  // ===== 入力 =====
  player.keys = keys;

  // ===== ブロック更新 =====
for (const b of blocks) {

  // ---------- 動く床 ----------
  if (b.type === 4) {
    b.x += (b.dir ?? 1) * (b.speed ?? 2);
    if (b.x > (b.startX ?? b.x) + (b.range ?? 200)) b.dir = -1;
    if (b.x < (b.startX ?? b.x)) b.dir = 1;
  }

  // ---------- 落ちる床 ----------
  if (b.type === 5) {

    // 初期化
    b.initX = b.initX ?? b.x;
    b.initY = b.initY ?? b.y;
    b.fall = b.fall ?? false;
    b.vy = b.vy ?? 0;
    b.timer = b.timer ?? 0;
    b.wait = b.wait ?? 0;         // ★ 落下前の待機タイマー追加
    b.resetDelay = b.resetDelay ?? 180;

    // ★ 落下していないとき（プレイヤーが乗っているかチェック）
    if (!b.fall) {

      const onPlayer =
        player.x + player.w > b.x &&
        player.x < b.x + b.w &&
        player.y + player.h >= b.y - 4 &&
        player.y + player.h <= b.y + 20;

      if (onPlayer) {
        b.wait++; // 乗っている間カウント

        // ▼ 落下待機時間（ここを延ばせばOK）
        if (b.wait >= 120) {   // ← 120 = 約2秒
          b.fall = true;
          b.wait = 0;
        }
      } else {
        // プレイヤーが離れたらリセット
        b.wait = 0;
      }

      continue;
    }

    // ★ 落下中の処理 ----------
    b.vy += 0.5;
    if (b.vy > 12) b.vy = 12;
    b.y += b.vy;
    b.timer++;

    // プレイヤーを一緒に落とす
    const onPlayer2 =
      player.x + player.w > b.x &&
      player.x < b.x + b.w &&
      player.y + player.h >= b.y - 4 &&
      player.y + player.h <= b.y + 20;

    if (onPlayer2) player.y += b.vy;

    // 敵も一緒に落とす
    for (const e of enemies) {
      const onE =
        e.x + e.w > b.x &&
        e.x < b.x + b.w &&
        e.y + e.h >= b.y - 4 &&
        e.y + e.h <= b.y + 20;
      if (onE) e.y += b.vy;
    }

    // ★ 元の位置へ戻す
    if (b.timer >= b.resetDelay) {
      b.y = b.initY;
      b.vy = 0;
      b.fall = false;
      b.timer = 0;
      b.wait = 0;
    }
  }
}


  // ===== プレイヤー更新 =====
  player.vy += 0.5;
  if (player.vy > 10) player.vy = 10;

  if (keys.left) player.vx = -3;
  else if (keys.right) player.vx = 3;
  else player.vx = 0;

  player.x += player.vx;
  player.y += player.vy;
  player.onGround = false;

  for (const b of blocks) {
    handleBlockCollision(player, b);
  }

  if (keys.jump && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  // ===== 敵更新 =====
  updateEnemies(enemies, blocks);
  updateBoss(boss, blocks);

  for (const e of enemies) {
    if (e.type === "rush") continue;
    for (const b of blocks) {
      handleBlockCollision(e, b);
    }
  }

  // 無敵解除
  if (invincible && performance.now() - invincibleTimer > 1500) {
    invincible = false;
  }

  // 穴に落ちた
  if (player.y > SCREEN_H) {
    killPlayer();
    requestAnimationFrame(loop);
    return;
  }

  // 敵ダメージ判定
  if (!invincible) {
    if (checkEnemyHit(enemies) === "hit") takeDamage(1);

    const bossState = checkBossHit(boss);
    if (bossState === "hit") takeDamage(1);
    else if (bossState === "dead") {
      score += 1000;
      bgm.pause();
      playClearBGM(stage);
      isStageCleared = true;
      clearTimer = performance.now();
    }
  }

  // ゴール
  if (player.x > 1800) {
    score += 500;
    bgm.pause();
    playClearBGM(stage);
    isStageCleared = true;
    clearTimer = performance.now();
  }

  // カメラ
  cameraX = Math.max(player.x - 200, 0);

  // 次フレームへ
  requestAnimationFrame(loop);
}
