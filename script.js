// ─── ELEMENTOS ───────────────────────────────────────────────────────────────
const startScreen   = document.getElementById('start-screen');
const scene         = document.getElementById('scene');
const camera        = document.getElementById('camera');
const accretionDisk = document.getElementById('accretion-disk');
const bgMusic       = document.getElementById('bg-music');
const bgStars       = document.getElementById('bg-stars');
const letterModal   = document.getElementById('letter-modal');
const closeLetterBtn= document.getElementById('close-letter');
const letterImg     = document.getElementById('letter-img');
const letterText    = document.getElementById('letter-text');
const controlsHint  = document.getElementById('controls-hint');

// ─── DATOS ───────────────────────────────────────────────────────────────────
const totalFotos = 15;
const mensajesFotos = [
  "Gracias por estar siempre, en las buenas y en las malas.",
  "La amistad más bonita que la vida me pudo regalar es la tuya.",
  "Eres esa hermana que la vida me permitió elegir.",
  "Nuestras locuras son mis recuerdos favoritos.",
  "Aprecio cada segundo que pasamos juntas. ¡Gracias por tanto!",
  "Una mejor amiga es la que sabe tu historia y la sigue escribiendo contigo.",
  "Inseparables es poco para describir nuestra amistad.",
  "Eres la única que me entiende sin que yo diga nada.",
  "Mejor amiga: mi confidente, mi consejera, mi familia.",
  "Por mil años más de risas y aventuras compartidas.",
  "Tu amistad es un regalo que cuido todos los días.",
  "Amo tu sonrisa en esta foto, ilumina mi día.",
  "Eres mi persona favorita en el mundo.",
  "Gracias por no dejarme sola en ninguna de mis ocurrencias.",
  "¡Te adoro, mi mejor amiga del alma! ✨💖"
];

// ─── INICIO ───────────────────────────────────────────────────────────────────
startScreen.addEventListener('click', () => {
  startScreen.style.transition = 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
  startScreen.style.transform  = 'scale(1.1)';
  startScreen.style.opacity    = '0';

  bgMusic.play().catch(() => {});

  crearFondoEstrellas();
  crearDisco();
  iniciarRotacion();

  setTimeout(() => {
    startScreen.style.display = 'none';
    scene.classList.remove('hidden');
    controlsHint.classList.remove('hidden');
    camera.classList.add('entry-animation');

    // Quitar clase de animación de entrada para que los controles funcionen
    camera.addEventListener('animationend', () => {
      camera.classList.remove('entry-animation');
    }, { once: true });
  }, 900);
});

// ─── FONDO DE ESTRELLAS (box-shadow trick, 0 lag) ─────────────────────────────
function crearFondoEstrellas() {
  const shadows = [];
  for (let i = 0; i < 250; i++) {
    const x = Math.floor(Math.random() * 5000 - 2500);
    const y = Math.floor(Math.random() * 5000 - 2500);
    const r = Math.random();
    let color;
    if (r > 0.92)      color = '#ffddaa';
    else if (r > 0.82) color = '#aaddff';
    else if (r > 0.75) color = '#ffaacc';
    else               color = '#ffffff';
    const size = Math.random() > 0.9 ? '2px' : '1px';
    shadows.push(`${x}px ${y}px ${size} ${color}`);
  }
  bgStars.style.boxShadow = shadows.join(', ');
}

// ─── CONSTRUCCIÓN DEL DISCO ────────────────────────────────────────────────────
function crearDisco() {
  const C = 22;            // constante espiral de Fermat
  const totalPuntos = 500; // puntos de estrellas

  // 1. Estrellas de polvo
  for (let i = 1; i <= totalPuntos; i++) {
    const el = document.createElement('div');
    el.className = 'disk-star';

    const ang = i * 137.508 * (Math.PI / 180);
    const r   = 140 + C * Math.sqrt(i);
    const tx  = Math.cos(ang) * r;
    const tz  = Math.sin(ang) * r;
    const ty  = (Math.random() - 0.5) * 12;

    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--tz', `${tz}px`);

    const size = Math.random() * 3 + 0.8;
    el.style.width  = `${size}px`;
    el.style.height = `${size}px`;

    const rand = Math.random();
    const col  = rand > 0.75 ? '#ffcc88' : rand > 0.5 ? '#ff99bb' : rand > 0.3 ? '#ffaa00' : '#ffffff';
    el.style.backgroundColor = col;
    el.style.boxShadow = `0 0 ${Math.random() * 12 + 6}px ${col}`;

    accretionDisk.appendChild(el);
  }

  // 2. Las 15 fotos distribuidas a lo largo de la espiral
  //    Usamos un radio mínimo más grande para que estén DENTRO del aro visible
  //    y separadas del agujero negro
  for (let i = 1; i <= totalFotos; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'photo-container';

    // Espaciado uniforme: distribuimos en puntos 40..460 del total de 500
    const puntoMin  = 40;
    const puntoMax  = 460;
    const puntoBase = puntoMin + ((i - 1) / (totalFotos - 1)) * (puntoMax - puntoMin);
    const punto     = Math.round(puntoBase);

    const ang   = punto * 137.508 * (Math.PI / 180);
    const radio = 140 + C * Math.sqrt(punto);
    const tx    = Math.cos(ang) * radio;
    const tz    = Math.sin(ang) * radio;
    const ty    = (Math.random() - 0.5) * 8;

    wrapper.style.setProperty('--tx', `${tx}px`);
    wrapper.style.setProperty('--ty', `${ty}px`);
    wrapper.style.setProperty('--tz', `${tz}px`);

    const img = document.createElement('img');
    img.src = `assets/foto${i}.jpg`;
    img.alt = `Recuerdo ${i}`;

    wrapper.appendChild(img);

    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirCarta(`assets/foto${i}.jpg`, mensajesFotos[i - 1]);
    });

    accretionDisk.appendChild(wrapper);
  }
}

// ─── ROTACIÓN DEL DISCO ────────────────────────────────────────────────────────
let diskAngle = 0;
function iniciarRotacion() {
  diskAngle -= 0.06;
  document.documentElement.style.setProperty('--diskAngle', `${diskAngle}deg`);
  requestAnimationFrame(iniciarRotacion);
}

// ─── CARTA / MODAL ────────────────────────────────────────────────────────────
function abrirCarta(src, mensaje) {
  letterImg.src = src;
  letterText.textContent = mensaje;
  letterModal.classList.remove('hidden');
  requestAnimationFrame(() => letterModal.classList.add('show'));
}
function cerrarCarta() {
  letterModal.classList.remove('show');
  setTimeout(() => letterModal.classList.add('hidden'), 520);
}
closeLetterBtn.addEventListener('click', cerrarCarta);
letterModal.addEventListener('click', (e) => { if (e.target === letterModal || e.target.classList.contains('letter-backdrop')) cerrarCarta(); });

// ─── ESTADO DE CÁMARA ─────────────────────────────────────────────────────────
const cam = { rotX: -28, rotY: 0, zoomZ: 200, panX: 0, panY: 0 };

function aplicarCamara() {
  const r = document.documentElement;
  r.style.setProperty('--rotX',   `${cam.rotX}deg`);
  r.style.setProperty('--rotY',   `${cam.rotY}deg`);
  r.style.setProperty('--invRotX',`${-cam.rotX}deg`);
  r.style.setProperty('--invRotY',`${-cam.rotY}deg`);
  r.style.setProperty('--zoomZ',  `${cam.zoomZ}px`);
  r.style.setProperty('--panX',   `${cam.panX}px`);
  r.style.setProperty('--panY',   `${cam.panY}px`);
}

function clampCam() {
  cam.rotX = Math.max(-88, Math.min(88, cam.rotX));
  cam.zoomZ = Math.max(-3000, Math.min(1800, cam.zoomZ));
}

// ─── MOUSE: arrastrar = ROTAR, clic derecho = PANEAR ──────────────────────────
let drag = { active: false, mode: 'rotate', startX: 0, startY: 0 };

scene.addEventListener('contextmenu', (e) => e.preventDefault());

scene.addEventListener('mousedown', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  if (letterModal.classList.contains('show')) return;
  drag.active = true;
  drag.mode   = e.button === 2 ? 'pan' : 'rotate';
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  e.preventDefault();
});

scene.addEventListener('mousemove', (e) => {
  if (!drag.active) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  if (drag.mode === 'rotate') {
    cam.rotY += dx * 0.35;
    cam.rotX -= dy * 0.35;
    clampCam();
  } else {
    cam.panX += dx;
    cam.panY += dy;
  }
  aplicarCamara();
  drag.startX = e.clientX;
  drag.startY = e.clientY;
});

window.addEventListener('mouseup', () => { drag.active = false; });

// ─── RUEDA DEL MOUSE = ZOOM ───────────────────────────────────────────────────
scene.addEventListener('wheel', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  e.preventDefault();
  cam.zoomZ -= e.deltaY * 2.2;
  clampCam();
  aplicarCamara();
}, { passive: false });

// ─── TOUCH: 1 dedo = ROTAR, 2 dedos = PINCH ZOOM + PAN ───────────────────────
let touch = {
  prev1X: 0, prev1Y: 0,
  prevDist: 0,
  prevMidX: 0, prevMidY: 0,
  fingers: 0
};

function distancia(t1, t2) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

scene.addEventListener('touchstart', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  if (letterModal.classList.contains('show')) return;
  e.preventDefault();
  touch.fingers = e.touches.length;

  if (e.touches.length === 1) {
    touch.prev1X = e.touches[0].clientX;
    touch.prev1Y = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    touch.prevDist = distancia(e.touches[0], e.touches[1]);
    touch.prevMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    touch.prevMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  }
}, { passive: false });

scene.addEventListener('touchmove', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  e.preventDefault();

  if (e.touches.length === 1 && touch.fingers === 1) {
    // 1 dedo → ROTAR
    const dx = e.touches[0].clientX - touch.prev1X;
    const dy = e.touches[0].clientY - touch.prev1Y;
    cam.rotY += dx * 0.38;
    cam.rotX -= dy * 0.38;
    clampCam();
    touch.prev1X = e.touches[0].clientX;
    touch.prev1Y = e.touches[0].clientY;

  } else if (e.touches.length === 2) {
    // 2 dedos → PINCH ZOOM + PAN
    const dist = distancia(e.touches[0], e.touches[1]);
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

    const deltaDist = dist - touch.prevDist;
    cam.zoomZ += deltaDist * 4;

    cam.panX += midX - touch.prevMidX;
    cam.panY += midY - touch.prevMidY;

    clampCam();
    touch.prevDist = dist;
    touch.prevMidX = midX;
    touch.prevMidY = midY;
  }

  aplicarCamara();
}, { passive: false });

window.addEventListener('touchend', (e) => {
  touch.fingers = e.touches.length;
  if (e.touches.length === 1) {
    touch.prev1X = e.touches[0].clientX;
    touch.prev1Y = e.touches[0].clientY;
  }
});
