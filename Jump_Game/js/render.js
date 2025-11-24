import { enemySprite } from "./enemy.js";

// プレイヤースプライト
const playerSprite = new Image();
playerSprite.src = "./images/characters/player.png";

// プレイヤー用定数
const FRAME_WIDTH = 34;
const FRAME_HEIGHT = 48;
const FRAME_COUNT = 4;

let frameIndex = 0;
let frameTimer = 0;
const FRAME_INTERVAL = 8;

export function render(ctx, cameraX, blocks, enemies, boss, player, HUD, isStageCleared, bgImage){
  ctx.clearRect(0,0,960,540);

  // 背景
  if(bgImage && bgImage.complete){
    ctx.drawImage(bgImage, -cameraX, 0, bgImage.width, bgImage.height);
  } else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0,0,960,540);
  }

  ctx.save();
  ctx.translate(-cameraX, 0);

  // ブロック
  ctx.fillStyle = "#654321";
  for(const b of blocks){
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }

  // 敵スプライト描画
  for(const e of enemies){
    if(enemySprite.complete){
      ctx.save();
      if(e.dir === -1){
        ctx.scale(-1,1);
        ctx.drawImage(
          enemySprite,
          e.frame * 34, 0, 34, 48,
          -(e.x + e.w), e.y, e.w, e.h
        );
      } else {
        ctx.drawImage(
          enemySprite,
          e.frame * 34, 0, 34, 48,
          e.x, e.y, e.w, e.h
        );
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(e.x, e.y, e.w, e.h);
    }
  }

  // ボス
  if(boss){
    ctx.fillStyle = "purple";
    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
  }

  // プレイヤー描画
  if(player.vx !== 0){
    frameTimer++;
    if(frameTimer > FRAME_INTERVAL){
      frameTimer = 0;
      frameIndex = (frameIndex + 1) % FRAME_COUNT;
    }
  } else {
    frameIndex = 0;
  }

  if(player.vx < 0){
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(
      playerSprite,
      FRAME_WIDTH*frameIndex,0,FRAME_WIDTH,FRAME_HEIGHT,
      -(player.x + player.w), player.y, player.w, player.h
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      playerSprite,
      FRAME_WIDTH*frameIndex,0,FRAME_WIDTH,FRAME_HEIGHT,
      player.x, player.y, player.w, player.h
    );
  }

  ctx.restore();

  // HUD
  HUD.textContent = `Stage ${HUD.stage} / Score ${HUD.score} / Lives ${HUD.lives}`;

  // ステージクリア
  if(isStageCleared){
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`ステージ ${HUD.stage} クリア！`, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.restore();
  }
}
