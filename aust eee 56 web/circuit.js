/* PCB circuit board animation — traces, chips, flowing current */

(function initCircuitBoard() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, cols, rows, grid = 52;
  let nodes = [];
  let segments = [];
  let pulses = [];
  let sparks = [];
  let chips = [];
  let arcs = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let frame = 0;
  let time = 0;

  const COLORS = {
    trace: "rgba(59, 158, 255, 0.12)",
    traceBright: "rgba(0, 229, 192, 0.35)",
    node: "#3b9eff",
    pulse: "#00e5c0",
    pulseCore: "#ffffff",
    chip: "rgba(59, 158, 255, 0.15)",
    chipPin: "rgba(0, 229, 192, 0.4)",
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / grid) + 1;
    rows = Math.ceil(h / grid) + 1;
    buildCircuit();
  }

  function gridPos(c, r) {
    return { x: c * grid + grid / 2, y: r * grid + grid / 2 };
  }

  function nodeAt(c, r) {
    return nodes.find((n) => n.c === c && n.r === r);
  }

  function addNode(c, r, type = "via") {
    const p = gridPos(c, r);
    const n = { c, r, x: p.x, y: p.y, type, glow: 0, id: nodes.length };
    nodes.push(n);
    return n;
  }

  function connect(a, b) {
    if (!a || !b) return;
    const horiz = a.r === b.r;
    const len = horiz ? Math.abs(b.x - a.x) : Math.abs(b.y - a.y);
    if (len < 1) return;
    segments.push({
      a,
      b,
      horiz,
      len,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
    });
  }

  function buildCircuit() {
    nodes = [];
    segments = [];
    pulses = [];
    sparks = [];
    chips = [];
    arcs = [];

    const density = w < 768 ? 0.22 : 0.28;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > density) continue;
        const roll = Math.random();
        const type = roll > 0.92 ? "chip" : roll > 0.75 ? "junction" : "via";
        addNode(c, r, type);
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const n = nodeAt(c, r);
        if (!n) continue;

        const right = nodeAt(c + 1, r);
        const down = nodeAt(c, r + 1);
        if (right && Math.random() < 0.72) connect(n, right);
        if (down && Math.random() < 0.72) connect(n, down);

        if (n.type === "chip") {
          chips.push({
            x: n.x,
            y: n.y,
            w: grid * 1.6,
            h: grid * 1.1,
            label: ["U", "IC", "MCU", "ADC", "OP"][Math.floor(Math.random() * 5)],
            pins: 4 + Math.floor(Math.random() * 4),
          });
        }
      }
    }

    if (segments.length < 8) {
      for (let i = 0; i < 20; i++) {
        const c = Math.floor(Math.random() * (cols - 2)) + 1;
        const r = Math.floor(Math.random() * (rows - 2)) + 1;
        if (!nodeAt(c, r)) addNode(c, r, "via");
        const n = nodeAt(c, r);
        const right = nodeAt(c + 1, r) || addNode(c + 1, r, "via");
        const down = nodeAt(c, r + 1) || addNode(c, r + 1, "via");
        if (n && right) connect(n, right);
        if (n && down) connect(n, down);
      }
    }

    const pulseCount = Math.min(55, Math.floor(segments.length * 0.9));
    for (let i = 0; i < pulseCount; i++) spawnPulse();
  }

  function spawnPulse() {
    const seg = segments[Math.floor(Math.random() * segments.length)];
    if (!seg) return;
    pulses.push({
      seg,
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.012,
      dir: Math.random() > 0.5 ? 1 : -1,
      hue: Math.random() > 0.3 ? "cyan" : "blue",
      trail: [],
      size: 2 + Math.random() * 2,
    });
  }

  function pointOnSegment(seg, t) {
    return {
      x: seg.x1 + (seg.x2 - seg.x1) * t,
      y: seg.y1 + (seg.y2 - seg.y1) * t,
    };
  }

  function spawnSpark(x, y) {
    sparks.push({
      x,
      y,
      life: 1,
      parts: Array.from({ length: 6 }, () => ({
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        len: 4 + Math.random() * 12,
      })),
    });
  }

  function maybeArc() {
    if (arcs.length > 3 || Math.random() > 0.003) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];
    if (!a || !b || a === b) return;
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < grid * 2 || d > grid * 6) return;
    arcs.push({ a, b, life: 1, segs: 5 + Math.floor(Math.random() * 4) });
  }

  function drawBackgroundGrid() {
    ctx.strokeStyle = "rgba(59, 158, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function drawTraces() {
    segments.forEach((seg) => {
      let boost = 0;
      if (mouse.active) {
        const mx = mouse.x;
        const my = mouse.y;
        const midX = (seg.x1 + seg.x2) / 2;
        const midY = (seg.y1 + seg.y2) / 2;
        const d = Math.hypot(mx - midX, my - midY);
        boost = Math.max(0, 1 - d / 180) * 0.5;
      }

      ctx.strokeStyle = boost > 0.1 ? COLORS.traceBright : COLORS.trace;
      ctx.lineWidth = 1.2 + boost * 1.5;
      ctx.lineCap = "square";
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();

      if (boost > 0.35 && frame % 20 === 0) {
        const p = pointOnSegment(seg, Math.random());
        spawnSpark(p.x, p.y);
      }
    });
  }

  function drawChips() {
    chips.forEach((chip) => {
      const x = chip.x - chip.w / 2;
      const y = chip.y - chip.h / 2;

      ctx.fillStyle = COLORS.chip;
      ctx.strokeStyle = "rgba(59, 158, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, chip.w, chip.h, 4);
      else ctx.rect(x, y, chip.w, chip.h);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(0, 229, 192, 0.25)";
      ctx.font = `600 ${Math.max(9, grid * 0.22)}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(chip.label, chip.x, chip.y);

      const pinW = 3;
      const pinH = 6;
      for (let i = 0; i < chip.pins; i++) {
        const t = (i + 1) / (chip.pins + 1);
        ctx.fillStyle = COLORS.chipPin;
        ctx.fillRect(x + chip.w * t - pinW / 2, y - pinH, pinW, pinH);
        ctx.fillRect(x + chip.w * t - pinW / 2, y + chip.h, pinW, pinH);
        ctx.fillRect(x - pinH, y + chip.h * t - pinW / 2, pinH, pinW);
        ctx.fillRect(x + chip.w, y + chip.h * t - pinW / 2, pinH, pinW);
      }
    });
  }

  function drawNodes() {
    nodes.forEach((n) => {
      let glow = n.glow;
      if (mouse.active) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        glow = Math.max(glow, Math.max(0, 1 - d / 120));
      }
      n.glow *= 0.92;

      const r = n.type === "chip" ? 3 : n.type === "junction" ? 4.5 : 3;
      const pulse = 1 + glow * 0.8;

      if (glow > 0.2) {
        ctx.shadowBlur = 12 + glow * 20;
        ctx.shadowColor = COLORS.pulse;
      }

      ctx.fillStyle = glow > 0.4 ? COLORS.pulse : COLORS.node;
      ctx.beginPath();
      if (n.type === "junction") {
        ctx.arc(n.x, n.y, r * pulse, 0, Math.PI * 2);
      } else {
        ctx.rect(n.x - r * pulse, n.y - r * pulse, r * 2 * pulse, r * 2 * pulse);
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      if (n.type === "junction" && frame % 90 === n.id % 90) {
        ctx.strokeStyle = "rgba(0, 229, 192, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, grid * 0.35, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function drawPulses() {
    pulses.forEach((p) => {
      p.t += p.speed * p.dir;
      if (p.t > 1 || p.t < 0) {
        p.dir *= -1;
        p.t = Math.max(0, Math.min(1, p.t));
        if (Math.random() > 0.7) {
          p.seg = segments[Math.floor(Math.random() * segments.length)];
        }
      }

      const pos = pointOnSegment(p.seg, p.t);
      p.trail.unshift({ x: pos.x, y: pos.y });
      if (p.trail.length > 14) p.trail.pop();

      for (let i = p.trail.length - 1; i >= 0; i--) {
        const t = p.trail[i];
        const alpha = (1 - i / p.trail.length) * 0.55;
        const size = p.size * (1 - i / p.trail.length * 0.6);
        ctx.fillStyle = `rgba(0, 229, 192, ${alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 5);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.2, "rgba(0,229,192,0.8)");
      grad.addColorStop(1, "rgba(59,158,255,0)");

      ctx.shadowBlur = 18;
      ctx.shadowColor = COLORS.pulse;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (mouse.active && Math.hypot(mouse.x - pos.x, mouse.y - pos.y) < 40) {
        p.speed = Math.min(p.speed * 1.02, 0.025);
        p.seg.a.glow = 1;
        p.seg.b.glow = 1;
      }
    });

    while (pulses.length < Math.min(55, segments.length)) spawnPulse();
    if (pulses.length > 70) pulses.splice(0, pulses.length - 70);
  }

  function drawArcs() {
    arcs.forEach((arc, i) => {
      arc.life -= 0.04;
      if (arc.life <= 0) {
        arcs.splice(i, 1);
        return;
      }

      ctx.strokeStyle = `rgba(0, 229, 192, ${arc.life * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.pulse;
      ctx.beginPath();
      ctx.moveTo(arc.a.x, arc.a.y);

      for (let s = 1; s <= arc.segs; s++) {
        const t = s / arc.segs;
        const jx = (arc.a.x + (arc.b.x - arc.a.x) * t) + (Math.random() - 0.5) * grid * 0.8;
        const jy = (arc.a.y + (arc.b.y - arc.a.y) * t) + (Math.random() - 0.5) * grid * 0.8;
        ctx.lineTo(jx, jy);
      }
      ctx.lineTo(arc.b.x, arc.b.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawSparks() {
    sparks.forEach((s, i) => {
      s.life -= 0.06;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        return;
      }
      s.parts.forEach((p) => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.life * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + p.vx * p.len * s.life, s.y + p.vy * p.len * s.life);
        ctx.stroke();
      });
    });
  }

  function drawScanline() {
    const y = (time * 0.04) % h;
    const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, "rgba(0, 229, 192, 0.03)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - 40, w, 80);
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85);
    g.addColorStop(0, "transparent");
    g.addColorStop(1, "rgba(6, 8, 15, 0.65)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function tick() {
    if (reduced) return;

    frame++;
    time++;

    ctx.fillStyle = "rgba(6, 8, 15, 0.18)";
    ctx.fillRect(0, 0, w, h);

    drawBackgroundGrid();
    drawTraces();
    drawChips();
    drawNodes();
    drawPulses();
    drawArcs();
    drawSparks();
    drawScanline();
    drawVignette();

    maybeArc();

    if (frame % 120 === 0 && nodes.length) {
      const n = nodes[Math.floor(Math.random() * nodes.length)];
      spawnSpark(n.x, n.y);
      n.glow = 1;
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  if (!reduced) {
    ctx.fillStyle = "#06080f";
    ctx.fillRect(0, 0, w, h);
    tick();
  }
})();
