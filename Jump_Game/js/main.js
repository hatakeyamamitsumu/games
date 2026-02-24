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


//const canvas = document.getElementById("game");
const GAME_W = 960;
const GAME_H = 540;

function resizeCanvas() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const scale = Math.min(vw / GAME_W, vh / GAME_H);

  canvas.style.width  = GAME_W * scale + "px";
  canvas.style.height = GAME_H * scale + "px";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== グローバル変数 =====
let blocks = [], enemies = [], boss = null, foregroundBlocks = [];
let score = 0, lives = 3, cameraX = 0;
let invincible = false, invincibleTimer = 0;
let isPaused = false, isStageCleared = false, clearTimer = 0;
let isGameEnding = false;
let isGameOver = false;   // ★追加

// ===== キー & ボタン =====
const keys = { left:false, right:false, jump:false, b:false };
const prevKeys = { left:false, right:false, jump:false, b:false };

const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");
const btnJump = document.getElementById("jump");
const btnB = document.getElementById("b");

// タッチ & マウス対応
[[btnLeft,'left'],
 [btnRight,'right'],
 [btnJump,'jump'],
 [btnB,'b']]   // ← 追加
.forEach(([btn,key])=>{
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

window.addEventListener("keydown", e=>{
  if(e.code==="ArrowLeft") keys.left=true;
  if(e.code==="ArrowRight") keys.right=true;
  if(e.code==="Space") keys.jump=true;
  if(e.code==="KeyX") keys.b=true;   // ← 追加
});
window.addEventListener("keyup", e=>{
  if(e.code==="ArrowLeft") keys.left=false;
  if(e.code==="ArrowRight") keys.right=false;
  if(e.code==="Space") keys.jump=false;
  if(e.code==="KeyX") keys.b=false;  // ← 追加
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

  // 初期化
  for (const b of blocks) {

    // ===== 落ちる床 =====
    if (b.type === 5) {
      b.initX = b.initX ?? b.x;
      b.initY = b.initY ?? b.y;
      b.fall = false;
      b.vy = 0;
      b.timer = 0;
      b.wait = 0;
      b.resetDelay = b.resetDelay ?? 180;
    }

    // ===== 横に動く床 =====
    if (b.type === 4) {
      b.startX = b.startX ?? b.x;
      b.dir = b.dir ?? 1;
      b.speed = b.speed ?? 2;
      b.range = b.range ?? 200;
    }

    // ===== 上下に動く床 =====
    if (b.type === 7) {
      b.startY = b.startY ?? b.y;
      b.dir = b.dir ?? 1;
      b.speed = b.speed ?? 2;
      b.range = b.range ?? 150;
    }

    // ===== 滑る床 =====
    if (b.type === 8) {
      b.slippery = true;
    }

    // ===== 円運動する床（block11） =====
    if (b.type === 11) {
      // 円の中心（初期位置を基準に固定）
      b.cx = b.cx ?? b.x;
      b.cy = b.cy ?? b.y;

      // 円運動パラメータ
      b.angle = b.angle ?? 0;
      b.radius = b.radius ?? 60;
      b.speed = b.speed ?? 0.03;

      // 前フレーム位置（乗っているキャラを動かす用）
      b.prevX = b.x;
      b.prevY = b.y;
    }

// ===== 円運動する床（block12：反時計回り）=====
if (b.type === 12) {
  b.cx = b.cx ?? b.x;
  b.cy = b.cy ?? b.y;

  b.angle  = b.angle  ?? 0;
  b.radius = b.radius ?? 60;
  b.speed  = b.speed  ?? 0.03;

  b.prevX = b.x;
  b.prevY = b.y;
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
// ============================
// デスサウンド（3音・低音版）
// ============================
function playDeathSound(){

  if (!window.audioCtx) {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  const ctxAudio = window.audioCtx;
  const now = ctxAudio.currentTime;

  const notes = [150, 100, 60]; // 低音3音

  notes.forEach((freq, i) => {

    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();

    const startTime = now + i * 0.15;

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

    osc.connect(gain);
    gain.connect(ctxAudio.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.2);
  });
}

function killPlayer(){

  if (isGameOver || isPaused) return;

  playDeathSound();   // ← ここだけでOK

  lives--;
  fadeOutAudio(bgm,1000);

  if(lives > 0){

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
    isGameOver = true;

    setTimeout(()=>{
      playGameoverBGM();
    },1000);
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

  // 🔥 フルスクリーン化（追加）
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }

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

// ===== AABB 衝突判定（player / enemy） =====
function handleBlockCollision(e, b){

    if (b.type >= 13 && b.type <= 33) {
    // 見た目だけ。完全スルー
    return;
    }

  const ex1 = e.x, ex2 = e.x + e.w;
  const ey1 = e.y, ey2 = e.y + e.h;
  const bx1 = b.x, bx2 = b.x + b.w;
  const by1 = b.y, by2 = b.y + b.h;

  // 衝突なし
  if (ex2 <= bx1 || ex1 >= bx2 || ey2 <= by1 || ey1 >= by2) return;

  // ======== 条件付きすり抜け床（type:10） ========
  if (b.type === 10) {

    // 下から来た場合は常にすり抜け
    if (ey1 > by2 - 5) return;

    // 上から落ちてきた場合
    const fromAbove = (e.vy >= 0 && ey2 > by1);
    if (!fromAbove) return;

    // プレイヤーが動いているか
    let moving = true;
    if (e === player) {
      moving =
        keys.left ||
        keys.right ||
        keys.jump;
    }

    // 動いていなければ床にならない
    if (!moving) return;

    // 着地
    e.y = by1 - e.h;
    e.vy = 0;
    e.onGround = true;
    return;
  }
  // ======== ここまで type:10 ========

  const overlapX = Math.min(ex2 - bx1, bx2 - ex1);
  const overlapY = Math.min(ey2 - by1, by2 - ey1);

  if (overlapY < overlapX) {
    // ===== Y方向衝突 =====
    if (ey2 - by1 <= by2 - ey1) {
      // 上から
      e.y = by1 - e.h;
      e.vy = 0;
      e.onGround = true;

      // 横に動く床
      if (b.type === 4) e.x += b.dir * b.speed;

      // 上下に動く床
      if (b.type === 7) e.y += b.dir * b.speed;

      // 落ちる床
      if (b.type === 5 && !b.fall) {
        b.fall = true;
        b.vy = 0;
        b.timer = 0;
      }

      // 跳ねる床
      if (b.type === 6 && e === player) {
        e.vy = -20;
        e.onGround = false;
      }
// 斜めジャンプ台（右前）
if (b.type === 55 && e === player) {
  e.vy = -30;   // 上方向
  e.vx = 30;    // 右方向
  e.onGround = false;
}
// 斜めジャンプ台（右前）
if (b.type === 56 && e === player) {
  e.vy = -30;   // 上方向
  e.vx = -30;    // 右方向
  e.onGround = false;
}
      // 滑る床
      if (b.type === 8 && e === player) {
        e.friction = 0.00;
        player.onSlippery = true;
      } else {
        e.friction = 0.1;
        player.onSlippery = false;
      }

    } else {
      // 下から
      e.y = by2;
      if (e.vy < 0) e.vy = 0;
    }

  } else {
    // ===== X方向衝突 =====
    if (ex2 - bx1 < bx2 - ex1) e.x = bx1 - e.w;
    else e.x = bx2;

    if (b.type === 4) e.x += b.dir * b.speed;
    e.vx = 0;
  }
}



// ===== メインループ =====
function loop(){

  const hudData = {
    stage: stage + 1,
    score,
    lives,
    hp: player.hp,
    maxHp: player.maxHp,
    invincible
  };

 render(
  ctx,
  cameraX,
  blocks,
  enemies,
  boss,
  player,
  hudData,
  isStageCleared,
  bgImage,
  hudData.stage 
);

  if(isStageCleared || lives <= 0 || isPaused || isGameEnding){
    if(isStageCleared && performance.now() - clearTimer > 5000){
      startStage(stage + 1);
    }
    requestAnimationFrame(loop);
    return;
  }

  player.keys = keys;

  // ===== ブロック更新 =====
  for(const b of blocks){

    // ===== 横に動く床 =====
    if(b.type === 4){
      b.x += (b.dir ?? 1) * (b.speed ?? 2);
      if(b.x > (b.startX ?? b.x) + (b.range ?? 200)) b.dir = -1;
      if(b.x < (b.startX ?? b.x)) b.dir = 1;
    }

    // ===== 上下に動く床 =====
    if(b.type === 7){
      b.y += (b.dir ?? 1) * (b.speed ?? 2);
      if(b.y > (b.startY ?? b.y) + (b.range ?? 150)) b.dir = -1;
      if(b.y < (b.startY ?? b.y)) b.dir = 1;

      const onPlayer =
        player.x + player.w > b.x &&
        player.x < b.x + b.w &&
        player.y + player.h >= b.y - 4 &&
        player.y + player.h <= b.y + 20;
      if(onPlayer) player.y += b.dir * b.speed;

      for(const e of enemies){
        const onE =
          e.x + e.w > b.x &&
          e.x < b.x + b.w &&
          e.y + e.h >= b.y - 4 &&
          e.y + e.h <= b.y + 20;
        if(onE) e.y += b.dir * b.speed;
      }
    }

    // ===== 落ちる床 =====
    if(b.type === 5){
      if(!b.fall){
        const onPlayer =
          player.x + player.w > b.x &&
          player.x < b.x + b.w &&
          player.y + player.h >= b.y - 4 &&
          player.y + player.h <= b.y + 20;
        if(onPlayer) b.wait++;
        else b.wait = 0;

        if(b.wait >= 180){
          b.fall = true;
          b.wait = 0;
        }
        continue;
      }

      b.vy += 0.5;
      if(b.vy > 12) b.vy = 12;
      b.y += b.vy;
      b.timer++;

      const onPlayer2 =
        player.x + player.w > b.x &&
        player.x < b.x + b.w &&
        player.y + player.h >= b.y - 4 &&
        player.y + player.h <= b.y + 20;
      if(onPlayer2) player.y += b.vy;

      for(const e of enemies){
        const onE =
          e.x + e.w > b.x &&
          e.x < b.x + b.w &&
          e.y + e.h >= b.y - 4 &&
          e.y + e.h <= b.y + 20;
        if(onE) e.y += b.vy;
      }

      if(b.timer >= b.resetDelay){
        b.y = b.initY;
        b.vy = 0;
        b.fall = false;
        b.timer = 0;
        b.wait = 0;
      }
    }

    // ===== 円運動する床（block11）=====
    if(b.type === 11){

      // 初期化（1回だけ）
      if(b.angle === undefined){
        b.angle = 0;
        b.cx = b.cx ?? b.x;
        b.cy = b.cy ?? b.y;
        b.radius = b.radius ?? 80;
        b.speed = b.speed ?? 0.03;
      }

      // 前フレーム位置保存
      b.prevX = b.x;
      b.prevY = b.y;

      // 円運動
      b.angle += b.speed;
      b.x = b.cx + Math.cos(b.angle) * b.radius;
      b.y = b.cy + Math.sin(b.angle) * b.radius;

      // プレイヤー追従
      const onPlayer =
        player.x + player.w > b.x &&
        player.x < b.x + b.w &&
        player.y + player.h >= b.y - 4 &&
        player.y + player.h <= b.y + 20;

      if(onPlayer){
        player.x += b.x - b.prevX;
        player.y += b.y - b.prevY;
      }

      // 敵追従
      for(const e of enemies){
        const onE =
          e.x + e.w > b.x &&
          e.x < b.x + b.w &&
          e.y + e.h >= b.y - 4 &&
          e.y + e.h <= b.y + 20;
        if(onE){
          e.x += b.x - b.prevX;
          e.y += b.y - b.prevY;
        }
      }
    }
    // ===== 円運動する床（block12：反時計回り）=====
if (b.type === 12){

  // 初期化（1回だけ）
  if(b.angle === undefined){
    b.angle = 0;
    b.cx = b.cx ?? b.x;
    b.cy = b.cy ?? b.y;
    b.radius = b.radius ?? 80;
    b.speed = b.speed ?? 0.03;
  }

  // 前フレーム位置保存
  b.prevX = b.x;
  b.prevY = b.y;

  // ★ 反時計回り（ここだけ違う）
  b.angle -= b.speed;

  b.x = b.cx + Math.cos(b.angle) * b.radius;
  b.y = b.cy + Math.sin(b.angle) * b.radius;

  // プレイヤー追従
  const onPlayer =
    player.x + player.w > b.x &&
    player.x < b.x + b.w &&
    player.y + player.h >= b.y - 4 &&
    player.y + player.h <= b.y + 20;

  if(onPlayer){
    player.x += b.x - b.prevX;
    player.y += b.y - b.prevY;
  }

  // 敵追従
  for(const e of enemies){
    const onE =
      e.x + e.w > b.x &&
      e.x < b.x + b.w &&
      e.y + e.h >= b.y - 4 &&
      e.y + e.h <= b.y + 20;
    if(onE){
      e.x += b.x - b.prevX;
      e.y += b.y - b.prevY;
    }
  }
}

  }

  // ===== プレイヤー更新 =====
  player.vy += 0.5;
  if(player.vy > 10) player.vy = 10;

  // 摩擦（滑る床）
  let friction = 0.1;
  for(const b of blocks){
    if(b.type === 8 &&
       player.x + player.w > b.x &&
       player.x < b.x + b.w &&
       player.y + player.h >= b.y - 4 &&
       player.y + player.h <= b.y + 20){
      friction = 0.02;
      break;
    }
  }

  if(keys.left) player.vx = -3;
  else if(keys.right) player.vx = 3;
  else player.vx *= 1 - friction;

  player.x += player.vx;
  player.y += player.vy;
  player.onGround = false;

  for(const b of blocks){
    handleBlockCollision(player, b);
  }

  if(keys.jump && player.onGround){
    player.vy = -12;
    player.onGround = false;
  }

  // ===== 敵更新 =====
  updateEnemies(enemies, blocks);
  updateBoss(boss, blocks);

  for(const e of enemies){
    if(e.type === "rush") continue;
    for(const b of blocks){
      handleBlockCollision(e, b);
    }
  }

  // 無敵解除
  if(invincible && performance.now() - invincibleTimer > 1500){
    invincible = false;
  }

  // 落下死
  if(player.y > SCREEN_H){
    invincible = true;
    killPlayer();
    setTimeout(() => invincible = false, 0);

    requestAnimationFrame(loop);
    return;
  }

// ダメージ判定
if(!invincible){

  const hitResult = checkEnemyHit(enemies);

  if (hitResult === "1up") {
    lives += 1;                 // ★ 残機アップ
  }
  else if (hitResult === "hit") {
    takeDamage(1);
  }

  const bossState = checkBossHit(boss);
  if(bossState === "hit") takeDamage(1);
  else if(bossState === "dead"){
    score += 1000;
    bgm.pause();
    playClearBGM(stage);
    isStageCleared = true;
    clearTimer = performance.now();
  }
}


  // ゴール
  if(player.x > 1800){
    score += 500;
    bgm.pause();
    playClearBGM(stage);
    isStageCleared = true;
    clearTimer = performance.now();
  }

  // カメラ
  cameraX = Math.max(player.x - 200, 0);

// --- クールタイム減少 ---
if (player.warpCooldown > 0) {
  player.warpCooldown--;
}


// --- Bボタン：最上空ワープ＋HP消費＋5秒クール ---
if (
  keys.b &&
  !prevKeys.b &&
  player.hp > 1 &&
  player.warpCooldown === 0
) {

  player.hp--;               // HPを1減少
  player.warpCooldown = 300; // 5秒クール（60fps想定）

  player.y = 0;              // 最上空へ
  player.vy = 2;             // 落下開始
  player.onGround = false;
}


// キー状態更新（必ず最後）
Object.assign(prevKeys, keys);

requestAnimationFrame(loop);
}