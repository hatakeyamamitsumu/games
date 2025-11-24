// ========== player.js ==========

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

  // ★ アニメーション用 ★
  frame: 0,
  frameTimer: 0,
  frameInterval: 100 // 100msごとに1コマ進む
};

export function resetPlayer() {
  player.x = 80;
  player.y = 0;
  player.vx = 0;
  player.vy = 0;

  player.frame = 0;
  player.frameTimer = 0;
}

export function updatePlayer(blocks) {

  // --- 横移動 ---
  if (keys.left) player.vx = -PLAYER_SPEED;
  if (keys.right) player.vx =  PLAYER_SPEED;
  if (!keys.left && !keys.right) player.vx *= 0.8;

  // --- ジャンプ ---
  if (keys.jump && player.onGround) {
    player.vy = -PLAYER_JUMP;
  }

  // --- 重力 ---
  player.vy += GRAVITY;
  if (player.vy > 15) player.vy = 15;

  player.x += player.vx;
  player.y += player.vy;

  resolvePlayerBlock(blocks);

  // ▼ アニメ更新 ▼
  updatePlayerAnimation();
}

function updatePlayerAnimation() {

  // 地面にいる & 移動している時だけアニメ
  if (player.onGround && Math.abs(player.vx) > 1) {

    player.frameTimer += 16; // ≒ 60fps

    if (player.frameTimer > player.frameInterval) {
      player.frameTimer = 0;
      player.frame = (player.frame + 1) % SPRITE_COUNT;
    }
  }
  else {
    // 停止・ジャンプ中は1コマ目で固定
    player.frame = 0;
  }
}

function resolvePlayerBlock(blocks){
  player.onGround = false;
  for(const b of blocks){
    if(!aabb(player,b)) continue;

    const prevX = player.x - player.vx;
    const prevY = player.y - player.vy;

    // 上から乗る
    if(prevY + player.h <= b.y){
      player.y = b.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
    // 下からぶつかる
    else if(prevY >= b.y + b.h){
      player.y = b.y + b.h;
      player.vy = 0;
    }
    // 左右衝突
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
