/**
 * ============================================================================
 * NOSSO AMOR — 3 ANOS JUNTOS
 * Script Limpo, Funcional e Desacoplado
 * ============================================================================
 */

(function () {
  'use strict';

  const APP_CONFIG = {
    startDate: '2023-11-25T00:00:00'
  };

  /* --------------------------------------------------------------------------
     1. PLAYER MULTIMÍDIA NATIVO LOCAL (100% OFFLINE, SEM ERROS)
     -------------------------------------------------------------------------- */
  class LocalVideoJukebox {
    constructor() {
      this.video = document.querySelector('#nativeVideoPlayer');
      this.source = document.querySelector('#videoSource');
      this.titleEl = document.querySelector('#nowPlayingTitle');
      this.artistEl = document.querySelector('#nowPlayingArtist');
      this.buttons = document.querySelectorAll('.music-choice-btn');

      if (!this.video || !this.buttons.length) return;
      this.init();
    }

    init() {
      this.buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const src = btn.getAttribute('data-src');
          const title = btn.getAttribute('data-title');
          const artist = btn.getAttribute('data-artist');

          this.play(src, title, artist, btn);
        });
      });
    }

    play(src, title, artist, activeBtn) {
      if (!src) return;

      this.video.pause();
      if (this.source) {
        this.source.src = src;
      } else {
        this.video.src = src;
      }
      this.video.load();
      
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }

      if (this.titleEl) this.titleEl.textContent = title;
      if (this.artistEl) this.artistEl.textContent = artist;

      this.buttons.forEach((b) => b.classList.remove('is-active'));
      if (activeBtn) activeBtn.classList.add('is-active');
    }
  }

  /* --------------------------------------------------------------------------
     2. CONTADOR DE TEMPO JUNTOS
     -------------------------------------------------------------------------- */
  class RelationshipCounter {
    constructor(startDateString) {
      this.startDate = new Date(startDateString);
      this.yearsEl = document.querySelector('#counterYears');
      this.daysEl = document.querySelector('#counterDays');
      this.hoursEl = document.querySelector('#counterHours');
      this.minutesEl = document.querySelector('#counterMinutes');
      this.secondsEl = document.querySelector('#counterSeconds');

      if (!this.yearsEl) return;
      this.start();
    }

    start() {
      this.update();
      setInterval(() => this.update(), 1000);
    }

    update() {
      const now = new Date();
      const diffMs = Math.max(0, now - this.startDate);

      let years = now.getFullYear() - this.startDate.getFullYear();
      const m = now.getMonth() - this.startDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < this.startDate.getDate())) {
        years--;
      }
      years = Math.max(0, years);

      const totalDays = Math.floor(diffMs / 86400000);
      const hours = Math.floor((diffMs / 3600000) % 24);
      const minutes = Math.floor((diffMs / 60000) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      this.yearsEl.textContent = years;
      this.daysEl.textContent = totalDays.toLocaleString('pt-BR');
      this.hoursEl.textContent = String(hours).padStart(2, '0');
      this.minutesEl.textContent = String(minutes).padStart(2, '0');
      this.secondsEl.textContent = String(seconds).padStart(2, '0');
    }
  }

  /* --------------------------------------------------------------------------
     3. GERENCIADOR DO LIGHTBOX (Apenas Imagens Limpas)
     -------------------------------------------------------------------------- */
  class LightboxManager {
    constructor() {
      this.lightbox = document.querySelector('#royalLightbox');
      this.backdrop = document.querySelector('#lightboxBackdrop');
      this.closeBtn = document.querySelector('#lightboxCloseBtn');
      this.imageEl = document.querySelector('#lightboxImage');
      this.placeholderEl = document.querySelector('#lightboxPlaceholder');

      if (!this.lightbox) return;
      this.init();
    }

    init() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.close());
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.lightbox.classList.contains('is-open')) {
          this.close();
        }
      });

      document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const imageSrc = trigger.getAttribute('data-lightbox');
          this.open(imageSrc);
        });
      });
    }

    open(src) {
      if (src && src.trim() !== '') {
        this.imageEl.src = src;
        this.imageEl.style.display = 'block';
        this.placeholderEl.style.display = 'none';
      } else {
        this.imageEl.style.display = 'none';
        this.placeholderEl.style.display = 'block';
      }

      this.lightbox.classList.add('is-open');
      this.lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');

      if (this.closeBtn) {
        this.closeBtn.focus();
      }
    }

    close() {
      this.lightbox.classList.remove('is-open');
      this.lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }
  }

  /* --------------------------------------------------------------------------
     4. CARTA PESSOAL (Salva o que o próprio usuário escrever)
     -------------------------------------------------------------------------- */
  class LoveLetterManager {
    constructor() {
      this.storageKey = 'minha-carta-namoro';
      this.textarea = document.querySelector('#loveLetterInputText');
      this.saveBtn = document.querySelector('#saveLetterBtn');
      this.bodyText = document.querySelector('#parchmentBodyText');
      this.statusText = document.querySelector('#letterSaveStatus');

      if (!this.textarea || !this.saveBtn) return;
      this.init();
    }

    init() {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && saved.trim() !== '') {
        this.textarea.value = saved;
        this.renderText(saved);
      }

      this.saveBtn.addEventListener('click', () => this.save());
    }

    save() {
      const text = this.textarea.value.trim();
      if (text) {
        localStorage.setItem(this.storageKey, text);
        this.renderText(text);
        if (this.statusText) {
          this.statusText.textContent = 'Carta salva com sucesso!';
          setTimeout(() => {
            this.statusText.textContent = '';
          }, 3000);
        }
      }
    }

    renderText(text) {
      if (!this.bodyText) return;
      this.bodyText.innerHTML = '';
      const paragraphs = text.split('\n\n').filter((p) => p.trim() !== '');

      paragraphs.forEach((pText) => {
        const p = document.createElement('p');
        p.textContent = pText.trim();
        this.bodyText.appendChild(p);
      });
    }
  }

  /* --------------------------------------------------------------------------
     5. NAVEGAÇÃO & CABEÇALHO
     -------------------------------------------------------------------------- */
  class NavigationManager {
    constructor() {
      this.header = document.querySelector('#royalTopbar');
      this.toggleBtn = document.querySelector('#mobileMenuToggle');
      this.drawer = document.querySelector('#mobileDrawer');
      this.navLinks = document.querySelectorAll('.header-nav a, .header-drawer a');

      if (!this.header) return;
      this.init();
    }

    init() {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
          this.header.classList.add('is-scrolled');
        } else {
          this.header.classList.remove('is-scrolled');
        }
      });

      if (this.toggleBtn && this.drawer) {
        this.toggleBtn.addEventListener('click', () => {
          const isOpen = this.drawer.classList.contains('is-open');
          this.drawer.classList.toggle('is-open', !isOpen);
          this.drawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
          this.toggleBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        });

        this.navLinks.forEach((link) => {
          link.addEventListener('click', () => {
            this.drawer.classList.remove('is-open');
            this.drawer.setAttribute('aria-hidden', 'true');
            this.toggleBtn.setAttribute('aria-expanded', 'false');
          });
        });
      }
    }
  }

  /* --------------------------------------------------------------------------
     6. CANVAS DE PARTÍCULAS
     -------------------------------------------------------------------------- */
  class AmbientCanvas {
    constructor(canvasId) {
      this.canvas = document.querySelector(canvasId);
      if (!this.canvas) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animationFrameId = null;
      this.isActive = true;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isActive = false;
          if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        } else {
          this.isActive = true;
          this.loop();
        }
      });

      this.loop();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      const count = Math.min(45, Math.floor(window.innerWidth / 26));

      this.particles = Array.from({ length: count }, () => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.3 + 0.08,
        speedX: (Math.random() - 0.5) * 0.12,
        alpha: Math.random() * 0.45 + 0.15
      }));
    }

    loop() {
      if (!this.isActive) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#CBB17E';

      this.particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = this.canvas.height + 10;
          p.x = Math.random() * this.canvas.width;
        }

        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
  }

  /* --------------------------------------------------------------------------
     7. CELEBRAÇÃO DE PÉTALAS
     -------------------------------------------------------------------------- */
  class PetalBurst {
    static burst(amount = 25) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const colors = ['#6A2433', '#A47F46', '#B65F6D', '#EAD0D0', '#4A1521'];
      for (let i = 0; i < amount; i++) {
        const petal = document.createElement('span');
        petal.className = 'royal-petal';
        petal.textContent = i % 2 === 0 ? '❦' : '✦';
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.color = colors[Math.floor(Math.random() * colors.length)];
        petal.style.fontSize = `${14 + Math.random() * 18}px`;
        petal.style.animationDuration = `${5 + Math.random() * 4}s`;
        petal.style.animationDelay = `${Math.random() * 0.4}s`;
        petal.style.opacity = `${0.6 + Math.random() * 0.4}`;

        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 9500);
      }
    }
  }

  /* --------------------------------------------------------------------------
     8. INICIALIZAÇÃO
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const royalOpening = document.querySelector('#royalOpening');
    const enterExperienceBtn = document.querySelector('#enterExperienceBtn');

    if (royalOpening && enterExperienceBtn) {
      enterExperienceBtn.addEventListener('click', () => {
        royalOpening.classList.add('is-hidden');
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
          royalOpening.style.display = 'none';
        }, 800);
      });
    }

    new LightboxManager();
    new LocalVideoJukebox();
    new RelationshipCounter(APP_CONFIG.startDate);
    new LoveLetterManager();
    new NavigationManager();
    new AmbientCanvas('#ambientCanvas');

    const celebrateBurstBtn = document.querySelector('#celebrateBurstBtn');
    if (celebrateBurstBtn) {
      celebrateBurstBtn.addEventListener('click', () => {
        PetalBurst.burst(30);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  });
})();
