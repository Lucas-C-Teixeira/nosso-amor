/**
 * ============================================================================
 * NOSSOS TRÊS ANOS — SCRIPT PRINCIPAL EDITORIAL & REAL
 * Arquitetura Modular, Clean Code, Separação de Preocupações & Acessibilidade
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CONFIGURAÇÃO GERAL DO SISTEMA (Playlist & Memórias Celestes)
     -------------------------------------------------------------------------- */
  const APP_CONFIG = {
    // Data de início do relacionamento: 25 de Novembro de 2023
    startDate: '2023-11-25T00:00:00',

    // Playlist com as músicas selecionadas pelo usuário
    playlist: [
      {
        title: 'L-O-V-E',
        artist: 'Michael Bublé',
        src: 'music/love-michael-buble.mp3',
        tag: 'Romântica'
      },
      {
        title: 'The Way You Look Tonight',
        artist: 'Frank Sinatra',
        src: 'music/the-way-you-look-tonight.mp3',
        tag: 'Clássica'
      },
      {
        title: 'Pra Que Juízo',
        artist: 'Henrique & Juliano',
        src: 'music/pra-que-juizo.mp3',
        tag: 'Nosso Amor'
      },
      {
        title: 'Te Vivo',
        artist: 'Luan Santana',
        src: 'music/te-vivo.mp3',
        tag: 'Especial'
      },
      {
        title: 'Pra Sempre Com Você',
        artist: 'Jorge & Mateus',
        src: 'music/pra-sempre-com-voce.mp3',
        tag: 'Para Sempre'
      },
      {
        title: 'Os Anjos Cantam Nosso Amor',
        artist: 'Jorge & Mateus',
        src: 'music/os-anjos-cantam.mp3',
        tag: 'Celebração'
      }
    ],

    // Céu das Memórias (Único lugar com textos poéticos e afetivos)
    skyMemories: [
      {
        x: 16,
        y: 28,
        title: 'O Teu Sorriso',
        text: 'O seu sorriso tem o dom raro de acalmar qualquer dia difícil e me lembrar da sorte imensa que é ter você na minha vida.',
        glyph: '✦'
      },
      {
        x: 36,
        y: 64,
        title: 'Nossos Abraços',
        text: 'A paz de estar com você em silêncio e sentir que no seu abraço eu encontrei o meu lar mais seguro.',
        glyph: '✧'
      },
      {
        x: 55,
        y: 30,
        title: 'Nossas Viagens',
        text: 'Cada viagem que fizemos juntos, cada café da manhã sem pressa e os risos soltos se tornaram os melhores dias da minha história.',
        glyph: '✦'
      },
      {
        x: 74,
        y: 68,
        title: 'A Sua Doçura',
        text: 'A sua bondade, sua inteligência e o jeito carinhoso como cuida de nós me fazem admirar a mulher linda que você é a cada amanhecer.',
        glyph: '✧'
      },
      {
        x: 88,
        y: 22,
        title: 'Três Anos e Todo o Sempre',
        text: 'Três anos se passaram rápido como um suspiro bom. Se eu pudesse viver tudo de novo, escolheria você em cada detalhe, infinitas vezes.',
        glyph: '✦'
      }
    ],

    // Mensagem confidencial do selo secreto
    secretMessage: {
      title: 'Mensagem Confidencial',
      text: 'Se você encontrou este selo, queria te lembrar mais uma vez: você é o meu maior acerto, minha paz diária e o amor da minha vida. Três anos ao seu lado foram o presente mais lindo que eu poderia ter recebido.'
    }
  };

  /* --------------------------------------------------------------------------
     2. GERENCIADOR DO REPRODUTOR DE ÁUDIO (SoundtrackManager)
     -------------------------------------------------------------------------- */
  class SoundtrackManager {
    constructor(config) {
      this.playlist = config.playlist;
      this.currentIndex = 0;
      this.isPlaying = false;
      this.isMuted = false;
      this.previousVolume = 0.75;

      // Elementos do DOM
      this.audio = document.querySelector('#mainAudioPlayer');
      this.playPauseBtn = document.querySelector('#playPauseBtn');
      this.prevBtn = document.querySelector('#prevTrackBtn');
      this.nextBtn = document.querySelector('#nextTrackBtn');
      this.topbarAudioBtn = document.querySelector('#topbarAudioBtn');
      this.topbarTrackName = document.querySelector('#topbarTrackName');
      this.vinylDisk = document.querySelector('#vinylDisk');
      this.trackTitle = document.querySelector('#trackTitle');
      this.trackArtist = document.querySelector('#trackArtist');
      this.trackStatusTag = document.querySelector('#trackStatusTag');
      this.progressBarFill = document.querySelector('#progressBarFill');
      this.progressBarWrap = document.querySelector('#progressBarWrap');
      this.currentTimeLabel = document.querySelector('#currentTimeLabel');
      this.durationTimeLabel = document.querySelector('#durationTimeLabel');
      this.volumeSlider = document.querySelector('#volumeSlider');
      this.volumeToggleBtn = document.querySelector('#volumeToggleBtn');
      this.playlistList = document.querySelector('#playlistList');

      if (!this.audio) return;
      this.init();
    }

    init() {
      this.audio.volume = parseFloat(this.volumeSlider ? this.volumeSlider.value : 0.75);
      this.loadTrack(this.currentIndex, false);

      if (this.playPauseBtn) {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
      }

      if (this.topbarAudioBtn) {
        this.topbarAudioBtn.addEventListener('click', () => this.togglePlayPause());
      }

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prevTrack());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.nextTrack());
      }

      this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
      this.audio.addEventListener('ended', () => this.nextTrack());
      this.audio.addEventListener('error', () => this.onAudioError());

      if (this.progressBarWrap) {
        this.progressBarWrap.addEventListener('click', (e) => this.seek(e));
      }

      if (this.volumeSlider) {
        this.volumeSlider.addEventListener('input', (e) => {
          this.setVolume(parseFloat(e.target.value));
        });
      }

      if (this.volumeToggleBtn) {
        this.volumeToggleBtn.addEventListener('click', () => this.toggleMute());
      }

      if (this.playlistList) {
        const items = this.playlistList.querySelectorAll('.playlist-item');
        items.forEach((item) => {
          item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index, 10);
            if (!isNaN(index) && index !== this.currentIndex) {
              this.loadTrack(index, true);
            } else {
              this.togglePlayPause();
            }
          });
        });
      }
    }

    loadTrack(index, autoPlay = false) {
      if (index < 0 || index >= this.playlist.length) return;
      this.currentIndex = index;
      const track = this.playlist[index];

      if (this.trackTitle) this.trackTitle.textContent = track.title;
      if (this.trackArtist) this.trackArtist.textContent = track.artist;
      if (this.trackStatusTag) this.trackStatusTag.textContent = track.tag || 'Nossa Seleção Musical';
      if (this.topbarTrackName) this.topbarTrackName.textContent = track.title;

      this.audio.src = track.src;
      this.updatePlaylistUI();

      if (autoPlay) {
        this.play();
      } else {
        this.updatePlayPauseUI(false);
      }
    }

    togglePlayPause() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    play() {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updatePlayPauseUI(true);
          })
          .catch(() => {
            this.isPlaying = false;
            this.updatePlayPauseUI(false);
            if (this.trackStatusTag) {
              this.trackStatusTag.textContent = 'Adicione o MP3 em music/ para ouvir';
            }
          });
      }
    }

    pause() {
      this.audio.pause();
      this.isPlaying = false;
      this.updatePlayPauseUI(false);
    }

    prevTrack() {
      const newIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.loadTrack(newIndex, true);
    }

    nextTrack() {
      const newIndex = (this.currentIndex + 1) % this.playlist.length;
      this.loadTrack(newIndex, true);
    }

    updatePlayPauseUI(playing) {
      if (this.playPauseBtn) {
        const iconPlay = this.playPauseBtn.querySelector('.icon-play');
        const iconPause = this.playPauseBtn.querySelector('.icon-pause');
        if (iconPlay && iconPause) {
          iconPlay.style.display = playing ? 'none' : 'block';
          iconPause.style.display = playing ? 'block' : 'none';
        }
      }

      if (this.topbarAudioBtn) {
        this.topbarAudioBtn.classList.toggle('is-playing', playing);
        const iconPlay = this.topbarAudioBtn.querySelector('.icon-play');
        const iconPause = this.topbarAudioBtn.querySelector('.icon-pause');
        if (iconPlay && iconPause) {
          iconPlay.style.display = playing ? 'none' : 'block';
          iconPause.style.display = playing ? 'block' : 'none';
        }
      }

      if (this.vinylDisk) {
        this.vinylDisk.classList.toggle('is-spinning', playing);
      }
    }

    updatePlaylistUI() {
      if (!this.playlistList) return;
      const items = this.playlistList.querySelectorAll('.playlist-item');
      items.forEach((item, idx) => {
        const isActive = idx === this.currentIndex;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    onTimeUpdate() {
      if (!this.audio.duration || isNaN(this.audio.duration)) return;
      const current = this.audio.currentTime;
      const duration = this.audio.duration;
      const percent = (current / duration) * 100;

      if (this.progressBarFill) {
        this.progressBarFill.style.width = `${percent}%`;
      }
      if (this.progressBarWrap) {
        this.progressBarWrap.setAttribute('aria-valuenow', Math.round(percent));
      }
      if (this.currentTimeLabel) {
        this.currentTimeLabel.textContent = this.formatTime(current);
      }
    }

    onLoadedMetadata() {
      if (this.durationTimeLabel && !isNaN(this.audio.duration)) {
        this.durationTimeLabel.textContent = this.formatTime(this.audio.duration);
      }
    }

    onAudioError() {
      if (this.trackStatusTag) {
        this.trackStatusTag.textContent = 'Arquivo de música aguardando cópia em music/';
      }
      this.updatePlayPauseUI(false);
    }

    seek(event) {
      if (!this.audio.duration || isNaN(this.audio.duration)) return;
      const rect = this.progressBarWrap.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const width = rect.width;
      const fraction = Math.max(0, Math.min(1, clickX / width));
      this.audio.currentTime = fraction * this.audio.duration;
    }

    setVolume(val) {
      this.audio.volume = Math.max(0, Math.min(1, val));
      if (this.volumeSlider) this.volumeSlider.value = this.audio.volume;
      this.updateVolumeIcons(this.audio.volume === 0);
    }

    toggleMute() {
      if (this.audio.volume > 0) {
        this.previousVolume = this.audio.volume;
        this.setVolume(0);
      } else {
        this.setVolume(this.previousVolume || 0.75);
      }
    }

    updateVolumeIcons(muted) {
      if (!this.volumeToggleBtn) return;
      const volHigh = this.volumeToggleBtn.querySelector('.vol-high');
      const volMute = this.volumeToggleBtn.querySelector('.vol-mute');
      if (volHigh && volMute) {
        volHigh.style.display = muted ? 'none' : 'block';
        volMute.style.display = muted ? 'block' : 'none';
      }
    }

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  /* --------------------------------------------------------------------------
     3. CONTADOR DE TEMPO JUNTOS (3 Anos de Namoro)
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
     4. GERENCIADOR DO LIGHTBOX (Sem poluição de texto nas fotos comuns)
     -------------------------------------------------------------------------- */
  class LightboxManager {
    constructor() {
      this.lightbox = document.querySelector('#royalLightbox');
      this.backdrop = document.querySelector('#lightboxBackdrop');
      this.closeBtn = document.querySelector('#lightboxCloseBtn');
      this.imageEl = document.querySelector('#lightboxImage');
      this.placeholderEl = document.querySelector('#lightboxPlaceholder');
      this.placeholderTitle = document.querySelector('#lightboxPlaceholderTitle');
      this.placeholderText = document.querySelector('#lightboxPlaceholderText');
      this.detailsEl = document.querySelector('#lightboxDetails');
      this.titleEl = document.querySelector('#lightboxTitle');
      this.descEl = document.querySelector('#lightboxDescription');
      this.lastFocusedElement = null;

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

      // Fotografias normais (Galeria e Timeline): limpas, sem texto
      document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const imageSrc = trigger.getAttribute('data-lightbox');
          this.open({
            src: imageSrc,
            title: '',
            description: '',
            isMemory: false,
            trigger: trigger
          });
        });
      });
    }

    open({ src, title = '', description = '', isMemory = false, trigger }) {
      this.lastFocusedElement = trigger || document.activeElement;

      if (isMemory && title) {
        // Céu das Memórias ou Selo Secreto: exibe texto poético
        if (this.detailsEl) this.detailsEl.style.display = 'block';
        if (this.titleEl) this.titleEl.textContent = title;
        if (this.descEl) this.descEl.textContent = description;
      } else {
        // Fotografias normais: limpas e sem texto
        if (this.detailsEl) this.detailsEl.style.display = 'none';
      }

      if (src && src.trim() !== '') {
        this.imageEl.src = src;
        this.imageEl.alt = 'Fotografia do casal';
        this.imageEl.style.display = 'block';
        this.placeholderEl.style.display = 'none';
      } else {
        this.imageEl.style.display = 'none';
        this.placeholderEl.style.display = 'block';
        if (this.placeholderTitle) {
          this.placeholderTitle.textContent = title || 'Lembrança Especial';
        }
        if (this.placeholderText) {
          this.placeholderText.textContent = description || 'Espaço reservado para mais uma fotografia dos nossos três anos.';
        }
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

      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. CARTA DE AMOR REAL
     -------------------------------------------------------------------------- */
  class LoveLetterManager {
    constructor() {
      this.storageKey = 'royal-love-letter-v3';
      this.viewBtn = document.querySelector('#viewLetterModeBtn');
      this.editBtn = document.querySelector('#editLetterModeBtn');
      this.displayView = document.querySelector('#royalLetterDisplay');
      this.editorView = document.querySelector('#royalLetterEditor');
      this.textarea = document.querySelector('#loveLetterInputText');
      this.saveBtn = document.querySelector('#saveLetterBtn');
      this.restoreBtn = document.querySelector('#restoreLetterDefaultBtn');
      this.bodyText = document.querySelector('#parchmentBodyText');
      this.statusText = document.querySelector('#letterSaveStatus');

      this.defaultLetterText = 
        `Hoje completamos três anos de um amor que se renova a cada amanhecer. Quando fecho os olhos e me lembro daquele 25 de novembro de 2023, percebo com clareza o tamanho da bênção que foi ter você entrando na minha vida.\n\n` +
        `Você é a mulher mais maravilhosa que eu poderia sonhar em ter ao meu lado: carinhosa, inteligente, autêntica e dona do sorriso mais lindo deste mundo. Em cada viagem a resorts, em cada conversa longa ou nos dias mais calmos em que apenas descansamos juntos, você transforma qualquer momento comum em algo precioso.\n\n` +
        `Obrigado por ser a minha parceira de vida, minha confidente e a verdadeira princesa dos meus dias. Três anos são apenas o primeiro capítulo da história linda que ainda continuaremos construindo juntos.`;

      if (!this.displayView || !this.editorView) return;
      this.init();
    }

    init() {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && saved.trim() !== '') {
        this.renderText(saved);
        if (this.textarea) this.textarea.value = saved;
      } else {
        if (this.textarea) this.textarea.value = this.defaultLetterText;
      }

      if (this.viewBtn && this.editBtn) {
        this.viewBtn.addEventListener('click', () => this.switchMode('view'));
        this.editBtn.addEventListener('click', () => this.switchMode('edit'));
      }

      if (this.saveBtn) {
        this.saveBtn.addEventListener('click', () => this.saveLetter());
      }

      if (this.restoreBtn) {
        this.restoreBtn.addEventListener('click', () => this.restoreDefault());
      }
    }

    switchMode(mode) {
      if (mode === 'view') {
        this.displayView.style.display = 'block';
        this.editorView.style.display = 'none';
        this.viewBtn.classList.add('is-active');
        this.editBtn.classList.remove('is-active');
      } else {
        this.displayView.style.display = 'none';
        this.editorView.style.display = 'block';
        this.viewBtn.classList.remove('is-active');
        this.editBtn.classList.add('is-active');
        if (this.textarea) this.textarea.focus();
      }
    }

    saveLetter() {
      const text = this.textarea ? this.textarea.value.trim() : '';
      if (text) {
        localStorage.setItem(this.storageKey, text);
        this.renderText(text);
        this.showStatus('Carta salva com sucesso!');
        this.switchMode('view');
      }
    }

    restoreDefault() {
      if (confirm('Deseja restaurar a carta original dos três anos?')) {
        localStorage.removeItem(this.storageKey);
        if (this.textarea) this.textarea.value = this.defaultLetterText;
        this.renderText(this.defaultLetterText);
        this.showStatus('Carta original restaurada.');
        this.switchMode('view');
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

      const closing = document.createElement('p');
      closing.className = 'parchment-closing';
      closing.innerHTML = 'Com todo o meu amor, admiração e carinho eterno,<br><strong>Para sempre seu. ❤️</strong>';
      this.bodyText.appendChild(closing);
    }

    showStatus(msg) {
      if (!this.statusText) return;
      this.statusText.textContent = msg;
      setTimeout(() => {
        this.statusText.textContent = 'Salva com segurança neste dispositivo';
      }, 3000);
    }
  }

  /* --------------------------------------------------------------------------
     6. CÉU DAS MEMÓRIAS (Constelações Poéticas)
     -------------------------------------------------------------------------- */
  class CelestialSky {
    constructor(containerId, memories, lightbox) {
      this.container = document.querySelector(containerId);
      this.memories = memories;
      this.lightbox = lightbox;

      if (!this.container) return;
      this.render();
    }

    render() {
      this.container.innerHTML = '';
      this.memories.forEach((memory, idx) => {
        const star = document.createElement('button');
        star.className = 'celestial-star';
        star.style.left = `${memory.x}%`;
        star.style.top = `${memory.y}%`;
        star.setAttribute('type', 'button');
        star.setAttribute('aria-label', `Abrir ${memory.title}`);

        const glyph = document.createElement('span');
        glyph.className = 'star-glyph';
        glyph.textContent = memory.glyph || '✦';
        glyph.style.animationDelay = `${idx * 0.4}s`;
        star.appendChild(glyph);

        star.addEventListener('click', () => {
          this.lightbox.open({
            src: '',
            title: memory.title,
            description: memory.text,
            isMemory: true,
            trigger: star
          });
        });

        this.container.appendChild(star);
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. SISTEMA DE NAVEGAÇÃO & HEADER ELEGANTE
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
      // Efeito de rolagem no cabeçalho
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
     8. CANVAS DE PARTÍCULAS SUTIS
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
      const count = Math.min(50, Math.floor(window.innerWidth / 24));

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
     9. CELEBRAÇÃO DE PÉTALAS
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
     10. INICIALIZAÇÃO
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

    const lightbox = new LightboxManager();
    new SoundtrackManager(APP_CONFIG);
    new RelationshipCounter(APP_CONFIG.startDate);
    new LoveLetterManager();
    new CelestialSky('#celestialVault', APP_CONFIG.skyMemories, lightbox);
    new NavigationManager();
    new AmbientCanvas('#ambientCanvas');

    const secretSealBtn = document.querySelector('#secretSealBtn');
    if (secretSealBtn) {
      secretSealBtn.addEventListener('click', () => {
        lightbox.open({
          src: '',
          title: APP_CONFIG.secretMessage.title,
          description: APP_CONFIG.secretMessage.text,
          isMemory: true,
          trigger: secretSealBtn
        });
      });
    }

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
