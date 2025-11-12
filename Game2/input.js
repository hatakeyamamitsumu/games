import { player } from './player.js';

export const keys = {};

export function setupInput() {
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyR') {
      // リセットはmain.jsで行う
    }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });
}
