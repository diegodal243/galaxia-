const startScreen = document.getElementById('start-screen');
const scene = document.getElementById('scene');
const camera = document.getElementById('camera');
const galaxy = document.getElementById('galaxy');
const bgMusic = document.getElementById('bg-music');
const starsContainer = document.getElementById('stars-container');

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

const frasesFlotantes = ["Inseparables ♾️", "Mejor Amiga 👯‍♀️", "Gracias por tanto 💖", "Locuras Juntas 🥰", "Siempre Leal 🤝"];

startScreen.addEventListener('click', () => {
  startScreen.style.transform = 'scale(0)';
  startScreen.style.opacity = '0';
  
  bgMusic.play().catch(e => console.log("Audio no reproducido"));
  crearEstrellas();
  crearUniverso();

  setTimeout(() => {
    startScreen.style.display = 'none';
    scene.classList.remove('hidden');
    camera.classList.add('entry-animation');
  }, 1000);
});

// Crear un mar de estrellas estáticas pero parpadeantes (optimizado para evitar lag)
function crearEstrellas() {
  const numEstrellas = 300; 
  for (let i = 0; i < numEstrellas; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2.5;
    const delay = Math.random() * 5;
    const duration = 2 + Math.random() * 4;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;

    starsContainer.appendChild(star);
  }
}

function crearUniverso() {
  for (let i = 0; i < totalFotos; i++) {
    const item = document.createElement('div');
    item.className = 'item photo';
    
    const phi = Math.acos(-1 + (2 * i) / totalFotos);
    const theta = Math.sqrt(totalFotos * Math.PI) * phi;
    const radio = 350; // Esfera más grande para que respiren las fotos
    
    const ry = (theta * 180) / Math.PI; 
    const ty = (radio * Math.cos(phi));
    const tz = radio * Math.sin(phi);

    item.style.setProperty('--ry', `${ry}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);
    item.style.animationDelay = `${i * 0.1}s`;

    item.innerHTML = `<img src="assets/foto${i + 1}.jpg" alt="Recuerdo">`;
    
    item.addEventListener('click', (e) => {
      e.stopPropagation(); 
      abrirCarta(`assets/foto${i + 1}.jpg`, mensajesFotos[i]);
    });

    galaxy.appendChild(item);
  }

  frasesFlotantes.forEach((frase, index) => {
    const item = document.createElement('div');
    item.className = 'item text';
    
    const angle = (index * (360 / frasesFlotantes.length));
    const ty = (Math.random() - 0.5) * 500;
    const tz = 400 + Math.random() * 50;

    item.style.setProperty('--ry', `${angle}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);
    item.style.animationDelay = `${(totalFotos * 0.1) + (index * 0.2)}s`;

    item.textContent = frase;
    galaxy.appendChild(item);
  });
}

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

// --- CONTROLES DE CÁMARA ANTI-LAG ---
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
  
  if(rotX > 60) rotX = 60;
  if(rotX < -60) rotX = -60;

  camera.style.setProperty('--rotX', `${rotX}deg`);
  camera.style.setProperty('--rotY', `${rotY}deg`);

  // ¡MAGIA! Actualizamos la rotación inversa en CSS para que las fotos y el hoyo negro siempre te miren
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
  camera.style.setProperty('--zoom', zoom);
});
