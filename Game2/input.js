export const keys = {};
export function setupInput(){
  window.addEventListener('keydown',e=>keys[e.code]=true);
  window.addEventListener('keyup',e=>keys[e.code]=false);
}
