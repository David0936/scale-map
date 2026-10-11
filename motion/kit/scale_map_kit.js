// Scale Map 动画工具包（scale_map_kit.js）——跑在 huashu-art-motion 引擎上，挂在 window.SM（别名 window.EP）。
// 来源：EP01 扫地机器人实做。四种媒介共用：
//   镜头    SM.cam / SM.withCam / SM.shots —— 脉冲节奏（停住 → 快推 0.28s / 横移 0.30s / 砸入 0.17s → 停住），镜与镜硬切
//   缓存    SM.cache / SM.boiled —— 静态层按种子画 3 份、8fps 轮换＝线条沸腾（画一直是活的）
//   铜版画  SM.paper / hatch / tone / ink / solid / hose / caption / onlooker / lobsterInk
//   当代扁平 SM.F 色板 / robotSide / broomFlat / grain
// 坑：镜头放大后视野会超出画好的世界，边上露黑——cam 的第三个参数传世界边界 [x0,y0,x1,y1]，自动把机位收回界内。
(() => {
const W = 1920, H = 1080, { clamp, lerp, rng, ss } = U;
const EP = window.EP = window.SM = {};
EP.W = W; EP.H = H;
const eo = q => 1 - Math.pow(1 - q, 3);

// ---------- 脉冲镜头 ----------
// keys: [{t, cx, cy, z, kind}]，kind = push | pan | slam | cut。第一个 key 是起始机位（t 可为 0）。
// 每个 key 在 t 时刻开始，按 kind 的时长从上一个机位过去，之后停住。slam 额外乘一个 1.55→0.94→1.0 的冲击。
// bounds（可选）[x0,y0,x1,y1]：画好的世界范围，默认 [0,0,1920,1080]；传 null 不收。
EP.cam = (lt, keys, bounds = [0, 0, W, H]) => EP.fit(EP.camRaw(lt, keys), bounds);
EP.fit = (cam, b) => {
  if (!b) return cam; const hw = W / 2 / cam.z, hh = H / 2 / cam.z;
  const fx = (v, lo, hi, h) => hi - lo <= 2 * h ? (lo + hi) / 2 : clamp(v, lo + h, hi - h);
  return { ...cam, cx: fx(cam.cx, b[0], b[2], hw), cy: fx(cam.cy, b[1], b[3], hh) };
};
EP.camRaw = (lt, keys) => {
  let cur = { cx: keys[0].cx, cy: keys[0].cy, z: keys[0].z }, mul = 1;
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i]; if (lt < k.t) break;
    const d = k.kind === 'push' ? 0.28 : k.kind === 'pan' ? 0.30 : k.kind === 'slam' ? 0.17 : 0.0001;
    const q = clamp((lt - k.t) / d), e = eo(q);
    const prev = { ...cur };
    cur = { cx: lerp(prev.cx, k.cx ?? prev.cx, e), cy: lerp(prev.cy, k.cy ?? prev.cy, e), z: lerp(prev.z, k.z ?? prev.z, e) };
    if (k.kind === 'slam') { const s = lt - k.t; mul = s < 0.17 ? lerp(1.55, 0.94, eo(s / 0.17)) : s < 0.32 ? lerp(0.94, 1.0, ss(0.17, 0.32, s)) : 1; }
  }
  return { ...cur, z: cur.z * mul };
};
EP.withCam = (c, cam, fn) => { c.save(); c.translate(W / 2, H / 2); c.scale(cam.z, cam.z); c.translate(-cam.cx, -cam.cy); fn(); c.restore(); };
// 镜头内的分镜：shots = [[t0, t1, fn(c, st, lt)], ...]，镜与镜硬切
EP.shots = (c, lt, shots) => { for (const [a, b, fn] of shots) if (lt >= a && lt < b) return fn(c, lt - a, lt); const last = shots[shots.length - 1]; return last[2](c, lt - last[0], lt); };

// ---------- 缓存＋沸腾 ----------
const CACHE = {};
EP.cache = (key, fn, w = W, h = H) => { if (!CACHE[key]) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; fn(cv.getContext('2d'), cv); CACHE[key] = cv; } return CACHE[key]; };
EP.boil = (t, fps = 8, n = 3) => Math.floor(t * fps) % n;
// 某个静态层画 n 份（种子不同），按 fps 轮换
EP.boiled = (key, t, fn, fps = 8, n = 3) => { const i = EP.boil(t, fps, n); return EP.cache(key + '#' + i, (g) => fn(g, 1000 + i * 97)); };

// ---------- 通用几何 ----------
EP.P = (fn) => { const p = new Path2D(); fn(p); return p; };
EP.circlePts = (cx, cy, r, n = 64) => { const a = []; for (let i = 0; i <= n; i++) { const t = i / n * Math.PI * 2; a.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]); } return a; };
EP.bez = (p0, p1, p2, p3, n = 40) => { const a = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; a.push([u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]); } return a; };
EP.poly = (g, pts, fill, stroke, lw = 2) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); } };
EP.rr = (g, x, y, w, h, r, fill, stroke, lw = 3) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
EP.text = (g, s, x, y, font, color, align = 'left', base = 'alphabetic') => { g.save(); g.font = font; g.fillStyle = color; g.textAlign = align; g.textBaseline = base; g.fillText(s, x, y); g.restore(); };

// ---------- 铜版画 ----------
EP.INK = '#2a2118'; EP.PAPER = '#ece2c9';
EP.paper = (g, base, seed, speck = 'rgba(80,60,30,', n = 26000) => {
  const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 9; i++) { const x = r() * W, y = r() * H, rad = 120 + r() * 380; const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, speck + (0.035 + r() * 0.04) + ')'); gr.addColorStop(1, speck + '0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  for (let i = 0; i < n; i++) { g.fillStyle = speck + (0.04 + r() * 0.12) + ')'; const s = 0.6 + r() * 1.6; g.fillRect(r() * W, r() * H, s, s); }
};
EP.hatch = (g, path, box, { angle = 45, gap = 8, lw = 1.4, color = EP.INK, seed = 1, wob = 0.3, breakP = 0.015, dens = null } = {}) => {
  const r = rng(seed); const [x0, y0, x1, y1] = box; const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 4; const a = angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  g.save(); if (path) g.clip(path); g.strokeStyle = color; g.lineWidth = lw; g.lineCap = 'round';
  for (let d = -R; d <= R; d += gap) {
    let drawing = true; g.beginPath(); let first = true;
    for (let s = -R; s <= R; s += 12) {
      const px = cx + ca * s - sa * d + (r() - 0.5) * wob, py = cy + sa * s + ca * d + (r() - 0.5) * wob;
      let on = !dens || r() < dens(px, py);
      if (r() < breakP) drawing = !drawing; on = on && drawing;
      if (on) { first ? g.moveTo(px, py) : g.lineTo(px, py); first = false; } else first = true;
    }
    g.stroke();
  }
  g.restore();
};
EP.tone = (g, path, box, level, opt = {}) => { const b = opt.angle ?? 35; const angs = [b, b + 90, b + 45, b - 45]; for (let i = 0; i < level; i++) EP.hatch(g, path, box, { ...opt, angle: angs[i], seed: (opt.seed || 1) + i * 17 }); };
EP.ink = (g, pts, { lw = 2.4, color = EP.INK, seed = 3, wob = 1.0, close = false } = {}) => {
  const r = rng(seed); g.save(); g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath();
  pts.forEach(([x, y], i) => { const px = x + (r() - 0.5) * wob, py = y + (r() - 0.5) * wob; i ? g.lineTo(px, py) : g.moveTo(px, py); });
  if (close) g.closePath(); g.stroke(); g.restore();
};
// 填色＋排线＋描边，一次画一个铜版画实体
EP.solid = (g, path, box, { fill = '#d6c39b', level = 1, angle = 35, gap = 5, lw = 1.2, seed = 1, stroke = 2.6, dens = null } = {}) => {
  g.fillStyle = fill; g.fill(path); if (level) EP.tone(g, path, box, level, { angle, gap, lw, seed, dens });
  if (stroke) { g.save(); g.strokeStyle = EP.INK; g.lineWidth = stroke; g.lineJoin = 'round'; g.stroke(path); g.restore(); }
};
// 软管：flow 让波纹沿管子流动（吸力）
EP.hose = (g, pts, { w = 26, ink = EP.INK, fill = '#e9dcc0', ring = 14, lw = 2.2, flow = 0 } = {}) => {
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  const line = () => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); };
  g.strokeStyle = ink; g.lineWidth = w + lw * 2; line(); g.stroke(); g.strokeStyle = fill; g.lineWidth = w; line(); g.stroke();
  g.strokeStyle = ink; g.lineWidth = lw * 0.8; let acc = 0; const off = ((flow % ring) + ring) % ring;
  for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i]; const L = Math.hypot(bx - ax, by - ay) || 1; const nx = -(by - ay) / L, ny = (bx - ax) / L;
    for (let s = ((ring - (acc + off) % ring) % ring); s < L; s += ring) { const x = ax + (bx - ax) * s / L, y = ay + (by - ay) * s / L; g.beginPath(); g.moveTo(x + nx * w / 2, y + ny * w / 2); g.quadraticCurveTo(x + (bx - ax) / L * 3, y + (by - ay) / L * 3, x - nx * w / 2, y - ny * w / 2); g.stroke(); }
    acc += L; }
  g.restore();
};
// 报刊图注框（屏上字落在画里的一块印刷图注上）
EP.caption = (c, x, y, w, year, place, zh, a = 1) => {
  if (a <= 0) return; c.save(); c.globalAlpha = a;
  c.fillStyle = 'rgba(236,226,201,.95)'; c.fillRect(x, y, w, 150); c.strokeStyle = EP.INK; c.lineWidth = 2.4; c.strokeRect(x, y, w, 150); c.strokeRect(x + 8, y + 8, w - 16, 134);
  EP.text(c, year, x + 32, y + 86, '76px "IMFellEnglish-400"', EP.INK); if (place) EP.text(c, place, x + 240, y + 82, '30px "IMFellEnglish-400i"', EP.INK);
  EP.text(c, zh, x + 32, y + 128, '34px "LXGWWenKai-500"', EP.INK); c.restore();
};
// 铜版画背影（帽子：bowler/cap/dress/none）
EP.onlooker = (g, x, y, h, kind, seed, s = 1, sway = 0) => {
  g.save(); g.translate(x, y); g.rotate(sway); g.scale(s, s); const P = EP.P;
  const coat = P(p => { if (kind === 'dress') { p.moveTo(-26, -h * 0.62); p.bezierCurveTo(-36, -h * 0.3, -60, -10, -66, 0); p.lineTo(66, 0); p.bezierCurveTo(60, -10, 36, -h * 0.3, 26, -h * 0.62); p.closePath(); } else { p.moveTo(-30, -h * 0.64); p.lineTo(-40, -h * 0.2); p.lineTo(-34, -h * 0.2); p.lineTo(-28, -2); p.lineTo(-6, -2); p.lineTo(-4, -h * 0.22); p.lineTo(4, -h * 0.22); p.lineTo(8, -2); p.lineTo(30, -2); p.lineTo(34, -h * 0.2); p.lineTo(40, -h * 0.2); p.lineTo(30, -h * 0.64); p.closePath(); } });
  EP.solid(g, coat, [-70, -h, 70, 0], { fill: '#a89068', level: 3, gap: 4, seed });
  const sh = P(p => { p.moveTo(-30, -h * 0.64); p.quadraticCurveTo(0, -h * 0.72, 30, -h * 0.64); p.lineTo(26, -h * 0.58); p.lineTo(-26, -h * 0.58); p.closePath(); }); g.fillStyle = '#7e6a4c'; g.fill(sh); g.strokeStyle = EP.INK; g.lineWidth = 2.4; g.stroke(sh);
  const head = P(p => p.ellipse(0, -h * 0.76, 17, 20, 0, 0, 7)); EP.solid(g, head, [-20, -h * 0.84, 20, -h * 0.66], { fill: '#b79d74', level: 1, gap: 3.5, seed: seed + 3, stroke: 2.2 });
  const hair = P(p => p.ellipse(0, -h * 0.78, 17, 16, 0, Math.PI * 0.95, Math.PI * 2.05)); g.fillStyle = '#3a2e22'; g.fill(hair);
  if (kind === 'bowler') { const hat = P(p => { p.ellipse(0, -h * 0.84, 26, 6, 0, 0, 7); p.moveTo(-15, -h * 0.84); p.bezierCurveTo(-16, -h * 0.94, 16, -h * 0.94, 15, -h * 0.84); }); g.fillStyle = EP.INK; g.fill(hat); }
  if (kind === 'cap') { const hat = P(p => { p.moveTo(-19, -h * 0.8); p.bezierCurveTo(-20, -h * 0.9, 20, -h * 0.9, 21, -h * 0.8); p.lineTo(28, -h * 0.79); p.lineTo(19, -h * 0.78); p.closePath(); }); g.fillStyle = '#3a2e22'; g.fill(hat); }
  if (kind === 'dress') { const hat = P(p => p.ellipse(0, -h * 0.84, 34, 8, 0, 0, 7)); g.fillStyle = '#3a2e22'; g.fill(hat); }
  g.restore();
};
// 龙虾彩蛋（铜版画版）
EP.lobsterInk = (g, x, y, rot = -0.25, s = 0.9, wave = 0) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const body = EP.P(p => p.ellipse(0, 0, 26, 11, 0, 0, 7)); EP.solid(g, body, [-30, -12, 30, 12], { fill: '#b89a70', level: 2, gap: 3, lw: 0.9, seed: 301, stroke: 1.8 });
  g.strokeStyle = EP.INK; g.lineWidth = 1.8; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(-30 - k * 9, Math.sin(wave + k) * 1.5, 6, 8 - k, 0, 0, 7); g.stroke(); }
  g.beginPath(); g.moveTo(20, -6); g.quadraticCurveTo(44, -24, 58, -14); g.moveTo(20, 6); g.quadraticCurveTo(46, 22, 60, 12); g.stroke();
  [[60, -14], [62, 12]].forEach(([cx, cy]) => { const cl = EP.P(p => p.ellipse(cx, cy, 10, 6, cy < 0 ? -0.4 : 0.4, 0, 7)); g.fillStyle = '#9c8058'; g.fill(cl); g.stroke(cl); });
  g.lineWidth = 1; g.beginPath(); g.moveTo(24, -3); g.quadraticCurveTo(70, -50 + Math.sin(wave) * 6, 110, -40); g.moveTo(24, 2); g.quadraticCurveTo(76, -30 + Math.sin(wave + 1) * 6, 108, -24); g.stroke(); g.restore();
};

// ---------- 当代扁平（2026 段、开头）----------
EP.F = { wall: '#f6efe2', wall2: '#efe3cf', floor: '#d9a86b', floorDk: '#c48f52', board: '#b9773f', ink: '#2a2118', coral: '#c8402e', coralLt: '#e0654d', mustard: '#e8a93a',
  green: '#2f5d50', greenLt: '#4d7f6e', cream: '#fbf4e6', grey: '#3a3a3a', greyLt: '#7b7670', robot: '#f4efe6', robotDk: '#d8d0c2', shadow: 'rgba(80,50,20,.18)' };
// 侧面的扫地机：x 为中心，y 为地面；dir 1=朝右；legs 0..1 轮腿伸出高度；brush 边刷相位
EP.robotSide = (g, x, y, { dir = 1, legs = 0, brush = 0, led = 1, old = false, s = 1 } = {}) => {
  const F = EP.F; g.save(); g.translate(x, y); g.scale(dir * s, s);
  const lift = legs * 120;
  // 地面投影
  g.fillStyle = F.shadow; g.beginPath(); g.ellipse(0, 4, 190, 14, 0, 0, 7); g.fill();
  if (legs > 0) { // 两条轮腿
    [[-110, 0], [110, 0]].forEach(([lx]) => { g.strokeStyle = F.grey; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx * 0.8, -40 - lift); g.lineTo(lx, -38); g.stroke();
      g.fillStyle = F.ink; g.beginPath(); g.arc(lx, -38, 38, 0, 7); g.fill(); g.fillStyle = F.greyLt; g.beginPath(); g.arc(lx, -38, 14, 0, 7); g.fill(); });
  }
  g.translate(0, -lift);
  // 机身：扁圆柱侧面
  const body = old ? '#5b5a58' : F.robot, bodyDk = old ? '#3e3d3b' : F.robotDk, top = old ? '#6c6a67' : '#fffaf1';
  EP.rr(g, -180, -96, 360, 80, 30, body); EP.rr(g, -180, -40, 360, 26, 13, bodyDk);
  g.fillStyle = top; g.beginPath(); g.ellipse(0, -96, 180, 16, 0, 0, 7); g.fill();
  // 前保险杠
  g.fillStyle = old ? '#2c2b2a' : F.grey; g.beginPath(); g.roundRect(150, -92, 34, 72, 14); g.fill();
  // 激光头
  if (!old) { EP.rr(g, -50, -128, 100, 34, 12, F.grey); g.fillStyle = led > 0.5 ? F.mustard : '#7a6a50'; g.beginPath(); g.arc(0, -112, 7, 0, 7); g.fill(); }
  else { g.fillStyle = '#8a8884'; g.beginPath(); g.ellipse(0, -97, 120, 10, 0, 0, 7); g.fill(); g.fillStyle = '#9fd36a'; g.beginPath(); g.arc(40, -98, 5, 0, 7); g.fill(); }
  // 灯带
  g.fillStyle = led > 0.5 ? F.mustard : bodyDk; g.fillRect(-120, -62, 90, 6);
  // 轮
  if (legs === 0) { g.fillStyle = F.ink; g.beginPath(); g.arc(-80, -14, 16, 0, 7); g.fill(); g.beginPath(); g.arc(90, -14, 16, 0, 7); g.fill(); }
  // 边刷（侧面看是一排转动的刷毛）
  g.strokeStyle = F.coral; g.lineWidth = 4; g.lineCap = 'round';
  for (let k = 0; k < 3; k++) { const a = brush + k * 2.094; const bx = 150 + Math.cos(a) * 40; g.beginPath(); g.moveTo(150, -8); g.lineTo(bx, -2 + Math.sin(a) * 4); g.stroke(); }
  g.restore();
};
// 竹扫帚（当代扁平版）：pivot 在帚头着地点，ang 弧度（0 = 竖直）
EP.broomFlat = (g, x, y, ang) => {
  const F = EP.F; g.save(); g.translate(x, y); g.rotate(ang);
  g.strokeStyle = '#b8894a'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -150); g.lineTo(0, -620); g.stroke();
  g.strokeStyle = '#9a6f38'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-8, -220 - k * 70); g.lineTo(8, -220 - k * 70); g.stroke(); }
  g.fillStyle = '#d8b061'; g.beginPath(); g.moveTo(-14, -170); g.lineTo(14, -170); g.lineTo(80, 0); g.lineTo(-80, 0); g.closePath(); g.fill();
  g.strokeStyle = '#b48c3e'; g.lineWidth = 3; for (let k = -6; k <= 6; k++) { g.beginPath(); g.moveTo(k * 2, -165); g.lineTo(k * 12.5, -2); g.stroke(); }
  g.fillStyle = F.coral; g.fillRect(-20, -176, 40, 14);
  g.restore();
};
// 全画面颗粒（扁平插画的印刷颗粒），缓存 3 份轮换
EP.grain = (c, t, alpha = 0.07) => { const g = EP.cache('grain#' + EP.boil(t, 12, 3), (gg) => { const r = rng(77 + EP.boil(t, 12, 3)); gg.fillStyle = `rgba(40,25,10,${alpha})`; for (let i = 0; i < 90000; i++) gg.fillRect(r() * W, r() * H, 2, 2); }); c.drawImage(g, 0, 0); };
})();
