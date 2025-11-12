// globals.js
export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");
// 地面の高さ（Y座標）
export const GROUND_Y = canvas.height - 60;

// ワールドのスクロール速度
export let worldSpeed = 2;

// 他ファイルから速度を変更したいとき用
export function setWorldSpeed(value) {
  worldSpeed = value;
}
