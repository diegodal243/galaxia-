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

// Frases para tu mejor amiga
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

// Iniciar Experiencia
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

// 1. Estrellas lejanas (Fondo estático)
function crearFondoEstrellas() {
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'bg-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    bgStars.appendChild(star);
  }
}

// 2. Crear el anillo de estrellas brillantes y las fotos
function crearAroDeEstrellasYFotos() {
  // Configuración del aro (Disco de acreción)
  const radioInterno = 120; // Espacio para el hoyo negro
  const radioExterno = 450; // Hasta dónde llegan las estrellas
  
  // A. Crear 800 estrellas para formar el anillo de luz
  for (let i = 0; i < 800; i++) {
    const star = document.createElement('div');
    star.className = 'disk-star';
    
    // Distribución aleatoria en forma de anillo
    const angulo = Math.random() * Math.PI * 2;
    const radio = radioInterno + Math.random() * (radioExterno - radioInterno);
    
    const tx = Math.cos(angulo) * radio;
    const tz = Math.sin(angulo) * radio;
    const ty = (Math.random() - 0.5) * 20; // Grosor muy delgado del aro
    
    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);
    star.style.setProperty('--tz', `${tz}px`);
    
    // Tamaños y brillos aleatorios
    const size = Math.random() * 2.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    if(Math.random() > 0.8) star.style.backgroundColor = '#ffddaa'; // Algunas doradas
    
    accretionDisk.appendChild(star);
  }

  // B. Colocar las 15 fotos intercaladas dentro del anillo
  for (let i = 0; i < totalFotos; i++) {
    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-container';
    
    // Repartidas en un círculo perfecto dentro del anillo (radio de 300px)
    const angulo = (i / totalFotos) * Math.PI * 2;
    const radioFoto = 300;
    
    const tx = Math.cos(angulo) * radioFoto;
    const tz = Math.sin(angulo) * radioFoto;
    const ty = (Math.random() - 0.5) * 60; // Un poco más de libertad en altura
    
    photoWrapper.style.setProperty('--tx', `${tx}px`);
    photoWrapper.style.setProperty('--ty', `${ty}px`);
    photoWrapper.style.setProperty('--tz', `${tz}px`);
    
    photoWrapper.innerHTML = `<img src="assets/foto${i + 1}.jpg" alt="Recuerdo">`;
    
    // Evento de abrir carta
    photoWrapper.addEventListener('click', (e) => {
      e.stopPropagation(); 
      abrirCarta(`assets/foto${i + 1}.jpg`, mensajesFotos[i]);
    });

    accretionDisk.appendChild(photoWrapper);
  }
}

// 3. Motor de Animación Constante (CERO LAG)
let diskAngle = 0;
function iniciarRotacionAro() {
  diskAngle += 0.1; // Velocidad lenta y majestuosa
  // Actualiza la variable CSS, lo que hace que el aro gire y las fotos se auto-roten
  document.documentElement.style.setProperty('--diskAngle', `${diskAngle}deg`);
  requestAnimationFrame(iniciarRotacionAro);
}

// --- LOGICA DE LA CARTA ---
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

// --- CONTROLES DE CÁMARA ---
let rotX = -15; 
let rotY = 0; 
let zoom = 1;
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
  
  if(rotX > 75) rotX = 75; // No dejar que se voltee la cámara por completo
  if(rotX < -75) rotX = -75;

  // Actualizar variables CSS
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

scene.addEventListener('wheel', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  e.preventDefault();
  zoom += e.deltaY * -0.001;
  if (zoom < 0.4) zoom = 0.4; 
  if (zoom > 3) zoom = 3;
  document.documentElement.style.setProperty('--zoom', zoom);
}, { passive: false });
