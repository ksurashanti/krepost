/* «Всем мешать»: мини-игра за Макара. MakarGame.open({asset: function(name){return url}, onEnd: function(score){}}) */
var MakarGame = (function () {
  var GW = 360, GH = 640, DUR = 60, LIVES = 3;
  // два зала: стол (трапеция в координатах 360x640), что не занимать предметами, гости и откуда тянутся руки
  var HALLS = [
    { bg: 'bg1', T: { top: 200, bot: 580, lt: 114, lb: 60, rt: 260, rb: 298 }, AVOID: [[180, 214, 24], [175, 556, 26], [280, 540, 22]],
      G: [
        { name: 'Ксения', x: 108, y: 214, c: '#1c1a1e', cuff: '#e8e2d2', f: 1 }, { name: 'Михаил', x: 112, y: 268, c: '#6e1a22', cuff: '#e8e2d2' },
        { name: 'Даня', x: 98, y: 345, c: '#242024', cuff: '#e8e2d2' }, { name: 'Регина', x: 82, y: 445, c: '#7e1e24', cuff: '#e8e2d2', f: 1 },
        { name: 'Айк', x: 132, y: 198, c: '#7a1c24', cuff: '#b8bcc0' }, { name: 'Кирилл', x: 180, y: 194, c: '#e2d6b4', cuff: '#c8a040' },
        { name: 'Ирина', x: 234, y: 198, c: '#24452c', cuff: '#c8a040', f: 1 }, { name: 'Женя', x: 262, y: 240, c: '#232c58', cuff: '#e8e2d2', f: 1 },
        { name: 'Яна', x: 268, y: 296, c: '#8c9096', cuff: '#5a4030', f: 1 }, { name: 'Савва', x: 288, y: 440, c: '#221e1e', cuff: '#e8e2d2' }] },
    { bg: 'bg2', T: { top: 194, bot: 576, lt: 122, lb: 62, rt: 248, rb: 296 }, AVOID: [[180, 208, 24], [175, 548, 26], [280, 540, 22]],
      G: [
        { name: 'Слава', x: 150, y: 192, c: '#1e1a1a', cuff: '#e8e2d2' }, { name: 'Маня', x: 185, y: 192, c: '#24452c', cuff: '#c8a040', f: 1 },
        { name: 'Олеся', x: 218, y: 192, c: '#8a2a20', cuff: '#c8a040', f: 1 },
        { name: 'Илья', x: 124, y: 216, c: '#d8ccb0', cuff: '#7a5a3a' }, { name: 'Маша', x: 126, y: 268, c: '#3a5a8a', cuff: '#e8e2d2', f: 1 },
        { name: 'Саша', x: 128, y: 348, c: '#5a5044', cuff: '#8a7a60' }, { name: 'Вова', x: 116, y: 428, c: '#d6c6a6', cuff: '#e8e2d2' },
        { name: 'Тина', x: 106, y: 505, c: '#8aa0c0', cuff: '#f0ece0', f: 1 },
        { name: 'Николай', x: 238, y: 232, c: '#22305a', cuff: '#c8a040' }, { name: 'Лёха', x: 232, y: 300, c: '#5a3a26', cuff: '#5a3a26' },
        { name: 'Люба', x: 238, y: 352, c: '#d8c8a8', cuff: '#e8e2d2', f: 1 }, { name: 'Оля', x: 240, y: 428, c: '#2a6a70', cuff: '#c8a040', f: 1 },
        { name: 'Катейник', x: 244, y: 492, c: '#7a1c24', cuff: '#c8a040', f: 1 }] }
  ];
  var HALL, T, AVOID, GUESTS;
  function setHall(k) { HALL = HALLS[k]; T = HALL.T; AVOID = HALL.AVOID; GUESTS = HALL.G; }
  setHall(0);
  var ITEMS = [
    { n: 'goblet', w: 17, pts: 1, p: 26 }, { n: 'mug', w: 20, pts: 1, p: 22 }, { n: 'bread', w: 26, pts: 1, p: 12 },
    { n: 'grapes', w: 27, pts: 1, p: 10 }, { n: 'plate', w: 24, pts: 1, p: 10 }, { n: 'candle', w: 14, pts: 2, p: 8 },
    { n: 'jug', w: 20, pts: 2, p: 6 }, { n: 'chicken', w: 32, pts: 3, p: 4 }, { n: 'cake', w: 32, pts: 5, p: 2 }
  ];
  // гости у стола: откуда тянется рука и цвет рукава
  var GUESTS = [
    { name: 'Ксения', x: 102, y: 206, c: '#1c1a1e', cuff: '#e8e2d2', f: 1 }, { name: 'Михаил', x: 100, y: 266, c: '#6e1a22', cuff: '#e8e2d2' },
    { name: 'Даня', x: 92, y: 346, c: '#242024', cuff: '#e8e2d2' }, { name: 'Регина', x: 84, y: 440, c: '#7e1e24', cuff: '#e8e2d2', f: 1 },
    { name: 'Айк', x: 132, y: 192, c: '#7a1c24', cuff: '#b8bcc0' }, { name: 'Кирилл', x: 180, y: 190, c: '#e2d6b4', cuff: '#c8a040' },
    { name: 'Ирина', x: 232, y: 194, c: '#24452c', cuff: '#c8a040', f: 1 }, { name: 'Женя', x: 266, y: 222, c: '#232c58', cuff: '#e8e2d2', f: 1 },
    { name: 'Яна', x: 274, y: 300, c: '#8c9096', cuff: '#5a4030', f: 1 }, { name: 'Савва', x: 288, y: 430, c: '#221e1e', cuff: '#e8e2d2' }
  ];
  var el, cv, cx, raf, st, opts, IMG = {};

  function load(n) { if (!IMG[n]) { var i = new Image(); i.src = opts.asset(n); IMG[n] = i; } return IMG[n]; }
  function ok(i) { return i && i.complete && i.naturalWidth; }
  function haptic(k) { try { window.Telegram.WebApp.HapticFeedback.impactOccurred(k || 'light'); } catch (e) {} }
  function edges(y) { var k = (y - T.top) / (T.bot - T.top); return [T.lt + (T.lb - T.lt) * k, T.rt + (T.rb - T.rt) * k]; }

  function open(o) {
    opts = o;
    el = document.createElement('div'); el.className = 'mg';
    el.innerHTML = '<canvas></canvas><button class="mg-x" aria-label="Закрыть">✕</button><div class="mg-over"></div>';
    document.body.appendChild(el); document.body.style.overflow = 'hidden';
    cv = el.querySelector('canvas'); cx = cv.getContext('2d'); cv.width = GW * 2; cv.height = GH * 2; cx.setTransform(2, 0, 0, 2, 0, 0); cx.imageSmoothingEnabled = false;
    el.querySelector('.mg-x').onclick = close;
    fit(); window.addEventListener('resize', fit);
    var move = function (e) { if (!st || !st.run) return; var r = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; st.tx = (p.clientX - r.left) * GW / r.width; st.ty = (p.clientY - r.top) * GH / r.height - 18; if (e.cancelable) e.preventDefault(); };
    cv.addEventListener('pointerdown', move); cv.addEventListener('pointermove', move); cv.addEventListener('touchmove', move, { passive: false });
    ['bg1', 'bg2', 'baby', 'parrot', 'parrot_fly'].concat(ITEMS.map(function (i) { return i.n; })).forEach(load);
    var bg = load('bg1'); var go = function () { drawStatic(); intro(); };
    if (ok(bg)) go(); else bg.onload = go;
  }
  function close() { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); if (el) el.remove(); el = null; document.body.style.overflow = ''; st = null; }
  function fit() { var s = Math.min(window.innerWidth / GW, window.innerHeight / GH); cv.style.width = GW * s + 'px'; cv.style.height = GH * s + 'px'; }
  function overlay(html) { var o = el.querySelector('.mg-over'); o.innerHTML = html; o.style.display = html ? 'grid' : 'none'; }
  function drawStatic() { cx.drawImage(load(HALL.bg), 0, 0, GW, GH); hudPanel(); }

  function intro() {
    overlay('<div class="mg-card"><b>Всем мешать!</b><p>Ты Макар. Ползи по пиршественному столу и сбрасывай всё, до чего дотянешься.</p><p>Гости будут тянуть руки, чтобы тебя поймать, а попугай Паша сдаёт тебя с потрохами. Увидел <b class="mg-warn">!</b> над кем-то, уползай. Три раза поймали, и в кроватку.</p><p class="mg-small">Веди пальцем по столу, Макар ползёт за ним. Курица 3 очка, торт 5.</p><button class="mg-btn" data-go>Поползли!</button></div>');
    el.querySelector('[data-go]').onclick = start;
  }
  function pickItem() { var s = 0, r; ITEMS.forEach(function (i) { s += i.p; }); r = Math.random() * s; for (var k = 0; k < ITEMS.length; k++) { r -= ITEMS[k].p; if (r <= 0) return ITEMS[k]; } return ITEMS[0]; }
  function freeSpot() {
    for (var n = 0; n < 40; n++) {
      var y = T.top + 26 + Math.random() * (T.bot - T.top - 40), e = edges(y), x = e[0] + 16 + Math.random() * (e[1] - e[0] - 32), bad = false;
      AVOID.forEach(function (a) { if (Math.hypot(a[0] - x, a[1] - y) < a[2]) bad = true; });
      st.items.forEach(function (o) { if (Math.hypot(o.x - x, o.y - y) < 26) bad = true; });
      if (st && Math.hypot(st.mx - x, st.my - y) < 50) bad = true;
      if (!bad) return [x, y];
    }
    return null;
  }
  function spawnItem() { var s = freeSpot(); if (s) st.items.push({ x: s[0], y: s[1], it: pickItem(), a: 0 }); }
  function start() {
    overlay(''); setHall(0);
    st = { run: true, t: 0, score: 0, lives: LIVES, mx: 182, my: 470, tx: 182, ty: 470, face: 1, inv: 1.2, items: [], fly: [], pops: [], hands: [], cd: {}, nextHand: 1.0, nextItem: 0, hall: 0, fade: 0, pa: { x: 280, y: 540, st: 'sit', t: 0, next: 7 }, last: performance.now() };
    for (var i = 0; i < 6; i++) spawnItem();
    raf = requestAnimationFrame(loop);
  }
  function launch() {
    var free = GUESTS.filter(function (g) { return !(st.cd[g.name] > st.t) && !st.hands.some(function (h) { return h.g === g; }); });
    if (!free.length) return;
    free.sort(function (a, b) { return Math.hypot(a.x - st.mx, a.y - st.my) - Math.hypot(b.x - st.mx, b.y - st.my); });
    var g = free[Math.floor(Math.random() * Math.min(3, free.length))];
    var warn = Math.max(0.48, 0.8 - st.t * 0.005);
    st.hands.push({ g: g, ph: 'warn', t: 0, warn: warn, len: 0 });
    st.cd[g.name] = st.t + 2.2;
  }
  function loop(now) {
    if (!st || !st.run) return;
    var dt = Math.min(0.05, (now - st.last) / 1000); st.last = now; st.t += dt; st.inv = Math.max(0, st.inv - dt);
    // Макар ползёт к пальцу
    var dx = st.tx - st.mx, dy = st.ty - st.my, d = Math.hypot(dx, dy), sp = 155;
    st.moving = d > 3;
    if (st.moving) { var k = Math.min(1, sp * dt / d); st.mx += dx * k; st.my += dy * k; if (Math.abs(dx) > 4) st.face = dx > 0 ? 1 : -1; }
    st.my = Math.max(T.top + 14, Math.min(T.bot - 10, st.my)); var e = edges(st.my); st.mx = Math.max(e[0] + 14, Math.min(e[1] - 14, st.mx));
    // предметы
    st.nextItem -= dt; if (st.nextItem <= 0 && st.items.length < 8) { spawnItem(); st.nextItem = 0.95; }
    for (var i = st.items.length - 1; i >= 0; i--) { var o = st.items[i]; o.a = Math.min(1, o.a + dt * 3);
      if (Math.hypot(o.x - st.mx, o.y - (st.my + 4)) < 20) {
        st.items.splice(i, 1); st.score += o.it.pts; haptic(o.it.pts >= 3 ? 'medium' : 'light');
        var side = o.x < (edges(o.y)[0] + edges(o.y)[1]) / 2 ? -1 : 1;
        st.fly.push({ x: o.x, y: o.y, vx: side * (120 + Math.random() * 80), vy: -160 - Math.random() * 60, r: 0, vr: side * (6 + Math.random() * 6), it: o.it, life: 1.1 });
        st.pops.push({ x: o.x, y: o.y - 14, s: '+' + o.it.pts, life: 0.8 });
      } }
    st.fly.forEach(function (f) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 520 * dt; f.r += f.vr * dt; f.life -= dt; }); st.fly = st.fly.filter(function (f) { return f.life > 0; });
    st.pops.forEach(function (p) { p.y -= 30 * dt; p.life -= dt; }); st.pops = st.pops.filter(function (p) { return p.life > 0; });
    // руки гостей
    st.nextHand -= dt; var maxH = Math.min(3, 1 + Math.floor(st.t / 15));
    if (st.nextHand <= 0) { if (st.hands.length < maxH) launch(); st.nextHand = Math.max(0.65, 1.5 - st.t * 0.013) * (0.7 + Math.random() * 0.6); }
    st.hands.forEach(function (h) {
      h.t += dt;
      if (h.ph === 'warn' && h.t >= h.warn) { h.ph = 'out'; h.t = 0; var lead = 0.2; h.tx = st.mx + (st.tx - st.mx) * lead; h.ty = st.my + (st.ty - st.my) * lead;
        var L = Math.hypot(h.tx - h.g.x, h.ty - h.g.y); var maxL = 175; if (L > maxL) { h.tx = h.g.x + (h.tx - h.g.x) * maxL / L; h.ty = h.g.y + (h.ty - h.g.y) * maxL / L; } h.full = Math.min(L, maxL); }
      else if (h.ph === 'out') { h.len = Math.min(1, h.t / 0.3); if (h.t >= 0.3) { h.ph = 'hold'; h.t = 0; } }
      else if (h.ph === 'hold' && h.t >= 0.35) { h.ph = 'back'; h.t = 0; }
      else if (h.ph === 'back') { h.len = Math.max(0, 1 - h.t / 0.45); if (h.len <= 0) h.done = 1; }
      if ((h.ph === 'out' || h.ph === 'hold') && st.inv <= 0) {
        var hx = h.g.x + (h.tx - h.g.x) * h.len, hy = h.g.y + (h.ty - h.g.y) * h.len;
        if (Math.hypot(hx - st.mx, hy - st.my) < 16) {
          st.lives--; st.inv = 1.5; haptic('heavy'); st.caughtBy = h.g.name; st.caughtF = !!h.g.f;
          st.pops.push({ x: st.mx, y: st.my - 26, s: 'Поймал' + (h.g.f ? 'а' : '') + ' ' + h.g.name + '!', life: 1.2, big: 1 });
          st.hands.forEach(function (x) { if (x.ph !== 'back') { x.ph = 'back'; x.t = 0; } });
        }
      }
    });
    st.hands = st.hands.filter(function (h) { return !h.done; });
    // на 30-й секунде подоспевают другие гости
    if (st.hall === 0 && st.t >= DUR / 2) { st.hall = 1; setHall(1); st.fade = 1; st.hands = []; st.cd = {}; st.nextHand = 1.2;
      st.items = st.items.filter(function (o) { var e = edges(o.y); return o.y > T.top + 20 && o.y < T.bot - 10 && o.x > e[0] + 14 && o.x < e[1] - 14; });
      st.pops.push({ x: GW / 2, y: 150, s: 'Подоспели гости!', life: 1.8, big: 1 }); haptic('medium'); }
    st.fade = Math.max(0, st.fade - dt * 1.4);
    parrot(dt);
    if (st.lives <= 0 || st.t >= DUR) return end();
    draw(); raf = requestAnimationFrame(loop);
  }
  // Паша: сидит на краю стола, время от времени подлетает к Макару, орёт «Тут он!» и сдаёт его ближайшему гостю
  function parrot(dt) {
    var P = st.pa; P.t += dt;
    if (P.st === 'sit') { P.next -= dt; if (P.next <= 0 && st.t > 4) { P.st = 'fly'; P.t = 0; P.fx = P.x; P.fy = P.y; var e = edges(st.my); P.tx = Math.max(e[0] + 10, Math.min(e[1] - 10, st.mx + (Math.random() < 0.5 ? -26 : 26))); P.ty = st.my - 6; } }
    else if (P.st === 'fly') { var k = Math.min(1, P.t / 0.9); P.x = P.fx + (P.tx - P.fx) * k; P.y = P.fy + (P.ty - P.fy) * k - Math.sin(k * Math.PI) * 40;
      if (k >= 1) { P.st = 'shout'; P.t = 0; st.pops.push({ x: P.x, y: P.y - 40, s: 'Тут он!', life: 1.1, big: 1 }); haptic('medium');
        var free = GUESTS.filter(function (g) { return !st.hands.some(function (h) { return h.g === g; }); }).sort(function (a, b) { return Math.hypot(a.x - st.mx, a.y - st.my) - Math.hypot(b.x - st.mx, b.y - st.my); });
        if (free[0]) st.hands.push({ g: free[0], ph: 'warn', t: 0, warn: 0.45, len: 0 }); } }
    else if (P.st === 'shout' && P.t > 1.4) { P.st = 'back'; P.t = 0; P.fx = P.x; P.fy = P.y; P.tx = 280; P.ty = 540; }
    else if (P.st === 'back') { var k2 = Math.min(1, P.t / 1.0); P.x = P.fx + (P.tx - P.fx) * k2; P.y = P.fy + (P.ty - P.fy) * k2 - Math.sin(k2 * Math.PI) * 50;
      if (k2 >= 1) { P.st = 'sit'; P.next = Math.max(6, 13 - st.t * 0.08) * (0.8 + Math.random() * 0.4); } }
  }
  function drawParrot() {
    var P = st.pa, flying = P.st === 'fly' || P.st === 'back';
    if (flying) { var flap = 0.75 + 0.25 * Math.abs(Math.sin(st.t * 18)); var im = load('parrot_fly'); if (!ok(im)) return; var w = 56, h = w * im.naturalHeight / im.naturalWidth;
      cx.save(); cx.translate(P.x, P.y); if (P.tx < P.fx) cx.scale(-1, 1); cx.scale(1, flap); cx.drawImage(im, -w / 2, -h, w, h); cx.restore(); }
    else { shadow(P.x, P.y, 18); drawSprite('parrot', P.x, P.y + (P.st === 'shout' ? -Math.abs(Math.sin(P.t * 20)) * 3 : 0), 30, 0, 1, P.st === 'shout' && P.x < st.mx); }
  }
  function drawSprite(n, x, y, w, rot, alpha, flip) {
    var im = load(n); if (!ok(im)) return; var h = w * im.naturalHeight / im.naturalWidth;
    cx.save(); cx.globalAlpha = alpha == null ? 1 : alpha; cx.translate(x, y); if (rot) cx.rotate(rot); if (flip) cx.scale(-1, 1);
    cx.drawImage(im, -w / 2, -h, w, h); cx.restore();
  }
  function shadow(x, y, w) { cx.save(); cx.globalAlpha = 0.28; cx.fillStyle = '#000'; cx.beginPath(); cx.ellipse(x, y, w * 0.45, w * 0.14, 0, 0, 7); cx.fill(); cx.restore(); }
  function drawArm(h) {
    var g = h.g, ex = g.x + (h.tx - g.x) * h.len, ey = g.y + (h.ty - g.y) * h.len, ang = Math.atan2(ey - g.y, ex - g.x);
    cx.save(); cx.lineCap = 'round';
    cx.strokeStyle = 'rgba(0,0,0,.35)'; cx.lineWidth = 13; cx.beginPath(); cx.moveTo(g.x + 3, g.y + 4); cx.lineTo(ex + 3, ey + 4); cx.stroke();
    cx.strokeStyle = '#120e0c'; cx.lineWidth = 12; cx.beginPath(); cx.moveTo(g.x, g.y); cx.lineTo(ex, ey); cx.stroke();
    cx.strokeStyle = g.c; cx.lineWidth = 9; cx.beginPath(); cx.moveTo(g.x, g.y); cx.lineTo(ex - Math.cos(ang) * 6, ey - Math.sin(ang) * 6); cx.stroke();
    cx.strokeStyle = g.cuff; cx.lineWidth = 9; cx.beginPath(); cx.moveTo(ex - Math.cos(ang) * 8, ey - Math.sin(ang) * 8); cx.lineTo(ex - Math.cos(ang) * 5, ey - Math.sin(ang) * 5); cx.stroke();
    cx.translate(ex, ey); cx.rotate(ang); cx.fillStyle = '#120e0c'; cx.beginPath(); cx.ellipse(2, 0, 8, 7, 0, 0, 7); cx.fill();
    cx.fillStyle = '#e9b893'; cx.beginPath(); cx.ellipse(2, 0, 6.5, 5.5, 0, 0, 7); cx.fill();
    var open = h.ph === 'out' || h.ph === 'hold';
    cx.strokeStyle = '#e9b893'; cx.lineWidth = 2.6;
    [-4, -1.3, 1.3, 4].forEach(function (f) { cx.beginPath(); cx.moveTo(6, f * 0.9); cx.lineTo(open ? 12 : 9, f * (open ? 1.5 : 1)); cx.stroke(); });
    cx.beginPath(); cx.moveTo(2, -5); cx.lineTo(5, -9); cx.stroke();
    cx.restore();
  }
  function hudPanel() {
    cx.save(); var gr = cx.createLinearGradient(0, 0, 0, 40); gr.addColorStop(0, 'rgba(20,16,12,.95)'); gr.addColorStop(1, 'rgba(20,16,12,.0)'); cx.fillStyle = gr; cx.fillRect(0, 0, GW, 42); cx.restore();
  }
  function heart(x, y, full) { var P = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...']; cx.fillStyle = '#120e0c'; cx.fillRect(x - 1, y - 1, 16, 14);
    P.forEach(function (row, j) { for (var i = 0; i < row.length; i++) if (row[i] === '#') { cx.fillStyle = full ? (j < 2 && i % 3 === 1 ? '#ff8a80' : '#d8342c') : '#4a4440'; cx.fillRect(x + i * 2, y + j * 2, 2, 2); } }); }
  function txt(s, x, y, size, color, align) { cx.font = '800 ' + size + 'px system-ui,-apple-system,sans-serif'; cx.textAlign = align || 'center'; cx.textBaseline = 'middle'; cx.lineWidth = 4; cx.strokeStyle = '#120e0c'; cx.strokeText(s, x, y); cx.fillStyle = color; cx.fillText(s, x, y); }
  function draw() {
    cx.drawImage(load(HALL.bg), 0, 0, GW, GH); hudPanel();
    // объекты по глубине
    var list = st.items.map(function (o) { return { y: o.y, f: function () { shadow(o.x, o.y, o.it.w); drawSprite(o.it.n, o.x, o.y, o.it.w, 0, o.a); } }; });
    var blink = st.inv > 0 && Math.floor(st.t * 12) % 2 === 0;
    list.push({ y: st.my + 6, f: function () { if (blink) return; var bob = st.moving ? Math.sin(st.t * 16) * 1.6 : 0; shadow(st.mx, st.my + 8, 52); drawSprite('baby', st.mx, st.my + 10 + bob, 60, st.moving ? Math.sin(st.t * 16) * 0.05 : 0, 1, st.face < 0); } });
    list.sort(function (a, b) { return a.y - b.y; }).forEach(function (o) { o.f(); });
    drawParrot();
    st.fly.forEach(function (f) { drawSprite(f.it.n, f.x, f.y, f.it.w, f.r, Math.max(0, Math.min(1, f.life * 1.6))); });
    // руки и предупреждения
    st.hands.forEach(function (h) {
      if (h.ph === 'warn') { var k = h.t / h.warn, pulse = 0.5 + 0.5 * Math.sin(h.t * 30);
        cx.save(); cx.globalAlpha = 0.35 + 0.4 * pulse; cx.fillStyle = '#ffcf6a'; cx.beginPath(); cx.arc(h.g.x, h.g.y, 10 + k * 6, 0, 7); cx.fill(); cx.restore();
        txt('!', h.g.x, h.g.y - 20, 22, '#ffd75e'); }
      else drawArm(h);
    });
    st.pops.forEach(function (p) { cx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6)); txt(p.s, p.x, p.y, p.big ? 17 : 15, p.big ? '#ffb27a' : '#ffe9a8'); }); cx.globalAlpha = 1;
    if (st.fade > 0) { cx.save(); cx.globalAlpha = Math.min(1, st.fade); cx.fillStyle = '#120e0c'; cx.fillRect(0, 0, GW, GH); cx.restore(); }
    // HUD
    for (var i = 0; i < LIVES; i++) heart(12 + i * 19, 13, i < st.lives);
    txt(String(st.score), GW - 14, 20, 22, '#ffe9a8', 'right');
    txt(String(Math.max(0, Math.ceil(DUR - st.t))), GW / 2, 20, 18, '#e8e2d2');
  }
  function end() {
    st.run = false; draw();
    var s = st.score, ph = s >= 40 ? 'Легенда хаоса! Пир сорван, крепость не оправится.' : s >= 26 ? 'Отличный погром! Роза Грубер в отчаянии.' : s >= 12 ? 'Неплохо помешал. Но можно и громче.' : 'Слишком воспитанный ребёнок. Ещё разок?';
    var head = st.lives <= 0 ? 'В кроватку!' : 'Время вышло!';
    overlay('<div class="mg-card"><b>' + head + '</b>' + (st.lives <= 0 && st.caughtBy ? '<p class="mg-small">Последним поймал' + (st.caughtF ? 'а ' : ' ') + st.caughtBy + '</p>' : '') + '<div class="mg-big">' + s + '</div><p>' + ph + '</p><button class="mg-btn" data-go>Ещё раз</button><button class="mg-btn ghost" data-x>Хватит</button></div>');
    el.querySelector('[data-go]').onclick = start; el.querySelector('[data-x]').onclick = close;
    if (opts.onEnd) try { opts.onEnd(s); } catch (e) {}
  }
  return { open: open, close: close, _st: function () { return st; } };
})();
