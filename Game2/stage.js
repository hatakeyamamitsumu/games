import { stages } from "./stages.js";
import { enemies } from "./enemy.js";
//import { GROUND_Y } from "./constants.js";

export let bgImgs = [];
export let bgmList = [];
export let bgImg = null;
export let bgm = null;
export let fadeOpacity = 0;
export let isFading = false;

// =========================
// 事前読み込み
// =========================
export function preloadStageAssets() {
  bgImgs = stages.map(stage => {
    const img = new Image();
    img.src = stage.bgSrc;
    return img;
  });

  bgmList = stages.map(stage => {
    const a = new Audio(stage.bgmSrc);
    a.loop = true;
    a.volume = 0.5;
    return a;
  });

  bgImg = bgImgs[0];
  bgm = bgmList[0];
}

// =========================
// ステージ切替
// =========================
export function switchStage(stageIndex, player, resetFn) {
  isFading = true;
  fadeOpacity = 0;
  const fadeDuration = 800;

  // setTimeoutは1回だけ使う（余計な中間タイミングを減らす）
  setTimeout(() => {
    const stage = stages[stageIndex];
    bgImg = bgImgs[stageIndex];

    // BGM切り替え（音声のロード待ちで固まらないようtry/catchで保護）
    try {
      if (bgm) bgm.pause();
      bgm = bgmList[stageIndex];
      bgm.currentTime = 0;
      bgm.play().catch(err => console.log("BGM再生ブロック:", err));
    } catch (e) {
      console.warn("BGM切り替えエラー:", e);
    }

    // 敵リストをリセット
    enemies.length = 0;
    stage.enemySpawns.forEach(sp => (sp.spawned = false));

    // プレイヤーリセット
    resetFn(player);

    // 🔹 フェード解除をもう少し遅らせて安全に
    requestAnimationFrame(() => {
      isFading = false;
    });
  }, fadeDuration);
}

// =========================
// 音フェード
// =========================
export function fadeOutAudio(audio, targetVolume, duration) {
  const step = audio.volume / (duration / 16);
  const fade = setInterval(() => {
    audio.volume -= step;
    if (audio.volume <= targetVolume) {
      audio.volume = targetVolume;
      audio.pause();
      clearInterval(fade);
    }
  }, 16);
}

export function fadeInAudio(audio, targetVolume, duration) {
  audio.volume = 0;
  audio.play().catch(err => console.log("BGM再生ブロック:", err));
  const step = targetVolume / (duration / 16);
  const fade = setInterval(() => {
    audio.volume += step;
    if (audio.volume >= targetVolume) {
      audio.volume = targetVolume;
      clearInterval(fade);
    }
  }, 16);
}
