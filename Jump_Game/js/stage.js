// ========== stage.js ==========
import { BOSS_SPEED, BOSS_HP } from "./config.js";

export let stage = 0;

export const LEVELS = [
  // --- Stage 1 ---
  {
    blocks: [
      {x:0,y:480,w:2000,h:60},
      {x:500,y:380,w:150,h:20}
    ],
    enemies: [
      {x:600,y:446,w:34,h:34,dir:-1,speed:1}
    ],
    boss: null
  },

  // --- Stage 2 ---
  {
    blocks: [
      {x:0,y:480,w:2000,h:60},
      {x:380,y:400,w:150,h:20},
      {x:900,y:300,w:150,h:20},
    ],
    enemies: [
      {x:400,y:366,w:34,h:34,dir:1,speed:1},
      {x:950,y:266,w:34,h:34,dir:-1,speed:1}
    ],
    boss: null
  },

  // --- Stage 3（ラスボス） ---
  {
    blocks: [
      {x:0,y:480,w:2000,h:60},
      {x:450,y:380,w:300,h:20}
    ],
    enemies: [],
    boss: {
      x:1400, y:400, w:80, h:80,
      dir:-1, speed:BOSS_SPEED, hp:BOSS_HP
    }
  }
];

// ▼ ここを強化するだけ！ ▼
export function loadStage(s){
  stage = s;
  const data = LEVELS[s];

  const blocks = structuredClone(data.blocks);

  // ---- 敵を複製しつつアニメ用プロパティを追加 ----
  const enemies = structuredClone(data.enemies).map(e => {
    return {
      ...e,
      frame: 0,
      _frameTimer: 0,
      _frameInterval: 8   // アニメ速度（好みで変更）
    };
  });

  // ---- ボスも必要なら複製 ----
  const boss = data.boss ? {
    ...structuredClone(data.boss),
    frame: 0,
    _frameTimer: 0,
    _frameInterval: 8
  } : null;

  return { blocks, enemies, boss };
}
