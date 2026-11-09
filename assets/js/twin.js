/* =====================================================================
   Live digital twin hero
   Renders the BIM model of our Smart City Lab building (Revit → IFC4x3)
   as a "being-digitized" wireframe.
   Data: /assets/twin/smartcity-lab.bin, produced by _tools/ifc_to_wire.py
   Format: uint32 n | n × 6 int16 (cm, Z-up, centred) | n × uint8 category
           category 0 = structure · 1 = windows/doors · 2 = facade details · 3 = site context
   ===================================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const root = document.querySelector('[data-twin-root]');
const canvas = root && root.querySelector('[data-twin-canvas]');
if (root && canvas) init().catch((err) => console.warn('[twin] disabled:', err));

async function init() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return; } // no WebGL → the static poster stays visible
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  /* ---------- Load the building ---------- */
  const res = await fetch(new URL('../twin/smartcity-lab.bin', import.meta.url));
  if (!res.ok) throw new Error('model ' + res.status);
  const buf = await res.arrayBuffer();
  const n = new DataView(buf).getUint32(0, true);
  const raw = new Int16Array(buf, 4, n * 6);
  const cats = new Uint8Array(buf, 4 + n * 12, n);

  const pos = new Float32Array(n * 6);
  const aCat = new Float32Array(n * 2);
  const aRand = new Float32Array(n * 2);
  let maxY = 0, maxR = 0;
  for (let i = 0; i < n * 2; i++) {
    const x = raw[i * 3] / 100, y = raw[i * 3 + 1] / 100, z = raw[i * 3 + 2] / 100;
    pos[i * 3] = x; pos[i * 3 + 1] = z; pos[i * 3 + 2] = -y; // Z-up → Y-up
    if (cats[i >> 1] === 3) continue; // site context doesn't drive the framing
    maxY = Math.max(maxY, z); maxR = Math.max(maxR, Math.hypot(x, y));
  }
  for (let e = 0; e < n; e++) {
    const r = Math.random();
    aCat[e * 2] = aCat[e * 2 + 1] = cats[e];
    aRand[e * 2] = aRand[e * 2 + 1] = r;
  }
  const H = maxY;
  const S = Math.max(1, maxR / 8);           // effect scale relative to an 8 m-radius model
  const G1 = S > 2 ? 2 : 1, G2 = G1 * 5;      // ground grid spacing (m)
  const f = (v) => v.toFixed(2);

  /* ---------- Scene ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);
  const uniforms = {
    uTime: { value: 0 },
    uReveal: { value: reduce ? H + 3 : -1 },
    uSweep: { value: -50 },
    uRing: { value: 0 },
    uC0: { value: new THREE.Color(0.32, 0.70, 1.0) },
    uC1: { value: new THREE.Color(1.0, 0.70, 0.30) },
    uC2: { value: new THREE.Color(0.45, 1.0, 0.80) },
    uC3: { value: new THREE.Color(0.30, 0.55, 1.0) },
  };
  const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };

  // Building wireframe
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aCat', new THREE.BufferAttribute(aCat, 1));
  g.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1));
  const lineMat = new THREE.ShaderMaterial({
    uniforms, ...additive,
    vertexShader: /* glsl */`
      attribute float aCat; attribute float aRand;
      varying float vCat; varying float vY; varying float vRand;
      void main() {
        vCat = aCat; vY = position.y; vRand = aRand;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uReveal, uSweep; uniform vec3 uC0, uC1, uC2, uC3;
      varying float vCat; varying float vY; varying float vRand;
      void main() {
        vec3 c = vCat < 0.5 ? uC0 : (vCat < 1.5 ? uC1 : (vCat < 2.5 ? uC2 : uC3));
        float k = vCat > 2.5 ? 0.35 : 1.0; // site context stays faint
        float built = smoothstep(uReveal + 0.05, uReveal - 0.35, vY);
        float rb = exp(-pow((vY - uReveal) * 3.5, 2.0));
        float sb = exp(-pow((vY - uSweep) * 4.0, 2.0));
        float flick = 0.82 + 0.18 * sin(uTime * 1.7 + vRand * 50.0);
        float a = (built * (0.20 + 0.06 * vCat) * flick + rb * 1.0 + sb * 0.5 * built + 0.02) * k;
        vec3 col = mix(c, vec3(0.88, 0.97, 1.0), clamp(rb + sb * 0.7, 0.0, 1.0));
        gl_FragColor = vec4(col, a);
      }`,
  });
  scene.add(new THREE.LineSegments(g, lineMat));

  // Procedural ground grid + radar ring
  const groundSize = Math.max(60, maxR * 6);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(groundSize, groundSize).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({
      uniforms, ...additive, extensions: { derivatives: true },
      vertexShader: /* glsl */`
        varying vec3 vW;
        void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */`
        uniform float uRing; varying vec3 vW;
        float grid(vec2 p, float s) { vec2 q = p / s; vec2 gg = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(gg.x, gg.y), 1.0); }
        void main() {
          float r = length(vW.xz);
          float fade = 1.0 - smoothstep(${f(5 * S)}, ${f(30 * S)}, r);
          float gl = grid(vW.xz, ${f(G1)}) * 0.22 + grid(vW.xz, ${f(G2)}) * 0.45;
          float ring = exp(-pow((r - uRing) * ${f(1.1 / S)}, 2.0)) * (1.0 - smoothstep(${f(3 * S)}, ${f(20 * S)}, uRing));
          float glow = exp(-r * r / ${f(60 * S * S)}) * 0.22;
          vec3 col = vec3(0.22, 0.50, 1.0) * (gl + glow) + vec3(0.45, 0.88, 1.0) * ring * 0.7;
          gl_FragColor = vec4(col, fade);
        }`,
    })
  );
  scene.add(ground);

  // IoT sensor nodes on windows / installations
  const sensors = [];
  const cand = [];
  for (let e = 0; e < n; e++) if (cats[e] === 1 || cats[e] === 2) cand.push(e);
  const want = Math.min(64, cand.length);
  for (let k = 0; k < want; k++) {
    const e = cand[(Math.random() * cand.length) | 0];
    const v = e * 2 + (Math.random() < 0.5 ? 0 : 1);
    sensors.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sensors, 3));
  sg.setAttribute('aPhase', new THREE.Float32BufferAttribute(sensors.filter((_, i) => i % 3 === 0).map(() => Math.random() * 6.28), 1));
  const sensorMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uPx: { value: renderer.getPixelRatio() } }, ...additive,
    vertexShader: /* glsl */`
      uniform float uTime, uPx; attribute float aPhase; varying float vA; varying float vY;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float p = 0.5 + 0.5 * sin(uTime * 2.2 + aPhase);
        vA = p; vY = position.y;
        gl_PointSize = (6.0 + 10.0 * p) * uPx * (${f(22 * S)} / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform float uReveal; varying float vA; varying float vY;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.18, 0.0, d), halo = smoothstep(0.5, 0.1, d) * 0.35;
        float on = step(vY, uReveal - 0.2);
        gl_FragColor = vec4(vec3(0.35, 1.0, 0.70), (core + halo) * (0.45 + 0.55 * vA) * on);
      }`,
  });
  scene.add(new THREE.Points(sg, sensorMat));

  // Data beams rising from a few sensors
  const beams = [], beamT = [];
  for (let k = 0; k < Math.min(10, sensors.length / 3); k++) {
    const i = ((Math.random() * sensors.length) / 3 | 0) * 3;
    const x = sensors[i], y = sensors[i + 1], z = sensors[i + 2];
    const top = H + (2 + Math.random() * 3) * Math.sqrt(S);
    beams.push(x, y, z, x, top, z); beamT.push(0, 1);
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute('position', new THREE.Float32BufferAttribute(beams, 3));
  bg.setAttribute('aT', new THREE.Float32BufferAttribute(beamT, 1));
  scene.add(new THREE.LineSegments(bg, new THREE.ShaderMaterial({
    uniforms, ...additive,
    vertexShader: `attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime, uReveal; varying float vT;
      void main(){ float d = smoothstep(0.75, 1.0, fract(vT * 5.0 - uTime * 0.8)); float on = step(${(H + 1).toFixed(2)}, uReveal);
        gl_FragColor = vec4(vec3(0.45, 0.9, 1.0), (0.10 + d * 0.7) * (1.0 - vT) * on); }`,
  })));

  // Floating data dust
  const dust = [];
  for (let k = 0; k < 360; k++) {
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * Math.max(14, maxR * 1.6);
    dust.push(Math.cos(a) * r, Math.random() * (H + 8), Math.sin(a) * r);
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3));
  const dustTop = H + 8;
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uPx: { value: renderer.getPixelRatio() } }, ...additive,
    vertexShader: `uniform float uTime, uPx; varying float vA;
      void main(){ vec3 p = position; p.y = mod(p.y + uTime * 0.25, ${dustTop.toFixed(2)});
        vA = sin(3.14159 * p.y / ${dustTop.toFixed(2)});
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = 2.2 * uPx * (${f(24 * S)} / -mv.z); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.5, 0.8, 1.0), smoothstep(0.5, 0.0, d) * 0.35 * vA); }`,
  });
  scene.add(new THREE.Points(dg, dustMat));

  /* ---------- Camera rig + interaction ---------- */
  const target = new THREE.Vector3(0, H * 0.42, 0);
  let yaw = 0.75, yawVel = reduce ? 0 : 0.10, pitch = 0.36, parX = 0, parY = 0;
  let dist = 30, dragging = false, lastX = 0, lastY = 0, dragVel = 0;
  const auto = reduce ? 0 : 0.10;

  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    parX = ((e.clientX - r.left) / r.width - 0.5); parY = ((e.clientY - r.top) / r.height - 0.5);
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    dragVel = dx * 0.006; yaw += dragVel;
    pitch = Math.min(0.9, Math.max(0.08, pitch + dy * 0.003));
    if (reduce) frame(performance.now());
  });
  const endDrag = () => { if (!dragging) return; dragging = false; yawVel = auto + dragVel * 20; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { parX = parY = 0; });

  /* ---------- Layout ---------- */
  function resize() {
    const w = root.clientWidth, h = root.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const wide = w > 900;
    const fit = (maxR * 1.25) / Math.tan((camera.fov * Math.PI) / 360);
    dist = wide ? fit * 1.12 : fit * (camera.aspect < 0.75 ? 1.75 : 1.3);
    if (wide) camera.setViewOffset(w, h, -w * 0.22, -h * 0.03, w, h);
    else camera.setViewOffset(w, h, 0, -h * 0.22, w, h);
    camera.updateProjectionMatrix();
    if (reduce) frame(performance.now());
  }
  new ResizeObserver(resize).observe(root);

  /* ---------- HUD ---------- */
  const hud = (k) => root.querySelector(`[data-hud="${k}"]`);
  const hudEdges = hud('edges'), hudYaw = hud('yaw'), hudScan = hud('scan'), hudBar = hud('scanbar');
  if (hudEdges) hudEdges.textContent = n.toLocaleString('en-US');

  /* ---------- Animation ---------- */
  let visible = true, running = false, t0 = performance.now(), prev = t0, first = true;
  const REVEAL = 3.4, SWEEP_EVERY = 7.5, SWEEP_DUR = 2.6;
  function frame(now) {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    const t = (now - t0) / 1000;
    uniforms.uTime.value = t;
    if (!reduce) {
      const k = Math.min(1, t / REVEAL);
      const ease = 1 - Math.pow(1 - k, 3);
      uniforms.uReveal.value = -1 + (H + 4) * ease;
      const st = (t - REVEAL - 1) % SWEEP_EVERY;
      uniforms.uSweep.value = t > REVEAL + 1 && st < SWEEP_DUR ? -1 + (H + 3) * (st / SWEEP_DUR) : -50;
      uniforms.uRing.value = (t * 4.0 * S) % (24 * S);
      if (!dragging) { yawVel += (auto - yawVel) * Math.min(1, dt * 1.5); yaw += yawVel * dt; }
      const pct = Math.round(k * 100);
      if (hudScan) hudScan.textContent = pct + '%';
      if (hudBar) hudBar.style.width = pct + '%';
    } else if (hudScan) { hudScan.textContent = '100%'; if (hudBar) hudBar.style.width = '100%'; }

    const p = pitch + parY * 0.08, y = yaw + parX * 0.12;
    camera.position.set(target.x + dist * Math.cos(p) * Math.sin(y), target.y + dist * Math.sin(p), target.z + dist * Math.cos(p) * Math.cos(y));
    camera.lookAt(target);
    renderer.render(scene, camera);
    if (hudYaw) hudYaw.textContent = (((y * 180 / Math.PI) % 360 + 360) % 360).toFixed(1).padStart(5, '0') + '°';
    if (first) { first = false; canvas.classList.add('is-ready'); root.classList.add('is-live'); }
  }
  function loop(now) {
    if (!visible || document.hidden) { running = false; return; }
    frame(now); requestAnimationFrame(loop);
  }
  function start() { if (!running && !reduce) { running = true; prev = performance.now(); requestAnimationFrame(loop); } }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(root);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  resize();
  frame(performance.now());
  start();
}
