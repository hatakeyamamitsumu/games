// ========== enemy_types.js ==========

export const ENEMY_TYPES = {
  walker: {
    spritePath: "./images/characters/enemy.png",
    w: 34,
    h: 48,
    frameCount: 4,
    movable: true,
    killable: true,
    gravity: 0.5,
    speed: 1
  },

  boss: {
    spritePath: "./images/characters/boss.png",
    w: 128,
    h: 128,
    frameCount: 2,
    movable: true,
    killable: true,
    gravity: 0.5,
    speed: 1
  },

  needle: {
    spritePath: "./images/characters/needle.png",
    w: 34,
    h: 48,
    frameCount: 4,
    movable: false,
    killable: false,
    gravity: 0,
    speed: 0
  }
};
