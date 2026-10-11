// 镜 1（0–4s）当代扁平：扫地机沿墙根开过来，撞上墙角的旧竹扫帚，扫帚倒地（砸入）。
// 主动作：扫地机行进→撞→扫帚倒；母题循环：窗光里的浮尘、绿植摆、边刷转。
SCENES['e1_now'] = (() => {
  const { clamp, lerp, rng, ss } = U, F = EP.F, W = 1920, H = 1080, FLOOR = 800;
  const room = () => EP.cache('e1_room', (g) => {
    g.fillStyle = F.wall; g.fillRect(0, 0, W, FLOOR);
    // 墙上淡色大块（扁平插画的空间感）
    g.fillStyle = F.wall2; g.beginPath(); g.roundRect(1520, 120, 330, 560, 26); g.fill();
    // 窗
    EP.rr(g, 250, 150, 400, 430, 18, F.cream); EP.rr(g, 272, 172, 356, 386, 10, '#f2d3a4');
    g.fillStyle = '#e8b97a'; g.beginPath(); g.arc(520, 300, 60, 0, 7); g.fill();
    g.fillStyle = '#d99a5a'; [[272, 470, 120, 88], [380, 430, 90, 128], [470, 490, 158, 68]].forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
    g.fillStyle = F.cream; g.fillRect(444, 172, 12, 386); g.fillRect(272, 360, 356, 12);
    EP.rr(g, 230, 575, 440, 22, 10, F.cream);
    // 墙上挂的一幅小画
    EP.rr(g, 820, 250, 200, 150, 6, F.green); EP.rr(g, 836, 266, 168, 118, 4, '#f2d3a4'); g.fillStyle = F.coral; g.beginPath(); g.arc(920, 330, 32, 0, 7); g.fill();
    // 踢脚线＋地板
    g.fillStyle = F.cream; g.fillRect(0, FLOOR - 26, W, 26);
    g.fillStyle = F.floor; g.fillRect(0, FLOOR, W, H - FLOOR);
    g.fillStyle = F.floorDk; for (let y = FLOOR + 50; y < H; y += 62) g.fillRect(0, y, W, 4);
    const r = rng(9); for (let y = FLOOR; y < H; y += 62) for (let x = r() * 300; x < W; x += 300 + r() * 200) g.fillRect(x, y, 4, 62);
  });
  // 地上的灰点（扫地机经过就没了）
  const dust = (() => { const r = rng(21), a = []; for (let i = 0; i < 60; i++) a.push([r() * 1300 - 40, FLOOR + 6 + r() * 30, 1.5 + r() * 2.5]); return a; })();
  const robotX = lt => lt < 2.25 ? lerp(80, 1096, lt / 2.25) : lt < 2.7 ? lerp(1096, 1050, ss(2.25, 2.7, lt)) : 1050;
  const broomAng = lt => { if (lt < 2.25) return -0.1; const q = clamp((lt - 2.25) / 0.6); if (q < 1) return lerp(-0.1, 1.68, q * q); const b = lt - 2.85; return 1.68 - 0.12 * Math.exp(-b * 9) * Math.abs(Math.sin(b * 22)); };
  return {
    draw(c, lt, t) {
      const cam = EP.cam(lt, [{ t: 0, cx: 1000, cy: 610, z: 1.5 }, { t: 2.85, cx: 1330, cy: 680, z: 1.95, kind: 'slam' }]);
      EP.withCam(c, cam, () => {
        c.drawImage(room(), 0, 0);
        // 窗光落在地上，缓慢明暗
        c.save(); c.globalAlpha = 0.22 + 0.05 * Math.sin(t * 2.1); c.fillStyle = '#fff3d6';
        c.beginPath(); c.moveTo(250, 580); c.lineTo(650, 580); c.lineTo(980, FLOOR + 200); c.lineTo(520, FLOOR + 200); c.closePath(); c.fill(); c.restore();
        // 浮尘
        const r = rng(5); c.fillStyle = 'rgba(255,240,210,.85)'; for (let i = 0; i < 26; i++) { const x = 300 + r() * 520 + Math.sin(t * 0.9 + i) * 18, y = 200 + ((r() * 600 + t * 22 * (0.5 + r())) % 600); c.beginPath(); c.arc(x, y, 1.5 + r() * 2, 0, 7); c.fill(); }
        // 绿植
        const sw = Math.sin(t * 2.3) * 0.05; c.save(); c.translate(140, FLOOR - 4);
        EP.rr(c, -60, -130, 120, 130, 14, F.coral);
        [[-0.5, 260], [-0.15, 320], [0.2, 300], [0.55, 240]].forEach(([a, L], i) => { c.save(); c.rotate(a + sw * (i % 2 ? 1 : -1)); c.fillStyle = i % 2 ? F.green : F.greenLt; c.beginPath(); c.ellipse(0, -130 - L / 2, 34, L / 2, 0, 0, 7); c.fill(); c.restore(); });
        c.restore();
        // 灰点
        const rx = robotX(lt); c.fillStyle = 'rgba(110,80,50,.6)'; dust.forEach(([x, y, s]) => { if (x > rx + 150) { c.beginPath(); c.arc(x, y, s, 0, 7); c.fill(); } });
        // 扫帚（撞上后倒向右边）
        { const a = broomAng(lt); EP.broomFlat(c, 1360 + 40 * Math.sin(Math.max(0, a)), FLOOR - 80 * Math.sin(Math.max(0, a)), a); }
        // 扫地机
        EP.robotSide(c, rx, FLOOR, { brush: t * 18, led: lt > 2.25 && lt < 3.4 ? (Math.floor(lt * 8) % 2) : 1 });
        // 撞上那一下：三道短线
        if (lt > 2.25 && lt < 2.6) { const a = 1 - (lt - 2.25) / 0.35; c.save(); c.strokeStyle = `rgba(42,33,24,${a})`; c.lineWidth = 6; c.lineCap = 'round'; [[-0.6], [0], [0.6]].forEach(([d]) => { c.beginPath(); c.moveTo(1290 + Math.cos(d - 1.57) * 40, 700 + Math.sin(d - 1.57) * 40); c.lineTo(1290 + Math.cos(d - 1.57) * 80, 700 + Math.sin(d - 1.57) * 80); c.stroke(); }); c.restore(); }
        // 扫帚落地扬起的一圈灰
        if (lt > 2.85) { const q = clamp((lt - 2.85) / 0.9); c.fillStyle = `rgba(180,150,110,${0.6 * (1 - q)})`; const rr = rng(33); for (let i = 0; i < 18; i++) { const a = rr() * Math.PI, d = 40 + q * (80 + rr() * 140); c.beginPath(); c.arc(1700 + Math.cos(a) * d * 1.6, FLOOR - Math.sin(a) * d * 0.5, 4 + rr() * 8, 0, 7); c.fill(); } }
      });
      EP.grain(c, t);
    },
  };
})();
