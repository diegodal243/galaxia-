const startScreen = document.getElementById('start-screen');
const scene = document.getElementById('scene');
const camera = document.getElementById('camera');
const accretionDisk = document.getElementById('accretion-disk');
const bgMusic = document.getElementById('bg-music');
const bgStars = document.getElementById('bg-stars');

const letterModal = document.getElementById('letter-modal');
const closeLetterBtn = document.getElementById('close-letter');
const letterImg = document.getElementById('letter-img');
const letterText = document.getElementById('letter-text');

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

startScreen.addEventListener('click', () => {
  startScreen.style.transform = 'scale(0)';
  startScreen.style.opacity = '0';
  
  bgMusic.play().catch(e => console.log("Audio no reproducido"));
  
  crearFondoEstrellas();
  crearAroDeEstrellasYFotos();
  iniciarRotacionAro();

  setTimeout(() => {
    startScreen.style.display = 'none';
    scene.classList.remove('hidden');
    camera.classList.add('entry-animation');
  }, 1000);
});

function crearFondoEstrellas() {
  for (let i = 0; i < 300; i++) {
    const star = document.createElement('div');
    star.className = 'bg-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    bgStars.appendChild(star);
  }
}

function crearAroDeEstrellasYFotos() {
  // EL ARO ES ENORME AHORA
  const radioInterno = 180; 
  const radioExterno = 1200; // ¡Casi 3 veces más grande!
  
  // A. Crear 1500 estrellas dispersas para formar el anillo de luz y polvo
  for (let i = 0; i < 1500; i++) {
    const star = document.createElement('div');
    star.className = 'disk-star';
    
    const angulo = Math.random() * Math.PI * 2;
    // Se agrupan un poco cerca del centro, pero se riegan hasta muy lejos
    const radio = radioInterno + Math.pow(Math.random(), 1.5) * (radioExterno - radioInterno);
    
    const tx = Math.cos(angulo) * radio;
    const tz = Math.sin(angulo) * radio;
    const ty = (Math.random() - 0.5) * 80; // Disco con volumen (grueso)
    
    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);
    star.style.setProperty('--tz', `${tz}px`);
    
    const size = Math.random() * 2.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    if(Math.random() > 0.8) star.style.backgroundColor = '#ffddaa'; 
    
    accretionDisk.appendChild(star);
  }

  // B. FOTOS REGADAS POR TODO EL ESPACIO
  for (let i = 0; i < totalFotos; i++) {
    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-container';
    
    // Ángulo aleatorio y distancia aleatoria entre 250px y 1000px
    const angulo = (i / totalFotos) * Math.PI * 2 + (Math.random());
    const radioFoto = 250 + Math.random() * 750; 
    
    const tx = Math.cos(angulo) * radioFoto;
    const tz = Math.sin(angulo) * radioFoto;
    const ty = (Math.random() - 0.5) * 120; // Algunas fotos flotan más arriba o abajo
    
    photoWrapper.style.setProperty('--tx', `${tx}px`);
    photoWrapper.style.setProperty('--ty', `${ty}px`);
    photoWrapper.style.setProperty('--tz', `${tz}px`);
    
    photoWrapper.innerHTML = `<img src="assets/foto${i + 1}.jpg" alt="Recuerdo">`;
    
    photoWrapper.addEventListener('click', (e) => {
      e.stopPropagation(); 
      abrirCarta(`assets/foto${i + 1}.jpg`, mensajesFotos[i]);
    });

    accretionDisk.appendChild(photoWrapper);
  }
}

let diskAngle = 0;
function iniciarRotacionAro() {
  diskAngle += 0.05; // Más lento por ser tan grande
  document.documentElement.style.setProperty('--diskAngle', `${diskAngle}deg`);
  requestAnimationFrame(iniciarRotacionAro);
}

// LOGICA DE LA CARTA
function abrirCarta(imgSrc, mensaje) {
  letterImg.src = imgSrc;
  letterText.textContent = mensaje;
  letterModal.classList.remove('hidden');
  setTimeout(() => letterModal.classList.add('show'), 10); 
}
closeLetterBtn.addEventListener('click', () => {
  letterModal.classList.remove('show');
  setTimeout(() => letterModal.classList.add('hidden'), 500);
});
letterModal.addEventListener('click', (e) => {
  if(e.target === letterModal) {
    letterModal.classList.remove('show');
    setTimeout(() => letterModal.classList.add('hidden'), 500);
  }
});

// --- CONTROLES DE CÁMARA (VISTA 90 GRADOS Y ZOOM REAL) ---
let rotX = -25; 
let rotY = 0; 
let zoomZ = -400; // Iniciamos un poco alejados
let isDragging = false;
let startX, startY;

scene.addEventListener('mousedown', (e) => {
  if (camera.classList.contains('entry-animation')) return; 
  isDragging = true; startX = e.clientX; startY = e.clientY;
});
scene.addEventListener('touchstart', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  isDragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
});

const moverCamara = (x, y) => {
  if (!isDragging || camera.classList.contains('entry-animation')) return;
  const deltaX = x - startX;
  const deltaY = y - startY;
  
  rotY += deltaX * 0.4; 
  rotX -= deltaY * 0.4; 
  
  // ¡AHORA PUEDES VER DESDE ARRIBA (90 GRADOS) O DESDE ABAJO (-90 GRADOS)!
  if(rotX > 90) rotX = 90; 
  if(rotX < -90) rotX = -90;

  document.documentElement.style.setProperty('--rotX', `${rotX}deg`);
  document.documentElement.style.setProperty('--rotY', `${rotY}deg`);
  document.documentElement.style.setProperty('--invRotX', `${-rotX}deg`);
  document.documentElement.style.setProperty('--invRotY', `${-rotY}deg`);
  
  startX = x; startY = y;
};

scene.addEventListener('mousemove', (e) => moverCamara(e.clientX, e.clientY));
scene.addEventListener('touchmove', (e) => moverCamara(e.touches[0].clientX, e.touches[0].clientY));

const detenerArrastre = () => isDragging = false;
window.addEventListener('mouseup', detenerArrastre);
window.addEventListener('touchend', detenerArrastre);

// ZOOM REAL EN 3D
scene.addEventListener('wheel', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  e.preventDefault();
  
  // Movemos la cámara en el Eje Z para volar entre las estrellas
  zoomZ -= e.deltaY * 1.5; 
  
  // Límites del viaje espacial
  if (zoomZ < -2500) zoomZ = -2500; // Lo más lejos que puedes ir
  if (zoomZ > 800) zoomZ = 800;    // Lo más cerca (puedes atravesar el hoyo negro)
  
  document.documentElement.style.setProperty('--zoomZ', `${zoomZ}px`);
}, { passive: false });
