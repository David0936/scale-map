// 镜 2–3（4–12s）古代水墨：竹扫帚扫院子里的落叶，弯腰的背影越弯越低（横移）；扫起的一团灰绕一圈又落回原地（快推）。
// 开场 0.45s 各笔按顺序写出；母题：树上落叶、扫帚来回、墨晕外扩。人只出背影，脸藏在斗笠下。
SCENES['e2_ink'] = (() => {
  const { clamp, lerp, rng, ss } = U, P = PAINT, W = 1920, H = 1080, G = 880;
  const F = EP.F;
  const brush = (c, pts, o = {}) => { const rev = o.reveal ?? 1; if (rev <= 0) return; const D = KIT.resample(KIT.densify(pts, 5), 4); const m = Math.max(2, Math.ceil(D.length * rev));
    c.save(); c.strokeStyle = (o.tone ?? 0.85) > 0.55 ? F.ink : 'rgba(42,33,24,.35)'; c.lineWidth = Math.max(3, (o.w || 10) * 0.7); c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); D.slice(0, m).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
  const paper = () => EP.cache('flat_yard', (g) => { g.fillStyle = F.wall; g.fillRect(0, 0, W, H); g.fillStyle = F.wall2; g.fillRect(1100, 300, 900, 600); g.fillStyle = F.floor; g.fillRect(0, G, W, H - G); g.fillStyle = F.floorDk; for (let y = G + 50; y < H; y += 62) g.fillRect(0, y, W, 4); });
  const blob = (c, x, y, r, a, blur = 8) => { c.save(); c.fillStyle = `rgba(185,140,90,${Math.min(0.9, a * 3)})`; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore(); };
  // 远景：淡墨院墙＋瓦檐＋一枝树
  const backdrop = (c, rev) => {
    
    brush(c, [[1120, 330], [1500, 300], [1980, 320]], { w: 34, tone: 0.35, dry: 0.6, seed: 11, reveal: rev });
    for (let k = 0; k < 9; k++) brush(c, [[1150 + k * 95, 338], [1170 + k * 95, 372]], { w: 14, tone: 0.3, dry: 0.4, seed: 20 + k, reveal: rev });
    brush(c, [[1130, 390], [1500, 392], [1960, 386]], { w: 6, tone: 0.25, dry: 0.7, seed: 31, reveal: rev });
    brush(c, [[-20, 140], [180, 190], [360, 210], [520, 280]], { w: 22, tone: 0.8, dry: 0.55, seed: 41, reveal: rev });
    brush(c, [[220, 196], [300, 120], [380, 90]], { w: 10, tone: 0.75, dry: 0.5, seed: 42, reveal: rev });
    // 地面：一道淡墨横抹
    brush(c, [[-40, G + 6], [700, G], [1500, G + 8], [1980, G + 2]], { w: 18, tone: 0.28, dry: 0.75, seed: 51, reveal: rev });
  };
  const leafAt = (c, x, y, a, s = 1) => { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = F.greenLt; c.beginPath(); c.moveTo(-14 * s, 0); c.quadraticCurveTo(0, -9 * s, 14 * s, 0); c.quadraticCurveTo(0, 9 * s, -14 * s, 0); c.fill(); c.restore(); };
  const LEAVES = (() => { const r = rng(61), a = []; for (let i = 0; i < 34; i++) a.push([200 + r() * 1300, G - 4 - r() * 14, r() * 6.28, 0.7 + r() * 0.6]); return a; })();
  // 弯腰扫地的人：背影，朝左扫。bend 0..1，sw 扫帚摆相位
  const sweeper = (c, bend, sw, rev, sd) => {
    const hip = [1020, 640], a = 0.55 + 0.45 * bend;
    const sh = [hip[0] - Math.sin(a) * 250, hip[1] - Math.cos(a) * 250];
    const head = [sh[0] - Math.sin(a + 0.25) * 70, sh[1] - Math.cos(a + 0.25) * 70];
    // 衣袍：淡墨晕（赭石调）
    c.save(); c.fillStyle = F.green; c.beginPath();
    c.moveTo(sh[0] - 70, sh[1] - 10); c.quadraticCurveTo(sh[0] + 40, sh[1] - 50, sh[0] + 80, sh[1] + 10); c.lineTo(hip[0] + 110, hip[1] + 40); c.lineTo(hip[0] + 90, 820); c.lineTo(hip[0] - 120, 820); c.lineTo(hip[0] - 90, hip[1] + 40); c.closePath(); c.fill(); c.restore();
    // 衣纹：浓淡几笔
    brush(c, [[sh[0] - 70, sh[1] - 6], [sh[0] + 20, sh[1] - 40], [sh[0] + 84, sh[1] + 12], [hip[0] + 100, hip[1] + 40]], { w: 12, tone: 0.85, dry: 0.4, seed: sd + 1, reveal: rev });
    brush(c, [[sh[0] - 66, sh[1]], [hip[0] - 80, hip[1] + 30], [hip[0] - 110, 816]], { w: 11, tone: 0.8, dry: 0.5, seed: sd + 2, reveal: rev });
    brush(c, [[hip[0] + 100, hip[1] + 40], [hip[0] + 92, 816]], { w: 9, tone: 0.7, dry: 0.6, seed: sd + 3, reveal: rev });
    brush(c, [[hip[0] - 20, hip[1] + 20], [hip[0] - 10, 810]], { w: 5, tone: 0.5, dry: 0.6, seed: sd + 4, reveal: rev });
    brush(c, [[hip[0] - 115, 818], [hip[0] + 95, 818]], { w: 7, tone: 0.7, dry: 0.5, seed: sd + 5, reveal: rev });
    // 腿与布鞋
    brush(c, [[hip[0] - 60, 820], [hip[0] - 72, G - 4]], { w: 12, tone: 0.9, dry: 0.3, seed: sd + 6, reveal: rev });
    brush(c, [[hip[0] + 50, 820], [hip[0] + 64, G - 4]], { w: 12, tone: 0.9, dry: 0.3, seed: sd + 7, reveal: rev });
    brush(c, [[hip[0] - 100, G - 2], [hip[0] - 60, G - 4]], { w: 14, tone: 0.95, dry: 0.2, seed: sd + 8, reveal: rev });
    brush(c, [[hip[0] + 40, G - 4], [hip[0] + 84, G - 2]], { w: 14, tone: 0.95, dry: 0.2, seed: sd + 9, reveal: rev });
    // 斗笠：一顶压得很低的笠，脸看不见
    c.save(); c.fillStyle = F.mustard; c.beginPath(); c.ellipse(head[0], head[1] + 6, 104, 34, -a * 0.5, 0, 7); c.fill(); c.restore();
    brush(c, [[head[0] - 108, head[1] + 22], [head[0] - 10, head[1] - 46], [head[0] + 104, head[1] + 2]], { w: 13, tone: 0.9, dry: 0.35, seed: sd + 10, reveal: rev });
    brush(c, [[head[0] - 106, head[1] + 24], [head[0], head[1] + 34], [head[0] + 104, head[1] + 4]], { w: 6, tone: 0.75, dry: 0.5, seed: sd + 11, reveal: rev });
    // 手与扫帚：双手握杆，帚头着地来回扫
    const hand = [sh[0] - 70, sh[1] + 150 + bend * 30];
    brush(c, [[sh[0] - 30, sh[1] + 10], [sh[0] - 60, sh[1] + 90], hand], { w: 10, tone: 0.85, dry: 0.4, seed: sd + 12, reveal: rev });
    brush(c, [[sh[0] + 40, sh[1] + 10], [sh[0] - 10, sh[1] + 110], [hand[0] + 50, hand[1] - 30]], { w: 9, tone: 0.75, dry: 0.45, seed: sd + 13, reveal: rev });
    const gx = hand[0] - 260 + Math.sin(sw) * 110, gp = [gx, G - 6];
    brush(c, [[hand[0] + 70, hand[1] - 44], hand, [gp[0] + 30, gp[1] - 60]], { w: 8, tone: 0.95, dry: 0.25, seed: sd + 14, reveal: rev });
    // 帚头：一把散开的枯笔
    for (let k = 0; k < 9; k++) { const sp = (k - 4) * 16; brush(c, [[gp[0] + 30, gp[1] - 62], [gp[0] + sp * 0.6 + 10, gp[1] - 28], [gp[0] + sp - Math.cos(sw) * 30, gp[1]]], { w: 5, tone: 0.75, dry: 0.75, seed: sd + 20 + k, reveal: rev, bristles: 4 }); }
    return gp;
  };
  // 镜 2：院子横移
  const shot2 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 1010, cy: 620, z: 1.55 }, { t: 1.5, cx: 790, cy: 640, z: 1.55, kind: 'pan' }]);
    const rev = ss(0, 0.45, lt);
    c.drawImage(paper(), 0, 0);
    EP.withCam(c, cam, () => {
      backdrop(c, rev);
      const sw = st * 3.4, bend = ss(0.2, 3.8, st);
      // 地上的叶：靠近帚头的被一点点扫向左
      const head = 1020 - Math.sin(0.55 + 0.45 * bend) * 250 - 70 - 260;
      LEAVES.forEach(([x, y, a, s], i) => { const near = clamp(1 - Math.abs(x - head) / 260); const push = near * (st * 34 + Math.max(0, Math.sin(sw)) * 18); leafAt(c, x - push, y, a + push * 0.02, s); });
      // 树上飘落的叶（循环）
      for (let i = 0; i < 6; i++) { const ph = (st * 0.32 + i / 6) % 1; leafAt(c, 380 + i * 120 + Math.sin(ph * 9 + i) * 40, 200 + ph * 680, ph * 8 + i, 0.9); }
      const gp = sweeper(c, bend, sw, rev, 100);
      // 帚头带起的淡灰
      for (let k = 0; k < 6; k++) { const q = ((st * 1.7 + k / 6) % 1); blob(c, gp[0] - 30 - q * 90, G - 20 - q * 60, 20 + q * 30, 0.12 * (1 - q), 10); }
    });
    // 题款：竖排「弯了几千年」＋朱印，写在纸上（不跟镜头）
    const ta = ss(0.6, 1.0, lt); if (ta > 0) { c.save(); c.globalAlpha = ta; c.font = '64px "PuHui-Black"'; c.fillStyle = F.ink; c.textAlign = 'center'; '弯了几千年'.split('').forEach((ch, i) => c.fillText(ch, 1780, 200 + i * 78)); c.restore();
      const q = ss(1.0, 1.15, lt); if (q > 0) { const s = 1.5 - 0.5 * q; c.save(); c.translate(1780, 640); c.scale(s, s); c.globalAlpha = Math.min(1, q * 1.5); c.fillStyle = '#c8402e'; c.fillRect(-34, -34, 68, 68); c.fillStyle = '#efe6d0'; c.font = '30px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('扫', 0, -13); c.fillText('地', 0, 17); c.restore(); } }
  };
  // 镜 3：一团灰扬起、绕一圈、落回原地（快推）
  const DUST = (() => { const r = rng(71), a = []; for (let i = 0; i < 120; i++) a.push({ ph: r(), r: 10 + r() * 26, ox: (r() - 0.5) * 120, oy: r() * 30, sp: 0.8 + r() * 0.5 }); return a; })();
  const shot3 = (c, st, lt) => {
    const cam = EP.cam(st, [{ t: 0, cx: 960, cy: 640, z: 1.0 }, { t: 0.7, cx: 960, cy: 600, z: 1.3, kind: 'push' }]);
    c.drawImage(paper(), 0, 0);
    EP.withCam(c, cam, () => {
      brush(c, [[-40, G + 4], [900, G - 2], [1980, G + 6]], { w: 22, tone: 0.32, dry: 0.75, seed: 81 });
      // 扫帚特写：从右上斜进来的帚头，扫过去又回来
      const sw = Math.sin(st * 2.6) * 140;
      brush(c, [[1700, -40], [1420 + sw * 0.3, 520], [1240 + sw * 0.5, 760]], { w: 26, tone: 0.95, dry: 0.3, seed: 82 });
      for (let k = 0; k < 14; k++) { const sp = (k - 7) * 22; brush(c, [[1250 + sw * 0.5, 740], [1190 + sw * 0.7 + sp * 0.5, 820], [1120 + sw + sp, G]], { w: 8, tone: 0.8, dry: 0.8, seed: 90 + k, bristles: 5 }); }
      // 灰：从帚头处扬起→向左上绕一圈→落回原处。一圈 3.2s，循环
      DUST.forEach((d, i) => {
        const q = ((st / 3.2) * d.sp + d.ph) % 1, ang = q * Math.PI * 2;
        const x = 900 + d.ox + Math.sin(ang) * 260 * (0.6 + 0.4 * d.sp), y = G - 30 - d.oy - (1 - Math.cos(ang)) * 210;
        blob(c, x, y, d.r * (0.7 + 0.6 * Math.sin(ang / 2)), 0.13, 13);
      });
      // 落回的灰在地上积成一小摊，墨晕慢慢洇开
      c.save(); c.translate(900, G - 12); c.scale(1, 0.22); blob(c, 0, 0, 160 + st * 14, 0.22, 14); c.restore();
      LEAVES.slice(0, 10).forEach(([x, y, a, s], i) => leafAt(c, 640 + i * 70, G - 6 - (i % 3) * 4, a, 1.3));
    });
  };
  return { draw(c, lt, t) { EP.shots(c, lt, [[0, 4, shot2], [4, 8, shot3]]); EP.grain(c, t); } };
})();
