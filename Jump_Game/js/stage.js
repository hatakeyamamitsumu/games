import { BOSS_SPEED, BOSS_HP } from "./config.js";

export let stage = 0;

export const LEVELS = [
  // --- Stage 1 ---
  {
    blocks: [
      {x:0, y:480, w:240, h:60, type:0},    // block1.png
      {x:288, y:480, w:2400, h:60, type:0},
      {x:500, y:380, w:136, h:20, type:1}    // block2.png
    ],
    enemies: [
      {x:600, y:446, w:34, h:34, dir:-1, speed:1}
    ],
    boss: null
  },

  // --- Stage 2 ---
  {
    blocks: [
      {x:0, y:480, w:2000, h:60, type:0},
      {x:380, y:400, w:150, h:20, type:1},
      {x:900, y:300, w:150, h:20, type:2}
    ],
    enemies: [
      {x:400, y:366, w:34, h:34, dir:1, speed:1},
      {x:950, y:266, w:34, h:34, dir:-1, speed:1}
    ],
    boss: null
  },

  // --- Stage 3（ラスボス） ---
  {
    blocks: [
      {x:0, y:480, w:2000, h:60, type:0},
      {x:450, y:380, w:300, h:20, type:1}
    ],
    enemies: [],
    boss: {
      x:1400, y:400, w:80, h:80,
      dir:-1, speed:BOSS_SPEED, hp:BOSS_HP
    }
  }
];

export function loadStage(s){
  stage = s;
  const data = LEVELS[s];

  const blocks = structuredClone(data.blocks);

  const enemies = structuredClone(data.enemies).map(e => ({
    ...e,
    frame: 0,
    _frameTimer: 0,
    _frameInterval: 8
  }));

  const boss = data.boss ? {
    ...structuredClone(data.boss),
    frame: 0,
    _frameTimer: 0,
    _frameInterval: 8
  } : null;

  return { blocks, enemies, boss };
}
