// 镜 11–14（42–60s）2026 当代扁平（和开头同一间屋、同一台机器）。
//  镜 11（0–4）扫地机倒进基站：尘盒的灰被抽进基站的袋子，拖布在水里转（快推）。字在基站屏幕上。
//  镜 12（4–8）旧款圆形扫地机被放进写着「深圳」的纸箱，盖子合上，胶带拉过（横移）。
//  镜 13（8–13）长出两条轮腿的扫地机一级级爬楼梯，爬过的台阶变干净（砸入）。
//  镜 14（13–18）回到开头那间屋：机器把倒地的扫帚推回墙边，退回基站，屏幕问「还需要我吗」，镜头拉远看整座空房子。
SCENES['e5_2026'] = (() => {
  const { clamp, lerp, rng, ss } = U, F = EP.F, W = 1920, H = 1080, FLOOR = 800, P = EP.P;
  // 基站：x 中心，地面 y
  const station = (c, x, y, { screen = '', blink = 0, suck = 0, wash = 0, t = 0 } = {}) => {
    c.save(); c.translate(x, y);
    c.fillStyle = F.shadow; c.beginPath(); c.ellipse(0, 4, 200, 14, 0, 0, 7); c.fill();
    EP.rr(c, -170, -560, 340, 560, 40, F.cream); EP.rr(c, -170, -120, 340, 120, 30, F.robotDk);
    // 屏幕
    EP.rr(c, -130, -520, 260, 120, 18, F.ink);
    if (screen) { c.save(); c.beginPath(); c.roundRect(-130, -520, 260, 120, 18); c.clip(); EP.text(c, screen, -6, -444, '46px "PuHui-Bold"', F.mustard, 'center'); if (blink && Math.floor(t * 2.5) % 2) { c.fillStyle = F.mustard; c.fillRect(108, -482, 6, 44); } c.restore(); }
    // 透明窗：里面的尘袋
    EP.rr(c, -110, -370, 220, 210, 20, '#efe6d6'); EP.rr(c, -90, -350, 180, 170, 30, '#e6dccb');
    const fill = clamp(0.25 + suck * 0.55); c.fillStyle = '#b39a7c'; c.beginPath(); c.roundRect(-86, -184 - 160 * fill, 172, 160 * fill, 26); c.fill();
    if (suck > 0 && suck < 1) { const r = rng(5 + Math.floor(t * 30)); c.fillStyle = 'rgba(110,80,50,.8)'; for (let i = 0; i < 26; i++) { c.beginPath(); c.arc(-60 + r() * 120, -170 - r() * 190, 2 + r() * 3, 0, 7); c.fill(); } }
    EP.rr(c, -110, -370, 220, 210, 20, null, F.ink, 4);
    // 清水箱、污水箱的小标
    c.fillStyle = F.green; c.beginPath(); c.arc(-120, -80, 10, 0, 7); c.fill(); c.fillStyle = F.coral; c.beginPath(); c.arc(-90, -80, 10, 0, 7); c.fill();
    // 洗拖布的水花
    if (wash > 0) { const r = rng(9 + Math.floor(t * 20)); for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(150,190,180,${0.7 * wash})`; c.beginPath(); c.arc(-150 + r() * 300, -20 - r() * 60, 4 + r() * 8, 0, 7); c.fill(); } }
    c.restore();
  };
  const room = () => EP.cache('e5_room', (g) => {
    g.fillStyle = F.wall; g.fillRect(0, 0, W, FLOOR); g.fillStyle = F.wall2; g.beginPath(); g.roundRect(1520, 120, 330, 560, 26); g.fill();
    EP.rr(g, 820, 250, 200, 150, 6, F.green); EP.rr(g, 836, 266, 168, 118, 4, '#f2d3a4'); g.fillStyle = F.coral; g.beginPath(); g.arc(920, 330, 32, 0, 7); g.fill();
    g.fillStyle = F.cream; g.fillRect(0, FLOOR - 26, W, 26); g.fillStyle = F.floor; g.fillRect(0, FLOOR, W, H - FLOOR);
    g.fillStyle = F.floorDk; for (let y = FLOOR + 50; y < H; y += 62) g.fillRect(0, y, W, 4);
    const r = rng(9); for (let y = FLOOR; y < H; y += 62) for (let x = r() * 300; x < W; x += 300 + r() * 200) g.fillRect(x, y, 4, 62);
  });

  // ============ 镜 11 ============
  const shot11 = (c, st, lt) => {
    const rx = st < 1.4 ? lerp(600, 1060, ss(0, 1.4, st)) : 1060;
    const cam = EP.cam(st, [{ t: 0, cx: 900, cy: 560, z: 1.25 }, { t: 1.5, cx: 1200, cy: 560, z: 1.6, kind: 'push' }]);
    EP.withCam(c, cam, () => {
      c.drawImage(room(), 0, 0);
      station(c, 1320, FLOOR, { screen: st > 1.6 ? '灰都不用倒' : '', suck: ss(1.6, 3.6, st), wash: st > 2.4 ? 1 : 0, t: st });
      // 扫地机倒着进基站（朝左）
      EP.robotSide(c, rx, FLOOR, { dir: -1, brush: st * 18, led: 1 });
      // 吸尘气流：机器→基站的箭头状灰流
      if (st > 1.6 && st < 3.6) { const r = rng(13); for (let i = 0; i < 18; i++) { const q = (st * 1.8 + r()) % 1; c.fillStyle = 'rgba(110,80,50,.7)'; c.beginPath(); c.arc(lerp(1150, 1300, q), lerp(FLOOR - 70, FLOOR - 300, q * q), 3 + r() * 3, 0, 7); c.fill(); } }
    });
    EP.grain(c, lt);
  };

  // ============ 镜 12：装箱 ============
  const shot12 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 820, cy: 560, z: 1.2 }, { t: 1.6, cx: 1100, cy: 620, z: 1.2, kind: 'pan' }]);
    EP.withCam(c, cam, () => {
      c.fillStyle = '#efe3cf'; c.fillRect(0, 0, W, H);
      c.fillStyle = F.floorDk; c.fillRect(0, 860, W, 220);
      // 后面一排已封好的箱子（流水线的感觉）
      for (let k = 0; k < 5; k++) { const x = 60 + k * 330, y = 520; EP.rr(c, x, y, 280, 220, 8, '#d1a46a'); c.fillStyle = '#bf9055'; c.fillRect(x, y, 280, 30); c.fillStyle = F.coral; c.fillRect(x + 130, y, 22, 220); }
      // 前面这只箱子
      const bx = 700, by = 580, bw = 620, bh = 300;
      // 机器：从上方被放进去
      const ry = st < 1.2 ? lerp(260, 640, ss(0, 1.2, st)) : 640;
      c.save(); c.beginPath(); c.rect(0, 0, W, by + 20); c.clip();
      // 俯视 3/4 看机器：一个扁椭圆
      c.save(); c.translate(bx + bw / 2, ry); c.scale(1, 0.42); c.fillStyle = '#3e3d3b'; c.beginPath(); c.arc(0, 30, 230, 0, 7); c.fill(); c.fillStyle = '#5b5a58'; c.beginPath(); c.arc(0, 0, 230, 0, 7); c.fill(); c.strokeStyle = '#8a8884'; c.lineWidth = 16; c.beginPath(); c.arc(0, 0, 180, 0, 7); c.stroke(); c.fillStyle = '#9fd36a'; c.beginPath(); c.arc(0, 0, 30, 0, 7); c.fill(); c.restore();
      c.restore();
      // 箱体
      c.fillStyle = 'rgba(80,50,20,.25)'; c.fillRect(bx + 20, by + bh - 4, bw, 18); c.fillStyle = '#d6aa6e'; c.fillRect(bx, by, bw, bh); c.strokeStyle = F.ink; c.lineWidth = 4; c.strokeRect(bx, by, bw, bh); c.fillStyle = '#c4955a'; c.fillRect(bx, by, bw, 26);
      // 盖子：两片从竖着合上
      const cl = ss(1.4, 2.2, st);
      if (cl < 1) { c.fillStyle = '#e0b779'; c.save(); c.translate(bx, by); c.rotate(-Math.PI / 2 * (1 - cl)); c.fillRect(0, -10, bw / 2, 14); c.restore(); c.save(); c.translate(bx + bw, by); c.rotate(Math.PI / 2 * (1 - cl)); c.fillRect(-bw / 2, -10, bw / 2, 14); c.restore(); }
      // 胶带拉过
      const tp = ss(2.3, 3.1, st); if (tp > 0) { c.fillStyle = 'rgba(200,64,46,.92)'; c.fillRect(bx - 20, by - 10, (bw + 40) * tp, 26); c.fillRect(bx + bw / 2 - 16, by, 32, bh * tp); }
      // 箱上印的「深圳」与贴纸
      c.save(); c.translate(bx + 170, by + 160); c.rotate(-0.06); c.strokeStyle = F.coral; c.lineWidth = 8; c.strokeRect(-120, -70, 240, 140); EP.text(c, '深圳', 0, 28, '84px "PuHui-Black"', F.coral, 'center'); c.restore();
      const ls = ss(2.6, 2.75, st); if (ls > 0) { c.save(); c.translate(bx + 470, by + 170); c.rotate(0.05); c.scale(ls * 1.1 - (ls > 0.95 ? 0.1 : 0), ls); EP.rr(c, -130, -60, 260, 120, 10, F.cream, F.ink, 4); EP.text(c, '2025 归深圳', 0, 16, '40px "PuHui-Bold"', F.ink, 'center'); c.restore(); }
    });
    EP.grain(c, lt);
  };

  // ============ 镜 13：爬楼梯 ============
  const STEP_W = 170, STEP_H = 120, S0 = [460, 900];   // 第一级台阶前沿
  const stairs = () => EP.cache('e5_stairs', (g) => {
    g.fillStyle = F.wall; g.fillRect(0, 0, W, H); g.fillStyle = F.wall2; g.fillRect(0, 0, W, 300);
    g.fillStyle = F.floor; g.fillRect(0, S0[1], W, H - S0[1]);
    for (let k = 0; k < 6; k++) { const x = S0[0] + k * STEP_W, y = S0[1] - (k + 1) * STEP_H; g.fillStyle = k % 2 ? F.floor : F.floorDk; g.fillRect(x, y, W - x, STEP_H); g.fillStyle = F.board; g.fillRect(x - 10, y, W - x + 10, 16); }
    g.strokeStyle = F.green; g.lineWidth = 10; g.beginPath(); g.moveTo(S0[0] - 40, S0[1] - 380); g.lineTo(S0[0] + 6 * STEP_W, S0[1] - 380 - 6 * STEP_H); g.stroke();
    for (let k = 0; k < 7; k++) { g.lineWidth = 6; g.beginPath(); const x = S0[0] + k * STEP_W - 20; g.moveTo(x, S0[1] - k * STEP_H - 380 + 30); g.lineTo(x, S0[1] - k * STEP_H - 20); g.stroke(); }
  });
  const shot13 = (c, st, lt) => {
    // 每级 0.85s：伸腿抬起（0–0.3）→ 往前（0.3–0.6）→ 收腿（0.6–0.85）
    const k = Math.floor(clamp((st - 0.6) / 0.85, 0, 4.99)), q = st < 0.6 ? 0 : ((st - 0.6) / 0.85) % 1;
    const done = st < 0.6 ? 0 : Math.min(5, Math.floor((st - 0.6) / 0.85));
    const lift = st < 0.6 ? 0 : ss(0, 0.3, q) * (1 - ss(0.6, 0.85, q));
    const baseX = S0[0] - 230 + done * STEP_W + (st < 0.6 ? 0 : ss(0.3, 0.6, q) * STEP_W);
    const baseY = S0[1] - done * STEP_H - (st < 0.6 ? 0 : ss(0.3, 0.6, q) * STEP_H);
    const cam = EP.cam(st, [{ t: 0, cx: 760, cy: 640, z: 1.3 }, { t: 0.9, cx: 860, cy: 600, z: 1.55, kind: 'slam' }, { t: 3.0, cx: 1120, cy: 440, z: 1.55, kind: 'pan' }]);
    EP.withCam(c, cam, () => {
      c.drawImage(stairs(), 0, 0);
      // 台阶上的灰：机器过了的台阶就干净
      const r = rng(31); c.fillStyle = 'rgba(110,80,50,.7)';
      for (let s = 0; s < 6; s++) { for (let i = 0; i < 12; i++) { const x = S0[0] + s * STEP_W + 14 + r() * (STEP_W - 30), y = S0[1] - (s + 1) * STEP_H - 3 - r() * 6; if (s >= done) { c.beginPath(); c.arc(x, y, 2 + r() * 2.5, 0, 7); c.fill(); } } }
      EP.robotSide(c, baseX, baseY, { dir: 1, legs: 0.15 + lift * 0.9, brush: st * 18, s: 0.8 });
      // 墙上的小牌
      EP.rr(c, 220, 330, 300, 120, 14, F.coral); EP.text(c, '2026 上楼', 370, 408, '52px "PuHui-Black"', F.cream, 'center');
    });
    EP.grain(c, lt);
  };

  // ============ 镜 14：回到开头那间屋 ============
  // 拉远时要看到的整座房子：屋子是 0..1920 × 0..1080，外面再画两间空屋＋楼梯间＋屋顶
  const house = () => EP.cache('e5_house', (g) => {
    g.fillStyle = '#f2d3a4'; g.fillRect(0, 0, 4400, 2800);
    const ox = 1200, oy = 1100;    // 世界坐标 (0,0) 在这张大图里的位置
    g.save(); g.translate(ox, oy);
    // 外墙与屋顶
    g.fillStyle = F.coral; g.beginPath(); g.moveTo(-900, -560); g.lineTo(960, -1000); g.lineTo(2820, -560); g.closePath(); g.fill();
    g.fillStyle = '#e9dcc4'; g.fillRect(-900, -560, 3720, 1660);
    // 左边：楼梯间（上下两层）；右边：厨房；楼上：卧室×2
    const rm = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); g.fillStyle = F.floor; g.fillRect(x, y + h - 60, w, 60); };
    rm(-860, 0, 820, 1080, F.wall2); rm(1960, 0, 820, 1080, F.wall2); rm(-860, -520, 1780, 480, F.wall2); rm(960, -520, 1820, 480, F.wall);
    // 楼梯（左间）
    for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? F.floor : F.floorDk; g.fillRect(-820 + k * 90, 1020 - (k + 1) * 120, 820 - k * 90 - 40, 120); }
    // 厨房：台面＋吊柜
    EP.rr(g, 2020, 640, 700, 380, 10, F.green); EP.rr(g, 2020, 120, 700, 200, 10, F.greenLt); g.fillStyle = F.cream; g.fillRect(2020, 620, 700, 26);
    // 楼上：床、书桌
    EP.rr(g, -700, -260, 600, 160, 30, F.cream); EP.rr(g, -700, -320, 120, 220, 20, F.coral);
    EP.rr(g, 1300, -250, 420, 30, 6, F.board); g.fillStyle = F.board; g.fillRect(1320, -220, 20, 160); g.fillRect(1680, -220, 20, 160);
    // 楼板与墙的切面
    g.fillStyle = '#d0c2a8'; g.fillRect(-900, -40, 3720, 40); g.fillRect(-40, -560, 40, 1660); g.fillRect(1920, -560, 40, 1660);
    g.restore();
  }, 4400, 2800);
  const shot14 = (c, st, lt) => {
    const BR = { x: 1360, y: FLOOR };
    // 0–1.6 机器从右边过来，把扫帚往墙边推平；1.6–3.0 倒车回基站（左边）；3.0 拉远
    const rx = st < 1.4 ? lerp(1950, 1500, ss(0, 1.4, st)) : lerp(1500, 620, ss(1.4, 2.4, st));
    const cam = EP.cam(st, [{ t: 0, cx: 1100, cy: 640, z: 1.35 }, { t: 1.5, cx: 640, cy: 520, z: 1.45, kind: 'pan' }, { t: 3.6, cx: 960, cy: 220, z: 0.5, kind: 'push' }], [-1200, -1100, 3200, 1700]);
    EP.withCam(c, cam, () => {
      c.drawImage(house(), -1200, -1100);
      c.drawImage(room(), 0, 0);
      // 窗、窗光（和开头同一间屋）
      EP.rr(c, 250, 150, 400, 430, 18, F.cream); EP.rr(c, 272, 172, 356, 386, 10, '#f2d3a4'); c.fillStyle = '#e8b97a'; c.beginPath(); c.arc(520, 300 + st * 6, 60, 0, 7); c.fill(); c.fillStyle = F.cream; c.fillRect(444, 172, 12, 386); c.fillRect(272, 360, 356, 12); EP.rr(c, 230, 575, 440, 22, 10, F.cream);
      // 扫帚：从倒地的位置被推到贴着墙根平放
      const push = ss(0.5, 1.4, st), bx = lerp(1360, 1180, push);
      EP.broomFlat(c, bx + 40 * Math.sin(1.68), FLOOR - 80 * Math.sin(1.68) + push * 20, lerp(1.68, 1.57, push));
      station(c, 380, FLOOR, { screen: st > 2.45 ? '还需要我吗' : '', blink: 1, t: st });
      EP.robotSide(c, rx, FLOOR, { dir: -1, brush: st * 18, led: st < 2.45 ? 1 : 0 });
      // 拉远后：整座房子里没有一个人，楼梯上只有落下的光
      const r = rng(5); c.fillStyle = 'rgba(255,240,210,.8)'; for (let i = 0; i < 30; i++) { const x = -800 + r() * 3600, y = -500 + ((r() * 1500 + st * 30) % 1500); c.beginPath(); c.arc(x, y, 2 + r() * 2, 0, 7); c.fill(); }
    });
    EP.grain(c, lt);
  };

  return { draw(c, lt, t) { EP.shots(c, lt, [[0, 4, shot11], [4, 8, shot12], [8, 13, shot13], [13, 18, shot14]]); } };
})();
