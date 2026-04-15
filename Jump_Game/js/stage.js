// ========== stage.js ==========
//全ステージ長さは5400です
import { BOSS_SPEED, BOSS_HP } from "./config.js";

export let stage = 0;

export const LEVELS = [
  // --- Stage 1 ---
  {
    blocks: [
      {x:0, y:480, w:192, h:48, type:1},//ノーマル床
      {x:192, y:480, w:96, h:48, type:33},//海
      {x:288, y:480, w:1152, h:48, type:1},//ノーマル床
      {x:1440, y:480, w:96, h:48, type:33},//海
      {x:1536, y:480, w:326, h:48, type:1},//ノーマル床
      {x:1872, y:480, w:96, h:48, type:33},//海
      {x:1968, y:480, w:480, h:48, type:1},//ノーマル床
      {x:2448, y:480, w:144, h:48, type:33},//海
      {x:2592, y:480, w:480, h:48, type:1},//ノーマル床
      {x:3072, y:480, w:240, h:48, type:33},//海
      {x:3312, y:480, w:720, h:48, type:1},//ノーマル床
      {x:4032, y:480, w:96, h:48, type:33},//海
      {x:4128, y:480, w:2000, h:48, type:1},//ノーマル床




{x:30, y:432, w:48, h:48, type:28},//草むら小
{x:80, y:432, w:48, h:48, type:27},//草むら大
{x:80, y:432, w:48, h:48, type:27},//草むら大

{x:288, y:384, w:48, h:48, type:3},//木箱ブロック
{x:288, y:432, w:48, h:48, type:3},//木箱ブロック

{x:528, y:380, w:192, h:48, type:1},//ノーマル床
{x:576, y:300, w:48, h:48, type:17},//ダミー赤い花
{x:576, y:335, w:48, h:48, type:48},//植木鉢
{x:604, y:432, w:48, h:48, type:20},//ダミー草ブロック小
{x:652, y:432, w:48, h:48, type:19},//ダミー草ブロック中
{x:700, y:98, w:36, h:48, type:1 },//ノーマル床
{x:700, y:432, w:48, h:48, type:18},//ダミー草ブロック大

{x:800, y:180, w:48, h:48, type:4, startX:800, dir:1, speed:2, range:200},//左右に動く床
{x:840, y:432, w:48, h:48, type:54},//障害物ブロック
{x:888, y:384, w:48, h:48, type:54},//障害物ブロック
{x:936, y:336, w:48, h:48, type:54},//障害物ブロック

{x:1050, y:432, w:48, h:48, type:34},//岩1
//{x:1100, y:292, w:48, h:48, type:38},//樽
{x:1150, y:432, w:48, h:48, type:38},//樽

{x:1200, y:150, w:48, h:48, type:12,centerX:600,centerY:250,radius:80,angle:0,angularSpeed:0.03},//反時計回り床

{x:1200, y:384, w:48, h:48, type:44},//柱上
{x:1200, y:432, w:48, h:48, type:43},//柱下

{x:1250, y:432, w:48, h:48, type:22},//ダミー柵
{x:1300, y:432, w:48, h:48, type:22},//ダミー柵
{x:1350, y:132, w:48, h:48, type:55},//右に飛ぶバネ
{x:1350, y:432, w:48, h:48, type:23},//ダミー茂み
{x:1400, y:432, w:48, h:48, type:24},//ダミー瓦礫
{x:1450, y:384, w:96, h:48, type:46},//吊り橋1

{x:1540, y:235, w:36, h:48, type:49},//砲台
{x:1540, y:278, w:36, h:48, type:51},//モアイブロック2
{x:1540, y:326, w:36, h:48, type:54},//障害物ブロック
{x:1540, y:374, w:36, h:48, type:54},//障害物ブロック

{x:1600, y:470, w:48, h:48, type:29},//ダミー笹

{x:1700, y:54, w:48, h:48, type:16},//ダミーひまわり
{x:1700, y:105, w:48, h:48, type:48},//植木鉢
{x:1700, y:150, w:48, h:48, compress: 0 ,type:41},//雲ブロック1

{x:1730, y:432, w:48, h:48, type:28},//草むら小
{x:1760, y:432, w:48, h:48, type:27},//草むら大
{x:1820, y:432, w:48, h:48, type:27},//草むら大

{x:2000, y:380, w:192, h:48, type:1},//ノーマル床
{x:2050, y:300, w:48, h:48, type:17},//ダミー赤い花
{x:2050, y:335, w:48, h:48, type:48},//植木鉢
{x:2088, y:432, w:48, h:48, type:3},//木箱ブロック
{x:2180, y:432, w:48, h:48, type:13},//ダミー床１

{x:2250, y:48, w:144, h:48, type:10},//雲の床
{x:2300, y:150, w:96, h:48,type:11,centerX:2400,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
{x:2300, y:390, w:192, h:48, type:8},//氷の床

{x:2350, y:432, w:48, h:48, type:19},//ダミー草ブロック中
{x:2400, y:432, w:48, h:48, type:18},//ダミー草ブロック大
{x:2404, y:432, w:48, h:48, type:20},//ダミー草ブロック小

{x:2590, y:432, w:48, h:48, type:54},//障害物ブロック
{x:2600, y:180, w:48, h:48, type:4, startX:2600, dir:1, speed:2, range:200},//左右に動く床
{x:2600, y:390, w:144, h:4, type:8},//氷の床

{x:2750, y:432, w:48, h:48, type:58},//右から左一方通行ブロック
{x:2850, y:432, w:48, h:48, type:34},//岩1
{x:2950, y:432, w:48, h:48, type:38},//樽

{x:3000, y:150, w:96, h:48, type:12,centerX:3500,centerY:250,radius:80,angle:0,angularSpeed:0.03},//反時計回り床
{x:3000, y:340, w:48, h:48, compress: 0 ,type:6},//上に飛ぶバネ
{x:3000, y:384, w:48, h:48, type:44},//柱上
{x:3000, y:432, w:48, h:48, type:43},//柱下

{x:3100, y:300, w:48, h:48, type:5},//落ちる床
{x:3250, y:300, w:48, h:48, type:55},//右に飛ぶバネ

{x:3200, y:432, w:48, h:48, type:46},//吊り橋1
{x:3340, y:260, w:36, h:48, type:49},//砲台
{x:3340, y:293, w:36, h:48, type:50},//モアイブロック1
{x:3340, y:341, w:36, h:48, type:54},//障害物ブロック
{x:3340, y:389, w:36, h:48, type:54},//障害物ブロック
{x:3340, y:437, w:36, h:48, type:54},//障害物ブロック
{x:3248, y:432, w:48, h:48, type:47},//吊り橋2
{x:3400, y:432, w:48, h:48, type:29},//ダミー笹
{x:3450, y:432, w:48, h:48, type:22},//ダミー柵

{x:3500, y:56, w:48, h:48, type:17},//ダミー赤い花
{x:3500, y:104, w:48, h:48, type:48},//植木鉢
{x:3500, y:150, w:48, h:48, compress: 0 ,type:42},//雲ブロック2
{x:3500, y:300, w:192, h:48, type:7, startY:300, dir:1, speed:1, range:80},//上下移動の金属床

{x:3600, y:150, w:48, h:48, compress: 0 ,type:41},//雲ブロック2

{x:3630, y:432, w:48, h:48, type:28},//草むら小
{x:3680, y:432, w:48, h:48, type:27},//草むら大
{x:3680, y:432, w:48, h:48, type:27},//草むら大

{x:3800, y:150, w:192, h:48, type:10},//雲の床
//{x:3850, y:250, w:48, h:48, type:9},//透明床
{x:3888, y:432, w:48, h:48, type:3},//木箱ブロック

{x:3900, y:390, w:144, h:48, type:8},//氷の床
{x:4050, y:200, w:48, h:48, type:10},//下からすり抜けれる床
{x:4100, y:380, w:192, h:48, type:1},//ノーマル床

{x:4204, y:432, w:48, h:48, type:20},//ダミー草ブロック小
{x:4230, y:150, w:96, h:48,type:11,centerX:4200,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
{x:4250, y:300, w:48, h:48, type:17},//ダミー赤い花
{x:4250, y:335, w:48, h:48, type:48},//植木鉢
{x:4252, y:432, w:48, h:48, type:19},//ダミー草ブロック中
{x:4300, y:432, w:48, h:48, type:18},//ダミー草ブロック大

{x:4400, y:180, w:48, h:48, type:4, startX:4400, dir:1, speed:2, range:200},//左右に動く床
{x:4400, y:390, w:192, h:4, type:8},//氷の床
{x:4440, y:432, w:48, h:48, type:54},//障害物ブロック

{x:4550, y:432, w:48, h:48, type:58},//右から左一方通行ブロック
//{x:4600, y:300, w:48, h:48, type:5},//落ちる床
{x:4650, y:432, w:48, h:48, type:34},//岩1
{x:4750, y:432, w:48, h:48, type:38},//樽

{x:4800, y:150, w:96, h:48, type:12,centerX:4200,centerY:250,radius:80,angle:0,angularSpeed:0.03},//反時計回り床
{x:4800, y:340, w:48, h:48, compress: 0 ,type:6},//上に飛ぶバネ
{x:4800, y:384, w:48, h:48, type:44},//柱上
{x:4800, y:432, w:48, h:48, type:43},//柱下


{x:4850, y:432, w:48, h:48, type:22},//ダミー柵
{x:4900, y:432, w:48, h:48, type:22},//ダミー柵
{x:4950, y:132, w:48, h:48, type:55},//右に飛ぶバネ
{x:4950, y:432, w:48, h:48, type:23},//ダミー茂み
{x:5000, y:432, w:48, h:48, type:24},//ダミー瓦礫

{x:5050, y:432, w:48, h:48, type:22},//ダミー柵

{x:5140, y:250, w:36, h:48, type:49},//砲台
{x:5140, y:293, w:36, h:48, type:51},//モアイブロック2
{x:5140, y:341, w:36, h:48, type:54},//障害物ブロック
{x:5140, y:389, w:36, h:48, type:54},//障害物ブロック
{x:5140, y:437, w:36, h:48, type:54},//障害物ブロック
{x:5148, y:432, w:48, h:48, type:47},//吊り橋2
{x:5200, y:432, w:48, h:48, type:29},//ダミー笹
{x:5250, y:432, w:48, h:48, type:29},//ダミー笹

{x:5300, y:56, w:48, h:48, type:17},//ダミー赤い花
{x:5300, y:104, w:48, h:48, type:48},//植木鉢
{x:5300, y:150, w:48, h:48, compress: 0 ,type:41},//雲ブロック1
{x:5300, y:300, w:192, h:48, type:7, startY:300, dir:1, speed:1, range:80},//上下移動の金属床

{x:5400, y:150, w:48, h:48, compress: 0 ,type:42}//雲ブロック2
    ],

    enemies: [



{x:500, y:400, w:36, h:48, speed:1, type:"seeker"},
{x:550, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:600, y:446, w:36, h:48, type:"enemy",dir:1, speed:1},

{x:700, y:48, w:36, h:48, type:"heal"},

{x:750, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:800, y:50, w:36, h:48, type:"hover8"},
{x:800, y:480, w:36, h:48, type:"heal"},

{x:900, y:120, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:900, y:180, w:36, h:48, type:"chaser", speed:1.3},

{x:1000, y:332, w:36, h:48, dir:-1, speed:1, type:"jump"},

{x:1200, y:50, w:36, h:48, type:"heal"},
{x:1200, y:300, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},

{x:1400, y:432, w:36, h:48, type:"jumper"},

{x:1500, y:200, w:36, h:48, type:"ball"},
{x:1540, y:184, w:36, h:48, type:"jumper"},
{x:1490, y:422, w:36, h:48, type:"heal"},
{x:1600, y:332, w:36, h:48, type:"jumper"},

{x:1700, y:200, w:36, h:48, type:"smokeBall"},

{x:1888, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},

{x:2000, y:382, w:36, h:48, type:"jumper"},

{x:2050, y:300, w:36, h:48, type:"fly", vy:1},
{x:2064, y:192, w:36, h:48, type:"phasePlatform"},
{x:2100, y:50, w:36, h:48, type:"hover8"},

{x:2180, y:432, w:36, h:48, type:"jump"},




{x:2300, y:400, w:36, h:48, type:"seeker"},
{x:2350, y:0, w:36, h:48, type:"heal"},

{x:2400, y:300, w:36, h:48, type:"fly", vy:1},

{x:2500, y:430, w:36, h:48, type:"live"},

//{x:2590, y:50, w:36, h:48, type:"heal"},


{x:2700, y:180, w:36, h:48, type:"chaser", speed:1.3},
{x:2700, y:120, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:2700, y:446, w:36, h:48, type:"enemy",dir:1, speed:1},
{x:2700, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:2800, y:432, w:36, h:48, dir:-1, speed:1, type:"jump"},

{x:2888, y:332, w:36, h:48, type:"wander"},

{x:3000, y:50, w:36, h:48, type:"heal"},
{x:3000, y:300, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},
{x:3050, y:430, w:36, h:48, type:"heal"},
{x:3200, y:432, w:36, h:48, type:"jumper"},

{x:3300, y:200, w:36, h:48, type:"ball"},
{x:3300, y:432, w:36, h:48, type:"jumper"},

{x:3340, y:230, w:36, h:48, type:"phaser"},
{x:3400, y:332, w:36, h:48, type:"jumper"},
{x:3400, y:432, w:36, h:48, dir:1, speed:6, type:"rush"},

{x:3500, y:120, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:3500, y:180, w:36, h:48, type:"chaser", speed:1.3},
{x:3500, y:200, w:36, h:48, type:"smokeBall"},


{x:3550, y:150, w:36, h:48, type:"jumper"},

{x:3600, y:100, w:36, h:48, type:"heal"},
{x:3600, y:200, w:36, h:48, type:"smokeFloat"},
{x:3600, y:528, w:48, h:48, type:"needle"},

{x:3688, y:332, w:36, h:48, type:"wander"},

{x:3700, y:200, w:36, h:48, type:"phasePlatform"},

{x:3800, y:382, w:36, h:48, type:"jumper"},

{x:3900, y:50, w:36, h:48, type:"hover8"},
{x:3900, y:528, w:48, h:48, type:"needle"},


{x:4050, y:100, w:36, h:48, type:"heal"},
{x:4100, y:400, w:36, h:48, type:"seeker"},

{x:4350, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:4400, y:446, w:36, h:48, type:"enemy",dir:1, speed:1},

{x:4600, y:432, w:36, h:48, dir:-1, speed:1, type:"jump"},
{x:4650, y:528, w:48, h:48, type:"needle"},

{x:4800, y:300, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},

{x:5000, y:432, w:36, h:48, type:"jumper"},

{x:5050, y:432, w:36, h:48, type:"heal"},

{x:5100, y:200, w:36, h:48, type:"ball"},
{x:5100, y:432, w:36, h:48, type:"jumper"},

{x:5200, y:332, w:36, h:48, type:"jumper"},
{x:5200, y:352, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:5200, y:382, w:36, h:48, type:"jumper"},
{x:5200, y:432, w:36, h:48, dir:1, speed:6, type:"rush"},

{x:5300, y:200, w:36, h:48, type:"smokeBall"},

{x:5400, y:100, w:36, h:48, type:"jumper"},
{x:5400, y:200, w:36, h:48, type:"smokeFloat"},
{x:5400, y:528, w:48, h:48, type:"needle"}
    ],
    boss: null
  },

        // --- Stage 2 ---
  {
    blocks: [
      {x:0, y:480, w:192, h:48, type:1},//ノーマル床
      {x:192, y:480, w:96, h:48, type:33},//海
      {x:288, y:480, w:1152, h:48, type:1},//ノーマル床
      {x:1440, y:480, w:192, h:48, type:33},//海
      {x:1632, y:480, w:230, h:48, type:1},//ノーマル床
      {x:1872, y:480, w:96, h:48, type:33},//海
      {x:1968, y:480, w:480, h:48, type:1},//ノーマル床
      {x:2448, y:480, w:144, h:48, type:33},//海
      {x:2592, y:480, w:480, h:48, type:1},//ノーマル床
      {x:3072, y:480, w:240, h:48, type:33},//海
      {x:3312, y:480, w:720, h:48, type:1},//ノーマル床
      {x:4032, y:480, w:96, h:48, type:33},//海
      {x:4128, y:480, w:2000, h:48, type:1},//ノーマル床



      {x:200, y:400, w:48, h:48, type:5},//落ちる床
      {x:300, y:160, w:144, h:48, type:8},//氷の床
      //{x:300, y:250, w:192, h:48, type:9},//透明床
      {x:380, y:400, w:192, h:48, type:1},//ノーマル床
      {x:500, y:225, w:96, h:48,type:11,centerX:550,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
      {x:500, y:435, w:192, h:48, type:32},//ダミー工事中の柵
      {x:500, y:352, w:192, h:48, type:1},//ノーマル床
      {x:600, y:100, w:48, h:48, type:5},//落ちる床
      
      {x:700, y:435, w:48, h:48, type:31},//ダミー工事中のコーン
      {x:750, y:435, w:48, h:48, type:30},//ダミータンポポ
      {x:900, y:300, w:192, h:48, type:2},//ノーマル床（草）
      {x:900, y:150, w:192, h:48, type:4, startX:800, dir:1, speed:2, range:200},//左右に動く床
      {x:1000, y:250, w:192, h:48, type:4, startX:800, dir:1, speed:2, range:200},//左右に動く床
      {x:1300, y:100, w:192, h:48, type:4, startX:800, dir:1, speed:2, range:200},//左右に動く床
      {x:1200, y:432, w:48, h:48, type:6},//上に飛ぶバネ
      {x:1300, y:200, w:48, h:48, type:56},//左に飛ぶバネ
      {x:1348, y:200, w:48, h:48, type:55},//右に飛ぶバネ
      {x:1396, y:200, w:48, h:48, type:56},//左に飛ぶバネ
      {x:1444, y:200, w:48, h:48, type:55},//右に飛ぶバネ
      {x:1400, y:250, w:192, h:48, type:7, startY:250, dir:1, speed:1, range:120},//上下移動の金属床
      {x:1600, y:50, w:48, h:48, type:5},//落ちる床
      {x:1700, y:200, w:48, h:48, type:55},//右に飛ぶバネ
      {x:1748, y:200, w:48, h:48, type:56},//左に飛ぶバネ

      {x:1970, y:48, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:96, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:144, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:192, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:200, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:248, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:296, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:344, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:392, w:48, h:48, type:54},//障害物ブロック
      {x:1970, y:440, w:48, h:48, type:54},//障害物ブロック





      //{x:2100, y:250, w:192, h:48, type:9},//透明床
      {x:2180, y:400, w:192, h:48, type:1},//ノーマル床
      {x:2200, y:435, w:192, h:48, type:32},//ダミー工事中の柵
      {x:2300, y:352, w:192, h:48, type:1},//ノーマル床
      {x:2400, y:435, w:48, h:48, type:31},//ダミー工事中のコーン
      
      {x:2050, y:150, w:48, h:48, type:56},//左に飛ぶバネ
      {x:2098, y:150, w:48, h:48, type:55},//右に飛ぶバネ
      {x:2146, y:150, w:48, h:48, type:56},//左に飛ぶバネ
      {x:2194, y:150, w:48, h:48, type:55},//右に飛ぶバネ

      {x:2400, y:50, w:48, h:48, type:5},//落ちる床
      {x:2450, y:180, w:96, h:48,type:11,centerX:2400,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
      {x:2550, y:435, w:48, h:48, type:30},//ダミータンポポ
      {x:2700, y:300, w:192, h:48, type:2},//ノーマル床（草）
      {x:2700, y:60, w:144, h:48, type:8},//氷の床
      {x:2700, y:150, w:192, h:48, type:4, startX:2600, dir:1, speed:2, range:200},//左右に動く床
      {x:2800, y:250, w:192, h:48, type:4, startX:2600, dir:1, speed:2, range:200},//左右に動く床

      {x:2800, y:200, w:48, h:48, type:56},//左に飛ぶバネ
      {x:2850, y:200, w:48, h:48, type:55},//右に飛ぶバネ
      {x:2900, y:200, w:48, h:48, type:56},//左に飛ぶバネ
      {x:2950, y:200, w:48, h:48, type:55},//右に飛ぶバネ

      {x:3000, y:432, w:48, h:48, type:6},//上に飛ぶバネ
      {x:3100, y:232, w:48, h:48, type:56},//左に飛ぶバネ
      {x:3200, y:250, w:192, h:48, type:7, startY:250, dir:1, speed:1, range:120},//上下移動の金属床
      {x:3500, y:350, w:144, h:48, type:8},//氷の床
      {x:3500, y:150, w:192, h:48, type:4, startX:3400, dir:1, speed:2, range:200},//左右に動く床
      {x:3500, y:250, w:192, h:48, type:4, startX:3400, dir:1, speed:3, range:200},//左右に動く床


      {x:3800, y:52, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:100, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:148, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:196, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:204, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:252, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:300, w:48, h:48, type:54},//障害物ブロック
      {x:3800, y:348, w:48, h:48, type:54},//障害物ブロック

      
      {x:3900, y:60, w:192, h:48, type:8},//氷の床
      //{x:3900, y:250, w:192, h:48, type:9},//透明床
      {x:3980, y:400, w:192, h:48, type:1},//ノーマル床
      {x:4100, y:352, w:192, h:48, type:1},//ノーマル床
      {x:4200, y:435, w:192, h:48, type:32},//ダミー工事中の柵
      {x:4200, y:50, w:48, h:48, type:5},//落ちる床
      {x:4250, y:180, w:96, h:48,type:11,centerX:4200,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床


      {x:4400, y:435, w:48, h:48, type:31},//ダミー工事中のコーン
      {x:4350, y:435, w:48, h:48, type:30},//ダミータンポポ
      {x:4500, y:300, w:192, h:48, type:2},//ノーマル床（草）
      {x:4500, y:150, w:192, h:48, type:4, startX:4400, dir:1, speed:2, range:200},//左右に動く床
      {x:4600, y:250, w:192, h:48, type:4, startX:4400, dir:1, speed:2, range:200},//左右に動く床
      {x:4750, y:380, w:48, h:48, type:6},//上に飛ぶバネ

      {x:4850, y:52, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:100, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:148, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:196, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:204, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:252, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:300, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:348, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:396, w:48, h:48, type:54},//障害物ブロック
      {x:4850, y:444, w:48, h:48, type:54},//障害物ブロック

      {x:4900, y:232, w:48, h:48, type:56},//左に飛ぶバネ
      {x:5000, y:250, w:192, h:48, type:7, startY:250, dir:1, speed:1, range:120},//上下移動の金属床

    ],
    enemies: [

{ x: 200, y: 50, w:36, h: 48, type: "hover8" },

{x:300, y:100, w:36, h:48, type:"jumper"},
{x:350, y:100, w:36, h:48, type:"heal"},// ▼ 回復アイテム
{x:380, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:400, y:100, w:36, h:48, type:"jumper"},
{x:400, y:366, w:36, h:48, dir:-1, type:"enemy",speed:1},

{x:600, y:50, w:36, h:48, type:"heal"},
{x:600, y:300, w:36, h:48, speed:1, type:"seeker"},

{x:900, y:120, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:1000, y:120, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:900, y:180, w:36, h:48, type:"chaser", speed:1.3},

{x:950, y:266, w:36, h:48, dir:-1, type:"enemy",speed:1},

{x:1000, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:1036, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:1072, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:1100, y:250, w:36, h:48, type:"heal"},
{x:1108, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:1250, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:1298, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},

{x:1200, y:252, w:36, h:48, dir:-1, speed:1, type:"jump"},

{x:1400, y:200, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},
{x:1500, y:432, w:36, h:48, type:"jumper"},

{x:1600, y:0, w:36, h:48, type:"heal"},
{x:1600, y:366, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:1600, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{ x: 1820, y: 10, w:36, h: 48, type: "hover8" },
{x:2020, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:2180, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:2200, y:366, w:36, h:48, dir:-1, type:"enemy",speed:1},

{x:2300, y:300, w:36, h:48, type:"heal"},// ▼ 回復アイテム
{x:2400, y:300, w:36, h:48, speed:1, type:"seeker"},

{x:2500, y:300, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:2600, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:2700, y:180, w:36, h:48, type:"chaser", speed:1.3},
{x:2750, y:266, w:36, h:48, dir:-1, type:"enemy",speed:1},

{x:2800, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:2836, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:2872, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},

{x:2900, y:250, w:36, h:48, type:"heal"},

{x:3000, y:252, w:36, h:48, dir:-1, speed:1, type:"jump"},
{x:3200, y:200, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},


{x:3300, y:432, w:36, h:48, type:"jumper"},
{x:3400, y:366, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:3500, y:300, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{ x: 3620, y: 10, w:36, h: 48, type: "hover8" },

{x:3750, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:3980, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:4000, y:366, w:36, h:48, dir:-1, type:"enemy",speed:1},

{x:4100, y:300, w:36, h:48, type:"heal"},// ▼ 回復アイテム
{x:4200, y:300, w:36, h:48, speed:1, type:"seeker"},

{x:4400, y:400, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:4500, y:180, w:36, h:48, type:"chaser", speed:1.3},
{x:4500, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:4536, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:4550, y:266, w:36, h:48, dir:-1, type:"enemy",speed:1},
{x:4572, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},

{x:4700, y:250, w:36, h:48, type:"heal"},
{x:4800, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:4800, y:252, w:36, h:48, dir:-1, speed:1, type:"jump"},
{x:5000, y:200, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},
{x:5000, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:5100, y:332, w:36, h:48, type:"jumper"},
{x:5100, y:432, w:36, h:48, type:"jumper"},
{x:5150, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:5200, y:366, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:5200, y:300, w:36, h:48, type:"phaser",timer:0,interval:120,visible:true,active:true},
{x:5300, y:450, w:36, h:48, type:"jumper"}
      
    ],
    boss: null
  },
    // --- Stage 3（ラスボスステージ） ---
  {
    blocks: [
      {x:0, y:480, w:192, h:48, type:1},//ノーマル床
      {x:192, y:480, w:96, h:48, type:33},//海
      {x:288, y:480, w:1152, h:48, type:1},//ノーマル床
      {x:1440, y:480, w:192, h:48, type:33},//海
      {x:1632, y:480, w:230, h:48, type:33},//ノーマル床
      {x:1872, y:480, w:96, h:48, type:33},//海
      {x:1968, y:480, w:480, h:48, type:1},//ノーマル床
      {x:2448, y:480, w:144, h:48, type:33},//海
      {x:2592, y:480, w:2600, h:48, type:1},//ノーマル床
      {x:5234, y:480, w:1000, h:48, type:33},//海
      //{x:3072, y:480, w:240, h:48, type:33},//海
      //{x:3312, y:480, w:720, h:48, type:1},//ノーマル床
      //{x:4032, y:480, w:96, h:48, type:33},//海
      //{x:4128, y:480, w:2000, h:48, type:1},//ノーマル床


      //{x:300, y:250, w:192, h:48, type:9},//透明床
      {x:450, y:200, w:192, h:48, type:8},//氷の床
      {x:400, y:380, w:240, h:48, type:1},//ノーマル床
      {x:700, y:160, w:192, h:48, type:10},//落ちる床
      {x:900, y:400, w:240, h:48, type:1},//ノーマル床
      
      {x:900, y:130, w:48, h:48, type:6},//上に飛ぶバネ
      {x:1100, y:100, w:96, h:48,type:11,centerX:600,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
      {x:1300, y:80, w:192, h:48, type:7, startY:160, dir:1, speed:1, range:100},//上下移動の金属床

      {x:1700, y:400, w:36, h:48, type:5},//落ちる床

      {x:2100, y:197, w:36, h:48, type:49},//砲台
      {x:2100, y:245, w:36, h:48, type:50},//モアイブロック1
      {x:2100, y:293, w:36, h:48, type:54},//障害物ブロック
      {x:2100, y:341, w:36, h:48, type:54},//障害物ブロック
      {x:2100, y:389, w:36, h:48, type:54},//障害物ブロック
      {x:2100, y:437, w:36, h:48, type:54},//障害物ブロック

      {x:2250, y:380, w:240, h:48, type:1},//ノーマル床
      {x:2260, y:250, w:192, h:48, type:8},//氷の床





      {x:2600, y:350, w:286, h:48, type:1},//ノーマル床

      {x:2700, y:230, w:48, h:48, type:6},//上に飛ぶバネ
      {x:2900, y:100, w:96, h:48,type:11,centerX:2400,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
      {x:3100, y:80, w:192, h:48, type:7, startY:80, dir:1, speed:1, range:100},//上下移動の金属床
      {x:3300, y:180, w:192, h:48, type:7, startY:160, dir:1, speed:1, range:100},//上下移動の金属床

{x:3100, y:80, w:192, h:48, type:7, startY:160, dir:1, speed:1, range:100},//上下移動の金属床
      {x:3800, y:197, w:36, h:48, type:49},//砲台
      {x:3800, y:245, w:36, h:48, type:50},//モアイブロック1
      {x:3800, y:293, w:36, h:48, type:54},//障害物ブロック
      {x:3800, y:341, w:36, h:48, type:54},//障害物ブロック
      {x:3800, y:389, w:36, h:48, type:54},//障害物ブロック
      {x:3800, y:437, w:36, h:48, type:54},//障害物ブロック

      {x:3900, y:149, w:36, h:48, type:49},//砲台
      {x:3900, y:197, w:36, h:48, type:50},//モアイブロック1
      {x:3900, y:245, w:36, h:48, type:54},//障害物ブロック
      {x:3900, y:293, w:36, h:48, type:54},//障害物ブロック
      {x:3900, y:341, w:36, h:48, type:54},//障害物ブロック
      {x:3900, y:389, w:36, h:48, type:54},//障害物ブロック
      {x:3900, y:437, w:36, h:48, type:54},//障害物ブロック
      {x:3950, y:300, w:48, h:48, type:6},//上に飛ぶバネ

      //{x:3900, y:250, w:192, h:48, type:9},//透明床
      {x:4050, y:200, w:192, h:48, type:8},//氷の床
      {x:4300, y:160, w:192, h:48, type:10},//落ちる雲
      {x:4500, y:230, w:48, h:48, type:6},//上に飛ぶバネ
      {x:4600, y:230, w:48, h:48, type:6},//上に飛ぶバネ
      {x:4600, y:100, w:96, h:48,type:11,centerX:4500,centerY:250,radius:80,angle:0,angularSpeed:0.03},//時計回り床
      {x:4700, y:80, w:192, h:48, type:7, startY:160, dir:1, speed:1, range:100},//上下移動の金属床

      {x:5000, y:197, w:36, h:48, type:49},//砲台
      {x:5000, y:245, w:36, h:48, type:50},//モアイブロック1
      {x:5000, y:293, w:36, h:48, type:54},//障害物ブロック
      {x:5000, y:341, w:36, h:48, type:54},//障害物ブロック
      {x:5000, y:389, w:36, h:48, type:54},//障害物ブロック
      {x:5000, y:437, w:36, h:48, type:54},//障害物ブロック

      {x:5100, y:149, w:36, h:48, type:49},//砲台
      {x:5100, y:197, w:36, h:48, type:50},//モアイブロック1
      {x:5100, y:245, w:36, h:48, type:54},//障害物ブロック
      {x:5100, y:293, w:36, h:48, type:54},//障害物ブロック
      {x:5100, y:341, w:36, h:48, type:54},//障害物ブロック
      {x:5100, y:389, w:36, h:48, type:54},//障害物ブロック
      {x:5100, y:437, w:36, h:48, type:54},//障害物ブロック
    ],
enemies: [
// ▼ 回復アイテム
//{ x: 550, y: 260, w:36, h: 48, type: "heal" },

// ▼ 敵
{x:480, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:500, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:500, y:332, w:36, h:48, type:"jumper"},
{x:500, y:432, w:36, h:48, type:"jumper"},
{x:520, y:300, w:36, h:48, speed:1, type:"seeker"},
//{x:550, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:600, y:300, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},
//{x:650, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:700, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:800, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:800, y:250, w:36, h:48, dir:-1, speed:1, type:"fly", vy:1},
{x:850, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:900, y:120, w:36, h:48, type:"phaser", timer:0, interval:120, visible:true, active:true},
//{x:900, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:900, y:180, w:36, h:48, type:"chaser", speed:1.3},
{x:910, y:360, w:36, h:48, type:"heal"},
{x:950, y:574, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:1000, y:432, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:1000, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
//{x:1050, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:1100, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:1100, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},

//{x:1200, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:1200, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:1300, y:432, w:36, h:48, type:"heal"},
{x:1300, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:1450, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:1950, y:300, w:36, h:48, type:"phasePlatform"},
{x:2000, y:250, w:36, h:48, type:"phasePlatform"},

{x:2050, y:130, w:36, h:48, type:"ball"},
// ===== 第2ブロック =====

{x:2280, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:2300, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:2300, y:332, w:36, h:48, type:"jumper"},
{x:2300, y:432, w:36, h:48, type:"jumper"},
{x:2320, y:300, w:36, h:48, speed:1, type:"seeker"},
//{x:2350, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:2400, y:300, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},
//{x:2450, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:2500, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:2600, y:250, w:36, h:48, dir:-1, speed:1, type:"fly", vy:1},
//{x:2650, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:2600, y:420, w:36, h:48, type:"heal"},
{x:2700, y:120, w:36, h:48, type:"phaser", timer:0, interval:120, visible:true, active:true},
{x:2650, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:2700, y:180, w:36, h:48, type:"chaser", speed:1.3},

{x:2750, y:574, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:2800, y:432, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:2800, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:2836, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},
{x:2872, y:528, w:36, h:48, dir:1, speed:1, type:"needle"},

//{x:2850, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:2800, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:2900, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},

//{x:3000, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:3000, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:3300, y:150, w:36, h:48, type:"heal"},
{x:3300, y:332, w:36, h:48, type:"jump"},
{x:3350, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:3350, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:3400, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:3450, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:3500, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:3550, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:3600, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:3650, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:3650, y:300, w:36, h:48, type:"phasePlatform"},
{x:3700, y:250, w:36, h:48, type:"phasePlatform"},
{x:3650, y:250, w:36, h:48, dir:-1, speed:1, type:"fly", vy:1},
{x:3700, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:3700, y:120, w:36, h:48, type:"phaser", timer:0, interval:120, visible:true, active:true},
{x:3750, y:130, w:36, h:48, type:"ball"},
{x:3850, y:80, w:36, h:48, type:"ball"},
// ===== 第3ブロック =====

{x:4080, y:332, w:36, h:48, dir:1, speed:1, type:"wander"},
{x:4100, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:4100, y:332, w:36, h:48, type:"jumper"},
{x:4100, y:432, w:36, h:48, type:"jumper"},
{x:4120, y:300, w:36, h:48, speed:1, type:"seeker"},
//{x:4150, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:4200, y:300, w:36, h:48, dir:1, speed:1, type:"fly", vy:1},
{x:4250, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:4330, y:574, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:4400, y:250, w:36, h:48, dir:-1, speed:1, type:"fly", vy:1},
{x:4450, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},

{x:4500, y:120, w:36, h:48, type:"phaser", timer:0, interval:120, visible:true, active:true},
//{x:4500, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:4500, y:180, w:36, h:48, type:"chaser", speed:1.3},

{x:4550, y:574, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:4600, y:432, w:36, h:48, dir:1, speed:6, type:"rush"},
{x:4600, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:4650, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
//{x:4700, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:4700, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},

{x:4800, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"},
{x:4800, y:528, w:36, h:48, dir:-1, speed:1, type:"needle"},
{x:4950, y:130, w:36, h:48, type:"ball"},
{x:5050, y:80, w:36, h:48, type:"ball"},
//{x:4900, y:132, w:36, h:48, dir:-1, speed:5, type:"thunder"}
],

    boss: {x:4200, y:350, w:128, h:128,dir:-1, speed:BOSS_SPEED, hp:BOSS_HP}
  },

  


  
  
  

  

  
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