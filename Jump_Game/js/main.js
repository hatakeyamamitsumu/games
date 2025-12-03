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

// ===== AABB 衝突判定（動く床押し出し対応） =====
function handleBlockCollision(e, b) {
  const ex1 = e.x, ex2 = e.x + e.w;
  const ey1 = e.y, ey2 = e.y + e.h;
  const bx1 = b.x, bx2 = b.x + b.w;
  const by1 = b.y, by2 = b.y + b.h;

  if (ex2 <= bx1 || ex1 >= bx2 || ey2 <= by1 || ey1 >= by2) return;

  const overlapX = Math.min(ex2 - bx1, bx2 - ex1);
  const overlapY = Math.min(ey2 - by1, by2 - ey1);

  if (overlapY < overlapX) {
    // Y方向の衝突
    if (ey2 - by1 < by2 - ey1) {
      // 上から
      e.y = by1 - e.h;
      e.vy = 0;
      e.onGround = true;

      // 動く床なら横方向に押される
      if (b.type === 4) {
        e.x += b.dir * b.speed;
      }
    } else {
      // 下から
      e.y = by2;
      e.vy = 0;

      // 動く床なら上方向に押される（底面接触時）
      if (b.type === 4) {
        e.x += b.dir * b.speed;
      }
    }
  } else {
    // X方向の衝突
    if (ex2 - bx1 < bx2 - ex1) {
      // 左から
      e.x = bx1 - e.w;
      // 動く床なら押し出し
      if (b.type === 4) e.x += b.dir * b.speed;
    } else {
      // 右から
      e.x = bx2;
      if (b.type === 4) e.x += b.dir * b.speed;
    }
    e.vx = 0;
  }
}



// ===== メインループ =====
function loop(){
  const hudData = { stage: stage+1, score, lives, hp: player.hp, maxHp: player.maxHp, invincible };

  if(isStageCleared || lives<=0 || isPaused || isGameEnding){
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);
    if(isStageCleared && performance.now()-clearTimer>5000) startStage(stage+1);
    requestAnimationFrame(loop);
    return;
  }

  // 入力
  player.keys = keys;

  // ===== プレイヤー更新 =====
  player.vy += 0.5;
  if(player.vy > 10) player.vy = 10;

  if(keys.left) player.vx = -3;
  else if(keys.right) player.vx = 3;
  else player.vx = 0;

  player.x += player.vx;
  player.y += player.vy;
  player.onGround = false;

  for(const b of blocks){
    if(b.type===4){
      b.x += b.dir*b.speed;
      if(b.x > b.startX + b.range || b.x < b.startX) b.dir*=-1;
    }
    handleBlockCollision(player, b);
  }

  if(keys.jump && player.onGround){
    player.vy = -12;
    player.onGround = false;
  }

  // ===== 敵更新 =====
  updateEnemies(enemies, blocks);
  updateBoss(boss, blocks);

  // 無敵解除
  if(invincible && performance.now()-invincibleTimer>1500) invincible=false;

  // 穴に落ちた
  if(player.y > SCREEN_H){ killPlayer(); requestAnimationFrame(loop); return; }

  // 敵当たり
  if(!invincible){
    if(checkEnemyHit(enemies) === "hit") takeDamage(1);
    const bossState = checkBossHit(boss);
    if(bossState === "hit") takeDamage(1);
    else if(bossState === "dead"){ score+=1000; bgm.pause(); playClearBGM(stage); isStageCleared=true; clearTimer=performance.now(); }
  }

  // ゴール
  if(player.x>1800){ score+=500; bgm.pause(); playClearBGM(stage); isStageCleared=true; clearTimer=performance.now(); }

  // カメラ
  cameraX = Math.max(player.x-200,0);

  // 描画
  render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);

  requestAnimationFrame(loop);
}
