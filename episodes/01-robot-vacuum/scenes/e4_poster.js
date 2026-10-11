// 镜 7–10（25–42s）消费广告海报：平涂＋本戴网点＋套色错位＋米色海报纸。
//  镜 7（0–4）罐式吸尘器滑过亮得反光的格子地板，一个背影握着吸管（快推）。标题印在海报横幅上。
//  镜 8（4–8）1996 年的电视：屏幕里三叶虫形扫地机自己沿墙绕房间（横移）。
//  镜 9（8–13）圆形扫地机＋价签：$1500 被红笔划掉，$199 砸上（砸入）。
//  镜 10（13–17）一台裂成 4、16、64 台，铺满海报地板（快推）。
SCENES['e4_poster'] = (() => {
  const { clamp, lerp, rng, ss } = U, W = 1920, H = 1080;
  const C = { paper: '#f3e6cc', ink: '#2a2118', coral: '#c8402e', mustard: '#e8a93a', green: '#2f5d50', cream: '#fbf4e6', tan: '#e2c99c', grey: '#8f8a80' };
  const MIS = 5;   // 套色错位
  const dots = (g, path, col, cell = 12, size = (x, y) => 0.35, box = [0, 0, W, H]) => { g.save(); if (path) g.clip(path); g.fillStyle = col; for (let y = box[1]; y < box[3]; y += cell) for (let x = box[0] + ((y / cell) % 2) * cell / 2; x < box[2]; x += cell) { const r = size(x, y) * cell * 0.5; if (r > 0.3) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } } g.restore(); };
  // 填色层（往右下错开 MIS）＋墨线层：海报印刷的味道
  const fillInk = (g, path, col, lw = 5) => { g.save(); g.translate(MIS, MIS); g.fillStyle = col; g.fill(path); g.restore(); g.strokeStyle = C.ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(path); };
  const P = EP.P;
  const posterPaper = () => EP.cache('poster_paper', (g) => {
    g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
    const r = rng(3); for (let i = 0; i < 30000; i++) { g.fillStyle = `rgba(120,90,50,${0.03 + r() * 0.07})`; g.fillRect(r() * W, r() * H, 1.5, 1.5); }
    g.strokeStyle = 'rgba(120,90,50,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, H); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();   // 折痕
  });
  const frame = (c) => { c.save(); c.strokeStyle = C.ink; c.lineWidth = 8; c.strokeRect(40, 40, W - 80, H - 80); c.lineWidth = 2; c.strokeRect(56, 56, W - 112, H - 112); c.restore(); };
  const headline = (c, s, x, y, size, col = C.cream, bg = C.coral, a = 1) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `${size}px "PuHui-Black"`; const w = c.measureText(s).width; c.fillStyle = bg; c.save(); c.translate(x - 30, y - size * 0.95); c.rotate(-0.02); c.fillRect(0, 0, w + 60, size * 1.3); c.restore(); c.fillStyle = C.ink; c.fillText(s, x + 4, y + 4); c.fillStyle = col; c.fillText(s, x, y); c.restore(); };
  const sparkle = (c, x, y, s, col = C.cream) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); for (let k = 0; k < 8; k++) { const r = k % 2 ? 6 : 30, a = k / 8 * 6.283; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.strokeStyle = C.ink; c.lineWidth = 2.5; c.stroke(); c.restore(); };

  // ============ 镜 7 ============
  const FL = 640;
  const floor7 = () => EP.cache('floor7', (g) => {
    g.drawImage(posterPaper(), 0, 0);
    // 墙：芥末色＋网点
    const wall = P(p => p.rect(0, 0, W, FL)); g.fillStyle = C.mustard; g.fill(wall); dots(g, wall, 'rgba(200,64,46,.35)', 14, (x, y) => 0.25 + 0.5 * (y / FL));
    // 窗（墙上的大窗，绿框）
    const win = P(p => p.rect(1220, 120, 460, 360)); fillInk(g, win, C.cream, 6); g.strokeStyle = C.ink; g.lineWidth = 5; g.beginPath(); g.moveTo(1450, 120); g.lineTo(1450, 480); g.moveTo(1220, 300); g.lineTo(1680, 300); g.stroke();
    // 格子地板（透视）
    const vp = [960, 120];
    for (let row = 0; row < 8; row++) for (let col = -12; col < 12; col++) {
      const y0 = FL + Math.pow(row / 8, 1.6) * (H - FL), y1 = FL + Math.pow((row + 1) / 8, 1.6) * (H - FL);
      const xAt = (x, y) => vp[0] + (x - vp[0]) * (y - vp[1]) / (H - vp[1]);
      const xa = col * 220 + 960, xb = xa + 220;
      const p = P(pp => { pp.moveTo(xAt(xa, y0), y0); pp.lineTo(xAt(xb, y0), y0); pp.lineTo(xAt(xb, y1), y1); pp.lineTo(xAt(xa, y1), y1); pp.closePath(); });
      g.fillStyle = (row + col) % 2 ? C.cream : C.green; g.fill(p);
    }
    g.strokeStyle = C.ink; g.lineWidth = 5; g.beginPath(); g.moveTo(0, FL); g.lineTo(W, FL); g.stroke();
    // 墙角那盆花（海报装饰）
    const pot = P(p => { p.moveTo(250, FL); p.lineTo(230, FL - 120); p.lineTo(370, FL - 120); p.lineTo(350, FL); p.closePath(); }); fillInk(g, pot, C.coral, 5);
    [[-0.4, 200], [0, 240], [0.4, 190]].forEach(([a, L]) => { g.save(); g.translate(300, FL - 120); g.rotate(a); const lf = P(p => p.ellipse(0, -L / 2, 30, L / 2, 0, 0, 7)); fillInk(g, lf, C.green, 4); g.restore(); });
  });
  // 罐式吸尘器（侧面）：x 中心、地面 y
  const canister = (c, x, y, wob) => {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(42,33,24,.25)'; c.beginPath(); c.ellipse(0, 6, 210, 18, 0, 0, 7); c.fill();
    const body = P(p => { p.moveTo(-200, -30); p.bezierCurveTo(-210, -150, 160, -170, 210, -60); p.lineTo(210, -30); p.closePath(); }); fillInk(c, body, C.coral, 6);
    const band = P(p => p.rect(-196, -64, 404, 30)); fillInk(c, band, C.cream, 4);
    dots(c, body, 'rgba(42,33,24,.25)', 10, (xx, yy) => 0.15 + 0.5 * clamp((yy + y + 100 - y) / 200), [x - 220, y - 180, x + 220, y]);
    [[-130, -18], [130, -18]].forEach(([wx, wy]) => { const wh = P(p => p.arc(wx, wy, 26, 0, 7)); fillInk(c, wh, C.ink, 4); c.fillStyle = C.cream; c.beginPath(); c.arc(wx, wy, 8, 0, 7); c.fill(); });
    // 镀铬高光
    c.strokeStyle = C.cream; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(-120, -120); c.quadraticCurveTo(-40, -150, 40, -140); c.stroke();
    c.restore();
  };
  // 背影：五十年代的连衣裙、围裙结、发髻，手握吸管
  const lady = (c, x, y, sway) => {
    c.save(); c.translate(x, y);
    const legs = P(p => { p.rect(-48, -150, 30, 150); p.rect(18, -150, 30, 150); }); fillInk(c, legs, '#e9b98f', 4);
    const shoes = P(p => { p.ellipse(-36, -6, 30, 12, 0, 0, 7); p.ellipse(36, -6, 30, 12, 0, 0, 7); }); fillInk(c, shoes, C.coral, 3);
    const skirt = P(p => { p.moveTo(-60, -420); p.bezierCurveTo(-170, -260, -190, -170, -180, -140); p.lineTo(180, -140); p.bezierCurveTo(190, -170, 170, -260, 60, -420); p.closePath(); }); fillInk(c, skirt, C.green, 6);
    dots(c, skirt, 'rgba(251,244,230,.55)', 26, () => 0.42, [x - 190, y - 420, x + 190, y - 140]);
    const torso = P(p => { p.moveTo(-70, -620); p.lineTo(70, -620); p.lineTo(60, -410); p.lineTo(-60, -410); p.closePath(); }); fillInk(c, torso, C.green, 6);
    const bow = P(p => { p.moveTo(0, -430); p.lineTo(-60, -460); p.lineTo(-56, -400); p.closePath(); p.moveTo(0, -430); p.lineTo(60, -460); p.lineTo(56, -400); p.closePath(); }); fillInk(c, bow, C.cream, 4);
    c.strokeStyle = C.ink; c.lineWidth = 4; c.beginPath(); c.moveTo(-60, -418); c.lineTo(60, -418); c.stroke();
    const neck = P(p => p.rect(-18, -660, 36, 48)); fillInk(c, neck, '#e9b98f', 4);
    const hair = P(p => { p.ellipse(0, -712, 62, 66, 0, 0, 7); }); fillInk(c, hair, '#5a3424', 6);
    const bun = P(p => p.arc(0, -770, 34, 0, 7)); fillInk(c, bun, '#5a3424', 5);
    const scarf = P(p => { p.moveTo(-40, -790); p.lineTo(40, -790); p.lineTo(30, -760); p.lineTo(-30, -760); p.closePath(); }); fillInk(c, scarf, C.coral, 3);
    // 手臂伸向前（左），握吸管
    c.save(); c.rotate(sway); const arm = P(p => { p.moveTo(-60, -600); p.quadraticCurveTo(-170, -520, -230, -470); p.lineTo(-206, -446); p.quadraticCurveTo(-150, -500, -50, -560); p.closePath(); }); fillInk(c, arm, C.green, 5); c.restore();
    c.restore();
  };
  const shot7 = (c, st, lt) => {
    const glide = Math.sin(st * 2.4) * 90;
    const cam = EP.cam(st, [{ t: 0, cx: 960, cy: 560, z: 1.0 }, { t: 0.6, cx: 860, cy: 690, z: 1.18, kind: 'push' }]);
    EP.withCam(c, cam, () => {
      c.drawImage(floor7(), 0, 0);
      const lx = 1180, ly = 1030;
      // 吸管：从手到吸头，吸头在地上来回
      const hand = [lx - 230 + Math.sin(st * 2.4) * 20, ly - 470], tip = [520 + glide * 1.6, ly - 20];
      c.save(); c.strokeStyle = C.ink; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.moveTo(hand[0], hand[1]); c.lineTo(tip[0], tip[1]); c.stroke(); c.strokeStyle = '#cfc8bb'; c.lineWidth = 12; c.stroke(); c.restore();
      const head = P(p => p.roundRect(tip[0] - 110, tip[1] - 26, 220, 34, 10)); fillInk(c, head, C.ink, 4);
      // 软管：从吸管接到罐子
      const cx0 = 760 + glide * 0.6;
      c.save(); c.strokeStyle = C.ink; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(hand[0] - 40, hand[1] + 70); c.bezierCurveTo(hand[0] - 120, hand[1] + 260, cx0 + 200, ly - 300, cx0 + 180, ly - 110); c.stroke(); c.strokeStyle = C.mustard; c.lineWidth = 14; c.stroke(); c.restore();
      canister(c, cx0, ly - 30, 0);
      lady(c, lx, ly, Math.sin(st * 2.4) * 0.03);
      // 地板反光：吸过的地方一闪一闪
      for (let k = 0; k < 6; k++) { const ph = (st * 1.6 + k / 6) % 1; const s = Math.sin(ph * Math.PI); sparkle(c, 300 + k * 230 + (k % 2) * 60, 760 + (k % 3) * 90, 0.4 + s * 0.9); }
    });
    headline(c, '省力又体面', 110, 200, 120, C.cream, C.coral, ss(0.2, 0.45, st));
    frame(c);
  };

  // ============ 镜 8：1996 电视 ============
  const shot8 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 820, cy: 560, z: 1.12 }, { t: 1.2, cx: 1100, cy: 540, z: 1.12, kind: 'pan' }]);
    c.drawImage(posterPaper(), 0, 0);
    EP.withCam(c, cam, () => {
      // 背景：绿底＋放射条
      c.save(); c.translate(960, 540); for (let k = 0; k < 24; k++) { c.fillStyle = k % 2 ? C.green : '#3a6b5d'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 1600, k / 24 * 6.283 + st * 0.05, (k + 1) / 24 * 6.283 + st * 0.05); c.closePath(); c.fill(); } c.restore();
      // 电视柜（木纹）
      const cab = P(p => p.roundRect(420, 170, 1080, 760, 40)); fillInk(c, cab, '#9a5a32', 8);
      c.save(); c.clip(cab); c.strokeStyle = 'rgba(42,33,24,.35)'; c.lineWidth = 3; for (let y = 180; y < 930; y += 22) { c.beginPath(); for (let x = 420; x < 1500; x += 30) c.lineTo(x, y + Math.sin(x * 0.02 + y) * 4); c.stroke(); } c.restore();
      const scr = P(p => p.roundRect(490, 230, 800, 600, 60)); fillInk(c, scr, '#2d3a33', 8);
      // 屏幕里：俯视的房间，三叶虫沿墙走
      c.save(); c.clip(scr);
      c.fillStyle = '#d9cfb8'; c.fillRect(540, 280, 700, 500); c.fillStyle = '#b9a98a'; c.fillRect(780, 420, 200, 160); c.fillRect(1080, 300, 140, 80);   // 沙发、桌
      // 沿墙的路径：先绕一圈墙边
      const per = 2 * (700 + 500) - 8 * 90, q = ((st * 0.42) % 1) * per;
      const walk = (d) => { const L = [610, 340, 1170, 640]; const w = L[2] - L[0], h = L[3] - L[1]; d = d % (2 * (w + h)); if (d < w) return [L[0] + d, L[1], 0]; d -= w; if (d < h) return [L[2], L[1] + d, 1.57]; d -= h; if (d < w) return [L[2] - d, L[3], 3.14]; d -= w; return [L[0], L[3] - d, 4.71]; };
      // 走过的轨迹
      c.strokeStyle = 'rgba(232,169,58,.8)'; c.lineWidth = 6; c.setLineDash([12, 10]); c.beginPath(); for (let d = Math.max(0, q - 900); d <= q; d += 10) { const [x, y] = walk(d); c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
      const [rx, ry, ra] = walk(q); c.save(); c.translate(rx, ry); c.rotate(ra);
      const tri = P(p => { p.moveTo(-50, -48); p.quadraticCurveTo(60, -40, 64, 0); p.quadraticCurveTo(60, 40, -50, 48); p.quadraticCurveTo(-70, 0, -50, -48); p.closePath(); }); c.fillStyle = '#4a4a46'; c.fill(tri); c.strokeStyle = '#111'; c.lineWidth = 4; c.stroke(tri);
      c.fillStyle = C.mustard; c.beginPath(); c.arc(10, 0, 10, 0, 7); c.fill(); c.restore();
      // 扫描线＋屏幕弧光
      c.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 230; y < 830; y += 6) c.fillRect(490, y + (st * 40 % 6), 800, 2);
      const gl = c.createRadialGradient(700, 360, 20, 700, 360, 520); gl.addColorStop(0, 'rgba(255,255,255,.22)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(490, 230, 800, 600);
      // 节目下方字幕条
      c.fillStyle = C.coral; c.fillRect(490, 720, 800, 80); EP.text(c, '1996  自己走', 890, 778, '50px "PuHui-Black"', C.cream, 'center');
      c.restore();
      // 旋钮
      [[1400, 330], [1400, 470]].forEach(([x, y], i) => { const k = P(p => p.arc(x, y, 40, 0, 7)); fillInk(c, k, C.cream, 5); c.save(); c.translate(x, y); c.rotate(i ? st * 2 : 0.6); c.fillStyle = C.ink; c.fillRect(-4, -36, 8, 30); c.restore(); });
      const grill = P(p => p.roundRect(1340, 560, 120, 240, 16)); fillInk(c, grill, '#7a4526', 4); c.strokeStyle = C.ink; c.lineWidth = 3; for (let y = 580; y < 790; y += 18) { c.beginPath(); c.moveTo(1356, y); c.lineTo(1444, y); c.stroke(); }
      // 天线
      c.strokeStyle = C.ink; c.lineWidth = 6; c.beginPath(); c.moveTo(960, 170); c.lineTo(820 + Math.sin(st * 3) * 6, 20); c.moveTo(960, 170); c.lineTo(1100, 30); c.stroke();
    });
    frame(c);
  };

  // ============ 镜 9：价签 ============
  const robotTop = (c, x, y, r, rot = 0, col = '#6f6b66') => {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = 'rgba(42,33,24,.25)'; c.beginPath(); c.arc(8, 10, r, 0, 7); c.fill();
    const body = P(p => p.arc(0, 0, r, 0, 7)); fillInk(c, body, col, Math.max(2, r * 0.03));
    const ring = P(p => p.arc(0, 0, r * 0.78, 0, 7)); c.strokeStyle = '#c9c4bb'; c.lineWidth = r * 0.08; c.stroke(ring);
    const bump = P(p => { p.arc(0, 0, r, -2.5, -0.64); p.arc(0, 0, r * 0.88, -0.64, -2.5, true); p.closePath(); }); fillInk(c, bump, C.ink, Math.max(1.5, r * 0.02));
    const btn = P(p => p.arc(0, 0, r * 0.18, 0, 7)); fillInk(c, btn, C.mustard, Math.max(1.5, r * 0.02));
    c.restore();
  };
  const shot9 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 960, cy: 540, z: 1.0 }, { t: 1.7, cx: 1280, cy: 560, z: 1.25, kind: 'slam' }]);
    c.drawImage(posterPaper(), 0, 0);
    EP.withCam(c, cam, () => {
      dots(c, null, 'rgba(232,169,58,.55)', 22, (x, y) => 0.25 + 0.45 * Math.hypot(x - 760, y - 540) / 1100);
      robotTop(c, 760, 560, 330, Math.sin(st * 1.4) * 0.12);
      // 价签：挂绳＋签，左右轻摆
      const sw = Math.sin(st * 2.2) * 0.06 + (st > 1.7 && st < 2.4 ? Math.sin((st - 1.7) * 18) * 0.08 * (2.4 - st) : 0);
      c.save(); c.translate(1080, 360); c.rotate(sw);
      c.strokeStyle = C.ink; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(170, 120); c.stroke();
      c.translate(170, 120); c.rotate(0.18);
      const tag = P(p => { p.moveTo(0, 0); p.lineTo(80, -70); p.lineTo(520, -70); p.lineTo(520, 330); p.lineTo(80, 330); p.lineTo(0, 260); p.closePath(); }); fillInk(c, tag, C.cream, 6);
      c.fillStyle = C.ink; c.beginPath(); c.arc(40, 10, 14, 0, 7); c.fill();
      EP.text(c, '2001', 130, -10, '40px "Poppins-800"', C.ink);
      EP.text(c, '$1500', 130, 90, '110px "Poppins-800"', C.ink);
      // 红笔划掉
      const q = ss(0.9, 1.3, st); if (q > 0) { c.strokeStyle = C.coral; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(120, 60); c.lineTo(120 + 380 * q, 30 - 30 * q); c.stroke(); }
      // $199 盖上
      const s = st > 1.7 ? (st < 1.87 ? lerp(1.8, 0.94, (st - 1.7) / 0.17) : st < 2.0 ? lerp(0.94, 1, (st - 1.87) / 0.13) : 1) : 0;
      if (s > 0) { c.save(); c.translate(300, 230); c.rotate(-0.08); c.scale(s, s); c.fillStyle = C.coral; c.beginPath(); c.roundRect(-200, -80, 400, 150, 18); c.fill(); EP.text(c, '$199', 0, 46, '130px "Poppins-800"', C.cream, 'center'); EP.text(c, '2002', 0, -90, '34px "Poppins-800"', C.ink, 'center'); c.restore(); }
      c.restore();
    });
    frame(c);
  };

  // ============ 镜 10：一台裂成很多台 ============
  const shot10 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 960, cy: 600, z: 1.0 }, { t: 2.4, cx: 960, cy: 620, z: 1.3, kind: 'push' }]);
    c.drawImage(posterPaper(), 0, 0);
    EP.withCam(c, cam, () => {
      // 地板（俯视木地板）
      c.fillStyle = C.tan; c.fillRect(0, 300, W, H); c.strokeStyle = 'rgba(42,33,24,.35)'; c.lineWidth = 3; for (let y = 300; y < H; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      // 分裂：level 0→3（1、4、16、64 台），每级 0.55s
      const T0 = [0.6, 1.15, 1.7], lvl = st < T0[0] ? 0 : st < T0[1] ? 1 : st < T0[2] ? 2 : 3, n = Math.pow(2, lvl), fr = lvl ? clamp((st - T0[lvl - 1]) / 0.2) : 1;
      const area = [300, 400, 1620, 1030], cw = (area[2] - area[0]) / n, ch = (area[3] - area[1]) / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = area[0] + cw * (i + 0.5), y = area[1] + ch * (j + 0.5); const r = Math.min(cw, ch) * 0.42 * (lvl === 0 ? 1 : (0.8 + 0.2 * fr)); robotTop(c, x + Math.sin(st * 3 + i + j) * 3, y, r, (i + j) * 0.5 + st * 0.5, (i + j) % 3 === 0 ? '#6f6b66' : (i + j) % 3 === 1 ? C.coral : C.green); }
    });
    headline(c, '人人买得起', 110, 200, 120, C.cream, C.green, ss(0.1, 0.35, st));
    frame(c);
  };

  return { draw(c, lt, t) { EP.shots(c, lt, [[0, 4, shot7], [4, 8, shot8], [8, 13, shot9], [13, 17, shot10]]); } };
})();
