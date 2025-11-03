import { GRAVITY, FRICTION } from "./physics.js";
import { Sprite } from "./sprite.js";

const image = new Image();
image.src = "./assets/player_sprites.png";

export const player = {
  x: 60, y: 360, w: 34, h: 48,
  vx: 0, vy: 0, onGround: false,
  facing: 1, // 1 = 右向き, -1 = 左向き
  state: "idle", // "idle" or "walk"
  sprite: null
};

image.onload = () => {
  player.sprite = new Sprite(image, 34, 48, 4, 6); // 4コマ, 6フレームごと更新
};

export function updatePlayer(input) {
  // 左右移動
  if (input.left) {
    player.vx -= 0.5;
    player.facing = -1;
    player.state = "walk";
  } else if (input.right) {
    player.vx += 0.5;
    player.facing = 1;
    player.state = "walk";
  } else {
    player.vx *= FRICTION;
    player.state = "idle";
  }

  // 重力
  player.vy += GRAVITY;

  // 位置更新
  player.x += player.vx;
  player.y += player.vy;

  // 地面の仮判定（y > 360 で止める）
  if (player.y > 360) {
    player.y = 360;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // スプライト更新
  if (player.sprite) {
    if (player.state === "walk" && Math.abs(player.vx) > 0.2) {
      player.sprite.update();
    } else {
      player.sprite.frameX = 0; // idleのときは最初のコマ
    }
  }
}

export function drawPlayer(ctx) {
  if (player.sprite) {
    ctx.save();
    ctx.scale(player.facing, 1);
    player.sprite.draw(
      ctx,
      player.facing === 1 ? player.x : -player.x - player.w,
      player.y
    );
    ctx.restore();
  } else {
    // ロード前は四角で代用
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }
}
