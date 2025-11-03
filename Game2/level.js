import { player } from './player.js';

export const levels = [
  {
    width:1800,
    objects:[
      {type:'platform',x:0,y:420,w:1800,h:120},
      {type:'platform',x:320,y:340,w:140,h:18},
      {type:'enemy',x:520,y:306,w:30,h:30},
      {type:'platform',x:620,y:300,w:120,h:18},
      {type:'spike',x:820,y:406,w:60,h:14},
      {type:'platform',x:920,y:360,w:160,h:18},
      {type:'platform',x:1220,y:320,w:120,h:18},
      {type:'goal',x:1650,y:320,w:40,h:80}
    ]
  },
  {
    width:2000,
    objects:[
      {type:'platform',x:0,y:420,w:2000,h:120},
      {type:'platform',x:200,y:340,w:120,h:18},
      {type:'enemy',x:420,y:306,w:30,h:30},
      {type:'platform',x:540,y:300,w:140,h:18},
      {type:'boss',x:1300,y:260,w:120,h:120,hp:3},
      {type:'goal',x:1850,y:320,w:40,h:80}
    ]
  }
];

export function resetLevel(i, player){
  const index = Math.max(0, Math.min(i, levels.length-1));
  const lvl = levels[index];
  player.x = 60; player.y = 300; player.vx=0; player.vy=0; player.onGround=false;
  return { data: JSON.parse(JSON.stringify(lvl.objects)), levelIndex: index };
}
