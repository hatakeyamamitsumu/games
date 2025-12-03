// ========== stage.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";

export let stage = 0;

export const LEVELS = [
  // --- Stage 1 ---
  {
    blocks: [
      {x:0, y:480, w:192, h:60, type:0},
      {x:288, y:432, w:48, h:60, type:0},
      {x:288, y:480, w:2400, h:60, type:0},
      {x:500, y:380, w:192, h:20, type:1},
      {x:800, y:350, w:192, h:20, type:4, startX:800, dir:1, speed:2, range:200}

    ],
    enemies: [
      {x:600, y:446, w:34, h:48, dir:1, speed:1},                    // 通常敵
      {x:800, y:432, w:34, h:48, dir:-1, speed:1, type:"needle"},    // 針
      {x:1000, y:432, w:34, h:48, dir:-1, speed:1, type:"jump"},     // 跳ねる敵
      {x:1200, y:300, w:34, h:48, dir:1, speed:1, type:"fly", vy:1}, // 空中敵
      {x:1500, y:332, w:34, h:48, type:"jumper"},
      {x:1500, y:432, w:34, h:48, type:"jumper"},
      {x:1500, y:532, w:34, h:48, type:"jumper"},
      

      {x:1600, y:432, w:34, h:48, dir:1, speed:2, type:"rush"}       // ← 新規 rush 敵
    ],
    boss: null
  },

  // --- Stage 2 ---
  {
    blocks: [
      {x:0, y:480, w:2400, h:60, type:0},
      {x:380, y:400, w:192, h:20, type:1},
      {x:500, y:352, w:192, h:20, type:1},
      {x:900, y:300, w:192, h:20, type:2},
      {x:1000, y:250, w:192, h:20, type:4, startX:800, dir:1, speed:2, range:200},
      {x:1000, y:350, w:192, h:20, type:4, startX:800, dir:1, speed:2, range:200}
    ],
    enemies: [
      {x:400, y:366, w:34, h:48, dir:-1, speed:1},
      {x:950, y:266, w:34, h:48, dir:-1, speed:1},
      {x:1000, y:252, w:34, h:48, dir:1, speed:1, type:"needle"},
      {x:1200, y:252, w:34, h:48, dir:-1, speed:1, type:"jump"},    // 跳ねる敵
      {x:1400, y:200, w:34, h:48, dir:1, speed:1, type:"fly", vy:1}, // 空中敵
      {x:1500, y:432, w:34, h:48, type:"jumper"},
      {x:1600, y:366, w:34, h:48, dir:1, speed:3, type:"rush"}       // ← rush 敵追加
    ],
    boss: null
  },

  // --- Stage 3（ラスボス） ---
  {
    blocks: [
      {x:0, y:480, w:2400, h:60, type:0},
      {x:450, y:380, w:240, h:20, type:1}
    ],
    enemies: [
      {x:500, y:332, w:34, h:48, type:"jumper"},
      {x:500, y:432, w:34, h:48, type:"jumper"},
      {x:600, y:300, w:34, h:48, dir:1, speed:1, type:"fly", vy:1},  // 空中敵
      
      {x:800, y:250, w:34, h:48, dir:-1, speed:1, type:"fly", vy:1}, // 空中敵
      {x:1000, y:432, w:34, h:48, dir:1, speed:3, type:"rush"}       // ← rush 敵追加
    ],
    boss: {
      x:1400, y:400, w:80, h:80,
      dir:-1, speed:BOSS_SPEED, hp:BOSS_HP
    }
  }
];

// ===== ステージ読込 =====
export function loadStage(s){
  stage = s;
  const data = LEVELS[s];

  // ブロックはそのまま
  const blocks = structuredClone(data.blocks);

  // 敵を複製してフレームデータ付与
  const enemies = structuredClone(data.enemies).map(e => ({
    ...e,
    frame: 0,
    _frameTimer: 0,
    _frameInterval: 8
  }));

  // ボスも同様に複製
  const boss = data.boss ? {
    ...structuredClone(data.boss),
    frame: 0,
    _frameTimer: 0,
    _frameInterval: 8
  } : null;

  return { blocks, enemies, boss };
}