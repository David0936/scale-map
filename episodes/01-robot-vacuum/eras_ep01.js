// 产品蒸馏 EP01｜扫地机器人 · 60 秒预览版。单一画风：当代扁平插画，段与段硬切。
// 每段内的镜头硬切（scenes 里的 SM.shots），段与段之间用「下一种媒介的签名转场」。
// 由 motion/sync.sh 复制到引擎根目录；kit 与 scenes 也由它放到引擎里对应位置。
window.SCENE_LIBS = ['scale_map/kit.js'];
window.SCENE_DIR = 'ep01/scenes';
window.PUNCH = 0;                       // 转场时不额外抖一下，镜头冲击由场景里的砸入负责
window.COUNTER_IN_TRANSITION = 'cut';
window.ERAS = [
  { id: 'e1_now', dur: 4 },
  { id: 'e2_ink', dur: 8 },
  { id: 'e3_print', dur: 13 },
  { id: 'e4_poster', dur: 17 },
  { id: 'e5_2026', dur: 18 },
];
