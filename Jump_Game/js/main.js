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

// ===== フリーズ管理 =====
let isPaused = false;

// ===== プレイヤーHP =====
player.maxHp = 3;
player.hp = player.maxHp;

// ===== ステージクリア関連 =====
let isStageCleared = false;
let clearTimer = 0;

// ===== キー & ボタン状態 =====
const keys = { left:false, right:false, jump:false };

// ===== ボタン操作 =====
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");
const btnJump = document.getElementById("jump");

btnLeft.addEventListener("mousedown", ()=>keys.left=true);
btnLeft.addEventListener("mouseup",   ()=>keys.left=false);
btnLeft.addEventListener("mouseleave",()=>keys.left=false);
btnLeft.addEventListener("touchstart", e=>{ e.preventDefault(); keys.left=true; });
btnLeft.addEventListener("touchend",   e=>{ e.preventDefault(); keys.left=false; });

btnRight.addEventListener("mousedown", ()=>keys.right=true);
btnRight.addEventListener("mouseup",   ()=>keys.right=false);
btnRight.addEventListener("mouseleave",()=>keys.right=false);
btnRight.addEventListener("touchstart", e=>{ e.preventDefault(); keys.right=true; });
btnRight.addEventListener("touchend",   e=>{ e.preventDefault(); keys.right=false; });

btnJump.addEventListener("mousedown", ()=>keys.jump=true);
btnJump.addEventListener("mouseup",   ()=>keys.jump=false);
btnJump.addEventListener("mouseleave",()=>keys.jump=false);
btnJump.addEventListener("touchstart", e=>{ e.preventDefault(); keys.jump=true; });
btnJump.addEventListener("touchend",   e=>{ e.preventDefault(); keys.jump=false; });

// ===== キーボード操作 =====
window.addEventListener("keydown", e=>{
  if(e.code==="ArrowLeft") keys.left = true;
  if(e.code==="ArrowRight") keys.right = true;
  if(e.code==="Space") keys.jump = true;
});
window.addEventListener("keyup", e=>{
  if(e.code==="ArrowLeft") keys.left = false;
  if(e.code==="ArrowRight") keys.right = false;
  if(e.code==="Space") keys.jump = false;
});

// ===== BGM管理 =====
let bgm = new Audio(); bgm.loop = true; bgm.volume = 0.5;
let clearBGM = new Audio(); clearBGM.loop = false; clearBGM.volume = 0.7;
let gameoverBGM = new Audio(); gameoverBGM.loop=false; gameoverBGM.volume=0.7;

function playBGM(stageNumber){
  bgm.src = `./sounds/BGM/bgm${stageNumber+1}.mp3`;
  bgm.pause(); bgm.currentTime=0;
  bgm.play().catch(_=>console.log("BGM再生待ち（タップ必要）"));
}
function playClearBGM(stageNumber){
  clearBGM.src = `./sounds/BGM/clear_bgm${stageNumber+1}.mp3`;
  clearBGM.pause(); clearBGM.currentTime=0;
  clearBGM.play().catch(_=>console.log("クリアBGM再生待ち（タップ必要）"));
}
function playGameoverBGM(){
  gameoverBGM.src="./sounds/BGM/gameover_bgm1.mp3";
  gameoverBGM.pause(); gameoverBGM.currentTime=0;
  gameoverBGM.play().catch(_=>console.log("GAME OVER BGM再生待ち"));
}
function fadeOutAudio(audio,duration=1000){
  const steps=20; const interval=duration/steps;
  let vol=audio.volume;
  const timer=setInterval(()=>{
    vol-=1/steps;
    if(vol<=0){ audio.volume=0; audio.pause(); clearInterval(timer);}
    else audio.volume=vol;
  }, interval);
}

// ===== 背景 =====
let bgImage=new Image();
function loadBackground(stageNumber){
  bgImage.src = `./images/graphics/background${stageNumber+1}.png`;
}

// ===== ステージ開始 =====
function startStage(s){
  const data = loadStage(s);
  blocks=data.blocks;
  enemies=data.enemies;
  boss=data.boss;

  resetPlayer();
  player.hp=player.maxHp;
  isStageCleared=false;
  clearBGM.pause(); clearBGM.currentTime=0;
  playBGM(s);
  loadBackground(s);
  invincible=false;
}

// ===== プレイヤーダメージ / 死亡 =====
function takeDamage(amount=1){
  if(invincible || isPaused) return;
  player.hp-=amount;
  if(player.hp<=0) killPlayer();
  else{ invincible=true; invincibleTimer=performance.now(); }
}
function killPlayer(){
  lives--;
  if(lives>0){
    fadeOutAudio(bgm,1000);
    isPaused=true; invincible=true; player.hp=player.maxHp;
    setTimeout(()=>{
      startStage(stage);
      bgm.volume=0.5; invincible=false; isPaused=false;
    },3000);
  }else{
    fadeOutAudio(bgm,1000); clearBGM.pause();
    setTimeout(()=>playGameoverBGM(),1000);
  }
}

startStage(0);

// ===== メインループ =====
function loop(){
  // HUD
  const hudData={ stage:stage+1, score, lives, hp:player.hp, maxHp:player.maxHp, invincible};

  // ステージクリア中
  if(isStageCleared){
    render(ctx,cameraX,blocks,enemies,boss,player,hudData,true,bgImage);
    if(performance.now()-clearTimer>5000) startStage(stage+1);
    requestAnimationFrame(loop); return;
  }

  // ゲームオーバー
  if(lives<=0){
    render(ctx,cameraX,blocks,enemies,boss,player,hudData,false,bgImage);
    requestAnimationFrame(loop); return;
  }

  // フリーズ中は描画のみ
  if(isPaused){
    render(ctx,cameraX,blocks,enemies,boss,player,hudData,isStageCleared,bgImage);
    requestAnimationFrame(loop); return;
  }

  // ===== キー情報を player に渡す =====
  player.keys = keys;

  // ===== 更新 =====
  updatePlayer(blocks);
  updateEnemies(enemies,blocks);
  updateBoss(boss,blocks);

  // 無敵時間更新
  if(invincible && performance.now()-invincibleTimer>1500) invincible=false;

  // 穴に落ちた判定
  if(player.y>SCREEN_H){ killPlayer(); requestAnimationFrame(loop); return; }

  // 当たり判定（無敵中は無効）
  if(!invincible){
    if(checkEnemyHit(enemies)==="hit") takeDamage(1);
    const bossState = checkBossHit(boss);
    if(bossState==="hit") takeDamage(1);
    if(bossState==="dead"){
      score+=1000; bgm.pause(); playClearBGM(stage);
      isStageCleared=true; clearTimer=performance.now();
    }
  }

  // ゴール
  if(player.x>1800){ score+=500; bgm.pause(); playClearBGM(stage); isStageCleared=true; clearTimer=performance.now(); }

  // カメラ
  cameraX = player.x-200;
  if(cameraX<0) cameraX=0;

  // 描画
  render(ctx,cameraX,blocks,enemies,boss,player,hudData,isStageCleared,bgImage);

  requestAnimationFrame(loop);
}

loop();
