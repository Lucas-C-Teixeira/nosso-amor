// DATA DO INICIO DO RELACIONAMENTO:
// Substitua "AAAA-MM-DD" pela data real. Exemplo: const dataInicio = "2022-06-12";
const dataInicio = "AAAA-MM-DD";

// CEU DAS MEMORIAS:
// Troque image por fotos em /images, text pelo texto da memoria e sound por um arquivo em /music.
const skyMemories = [
  { x: 14, y: 22, image: "FOTO_CEU_01", text: "A primeira estrela guarda uma memoria que nunca perdeu o brilho.", sound: "music/star-soft.mp3" },
  { x: 30, y: 54, image: "FOTO_CEU_02", text: "Essa lembra um dia em que tudo parecia exatamente no lugar.", sound: "music/star-soft.mp3" },
  { x: 52, y: 30, image: "FOTO_CEU_03", text: "Uma noite, um sorriso, uma certeza bonita.", sound: "music/star-soft.mp3" },
  { x: 72, y: 62, image: "FOTO_CEU_04", text: "Aqui mora uma lembrança que ainda aquece meu coração.", sound: "music/star-soft.mp3" },
  { x: 86, y: 18, image: "FOTO_CEU_05", text: "Nem toda estrela esta no ceu. Algumas caminham ao nosso lado.", sound: "music/star-soft.mp3" }
];

const opening = document.querySelector("#opening");
const enterButton = document.querySelector("#enterButton");
const bgMusic = document.querySelector("#backgroundMusic");
const memoryMusic = document.querySelector("#memoryMusic");
const starSound = document.querySelector("#starSound");
const musicToggle = document.querySelector("#musicToggle");
const modal = document.querySelector("#modal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const letterInput = document.querySelector("#loveLetterInput");
const letterPreview = document.querySelector("#loveLetterPreview");
const saveLetterButton = document.querySelector("#saveLetter");
const clearLetterButton = document.querySelector("#clearLetter");
let musicEnabled = false;
let experienceStarted = false;

function safePlay(audio) {
  audio.play().catch(() => {
    // O navegador pode bloquear audio ate o primeiro clique do usuario.
  });
}

function setMusicEnabled(enabled) {
  musicEnabled = enabled;
  if (enabled) {
    bgMusic.volume = 0.42;
    safePlay(bgMusic);
  } else {
    bgMusic.pause();
    memoryMusic.pause();
  }
}

function beginExperience() {
  if (experienceStarted) return;
  experienceStarted = true;
  opening.classList.add("is-hidden");
  document.body.classList.remove("no-scroll");
  setMusicEnabled(true);
  setTimeout(() => {
    opening.style.display = "none";
  }, 760);
}

enterButton.addEventListener("click", beginExperience);
enterButton.addEventListener("touchend", (event) => {
  event.preventDefault();
  beginExperience();
}, { passive: false });

musicToggle.addEventListener("click", () => {
  setMusicEnabled(!musicEnabled);
});

document.body.classList.add("no-scroll");

function openModal({ title = "Memória", image = "FOTO", text = "", song = "" }) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalImage.textContent = image.includes("/") ? "" : image;
  modalImage.style.backgroundImage = image.includes("/") ? `url("${image}")` : "";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  if (song) {
    bgMusic.pause();
    memoryMusic.src = song;
    memoryMusic.volume = 0.62;
    safePlay(memoryMusic);
  }
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  memoryMusic.pause();
  if (musicEnabled) safePlay(bgMusic);
}

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

document.querySelectorAll(".gallery-item").forEach((item, index) => {
  item.addEventListener("click", () => {
    openModal({
      title: `Foto ${index + 1}`,
      image: item.dataset.image,
      text: item.dataset.message
    });
  });
});

document.querySelectorAll(".memory-card").forEach((card) => {
  card.addEventListener("click", () => {
    openModal({
      title: card.dataset.title,
      image: card.dataset.image,
      text: card.dataset.text,
      song: card.dataset.song
    });
  });
});

const savedLetter = localStorage.getItem("love-letter-text") || "";

function updateLetterPreview() {
  const text = letterInput.value.trim();
  letterPreview.textContent = text || "Sua carta aparecerá aqui enquanto você escreve.";
  letterPreview.classList.toggle("is-empty", !text);
}

letterInput.value = savedLetter;
updateLetterPreview();

letterInput.addEventListener("input", updateLetterPreview);
saveLetterButton.addEventListener("click", () => {
  localStorage.setItem("love-letter-text", letterInput.value);
  saveLetterButton.textContent = "Carta salva";
  setTimeout(() => {
    saveLetterButton.textContent = "Salvar carta";
  }, 1600);
});

clearLetterButton.addEventListener("click", () => {
  letterInput.value = "";
  localStorage.removeItem("love-letter-text");
  updateLetterPreview();
  letterInput.focus();
});

function updateCounter() {
  const fallback = "2024-06-12";
  const configuredDate = dataInicio === "AAAA-MM-DD" ? fallback : dataInicio;
  const start = new Date(`${configuredDate}T00:00:00`);
  const now = new Date();
  const difference = Math.max(0, now - start);
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.querySelector("#days").textContent = days;
  document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCounter, 1000);
updateCounter();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const memorySky = document.querySelector("#memorySky");
skyMemories.forEach((memory, index) => {
  const star = document.createElement("button");
  star.className = "star";
  star.style.left = `${memory.x}%`;
  star.style.top = `${memory.y}%`;
  star.style.animationDelay = `${index * 280}ms`;
  star.setAttribute("aria-label", `Abrir memoria ${index + 1}`);
  star.addEventListener("click", () => {
    starSound.src = memory.sound;
    starSound.volume = 0.36;
    safePlay(starSound);
    openModal({
      title: `Estrela ${index + 1}`,
      image: memory.image,
      text: memory.text
    });
  });
  memorySky.appendChild(star);
});

function createHeart(amount = 1) {
  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "❤️" : "♥";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${16 + Math.random() * 30}px`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.opacity = `${0.55 + Math.random() * 0.45}`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8200);
  }
}

setInterval(() => createHeart(10), 12000);
document.querySelector("#heartBurst").addEventListener("click", () => createHeart(220));

document.querySelector("#secretButton").addEventListener("click", () => {
  openModal({
    title: "Mensagem secreta",
    image: "❤️",
    text: "Mesmo escondidinha, esta mensagem queria te lembrar: voce e o meu melhor acaso, minha escolha diaria e meu amor favorito."
  });
});

const canvas = document.querySelector("#particlesCanvas");
const context = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(120, Math.floor(window.innerWidth / 10)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.6,
    speed: Math.random() * 0.42 + 0.12,
    alpha: Math.random() * 0.7 + 0.18
  }));
}

function drawParticles() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    if (particle.y < -10) {
      particle.y = canvas.height + 10;
      particle.x = Math.random() * canvas.width;
    }
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 245, 210, ${particle.alpha})`;
    context.fill();
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawParticles();
