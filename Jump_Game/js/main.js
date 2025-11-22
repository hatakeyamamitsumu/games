// ========== main.js ==========
import { SCREEN_W, SCREEN_H } from "./config.js";
import { player, updatePlayer, resetPlayer } from "./player.js";
import { updateEnemies, checkEnemyHit,
         updateBoss, checkBossHit } from "./enemy.js";
import { loadStage, stage } from "./stage.js";
import { render } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const HUD = document.getElementById("hud");

// ===== グローバル変数 =====
let blocks = [];
let enemies = [];
let boss = null;

let score = 0;
let lives = 3;
let cameraX = 0;

// ★★ 追加：ステージクリア関連 ★★
let isStageCleared = false;
let clearTimer = 0;

// ===== ステージ開始 =====
function startStage(s){
  const data = loadStage(s);
  blocks = data.blocks;
  enemies = data.enemies;
  boss = data.boss;
  resetPlayer();
}
startStage(0);

// ===== メインループ =====
function loop(){

  // ★★ ステージクリア中の動作 ★★
  if(isStageCleared){
    HUD.textContent = `ステージ ${stage + 1} クリア！`;

    // 5秒経過したら次のステージ開始
    if(performance.now() - clearTimer > 5000){
      isStageCleared = false;
      startStage(stage + 1);
    }

    requestAnimationFrame(loop);
    return;
  }

  // ===== ゲームオーバー =====
  if(lives <= 0){
    HUD.textContent = "GAME OVER (Rで再開)";
    requestAnimationFrame(loop);
    return;
  }

  // ===== 通常更新 =====
  updatePlayer(blocks);
  updateEnemies(enemies, blocks);
  updateBoss(boss, blocks);

  // ===== 当たり判定 =====
  if(checkEnemyHit(enemies) === "hit"){
    lives--;
  }

  const bossState = checkBossHit(boss);
  if(bossState === "hit") lives--;
  if(bossState === "dead"){
    score += 1000;

    // ★ステージクリア開始★
    isStageCleared = true;
    clearTimer = performance.now();
  }

  // ===== ゴール判定 =====
  if(player.x > 1800){
    score += 500;

    // ★ステージクリア開始★
    isStageCleared = true;
    clearTimer = performance.now();
  }

  // ===== カメラ =====
  cameraX = player.x - 200;
  if(cameraX < 0) cameraX = 0;

  // ===== 描画 =====
  HUD.stage = stage + 1;
  HUD.score = score;
  HUD.lives = lives;
  render(ctx, cameraX, blocks, enemies, boss, player, HUD, isStageCleared);


  requestAnimationFrame(loop);
}

loop();
