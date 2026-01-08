// ========== stage.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";

export let stage = 0;

export const LEVELS = [
  // --- Stage 1 ---
  {
    blocks: [
      {x:0, y:480, w:192, h:60, type:0},
      {x:200, y:380, w:192, h:20, type:8},
      {x:200, y:150, w:192, h:20, type:10},
      {x:288, y:432, w:48, h:60, type:0},
      {x:288, y:480, w:2400, h:60, type:0},
      {x:500, y:380, w:192, h:20, type:1},
      {x:800, y:380, w:192, h:4, type:8},
      {x:800, y:180, w:192, h:20, type:4, startX:800, dir:1, speed:2, range:200},
      {x:1000, y:300, w:192, h:20, type:5},
      {x:1200, y:340, w:192, h:20, type:6},
      {x:1700, y:360, w:192, h:20, type:7, startY:360, dir:1, speed:1, range:80},
      {x:160, y:250, w:192, h:20, type:9},
      {x:600, y:250, w:96, h:20,type:11,centerX:600,centerY:250,radius:80,angle:0,angularSpeed:0.03}
    ],
    enemies: [
        { x: 600, y: 350, w: 32, h: 32, type: "heal" },
  { x: 1200, y: 300, w: 32, h: 32, type: "heal" },
      {x:600, y:446, w:34, h:48, dir:1, speed:1},
      {x:800, y:432, w:34, h:48, dir:-1, speed:1, type:"needle"},
      {x:1000, y:432, w:34, h:48, dir:-1, speed:1, type:"jump"},
      {x:1200, y:300, w:34, h:48, dir:1, speed:1, type:"fly", vy:1},
      {x:1400, y:432, w:34, h:48, type:"jumper"},
      {x:1500, y:432, w:34, h:48, type:"jumper"},
      {x:1600, y:332, w:34, h:48, type:"jumper"},
      {x:1600, y:432, w:34, h:48, dir:1, speed:6, type:"rush"},
      {x:1800, y:382, w:34, h:48, type:"jumper"},
      {x:288, y:332, w:34, h:48, dir:1, speed:1, type:"wander"},
      {x:500, y:400, w:34, h:48, speed:1, type:"seeker"},
      { x:900, y:180, w:48, h:48, type:"chaser", speed:1.3 },
      {x: 900,y: 120,w: 48,h: 48,type: "phaser",timer: 0,interval: 120,visible: true,active: true}
    ],
    boss: null
  },

  // --- Stage 2 ---
  {
    blocks: [
      {x:0, y:480, w:2400, h:60, type:0},
      {x:380, y:400, w:192, h:20, type:1},
      {x:500, y:352, w:192, h:20, type:1},
      {x:600, y:0, w:192, h:20, type:5},
      {x:900, y:300, w:192, h:20, type:2},
      {x:900, y:150, w:192, h:20, type:4, startX:800, dir:1, speed:2, range:200},
      {x:1000, y:250, w:192, h:20, type:4, startX:800, dir:1, speed:2, range:200},
      {x:1200, y:200, w:192, h:20, type:6},
      {x:1400, y:250, w:192, h:20, type:7, startY:250, dir:1, speed:1, range:120},
      {x:300, y:120, w:192, h:20, type:8},
      {x:300, y:250, w:192, h:20, type:9},
      {x:650, y:180, w:96, h:20,type:11,centerX:600,centerY:250,radius:80,angle:0,angularSpeed:0.03}
    ],
    enemies: [
        // ▼ 回復アイテム
  { x: 500,  y: 300, w: 32, h: 32, type: "heal" },
  { x: 1100, y: 250, w: 32, h: 32, type: "heal" },
      {x:400, y:366, w:34, h:48, dir:-1, speed:1},
      {x:950, y:266, w:34, h:48, dir:-1, speed:1},
      {x:1000, y:432, w:34, h:48, dir:1, speed:1, type:"needle"},
      {x:1200, y:252, w:34, h:48, dir:-1, speed:1, type:"jump"},
      {x:1400, y:200, w:34, h:48, dir:1, speed:1, type:"fly", vy:1},
      {x:1500, y:432, w:34, h:48, type:"jumper"},
      {x:1600, y:366, w:34, h:48, dir:1, speed:6, type:"rush"},
      {x:380, y:332, w:34, h:48, dir:1, speed:1, type:"wander"},
      {x:600, y:300, w:34, h:48, speed:1, type:"seeker"},
      { x:900, y:180, w:48, h:48, type:"chaser", speed:1.3 },
      {x: 900,y: 120,w: 48,h: 48,type: "phaser",timer: 0,interval: 120,visible: true,active: true}
    ],
    boss: null
  },

  // --- Stage 3（ラスボス） ---
  {
    blocks: [
      {x:0, y:480, w:2400, h:60, type:0},
      {x:450, y:380, w:240, h:20, type:1},
      {x:700, y:260, w:192, h:20, type:5},
      {x:900, y:230, w:192, h:20, type:6},
      {x:1300, y:260, w:192, h:20, type:7, startY:260, dir:1, speed:1, range:100},
      {x:450, y:200, w:192, h:20, type:8},
      {x:300, y:250, w:192, h:20, type:9},
      {x:1100, y:100, w:96, h:20,type:11,centerX:600,centerY:250,radius:80,angle:0,angularSpeed:0.03}
    ],
enemies: [
  // ▼ 回復アイテム
  { x: 550, y: 260, w: 32, h: 32, type: "heal" },

  // ▼ 敵
  {x:500, y:332, w:34, h:48, type:"jumper"},
  {x:500, y:432, w:34, h:48, type:"jumper"},
  {x:600, y:300, w:34, h:48, dir:1, speed:1, type:"fly", vy:1},
  {x:800, y:250, w:34, h:48, dir:-1, speed:1, type:"fly", vy:1},
  {x:1000, y:432, w:34, h:48, dir:1, speed:6, type:"rush"},
  {x:480, y:332, w:34, h:48, dir:1, speed:1, type:"wander"},
  {x:520, y:300, w:34, h:48, speed:1, type:"seeker"},
  {x:900, y:180, w:48, h:48, type:"chaser", speed:1.3},
  {x:900, y:120, w:48, h:48, type:"phaser", timer:0, interval:120, visible:true, active:true}
],

    boss: {x:1400, y:400, w:80, h:80,dir:-1, speed:BOSS_SPEED, hp:BOSS_HP}
  }
];

// ===== ステージ読込 =====
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