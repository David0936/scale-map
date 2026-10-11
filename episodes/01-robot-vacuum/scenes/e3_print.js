// 镜 4–6（12–25s）报刊铜版画。
//  镜 4（0–4）1876 地毯清扫器：手推着它滚过地毯，滚刷转，灰被卷进盒里（快推）。右上角放大圈＝铜版画的「局部详图」。
//  镜 5（4–9）1901 马车吸尘机：活塞抽、软管里的波纹往车上流，管子伸进楼里的窗（从车横移到窗）。
//  镜 6（9–13）1908 立式电动吸尘器：布袋一鼓，被推过门槛进了屋（砸入）。剖面画法：墙被切开，门槛在中间。
// 静态层用 EP.boiled 画 3 份按 8fps 轮换＝线条沸腾；会动的部件每帧画（排线密度低一些）。
SCENES['e3_print'] = (() => {
  const { clamp, lerp, rng, ss } = U, W = 1920, H = 1080, I = EP.INK, Pth = EP.P;
  const ink = EP.ink, solid = EP.solid, hatch = EP.hatch, tone = EP.tone;

  // ================= 镜 4：1876 =================
  const FL4 = 860;
  const room4 = (g, sd) => {
    EP.paper(g, EP.PAPER, 7 + sd);
    // 墙：护墙板＋墙纸（菱形纹）
    const wall = Pth(p => p.rect(0, 0, W, 560)); g.fillStyle = '#e6d9ba'; g.fill(wall);
    hatch(g, wall, [0, 0, W, 560], { angle: 90, gap: 9, lw: 0.9, color: 'rgba(42,33,24,.45)', seed: sd + 1 });
    g.save(); g.strokeStyle = 'rgba(42,33,24,.55)'; g.lineWidth = 1.4; for (let y = 40; y < 540; y += 90) for (let x = (y / 90 % 2) * 60; x < W; x += 120) { g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x + 22, y); g.lineTo(x, y + 30); g.lineTo(x - 22, y); g.closePath(); g.stroke(); } g.restore();
    const wain = Pth(p => p.rect(0, 560, W, FL4 - 560)); solid(g, wain, [0, 560, W, FL4], { fill: '#d4c29c', level: 1, angle: 90, gap: 6, seed: sd + 2, stroke: 0 });
    g.save(); g.strokeStyle = I; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 560); g.lineTo(W, 560); g.stroke(); for (let x = 60; x < W; x += 300) { g.lineWidth = 2; g.strokeRect(x, 600, 240, 210); } g.restore();
    // 地毯：花纹带
    const rug = Pth(p => p.rect(0, FL4, W, H - FL4)); solid(g, rug, [0, FL4, W, H], { fill: '#c9b089', level: 1, angle: 8, gap: 5, seed: sd + 3, stroke: 0 });
    g.save(); g.strokeStyle = I; g.lineWidth = 2.4; g.beginPath(); g.moveTo(0, FL4); g.lineTo(W, FL4); g.stroke(); g.lineWidth = 1.6;
    for (let x = 0; x < W; x += 80) { g.beginPath(); g.moveTo(x, FL4 + 40); g.lineTo(x + 40, FL4 + 20); g.lineTo(x + 80, FL4 + 40); g.lineTo(x + 40, FL4 + 60); g.closePath(); g.stroke(); }
    g.beginPath(); g.moveTo(0, FL4 + 90); g.lineTo(W, FL4 + 90); g.stroke(); g.restore();
    hatch(g, Pth(p => p.rect(0, FL4 + 100, W, 120)), [0, FL4 + 100, W, H], { angle: 0, gap: 6, lw: 1, seed: sd + 4 });
  };
  // 清扫器（静态外形，缓存成精灵）：中心 (0,0) 在盒底中点，宽 420
  const sweeperSprite = (sd) => EP.cache('sw1876#' + sd, (g) => {
    g.translate(260, 220);
    const box = Pth(p => { p.moveTo(-210, -30); p.lineTo(-200, -150); p.quadraticCurveTo(0, -176, 200, -150); p.lineTo(210, -30); p.closePath(); });
    solid(g, box, [-210, -180, 210, -20], { fill: '#bfa47a', level: 2, angle: 90, gap: 5, seed: sd + 11 });
    // 木纹与铜包边
    g.save(); g.strokeStyle = I; g.lineWidth = 1.6; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-196, -130 + k * 26); g.bezierCurveTo(-80, -136 + k * 26, 60, -120 + k * 26, 196, -128 + k * 26); g.stroke(); } g.restore();
    const band = Pth(p => p.rect(-212, -48, 424, 22)); solid(g, band, [-212, -48, 212, -26], { fill: '#e6d6ae', level: 1, angle: 0, gap: 4, seed: sd + 12, stroke: 2 });
    EP.text(g, 'CARPET SWEEPER', 0, -86, '30px "IMFellEnglish-400"', I, 'center');
  }, 520, 260);
  const wheel = (g, x, y, r, rot, n = 8) => { g.save(); g.fillStyle = '#d6c39b'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = I; g.lineWidth = 3; g.stroke(); g.lineWidth = 2; for (let k = 0; k < n; k++) { const a = rot + k / n * 6.283; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); } g.fillStyle = I; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.restore(); };
  const DUST4 = (() => { const r = rng(401), a = []; for (let i = 0; i < 90; i++) a.push([r() * 2200 - 100, FL4 + 8 + r() * 70, 1.5 + r() * 2.5]); return a; })();
  const shot4 = (c, st, lt) => {
    const sx = 700 + st * 120 + Math.sin(st * 2.6) * 120;   // 来回推，整体往右走
    const cam = EP.cam(st, [{ t: 0, cx: 960, cy: 640, z: 1.2 }, { t: 0.7, cx: Math.min(sx + 140, 1300), cy: 650, z: 1.55, kind: 'push' }]);
    EP.withCam(c, cam, () => {
      c.drawImage(EP.boiled('room4', lt, room4), 0, 0);
      // 灰：清扫器经过的地方没了
      c.fillStyle = 'rgba(42,33,24,.75)'; DUST4.forEach(([x, y, s]) => { if (x > sx + 230 || x < 300) { c.beginPath(); c.arc(x, y, s, 0, 7); c.fill(); } });
      // 长柄：从盒子中间斜伸到右上，一只手握着
      const top = [sx + 560, FL4 - 660];
      c.save(); c.strokeStyle = I; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx + 20, FL4 - 150); c.lineTo(top[0], top[1]); c.stroke(); c.strokeStyle = '#cdb88f'; c.lineWidth = 8; c.stroke(); c.restore();
      // 手：袖口＋握拳（排线）
      const hx = sx + 380, hy = FL4 - 440;
      const sleeve = Pth(p => { p.moveTo(hx + 30, hy - 40); p.lineTo(hx + 260, hy - 240); p.lineTo(hx + 330, hy - 160); p.lineTo(hx + 90, hy + 30); p.closePath(); });
      solid(c, sleeve, [hx, hy - 260, hx + 340, hy + 40], { fill: '#8f7a58', level: 2, gap: 4.5, seed: 420 + EP.boil(lt), angle: 30 });
      const cuff = Pth(p => { p.moveTo(hx + 20, hy - 34); p.lineTo(hx + 50, hy - 62); p.lineTo(hx + 110, hy); p.lineTo(hx + 80, hy + 30); p.closePath(); }); solid(c, cuff, [hx, hy - 70, hx + 120, hy + 40], { fill: '#efe6cf', level: 0, seed: 1 });
      const fist = Pth(p => { p.ellipse(hx + 10, hy + 6, 52, 40, -0.7, 0, 7); }); solid(c, fist, [hx - 50, hy - 40, hx + 60, hy + 50], { fill: '#d9c19b', level: 1, gap: 4, seed: 430 + EP.boil(lt), angle: 60 });
      for (let k = 0; k < 3; k++) ink(c, [[hx - 30 + k * 16, hy - 20 + k * 14], [hx - 4 + k * 16, hy + 6 + k * 14]], { lw: 1.8, seed: 440 + k });
      // 盒子＋轮子
      c.drawImage(sweeperSprite(EP.boil(lt)), sx - 260, FL4 - 220);
      const rot = (sx / 34);
      wheel(c, sx - 170, FL4 - 26, 26, rot); wheel(c, sx + 170, FL4 - 26, 26, rot);
      ink(c, [[sx - 200, FL4 + 4], [sx + 200, FL4 + 4]], { lw: 2, seed: 450 });
    });
    // 局部详图圈：盒里的滚刷在转，灰被卷进去（不跟镜头，像版面上的插图）
    const a = ss(0.9, 1.2, st); if (a > 0) {
      const cx = 820, cy = 240, R = 165; c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(236,226,201,.97)'; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill(); c.clip();
      const rot = st * 9; c.fillStyle = '#d6c39b'; c.fillRect(cx - R, cy + 70, 2 * R, 120); hatch(c, null, [cx - R, cy + 70, cx + R, cy + 190], { angle: 10, gap: 6, lw: 1, seed: 460 });
      ink(c, [[cx - R, cy + 70], [cx + R, cy + 70]], { lw: 2.4, seed: 461 });
      ink(c, [[cx - 150, cy + 60], [cx - 150, cy - 110], [cx + 150, cy - 110], [cx + 150, cy + 60]], { lw: 3, seed: 462 });
      c.strokeStyle = I; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy + 10, 52, 0, 7); c.stroke();
      for (let k = 0; k < 10; k++) { const an = rot + k * 0.628; ink(c, [[cx + Math.cos(an) * 20, cy + 10 + Math.sin(an) * 20], [cx + Math.cos(an) * 66, cy + 10 + Math.sin(an) * 66]], { lw: 2, seed: 470 + k, wob: 0.4 }); }
      // 灰被卷进左边的盒仓
      for (let k = 0; k < 12; k++) { const q = ((st * 1.3 + k / 12) % 1); const an = Math.PI * 0.4 + q * Math.PI * 1.1; const x = cx + Math.cos(an) * 75 - q * 40, y = cy + 10 + Math.sin(an) * 75; c.fillStyle = I; c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); }
      c.restore(); c.save(); c.globalAlpha = a; c.strokeStyle = I; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke(); c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, R - 8, 0, 7); c.stroke();
      EP.text(c, 'Fig. 2', cx - R + 10, cy + R + 40, 'italic 32px "IMFellEnglish-400i"', I); c.restore();
    }
    EP.caption(c, 70, 60, 520, '1876', 'Michigan', '站着扫，不用弯腰', ss(0.2, 0.5, st));
  };

  // ================= 镜 5：1901 =================
  const GR = 812, CURB = 850;
  const street = (g, sd) => {
    EP.paper(g, EP.PAPER, 17 + sd);
    const far = Pth(p => { p.moveTo(0, 470); [[60,470],[60,330],[150,330],[150,300],[260,300],[260,350],[380,350],[380,260],[470,260],[470,380],[600,380],[600,320],[720,320],[720,400],[860,400],[860,300],[980,300],[980,470]].forEach(([x,y])=>p.lineTo(x,y)); p.lineTo(980, GR); p.lineTo(0, GR); p.closePath(); });
    hatch(g, far, [0, 250, 980, GR], { angle: 90, gap: 7, lw: 0.9, color: 'rgba(42,33,24,.6)', seed: sd + 11, breakP: 0.03 });
    g.fillStyle = 'rgba(236,226,201,.9)'; for (let x = 90; x < 950; x += 70) for (let y = 400; y < 700; y += 95) if ((x * 7 + y) % 3) g.fillRect(x, y, 26, 44);
    hatch(g, Pth(p => p.rect(0, 0, 980, 470)), [0, 0, 980, 470], { angle: 0, gap: 9, lw: 0.8, color: 'rgba(42,33,24,.35)', seed: sd + 12, dens: (x, y) => 0.15 + 0.6 * (1 - y / 470) });
    const bx0 = 1010, facade = Pth(p => p.rect(bx0, -10, W - bx0 + 10, GR + 10)); g.fillStyle = '#e4d7b8'; g.fill(facade);
    hatch(g, facade, [bx0, 0, W, GR], { angle: 90, gap: 11, lw: 0.9, color: 'rgba(42,33,24,.5)', seed: sd + 21 });
    g.save(); g.strokeStyle = I; g.lineWidth = 1.6; for (let y = 20; y < GR; y += 46) { g.beginPath(); g.moveTo(bx0, y); g.lineTo(W, y); g.stroke(); } g.restore();
    tone(g, Pth(p => p.rect(bx0, -10, 40, GR + 10)), [bx0, 0, bx0 + 40, GR], 3, { gap: 5, lw: 1.3, seed: sd + 22 }); ink(g, [[bx0, -10], [bx0, GR]], { lw: 3.5 });
    const win = (x, y, w, h, open = 0) => {
      const glass = Pth(p => p.rect(x, y, w, h)); g.fillStyle = '#d8c9a6'; g.fill(glass); tone(g, glass, [x, y, x + w, y + h], 2, { gap: 4, lw: 1.2, seed: sd + x + y });
      if (open) { g.fillStyle = '#1e1710'; g.fillRect(x, y + h - open, w, open); }
      g.save(); g.strokeStyle = '#efe5cc'; g.lineWidth = 9; g.strokeRect(x, y, w, h); g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h - open); g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); g.stroke(); g.restore();
      ink(g, [[x - 5, y - 5], [x + w + 5, y - 5], [x + w + 5, y + h + 5], [x - 5, y + h + 5]], { lw: 2.2, close: true, seed: x });
      const lin = Pth(p => { p.moveTo(x - 22, y - 8); p.lineTo(x + w + 22, y - 8); p.lineTo(x + w + 12, y - 40); p.lineTo(x - 12, y - 40); p.closePath(); }); solid(g, lin, [x - 22, y - 40, x + w + 22, y - 8], { fill: '#efe6cf', level: 1, angle: 0, gap: 5, seed: sd + x * 3, stroke: 2 });
      const sill = Pth(p => p.rect(x - 18, y + h + 6, w + 36, 16)); solid(g, sill, [x - 18, y + h + 6, x + w + 18, y + h + 22], { fill: '#efe6cf', level: 1, angle: 0, gap: 4, seed: sd + 5 + x, stroke: 2 });
    };
    win(1160, 90, 250, 270); win(1560, 90, 230, 270); win(1160, 480, 250, 260, 120);
    const door = Pth(p => { p.moveTo(1590, GR - 40); p.lineTo(1590, 520); p.arc(1680, 520, 90, Math.PI, 0); p.lineTo(1770, GR - 40); p.closePath(); }); solid(g, door, [1590, 430, 1770, GR], { fill: '#cdbb94', level: 2, angle: 80, gap: 5, lw: 1.3, seed: sd + 31, stroke: 3 });
    for (let i = 0; i < 3; i++) { const s2 = Pth(p => p.rect(1560 - i * 14, GR - 54 + i * 14, 240 + i * 28, 14)); solid(g, s2, [1500, GR - 60, 1850, GR], { fill: '#efe6cf', level: 1, angle: 0, gap: 4, lw: 1, seed: sd + 40 + i, stroke: 2 }); }
    g.save(); g.strokeStyle = I; g.lineWidth = 3; for (let x = 1040; x < 1540; x += 24) { g.beginPath(); g.moveTo(x, GR); g.lineTo(x, GR - 92); g.stroke(); } g.lineWidth = 4; g.beginPath(); g.moveTo(1030, GR - 80); g.lineTo(1545, GR - 80); g.stroke(); g.restore();
    solid(g, Pth(p => p.rect(0, GR, W, CURB - GR)), [0, GR, W, CURB], { fill: '#e3d6b6', level: 1, angle: 0, gap: 6, lw: 0.9, seed: sd + 51, stroke: 0 });
    ink(g, [[0, GR], [W, GR]], { lw: 2.6 }); ink(g, [[0, CURB], [W, CURB]], { lw: 3.4 });
    const road = Pth(p => p.rect(0, CURB, W, H - CURB)); g.fillStyle = '#d9caa6'; g.fill(road);
    hatch(g, road, [0, CURB, W, H], { angle: 4, gap: 7, lw: 1, color: 'rgba(42,33,24,.6)', seed: sd + 52, dens: (x, y) => 0.35 + 0.5 * ((y - CURB) / (H - CURB)) });
    // 车厢、发动机、泵（不动的部分）
    [[0, 0], [0, 40]].forEach(([dx, dy]) => { ink(g, [[70, GR + 4 + dy], [290, 640 + dy]], { lw: 9 }); ink(g, [[70, GR + 4 + dy], [290, 640 + dy]], { lw: 4, color: '#d8c7a0' }); });
    const box = Pth(p => p.rect(280, 560, 600, 150)); solid(g, box, [280, 560, 880, 710], { fill: '#d6c39b', level: 1, angle: 90, gap: 5, seed: sd + 81, stroke: 3.2 });
    hatch(g, box, [280, 560, 880, 710], { angle: 20, gap: 5, lw: 1.1, seed: sd + 82, dens: (x, y) => (y - 560) / 150 });
    g.save(); g.strokeStyle = I; g.lineWidth = 2; for (let x = 340; x < 880; x += 60) { g.beginPath(); g.moveTo(x, 560); g.lineTo(x, 710); g.stroke(); } g.restore();
    g.fillStyle = '#efe6cf'; g.fillRect(400, 572, 360, 50); g.strokeStyle = I; g.lineWidth = 2; g.strokeRect(400, 572, 360, 50); EP.text(g, 'VACUUM  CLEANING', 580, 607, '34px "IMFellEnglish-400"', I, 'center');
    solid(g, Pth(p => p.rect(470, 420, 150, 140)), [470, 420, 620, 560], { fill: '#c8b48a', level: 2, gap: 5, seed: sd + 92, stroke: 3 });
    const pump = Pth(p => p.rect(650, 330, 110, 230)); g.fillStyle = '#d9c7a1'; g.fill(pump); hatch(g, pump, [650, 330, 760, 560], { angle: 90, gap: 5, lw: 1.2, seed: sd + 93, dens: x => 0.15 + 0.85 * Math.abs((x - 690) / 70) });
    g.save(); g.strokeStyle = I; g.lineWidth = 3; g.stroke(pump); g.lineWidth = 2; [350, 420, 500].forEach(y => { g.beginPath(); g.moveTo(645, y); g.lineTo(765, y); g.stroke(); }); g.restore();
    ink(g, [[540, 420], [540, 300]], { lw: 14 }); ink(g, [[540, 420], [540, 300]], { lw: 8, color: '#cdb88f' });
    solid(g, Pth(p => p.ellipse(600, CURB + 12, 380, 18, 0, 0, 7)), [220, CURB - 10, 980, CURB + 30], { fill: 'rgba(0,0,0,0)', level: 2, gap: 4, lw: 1, seed: sd + 103, stroke: 0 });
  };
  const wheel5 = (c, cx, cy, r, rot) => {
    const rim = Pth(p => { p.arc(cx, cy, r, 0, 7); p.arc(cx, cy, r - 16, 0, 7, true); }); c.fillStyle = '#c4ae82'; c.fill(rim);
    c.save(); c.strokeStyle = I; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); c.beginPath(); c.arc(cx, cy, r - 16, 0, 7); c.stroke(); c.lineWidth = 4;
    for (let k = 0; k < 12; k++) { const a = rot + k / 12 * 6.283; c.beginPath(); c.moveTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16); c.lineTo(cx + Math.cos(a) * (r - 16), cy + Math.sin(a) * (r - 16)); c.stroke(); }
    c.beginPath(); c.arc(cx, cy, 18, 0, 7); c.fillStyle = I; c.fill(); c.restore();
  };
  const shot5 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 740, cy: 560, z: 1.32 }, { t: 2.0, cx: 1190, cy: 560, z: 1.32, kind: 'pan' }]);
    EP.withCam(c, cam, () => {
      c.drawImage(EP.boiled('street5', lt, street), 0, 0);
      // 飞轮转
      const fr = st * 7; c.save(); c.fillStyle = '#d6c39b'; c.beginPath(); c.arc(400, 470, 82, 0, 7); c.fill(); c.strokeStyle = I; c.lineWidth = 6; c.stroke(); c.lineWidth = 3;
      for (let k = 0; k < 6; k++) { const a = fr + k / 6 * 6.283; c.beginPath(); c.moveTo(400, 470); c.lineTo(400 + Math.cos(a) * 78, 470 + Math.sin(a) * 78); c.stroke(); } c.beginPath(); c.arc(400, 470, 14, 0, 7); c.fillStyle = I; c.fill(); c.restore();
      // 连杆＋活塞杆上下
      const py = 300 - 40 * (0.5 + 0.5 * Math.sin(fr)); const crank = [400 + Math.cos(fr) * 50, 470 + Math.sin(fr) * 50];
      ink(c, [crank, [705, py + 10]], { lw: 5, seed: 501 }); ink(c, [[705, py], [705, 330]], { lw: 9, seed: 502 });
      const cap = Pth(p => p.ellipse(705, 330, 62, 14, 0, 0, 7)); c.fillStyle = '#e6d8b8'; c.fill(cap); c.strokeStyle = I; c.lineWidth = 3; c.stroke(cap);
      c.fillStyle = I; c.fillRect(680, py - 12, 50, 14);
      // 烟：一团团往上飘、变大（循环）
      for (let k = 0; k < 6; k++) { const q = (st * 0.45 + k / 6) % 1; const cx = 540 - q * 200, cy = 280 - q * 300, rad = 20 + q * 70;
        c.save(); c.globalAlpha = 1 - q * 0.8; c.fillStyle = 'rgba(236,226,201,.95)'; c.beginPath(); c.arc(cx, cy, rad, 0, 7); c.fill();
        hatch(c, Pth(p => p.arc(cx, cy, rad, 0, 7)), [cx - rad, cy - rad, cx + rad, cy + rad], { angle: 30, gap: 6, lw: 0.9, color: 'rgba(42,33,24,.45)', seed: 520 + k, dens: (x, y) => 0.6 * Math.hypot(x - cx + rad * 0.3, y - cy + rad * 0.3) / rad });
        ink(c, EP.circlePts(cx, cy, rad, 36), { lw: 1.4, seed: 530 + k, color: 'rgba(42,33,24,.7)' }); c.restore(); }
      wheel5(c, 360, CURB - 96, 100, st * 0); wheel5(c, 800, CURB - 112, 116, 0);
      // 软管：波纹往车的方向流（被吸走）
      EP.hose(c, EP.bez([740, 520], [900, 520], [980, 700], [1190, 700]), { w: 30, fill: '#d2bf98', flow: -st * 60 });
      EP.hose(c, EP.bez([720, 440], [880, 380], [1010, 640], [1250, 690]), { w: 26, fill: '#e2d3b0', flow: -st * 60 });
      c.save(); c.fillStyle = 'rgba(20,15,10,.55)'; c.fillRect(1160, 620, 250, 120); c.restore();
      // 围观的人：轻微晃动；戴鸭舌帽的那个是 David（背影）
      EP.onlooker(c, 890, GR + 4, 270, 'bowler', 601, 1, Math.sin(st * 1.7) * 0.01);
      EP.onlooker(c, 965, GR + 4, 252, 'dress', 602, 1, Math.sin(st * 1.4 + 1) * 0.01);
      EP.onlooker(c, 1075, GR + 4, 248, 'cap', 604, 0.9, Math.sin(st * 2 + 2) * 0.012);
      EP.onlooker(c, 1500, GR + 4, 262, 'bowler', 603, 0.96, Math.sin(st * 1.2 + 3) * 0.01);
      EP.onlooker(c, 1420, GR + 4, 170, 'cap', 605, 0.8, Math.sin(st * 2.4) * 0.02);
      EP.lobsterInk(c, 1000, CURB + 30, -0.25, 0.9, st * 4);
    });
    EP.caption(c, 70, 60, 560, '1901', 'London', '机器太大，进不了门', ss(0.1, 0.4, st));
  };

  // ================= 镜 6：1908 =================
  const FL6 = 860, WALL = 900;    // 墙的剖面在 x=900..980
  const house6 = (g, sd) => {
    EP.paper(g, EP.PAPER, 27 + sd);
    // 门外：门廊与天（左）
    hatch(g, Pth(p => p.rect(0, 0, WALL, FL6)), [0, 0, WALL, FL6], { angle: 0, gap: 10, lw: 0.8, color: 'rgba(42,33,24,.35)', seed: sd + 1, dens: (x, y) => 0.2 + 0.5 * (1 - y / FL6) });
    for (let k = 0; k < 4; k++) { const tr = Pth(p => { p.moveTo(120 + k * 190, FL6); p.lineTo(160 + k * 190, 520 - k * 30); p.lineTo(200 + k * 190, FL6); p.closePath(); }); }
    const porch = Pth(p => p.rect(0, FL6, WALL, H - FL6)); solid(g, porch, [0, FL6, WALL, H], { fill: '#d2bf98', level: 1, angle: 0, gap: 7, seed: sd + 2, stroke: 0 });
    g.save(); g.strokeStyle = I; g.lineWidth = 2; for (let x = 0; x < WALL; x += 110) { g.beginPath(); g.moveTo(x, FL6); g.lineTo(x - 40, H); g.stroke(); } g.restore();
    // 门廊柱
    solid(g, Pth(p => p.rect(160, 120, 46, FL6 - 120)), [160, 120, 206, FL6], { fill: '#e6d8b8', level: 1, angle: 90, gap: 5, seed: sd + 3, stroke: 2.4 });
    // 屋内（右）：墙纸＋相框＋地毯
    const inner = Pth(p => p.rect(980, 0, W - 980, FL6)); g.fillStyle = '#e8dcbf'; g.fill(inner);
    g.save(); g.strokeStyle = 'rgba(42,33,24,.5)'; g.lineWidth = 1.4; for (let x = 1000; x < W; x += 70) { g.beginPath(); for (let y = 0; y < FL6; y += 20) g.lineTo(x + Math.sin(y * 0.05) * 8, y); g.stroke(); } g.restore();
    solid(g, Pth(p => p.rect(1400, 220, 260, 200)), [1400, 220, 1660, 420], { fill: '#c9b48a', level: 2, gap: 5, seed: sd + 4, stroke: 6 });
    const floor = Pth(p => p.rect(980, FL6, W - 980, H - FL6)); solid(g, floor, [980, FL6, W, H], { fill: '#c9b089', level: 1, angle: 8, gap: 5, seed: sd + 5, stroke: 0 });
    // 墙的剖面：上方是墙体（交叉排线＝剖面），门洞在下，门槛凸起
    const wallSec = Pth(p => p.rect(WALL, 0, 80, 340)); solid(g, wallSec, [WALL, 0, WALL + 80, 340], { fill: '#b8a27a', level: 3, gap: 4, seed: sd + 6, stroke: 3 });
    const lintel = Pth(p => p.rect(WALL - 20, 320, 120, 40)); solid(g, lintel, [WALL - 20, 320, WALL + 100, 360], { fill: '#d6c39b', level: 1, angle: 0, gap: 4, seed: sd + 7, stroke: 3 });
    // 推开的门（屋内一侧，斜着）
    const door = Pth(p => { p.moveTo(WALL + 80, 360); p.lineTo(WALL + 150, 390); p.lineTo(WALL + 150, FL6 - 14); p.lineTo(WALL + 80, FL6); p.closePath(); }); solid(g, door, [WALL + 80, 360, WALL + 150, FL6], { fill: '#cdb88f', level: 1, angle: 80, gap: 5, seed: sd + 8, stroke: 3 });
    const sill = Pth(p => { p.moveTo(WALL - 30, FL6); p.lineTo(WALL, FL6 - 22); p.lineTo(WALL + 80, FL6 - 22); p.lineTo(WALL + 110, FL6); p.closePath(); }); solid(g, sill, [WALL - 30, FL6 - 22, WALL + 110, FL6], { fill: '#d6c39b', level: 2, angle: 0, gap: 3.5, seed: sd + 9, stroke: 2.6 });
    ink(g, [[0, FL6], [WALL - 30, FL6]], { lw: 3 }); ink(g, [[WALL + 110, FL6], [W, FL6]], { lw: 3 });
  };
  // 立式吸尘器：x 是机身中心、y 地面；puff 布袋鼓起；hop 过门槛时抬起
  const upright = (c, x, y, puff, rot, sd) => {
    c.save(); c.translate(x, y);
    // 长柄（往左上，手推着）
    ink(c, [[-20, -150], [-330, -720]], { lw: 12, seed: sd }); ink(c, [[-20, -150], [-330, -720]], { lw: 6, color: '#cdb88f', seed: sd + 1 });
    ink(c, [[-360, -740], [-300, -700]], { lw: 12, seed: sd + 2 });
    // 布袋（枕套）：挂在柄上，会鼓
    c.save(); c.translate(-170, -420); c.rotate(-0.5); c.scale(1 + puff * 0.18, 1 + puff * 0.06);
    const bag = Pth(p => { p.moveTo(-40, -150); p.quadraticCurveTo(-62, 0, -46, 150); p.lineTo(46, 150); p.quadraticCurveTo(62, 0, 40, -150); p.closePath(); });
    solid(c, bag, [-90, -170, 90, 170], { fill: '#e8dcc0', level: 1, angle: 70, gap: 6, seed: sd + 3 + EP.boil(EP.__t || 0), stroke: 2.6 });
    for (let k = 0; k < 3; k++) ink(c, [[-30 + k * 30, -130], [-34 + k * 34, 130]], { lw: 1.2, seed: sd + 10 + k, color: 'rgba(42,33,24,.6)' });
    c.restore();
    // 电机罩（圆）＋吸口
    const motor = Pth(p => p.ellipse(10, -150, 90, 80, 0, 0, 7)); solid(c, motor, [-80, -230, 100, -70], { fill: '#bba27a', level: 2, gap: 4.5, seed: sd + 20 });
    const foot = Pth(p => { p.moveTo(-110, -80); p.lineTo(150, -80); p.lineTo(170, -20); p.lineTo(-120, -20); p.closePath(); }); solid(c, foot, [-120, -80, 170, -20], { fill: '#a88f68', level: 2, angle: 0, gap: 4, seed: sd + 21 });
    // 电线（往后拖）
    c.save(); c.strokeStyle = I; c.lineWidth = 3; c.beginPath(); c.moveTo(-60, -210); c.bezierCurveTo(-200, -160, -300, -40, -600, -10); c.stroke(); c.restore();
    // 轮子
    [[-80, -20], [120, -20]].forEach(([wx, wy]) => { c.fillStyle = '#d6c39b'; c.beginPath(); c.arc(wx, wy, 20, 0, 7); c.fill(); c.strokeStyle = I; c.lineWidth = 3; c.stroke(); for (let k = 0; k < 4; k++) { const a = rot + k * 1.57; ink(c, [[wx, wy], [wx + Math.cos(a) * 18, wy + Math.sin(a) * 18]], { lw: 2, seed: sd + 30 + k, wob: 0.2 }); } });
    c.restore();
  };
  const shot6 = (c, st, lt) => {
    // 位置：0–1.2s 从门外推过来，1.2s 越过门槛（砸入），之后进屋
    const x = st < 1.25 ? lerp(420, 920, ss(0, 1.25, st)) : lerp(920, 1300, ss(1.25, 3.4, st));
    const hop = st > 1.0 && st < 1.5 ? Math.sin((st - 1.0) / 0.5 * Math.PI) * 26 : 0;
    const puff = 0.5 + 0.5 * Math.sin(st * 6);
    const cam = EP.cam(st, [{ t: 0, cx: 880, cy: 560, z: 1.12 }, { t: 1.25, cx: 1020, cy: 600, z: 1.4, kind: 'slam' }]);
    EP.__t = lt;
    EP.withCam(c, cam, () => {
      c.drawImage(EP.boiled('house6', lt, house6), 0, 0);
      // 屋里地毯上的灰：吸尘器经过就没了
      const r = rng(611); c.fillStyle = 'rgba(42,33,24,.75)'; for (let i = 0; i < 70; i++) { const dx = 1000 + r() * 900, dy = FL6 + 8 + r() * 60; if (dx > x + 170) { c.beginPath(); c.arc(dx, dy, 1.5 + r() * 2.5, 0, 7); c.fill(); } }
      upright(c, x, FL6 - hop - (x > WALL - 40 && x < WALL + 120 ? 22 : 0), puff, x / 20, 640);
      // 推它的手（从左上进画）
      const hx = x - 350, hy = FL6 - hop - 740;
      const sleeve = Pth(p => { p.moveTo(hx - 30, hy - 20); p.lineTo(hx - 400, hy - 200); p.lineTo(hx - 440, hy - 100); p.lineTo(hx - 60, hy + 50); p.closePath(); }); solid(c, sleeve, [hx - 440, hy - 200, hx, hy + 60], { fill: '#8f7a58', level: 2, gap: 4.5, seed: 650 + EP.boil(lt), angle: 20 });
      const fist = Pth(p => p.ellipse(hx + 6, hy + 10, 48, 38, 0.3, 0, 7)); solid(c, fist, [hx - 50, hy - 30, hx + 60, hy + 50], { fill: '#d9c19b', level: 1, gap: 4, seed: 660 + EP.boil(lt), angle: 60 });
      // 越过门槛那一下：扬起一圈灰
      if (st > 1.25 && st < 2.2) { const q = (st - 1.25) / 0.95; for (let k = 0; k < 14; k++) { const a = Math.PI + k / 13 * Math.PI; const d = 40 + q * 160; c.fillStyle = `rgba(42,33,24,${0.6 * (1 - q)})`; c.beginPath(); c.arc(WALL + 40 + Math.cos(a) * d * 1.4, FL6 - 10 + Math.sin(a) * d * 0.5, 3 + (k % 3), 0, 7); c.fill(); } }
    });
    EP.caption(c, 70, 60, 520, '1908', 'Ohio', '电动吸尘器进屋了', ss(1.2, 1.5, st));
  };

  return { draw(c, lt, t) { EP.shots(c, lt, [[0, 4, shot4], [4, 9, shot5], [9, 13, shot6]]); } };
})();
