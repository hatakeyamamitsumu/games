import { GRAVITY, PLAYER_SPEED, PLAYER_JUMP,
         PLAYER_WIDTH, PLAYER_HEIGHT } from "./config.js";
import { aabb } from "./physics.js";
import { keys } from "./input.js";

export const playerImg = new Image();
playerImg.src = "./images/characters/player.png"; // 4コマ 136×48

const SPRITE_W = 34;  // 136 / 4
const SPRITE_H = 48;
const SPRITE_COUNT = 4;

export const player = {
  x: 80, y: 0, w: PLAYER_WIDTH, h: PLAYER_HEIGHT,
  vx: 0, vy: 0,
  onGround: false,
  frame: 0,
  frameTimer: 0,
  frameInterval: 100
};

export function resetPlayer() {
  player.x = 80;
  player.y = 0;
  player.vx = 0;
  player.vy = 0;
  player.frame = 0;
  player.frameTimer = 0;
}

export function updatePlayer(blocks, stageWidth = 3000) {
  // 横移動
  if(keys.left)  player.vx = -PLAYER_SPEED;
  if(keys.right) player.vx = PLAYER_SPEED;
  if(!keys.left && !keys.right) player.vx *= 0.8;

  // ジャンプ
  if(keys.jump && player.onGround) {
    player.vy = -PLAYER_JUMP;
  }

  // 重力
  player.vy += GRAVITY;
  if(player.vy > 15) player.vy = 15;

  // 位置更新
  player.x += player.vx;
  player.y += player.vy;

  // ブロックとの衝突
  resolvePlayerBlock(blocks);

  // ワールド端制限
  if(player.x < 0) player.x = 0;
  if(player.x + player.w > stageWidth) player.x = stageWidth - player.w;

  // アニメ更新
  updatePlayerAnimation();
}

function updatePlayerAnimation() {
  if(player.onGround && Math.abs(player.vx) > 1){
    player.frameTimer += 16;
    if(player.frameTimer > player.frameInterval){
      player.frameTimer = 0;
      player.frame = (player.frame + 1) % SPRITE_COUNT;
    }
  } else {
    player.frame = 0;
  }
}

function resolvePlayerBlock(blocks){
  player.onGround = false;
  for(const b of blocks){
    if(!aabb(player,b)) continue;

    const prevX = player.x - player.vx;
    const prevY = player.y - player.vy;

    // 上から
    if(prevY + player.h <= b.y){
      player.y = b.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
    // 下から
    else if(prevY >= b.y + b.h){
      player.y = b.y + b.h;
      player.vy = 0;
    }
    // 左右
    else if(prevX + player.w <= b.x){
      player.x = b.x - player.w;
      player.vx = 0;
    }
    else if(prevX >= b.x + b.w){
      player.x = b.x + b.w;
      player.vx = 0;
    }
  }
}
