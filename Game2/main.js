import { keys, setupInput } from './input.js';
import { aabb, GRAVITY, FRICTION } from './physics.js';
import { levels, resetLevel } from './level.js';
import { player } from './player.js';
import { draw } from './render.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

let camX = 0;
let currentLevel = 0;
let gameOver = false;
let gameWin = false;
let lvl = [];

setupInput();
({ data: lvl, levelIndex: currentLevel } = resetLevel(0, player));

function update() {
  if (gameOver || gameWin) return;

  if (keys['ArrowLeft']) player.vx -= 0.9;
  if (keys['ArrowRight']) player.vx += 0.95;
  if ((keys['Space'] || keys['ArrowUp']) && player.onGround) {
    player.vy = -18;
    player.onGround = false;
  }

  player.vy += GRAVITY;
  player.vx *= FRICTION;
  player.vx = Math.max(Math.min(player.vx, 10), -10);
  player.vy = Math.max(Math.min(player.vy, 30), -30);
  player.x += player.vx;
  player.y += player.vy;

  const lvlData = levels[currentLevel];
  camX = Math.max(0, Math.min(player.x - W*0.35, lvlData.width - W));
  player.onGround = false;

  for (let i = lvl.length - 1; i >= 0; i--) {
    const obj = lvl[i];
    if (obj.type === 'platform' || obj.type === 'goal') {
      if (aabb(player, obj)) {
        const px = (player.x + player.w/2) - (obj.x + obj.w/2);
        const py = (player.y + player.h/2) - (obj.y + obj.h/2);
        const overlapX = (player.w + obj.w)/2 - Math.abs(px);
        const overlapY = (player.h + obj.h)/2 - Math.abs(py);
        if (overlapX>0 && overlapY>0) {
          if (overlapY < overlapX) {
            if (py>0){ player.y+=overlapY; player.vy=0; }
            else{ player.y-=overlapY; player.vy=0; player.onGround=true; }
          } else {
            if(px>0){ player.x+=overlapX; player.vx=0; }
            else{ player.x-=overlapX; player.vx=0; }
          }
        }
      }
    }
    if(obj.type==='spike' && aabb(player,obj)) gameOver=true;

    if(obj.type==='enemy' && aabb(player,obj)){
      const playerBottom = player.y + player.h;
      if(player.vy>0 && playerBottom - obj.y<15){ lvl.splice(i,1); player.vy=-12; }
      else gameOver=true;
    }

    if(obj.type==='boss' && aabb(player,obj)){
      if(obj.hp===undefined) obj.hp=3;
      const playerBottom = player.y+player.h;
      const fromAbove = player.vy>0 && playerBottom-obj.y<player.h/2;
      if(fromAbove){ obj.hp--; player.vy=-14; if(obj.hp<=0) lvl[i]={type:'platform',x:obj.x,y:obj.y+obj.h-18,w:obj.w,h:18}; }
      else if(obj.hp>0) gameOver=true;
    }

    if(obj.type==='goal' && aabb(player,{x:obj.x-10,y:obj.y-10,w:obj.w+20,h:obj.h+20})){
      if(currentLevel<levels.length-1) ({ data: lvl, levelIndex: currentLevel } = resetLevel(currentLevel+1, player));
      else gameWin=true;
    }
  }

  if(player.y > H + 200) gameOver=true;
}

function loop(){
  update();
  draw(ctx, W, H, lvl, camX, player, gameOver, gameWin);
  requestAnimationFrame(loop);
}

loop();
