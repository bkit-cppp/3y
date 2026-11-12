// ============================================================================
// 3 YEARS ANNIVERSARY — FULLSCREEN 3D / 4D HOLOGRAM EXPERIENCE (Three.js)
// No text overlays during 3D/4D motion; heartfelt wishes appear in the final letter
// ============================================================================

const PHOTO_PATHS = [
  'assets/photos/photo1.jpg',
  'assets/photos/photo2.jpg',
  'assets/photos/photo3.jpg',
  'assets/photos/photo4.jpg',
  'assets/photos/photo5.jpg'
];

const TOTAL_SCENES = 6; // 0 = Central 3D Heart Universe, 1..5 = 5 Couple Photos

// ============================================================================
// ROMANTIC WEB AUDIO SYNTHESIZER (Music Box + Warm Pad)
// ============================================================================
class RomanticMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.step = 0;
    this.melody = [
      { note: 69, bass: 53 },
      { note: 72, bass: 57 },
      { note: 76, bass: 60 },
      { note: 74, bass: 52 },
      { note: 69, bass: 50 },
      { note: 72, bass: 53 },
      { note: 69, bass: 46 },
      { note: 67, bass: 53 },
      { note: 65, bass: 48 },
      { note: 69, bass: 52 },
      { note: 72, bass: 55 },
      { note: 77, bass: 53 }
    ];
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  start() {
    if (this.isPlaying) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.playStep();
    this.intervalId = setInterval(() => this.playStep(), 1350);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  playStep() {
    if (!this.isPlaying || !this.ctx) return;
    const item = this.melody[this.step % this.melody.length];
    this.step++;
    this.triggerBell(this.midiToFreq(item.note), 0.14, 2.8);
    this.triggerBell(this.midiToFreq(item.bass), 0.08, 3.4);
  }

  triggerBell(freq, gainLevel, duration) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, now);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.15, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    subOsc.connect(subGain);
    subGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.05);
    subOsc.stop(now + duration + 0.05);
  }
}

// ============================================================================
// MAIN 3D SCENE INITIALIZATION
// ============================================================================
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020006, 0.016);

const camera = new THREE.PerspectiveCamera(
  54,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);
camera.position.set(0, 6.0, 22);

// Camera for 4-Sided 4D Pyramid Hologram mode
const pyramidCam = new THREE.PerspectiveCamera(48, 1, 0.1, 200);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ============================================================================
// LIGHTING
// ============================================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const corePinkLight = new THREE.PointLight(0xff2a85, 3.4, 38);
corePinkLight.position.set(0, 2.5, 0);
scene.add(corePinkLight);

const cyanBaseLight = new THREE.PointLight(0x00f2fe, 2.8, 32);
cyanBaseLight.position.set(0, -3.5, 0);
scene.add(cyanBaseLight);

const goldTopLight = new THREE.PointLight(0xffd166, 2.0, 32);
goldTopLight.position.set(0, 9, 4);
scene.add(goldTopLight);

// ============================================================================
// HOLOGRAM BASE PROJECTOR & ENERGY RINGS
// ============================================================================
const projectorGroup = new THREE.Group();
scene.add(projectorGroup);

const baseGeo = new THREE.CylinderGeometry(4.2, 5.2, 0.45, 64);
const baseMat = new THREE.MeshStandardMaterial({
  color: 0x0b0518,
  metalness: 0.85,
  roughness: 0.2,
  emissive: 0x00f2fe,
  emissiveIntensity: 0.28
});
const baseMesh = new THREE.Mesh(baseGeo, baseMat);
baseMesh.position.y = -4.2;
projectorGroup.add(baseMesh);

const holoRings = [];
const ringRadii = [3.6, 6.5, 9.8, 12.6];
ringRadii.forEach((radius, idx) => {
  const rGeo = new THREE.RingGeometry(radius - 0.06, radius + 0.06, 96);
  const rMat = new THREE.MeshBasicMaterial({
    color: idx % 2 === 0 ? 0x00f2fe : 0xff2a85,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: idx === 0 ? 0.85 : 0.42,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(rGeo, rMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -3.92 + idx * 0.02;
  projectorGroup.add(ring);
  holoRings.push(ring);
});

const beamUniforms = {
  uTime: { value: 0 }
};

const beamGeo = new THREE.CylinderGeometry(7.2, 2.8, 11.5, 64, 1, true);
const beamMat = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      float verticalFade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.3, 1.0, vUv.y));
      float scanline = sin((vUv.y * 80.0) - uTime * 4.5) * 0.5 + 0.5;
      float pulse = sin(uTime * 2.0) * 0.15 + 0.85;
      vec3 cyan = vec3(0.0, 0.95, 1.0);
      vec3 pink = vec3(1.0, 0.16, 0.52);
      vec3 col = mix(cyan, pink, vUv.y);
      float alpha = verticalFade * (0.12 + scanline * 0.14) * pulse;
      gl_FragColor = vec4(col, alpha);
    }
  `,
  uniforms: beamUniforms,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending
});
const beamMesh = new THREE.Mesh(beamGeo, beamMat);
beamMesh.position.y = 1.6;
projectorGroup.add(beamMesh);

// ============================================================================
// CENTRAL 3D HOLOGRAPHIC HEART
// ============================================================================
const centerHeartGroup = new THREE.Group();
centerHeartGroup.position.set(0, 1.4, 0);
scene.add(centerHeartGroup);

const heartShape = new THREE.Shape();
const hx = 0, hy = 0;
heartShape.moveTo(hx, hy + 0.65);
heartShape.bezierCurveTo(hx, hy + 0.65, hx - 0.15, hy + 1.25, hx - 0.85, hy + 1.25);
heartShape.bezierCurveTo(hx - 1.75, hy + 1.25, hx - 1.75, hy + 0.15, hx - 1.75, hy + 0.15);
heartShape.bezierCurveTo(hx - 1.75, hy - 0.55, hx - 1.05, hy - 1.25, hx, hy - 1.95);
heartShape.bezierCurveTo(hx + 1.05, hy - 1.25, hx + 1.75, hy - 0.55, hx + 1.75, hy + 0.15);
heartShape.bezierCurveTo(hx + 1.75, hy + 0.15, hx + 1.75, hy + 1.25, hx + 0.85, hy + 1.25);
heartShape.bezierCurveTo(hx + 0.25, hy + 1.25, hx, hy + 0.65, hx, hy + 0.65);

const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
  depth: 0.45,
  bevelEnabled: true,
  bevelSegments: 6,
  steps: 2,
  bevelSize: 0.22,
  bevelThickness: 0.22
});
heartGeo.center();

const holoHeartMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.2);
      float scan = sin(vWorldPos.y * 18.0 - uTime * 6.0) * 0.5 + 0.5;
      vec3 coreColor = vec3(1.0, 0.15, 0.55);
      vec3 rimColor = vec3(0.0, 0.95, 1.0);
      vec3 finalCol = mix(coreColor, rimColor, fresnel * 0.75) + vec3(scan * 0.18);
      float alpha = 0.58 + fresnel * 0.42;
      gl_FragColor = vec4(finalCol, alpha);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const heartMesh = new THREE.Mesh(heartGeo, holoHeartMat);
heartMesh.scale.set(0.95, 0.95, 0.95);
centerHeartGroup.add(heartMesh);

const wireHeartMat = new THREE.MeshBasicMaterial({
  color: 0xff85c0,
  wireframe: true,
  transparent: true,
  opacity: 0.24,
  blending: THREE.AdditiveBlending
});
const wireHeartMesh = new THREE.Mesh(heartGeo, wireHeartMat);
wireHeartMesh.scale.set(1.03, 1.03, 1.03);
centerHeartGroup.add(wireHeartMesh);

const orbitRing1 = new THREE.Mesh(
  new THREE.TorusGeometry(2.55, 0.03, 16, 100),
  new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.75 })
);
orbitRing1.rotation.x = Math.PI / 3;
centerHeartGroup.add(orbitRing1);

const orbitRing2 = new THREE.Mesh(
  new THREE.TorusGeometry(2.9, 0.025, 16, 100),
  new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.6 })
);
orbitRing2.rotation.y = Math.PI / 4;
orbitRing2.rotation.x = -Math.PI / 3;
centerHeartGroup.add(orbitRing2);

// ============================================================================
// FLOATING 3D HOLOGRAM PHOTO FRAMES (PURE VISUALS, NO TEXT LABELS)
// ============================================================================
const photoFramesGroup = new THREE.Group();
scene.add(photoFramesGroup);

const photoMeshes = [];
const frameAnchors = [];
const RING_RADIUS = 8.2;

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(255, 110, 199, 0.85)');
  grad.addColorStop(0.7, 'rgba(0, 242, 254, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

const textureLoader = new THREE.TextureLoader();
const photoSources =
  window.EMBEDDED_PHOTOS && window.EMBEDDED_PHOTOS.length === 5
    ? window.EMBEDDED_PHOTOS
    : PHOTO_PATHS;

photoSources.forEach((src, index) => {
  const angle = (index / photoSources.length) * Math.PI * 2;
  const x = Math.sin(angle) * RING_RADIUS;
  const z = Math.cos(angle) * RING_RADIUS;

  const frameHolder = new THREE.Group();
  frameHolder.position.set(x, 1.4, z);
  frameHolder.rotation.y = angle;
  photoFramesGroup.add(frameHolder);

  const tex = textureLoader.load(src);
  tex.encoding = THREE.sRGBEncoding;

  // Couple Photo Plane (Larger & vivid for full-screen mobile & 4D reflection)
  const cardWidth = 3.5;
  const cardHeight = 4.65;
  const photoGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
  const photoMat = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.DoubleSide
  });
  const photoMesh = new THREE.Mesh(photoGeo, photoMat);
  photoMesh.userData = { sceneIndex: index + 1 };
  frameHolder.add(photoMesh);
  photoMeshes.push(photoMesh);

  // Outer Neon Hologram Glass Border
  const borderGeo = new THREE.PlaneGeometry(cardWidth + 0.32, cardHeight + 0.32);
  const borderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: beamUniforms.uTime,
      uIndex: { value: index }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIndex;
      varying vec2 vUv;
      void main() {
        vec2 d = abs(vUv - 0.5) * 2.0;
        float edge = max(d.x, d.y);
        float glow = smoothstep(0.84, 1.0, edge);
        float wave = sin(uTime * 3.0 + uIndex * 1.3 + vUv.y * 12.0) * 0.5 + 0.5;
        vec3 cyan = vec3(0.0, 0.95, 1.0);
        vec3 pink = vec3(1.0, 0.16, 0.52);
        vec3 col = mix(cyan, pink, wave);
        gl_FragColor = vec4(col, glow * 0.95);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const borderMesh = new THREE.Mesh(borderGeo, borderMat);
  borderMesh.position.z = -0.02;
  frameHolder.add(borderMesh);

  // Holographic Energy Ring under each photo
  const pedestalRingGeo = new THREE.RingGeometry(1.5, 1.68, 48);
  const pedestalRingMat = new THREE.MeshBasicMaterial({
    color: index % 2 === 0 ? 0x00f2fe : 0xff2a85,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const pedRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
  pedRing.rotation.x = Math.PI / 2;
  pedRing.position.y = -2.65;
  frameHolder.add(pedRing);

  frameAnchors.push({
    group: frameHolder,
    angle,
    baseY: 1.4
  });
});

// ============================================================================
// STARFIELD & RISING HOLOGRAM SPARKLES
// ============================================================================
const glowTex = createGlowTexture();
const particleCount = 1400;
const pGeo = new THREE.BufferGeometry();
const pPositions = new Float32Array(particleCount * 3);
const pColors = new Float32Array(particleCount * 3);
const pSpeeds = new Float32Array(particleCount);

const colorPalette = [
  new THREE.Color(0xff2a85),
  new THREE.Color(0x00f2fe),
  new THREE.Color(0xffd166),
  new THREE.Color(0xffffff)
];

for (let i = 0; i < particleCount; i++) {
  const r = 2.0 + Math.random() * 32.0;
  const theta = Math.random() * Math.PI * 2;
  pPositions[i * 3] = Math.cos(theta) * r;
  pPositions[i * 3 + 1] = (Math.random() - 0.3) * 24;
  pPositions[i * 3 + 2] = Math.sin(theta) * r;

  const c = colorPalette[i % colorPalette.length];
  pColors[i * 3] = c.r;
  pColors[i * 3 + 1] = c.g;
  pColors[i * 3 + 2] = c.b;

  pSpeeds[i] = 0.45 + Math.random() * 1.25;
}

pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

const pMat = new THREE.PointsMaterial({
  size: 0.36,
  map: glowTex,
  vertexColors: true,
  transparent: true,
  opacity: 0.88,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(pGeo, pMat);
scene.add(particleSystem);

// ============================================================================
// CINEMATIC CAMERA DIRECTOR & AUTOMATIC FINAL LOVE LETTER REVEAL
// ============================================================================
let currentSceneIndex = 0; // 0 = overview, 1..5 = couple photos
let autoPlay = true;
let autoPlayTimer = 0;
const SCENE_DURATION = 5.5; // seconds per photo before transitioning
let isPyramidMode = false;
let hasShownFinalLetter = false;
let visitedAllPhotos = false;

const targetCameraPos = new THREE.Vector3(0, 5.5, 20);
const targetLookAt = new THREE.Vector3(0, 1.4, 0);
const currentLookAt = new THREE.Vector3(0, 1.4, 0);

let isDragging = false;
let prevPointer = { x: 0, y: 0 };
let userYawOffset = 0;
let userPitchOffset = 0;

function openFinalLetter() {
  document.getElementById('letterModal').classList.add('open');
}

function setScene(index) {
  currentSceneIndex = index;
  autoPlayTimer = 0;
  userYawOffset = 0;
  userPitchOffset = 0;
}

function computeCameraTargets(elapsedTime) {
  const isPortrait = window.innerWidth < window.innerHeight;
  if (currentSceneIndex === 0) {
    const orbitAngle = elapsedTime * 0.22 + userYawOffset;
    const radius = isPortrait ? 22.0 : 17.5;
    targetCameraPos.set(
      Math.sin(orbitAngle) * radius,
      (isPortrait ? 5.2 : 4.5) + Math.sin(elapsedTime * 0.45) * 1.1 + userPitchOffset * 4,
      Math.cos(orbitAngle) * radius
    );
    targetLookAt.set(0, 1.4, 0);
  } else {
    const anchor = frameAnchors[currentSceneIndex - 1];
    if (anchor) {
      const worldAngle = anchor.angle + photoFramesGroup.rotation.y + userYawOffset * 0.5;
      // Close, full-screen framing for each photo
      const camDist = isPortrait ? RING_RADIUS + 7.2 : RING_RADIUS + 5.0;
      const subtleSway = Math.sin(elapsedTime * 0.9) * 0.3;

      targetCameraPos.set(
        Math.sin(worldAngle + subtleSway * 0.04) * camDist,
        anchor.baseY + userPitchOffset * 2.5,
        Math.cos(worldAngle + subtleSway * 0.04) * camDist
      );

      targetLookAt.set(
        Math.sin(anchor.angle + photoFramesGroup.rotation.y) * RING_RADIUS,
        anchor.baseY,
        Math.cos(anchor.angle + photoFramesGroup.rotation.y) * RING_RADIUS
      );
    }
  }
}

// Touch / Pointer drag & tap-to-focus on photos
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button') || e.target.closest('.modal-card')) return;
  isDragging = true;
  prevPointer.x = e.clientX;
  prevPointer.y = e.clientY;
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - prevPointer.x;
  const dy = e.clientY - prevPointer.y;
  prevPointer.x = e.clientX;
  prevPointer.y = e.clientY;
  userYawOffset -= dx * 0.005;
  userPitchOffset = Math.max(-0.8, Math.min(0.8, userPitchOffset + dy * 0.004));
});

window.addEventListener('pointerup', () => {
  isDragging = false;
});

window.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.modal-card') || isPyramidMode) return;
  pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(photoMeshes);
  if (hits.length > 0) {
    const clickedScene = hits[0].object.userData.sceneIndex;
    if (clickedScene) {
      setScene(clickedScene);
    }
  }
});

// ============================================================================
// 4-SIDED 4D PYRAMID HOLOGRAM RENDERER (MAXIMIZED FOR MOBILE FULLSCREEN)
// ============================================================================
function renderPyramidHologramMode() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const minDim = Math.min(w, h);
  // Maximize each of the 4 hologram quadrants to fill the full screen width/height
  const quadSize = Math.floor(minDim * 0.43);
  const centerGap = Math.floor(minDim * 0.045);

  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);

  renderer.setScissorTest(true);
  renderer.setClearColor(0x000000, 1);
  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.clear();

  // Pure black void background for crisp reflection on acrylic pyramid
  projectorGroup.visible = false;

  const lookTarget = new THREE.Vector3(0, 1.4, 0);
  const camRadius = 13.2;

  const views = [
    {
      // TOP
      x: cx - Math.floor(quadSize / 2),
      y: cy + centerGap,
      up: [0, -1, 0],
      angleOffset: 0
    },
    {
      // BOTTOM
      x: cx - Math.floor(quadSize / 2),
      y: cy - centerGap - quadSize,
      up: [0, 1, 0],
      angleOffset: Math.PI
    },
    {
      // LEFT
      x: cx - centerGap - quadSize,
      y: cy - Math.floor(quadSize / 2),
      up: [1, 0, 0],
      angleOffset: -Math.PI / 2
    },
    {
      // RIGHT
      x: cx + centerGap,
      y: cy - Math.floor(quadSize / 2),
      up: [-1, 0, 0],
      angleOffset: Math.PI / 2
    }
  ];

  views.forEach((v) => {
    renderer.setViewport(v.x, v.y, quadSize, quadSize);
    renderer.setScissor(v.x, v.y, quadSize, quadSize);

    pyramidCam.aspect = 1;
    pyramidCam.updateProjectionMatrix();
    pyramidCam.position.set(
      Math.sin(v.angleOffset) * camRadius,
      1.4,
      Math.cos(v.angleOffset) * camRadius
    );
    pyramidCam.up.set(v.up[0], v.up[1], v.up[2]);
    pyramidCam.lookAt(lookTarget);

    renderer.render(scene, pyramidCam);
  });

  projectorGroup.visible = true;
  renderer.setScissorTest(false);
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  beamUniforms.uTime.value = elapsed;
  holoHeartMat.uniforms.uTime.value = elapsed;

  // Heartbeat pulse
  const heartBeat = 0.95 + Math.sin(elapsed * 4.2) * 0.06 + Math.pow(Math.sin(elapsed * 2.1), 6) * 0.08;
  heartMesh.scale.set(heartBeat, heartBeat, heartBeat);
  centerHeartGroup.rotation.y = elapsed * 0.65;
  orbitRing1.rotation.z = elapsed * 0.8;
  orbitRing2.rotation.x = elapsed * 0.6;

  holoRings.forEach((r, idx) => {
    r.rotation.z = elapsed * (idx % 2 === 0 ? 0.3 : -0.25);
  });

  // Rotate photo ring in overview or 4D Pyramid Mode
  if (currentSceneIndex === 0 || isPyramidMode) {
    photoFramesGroup.rotation.y += delta * 0.28;
  }

  frameAnchors.forEach((item, idx) => {
    item.group.position.y = item.baseY + Math.sin(elapsed * 1.8 + idx * 1.2) * 0.22;
  });

  // Rising hologram particles
  const posAttr = pGeo.attributes.position;
  for (let i = 0; i < particleCount; i++) {
    let py = posAttr.getY(i);
    py += pSpeeds[i] * delta;
    if (py > 14) py = -5;
    posAttr.setY(i, py);
  }
  posAttr.needsUpdate = true;
  particleSystem.rotation.y = elapsed * 0.05;

  // Auto-play progression through the 5 photos, then automatically reveal the Final Love Letter!
  if (autoPlay && !isPyramidMode) {
    autoPlayTimer += delta;
    if (autoPlayTimer >= SCENE_DURATION) {
      if (currentSceneIndex < 5) {
        setScene(currentSceneIndex + 1);
        if (currentSceneIndex === 5) {
          visitedAllPhotos = true;
        }
      } else {
        // Finished showing Photo 5 -> Return to Central Heart and open the Final Love Letter!
        setScene(0);
        if (visitedAllPhotos && !hasShownFinalLetter) {
          hasShownFinalLetter = true;
          setTimeout(() => {
            openFinalLetter();
          }, 1800);
        }
      }
    }
  }

  if (isPyramidMode) {
    renderPyramidHologramMode();
  } else {
    computeCameraTargets(elapsed);
    camera.position.lerp(targetCameraPos, 0.048);
    currentLookAt.lerp(targetLookAt, 0.065);
    camera.lookAt(currentLookAt);

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
}

animate();

// ============================================================================
// FULLSCREEN HELPER & UI CONTROLS
// ============================================================================
const musicBox = new RomanticMusicBox();

function triggerFullscreen() {
  const docEl = document.documentElement;
  const requestFs =
    docEl.requestFullscreen ||
    docEl.webkitRequestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.msRequestFullscreen;
  if (requestFs && !document.fullscreenElement && !document.webkitFullscreenElement) {
    requestFs.call(docEl).catch(() => {});
  }
}

function toggleFullscreen() {
  const docEl = document.documentElement;
  const isFs = document.fullscreenElement || document.webkitFullscreenElement;
  if (!isFs) {
    triggerFullscreen();
  } else {
    const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
    if (exitFs) exitFs.call(document).catch(() => {});
  }
}

function setPyramidMode(active) {
  isPyramidMode = active;
  document.body.classList.toggle('pyramid-active', active);
}

const introScreen = document.getElementById('introScreen');
const startExperienceBtn = document.getElementById('startExperienceBtn');
const start4DBtn = document.getElementById('start4DBtn');
const btnAutoPlay = document.getElementById('btnAutoPlay');
const btnPyramidMode = document.getElementById('btnPyramidMode');
const btnExitPyramid = document.getElementById('btnExitPyramid');
const btnToggleCrosshair = document.getElementById('btnToggleCrosshair');
const btnOpenLetterFrom4D = document.getElementById('btnOpenLetterFrom4D');
const btnAudio = document.getElementById('btnAudio');
const btnFullscreen = document.getElementById('btnFullscreen');
const btnLoveLetter = document.getElementById('btnLoveLetter');
const btnReplay3D = document.getElementById('btnReplay3D');
const btnSwitchTo4D = document.getElementById('btnSwitchTo4D');

// Start in 3D Fullscreen Movie Mode
startExperienceBtn.addEventListener('click', () => {
  triggerFullscreen();
  introScreen.classList.add('hidden');
  musicBox.start();
  setPyramidMode(false);
  hasShownFinalLetter = false;
  visitedAllPhotos = false;
  setScene(1);
});

// Start directly in 4D Pyramid Hologram Mode
start4DBtn.addEventListener('click', () => {
  triggerFullscreen();
  introScreen.classList.add('hidden');
  musicBox.start();
  setPyramidMode(true);
});

btnAutoPlay.addEventListener('click', () => {
  autoPlay = !autoPlay;
  btnAutoPlay.classList.toggle('active', autoPlay);
});

btnPyramidMode.addEventListener('click', () => {
  triggerFullscreen();
  setPyramidMode(true);
});

btnExitPyramid.addEventListener('click', () => {
  setPyramidMode(false);
});

btnToggleCrosshair.addEventListener('click', () => {
  const cross = document.getElementById('pyramidGuideCross');
  const hidden = cross.style.opacity === '0';
  cross.style.opacity = hidden ? '1' : '0';
  btnToggleCrosshair.textContent = hidden ? 'Ẩn Tâm' : 'Hiện Tâm';
});

btnOpenLetterFrom4D.addEventListener('click', () => {
  openFinalLetter();
});

btnAudio.addEventListener('click', () => {
  const playing = musicBox.toggle();
  btnAudio.classList.toggle('active', playing);
});

btnFullscreen.addEventListener('click', () => {
  toggleFullscreen();
});

btnLoveLetter.addEventListener('click', () => {
  openFinalLetter();
});

btnReplay3D.addEventListener('click', () => {
  document.getElementById('letterModal').classList.remove('open');
  setPyramidMode(false);
  hasShownFinalLetter = false;
  visitedAllPhotos = false;
  autoPlay = true;
  btnAutoPlay.classList.add('active');
  setScene(1);
});

btnSwitchTo4D.addEventListener('click', () => {
  document.getElementById('letterModal').classList.remove('open');
  triggerFullscreen();
  setPyramidMode(true);
});

document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-close');
    document.getElementById(targetId).classList.remove('open');
  });
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
