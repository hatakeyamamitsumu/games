// ========== main.js ==========
import { SCREEN_H } from "./config.js";
import { player, updatePlayer, resetPlayer } from "./player.js";
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
    // 最終ステージクリア
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

// ===== エンディング画面作成（派手仕様） =====
const endingScreen = document.createElement("div");
endingScreen.id = "endingScreen";
endingScreen.style.cssText = `
  position:fixed; top:0; left:0; width:100%; height:100%;
  background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080);
  background-size: 400% 400%;
  display:flex; align-items:center; justify-content:center;
  z-index:3000; color:#fff; font-size:3em; flex-direction:column;
  text-align:center; display:none;
`;
endingScreen.innerHTML = `
  <div style="
    text-shadow: 0 0 5px #fff, 0 0 10px #ff0, 0 0 20px #f0f, 0 0 40px #0ff;
    animation: glow 1.5s ease-in-out infinite alternate, pop 1s ease infinite;
  ">Congratulations!</div>
`;
document.body.appendChild(endingScreen);

// CSSアニメ追加
const style = document.createElement('style');
style.textContent = `
@keyframes gradientAnimation {
  0% { background-position:0% 50%; }
  50% { background-position:100% 50%; }
  100% { background-position:0% 50%; }
}
@keyframes glow {
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #ff0, 0 0 20px #f0f, 0 0 40px #0ff; }
  100% { text-shadow: 0 0 20px #fff, 0 0 30px #ff0, 0 0 40px #f0f, 0 0 60px #0ff; }
}
@keyframes pop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
#endingScreen {
  animation: gradientAnimation 10s ease infinite;
}
`;
document.head.appendChild(style);

// ===== タイトル画面ボタン =====
startButton.addEventListener("click", ()=>{
  titleScreen.style.display = "none";
  document.getElementById("hud").style.display = "block";
  score = 0;
  lives = 3;
  startStage(0);
  bgm.play().catch(()=>{});
  loop();
});

// ===== エンディング表示 =====
function showEndingScreen(){
  isGameEnding = true;
  endingScreen.style.display = "flex";
  fadeOutAudio(bgm,1000);
  clearBGM.pause();
}

// ===== メインループ =====
function loop(){
  const hudData = {
    stage: stage+1,
    score,
    lives,
    hp: player.hp,
    maxHp: player.maxHp,
    invincible
  };

  // 状態別描画
  if(isStageCleared || lives<=0 || isPaused || isGameEnding){
    render(ctx, cameraX, blocks, enemies, boss, player, hudData, isStageCleared, bgImage);
    if(isStageCleared && performance.now()-clearTimer>5000) startStage(stage+1);
    requestAnimationFrame(loop);
    return;
  }

  // 入力
  player.keys = keys;

  // 更新
  updatePlayer(blocks);
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
