// ==============================
// player.js
// ==============================

// プレイヤー画像（スプライトシート：横4コマ）
export const playerImg = new Image();
playerImg.src = "./images/characters/player.png";

// プレイヤー初期データ
export const player = {
  x: window.innerWidth / 4, // 34px幅なので中央に配置
  y: 360,                        
  w: 34,
  h: 48,
  vx: 0,
  vy: 0,
  onGround: false,
  frame: 0,
  frameTimer: 0,
  frameMax: 4,
  facing: 1,
  hp: 3,
};
