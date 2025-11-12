export const stages = [
  {
    number: 1,
    length: 2500,
    bgSrc: "./images/graphics/background1.png",
    bgmSrc: "./sounds/BGM/bgm1.mp3",
    enemySpawns: [
      { x: 1200, type: "boss",  y: 408 - 158 , spawned: false },
      { x: 1600, type: "type1", y: 408 - 48, spawned: false }, // 👈 例：地面に立つ
      { x: 2000, type: "type2", y: 408 - 48, spawned: false },
      { x: 2100, type: "type1", y: 408 - 48, spawned: false },
    ]
  },
  {
    number: 2,
    length: 2500,
    bgSrc: "./images/graphics/background2.png",
    bgmSrc: "./sounds/BGM/bgm2.mp3",
    enemySpawns: [
      { x: 1500, type: "type2", y: 408 - 48, spawned: false },
      { x: 2000, type: "type3", y: 408 - 48, spawned: false },
      { x: 2200, type: "type1", y: 408 - 48, spawned: false },
    ]
  },
  {
    number: 3,
    length: 2500,
    bgSrc: "./images/graphics/background3.png",
    bgmSrc: "./sounds/BGM/bgm3.mp3",
    enemySpawns: [
      { x: 1400, type: "type1", y: 408 - 48, spawned: false },
      { x: 1800, type: "type2", y: 408 - 48, spawned: false },
      { x: 1900, type: "type3", y: 408 - 48, spawned: false },
      { x: 2000, type: "type2", y: 408 - 48, spawned: false },
      { x: 2200, type: "boss",  y: 408 - 128, spawned: false } // 👈 ボスの底面も地面に合わせる
    ]
  }
];
