/**
 * ============================================================================
 * NOSSOS TRÊS ANOS — SCRIPT PRINCIPAL EDITORIAL & REAL
 * Arquitetura Modular, Clean Code, Separação de Preocupações & Acessibilidade
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CONFIGURAÇÃO GERAL DO SISTEMA (Fácil Manutenção)
     -------------------------------------------------------------------------- */
  const APP_CONFIG = {
    // Data de início do relacionamento: 25 de Novembro de 2023
    startDate: '2023-11-25T00:00:00',

    // Playlist de trilhas sonoras (configure seus arquivos na pasta music/)
    playlist: [
      {
        title: 'Nossa Canção Principal',
        artist: 'Trilha Especial dos Nossos Três Anos',
        src: 'music/song1.mp3',
        tag: 'Principal'
      },
      {
        title: 'Primeiro Encontro & Encanto',
        artist: 'Memória 01',
        src: 'music/memoria-01.mp3',
        tag: 'Memória'
      },
      {
        title: 'Nossas Viagens & Horizontes',
        artist: 'Memória 02',
        src: 'music/memoria-02.mp3',
        tag: 'Viagem'
      }
    ],

    // Estrelas do Céu das Memórias
    skyMemories: [
      {
        x: 18,
        y: 26,
        title: 'A Primeira Estrela',
        text: 'Guarda o momento exato em que percebi que seu sorriso iluminaria toda a minha vida.',
        glyph: '✦'
      },
      {
        x: 38,
        y: 62,
        title: 'A Estrela da Cumplicidade',
        text: 'Lembrança dos dias simples em que um abraço apertado era tudo de que precisávamos.',
        glyph: '✧'
      },
      {
        x: 58,
        y: 32,
        title: 'A Estrela das Viagens',
        text: 'O horizonte que descobrimos juntos e a certeza de que viajar com você é a melhor experiência.',
        glyph: '✦'
      },
      {
        x: 76,
        y: 68,
        title: 'A Estrela da Ternura',
        text: 'Seu jeito carinhoso e atencioso, que faz qualquer dia comum parecer um conto especial.',
        glyph: '✧'
      },
      {
        x: 88,
        y: 22,
        title: 'A Estrela dos Três Anos',
        text: 'A celebração dos nossos 1.096 dias juntos e o prelúdio de toda uma vida pela frente.',
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
     2. GERENCIADOR DE REPRODUÇÃO DE ÁUDIO (SoundtrackManager)
     -------------------------------------------------------------------------- */
  class SoundtrackManager {
    constructor(config) {
      this.playlist = config.playlist;
      this.currentIndex = 0;
      this.isPlaying = false;
      this.isMuted = false;
      this.previousVolume = 0.7;

      // Elementos do DOM
      this.audio = document.querySelector('#mainAudioPlayer');
      this.playPauseBtn = document.querySelector('#playPauseBtn');
      this.prevBtn = document.querySelector('#prevTrackBtn');
      this.nextBtn = document.querySelector('#nextTrackBtn');
      this.topbarAudioBtn = document.querySelector('#topbarAudioBtn');
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
      this.audio.volume = parseFloat(this.volumeSlider ? this.volumeSlider.value : 0.7);
      this.loadTrack(this.currentIndex, false);

      // Eventos de controles
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

      // Eventos do elemento de áudio
      this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
      this.audio.addEventListener('ended', () => this.nextTrack());
      this.audio.addEventListener('error', (e) => this.onAudioError(e));

      // Barra de progresso interativa
      if (this.progressBarWrap) {
        this.progressBarWrap.addEventListener('click', (e) => this.seek(e));
      }

      // Controle de volume
      if (this.volumeSlider) {
        this.volumeSlider.addEventListener('input', (e) => {
          this.setVolume(parseFloat(e.target.value));
        });
      }

      if (this.volumeToggleBtn) {
        this.volumeToggleBtn.addEventListener('click', () => this.toggleMute());
      }

      // Clique nos itens da playlist
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
      if (this.trackStatusTag) this.trackStatusTag.textContent = track.tag || 'Trilha Selecionada';

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
            // Se o arquivo não existir ou o navegador bloquear
            this.isPlaying = false;
            this.updatePlayPauseUI(false);
            if (this.trackStatusTag) {
              this.trackStatusTag.textContent = 'Aguardando arquivo de música em music/';
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
        const iconPlay = this.topbarAudioBtn.querySelector('.audio-icon--play');
        const iconPause = this.topbarAudioBtn.querySelector('.audio-icon--pause');
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
        this.trackStatusTag.textContent = 'Arquivo de áudio não encontrado na pasta music/';
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
        this.setVolume(this.previousVolume || 0.7);
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
     3. CONTADOR DE TEMPO JUNTOS (RelationshipCounter - Exatidão dos 3 Anos)
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

      // Cálculo de anos completos
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
     4. GERENCIADOR DO LIGHTBOX (Acessível e Universal)
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
      this.titleEl = document.querySelector('#lightboxTitle');
      this.descEl = document.querySelector('#lightboxDescription');
      this.lastFocusedElement = null;

      if (!this.lightbox) return;
      this.init();
    }

    init() {
      // Evento de fechar
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.close());
      }

      // Fechar com Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.lightbox.classList.contains('is-open')) {
          this.close();
        }
      });

      // Registrar gatilhos com data-lightbox
      document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const imageSrc = trigger.getAttribute('data-lightbox');
          const caption = trigger.getAttribute('data-caption') || '';
          const title = trigger.querySelector('.overlay-title, strong, h3')
            ? trigger.querySelector('.overlay-title, strong, h3').textContent
            : 'Memória Especial';

          this.open({
            src: imageSrc,
            title: title,
            description: caption,
            trigger: trigger
          });
        });
      });
    }

    open({ src, title, description, trigger }) {
      this.lastFocusedElement = trigger || document.activeElement;

      if (this.titleEl) this.titleEl.textContent = title;
      if (this.descEl) this.descEl.textContent = description;

      if (src && src.trim() !== '') {
        // Imagem real disponível
        this.imageEl.src = src;
        this.imageEl.alt = title;
        this.imageEl.style.display = 'block';
        this.placeholderEl.style.display = 'none';
      } else {
        // Placeholder elegante para fotos futuras
        this.imageEl.style.display = 'none';
        this.placeholderEl.style.display = 'block';
        if (this.placeholderTitle) this.placeholderTitle.textContent = title;
        if (this.placeholderText) {
          this.placeholderText.textContent = description || 'Adicione a sua fotografia neste espaço para eternizar mais um instante dos nossos três anos.';
        }
      }

      this.lightbox.classList.add('is-open');
      this.lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');

      // Foco para acessibilidade
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
     5. CARTA DE AMOR REAL (Leitura, Edição & Persistência Segura)
     -------------------------------------------------------------------------- */
  class LoveLetterManager {
    constructor() {
      this.storageKey = 'royal-love-letter-v2';
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
        `Hoje comemoramos três anos desde o dia em que nossos caminhos se uniram para sempre. Quando olho para trás, para aquele 25 de novembro de 2023, vejo com clareza como cada dia ao seu lado superou qualquer expectativa que meu coração já teve.\n\n` +
        `Você é a mulher mais maravilhosa que o destino poderia ter me presenteado: inteligente, delicada, forte e dona do sorriso mais lindo do mundo. Nossas conversas, nossas viagens a resorts, nossos momentos de descanso e até os silêncios compartilhados me provam, a cada amanhecer, que o amor verdadeiro é o nosso maior tesouro.\n\n` +
        `Obrigado por ser minha parceira, minha confidente e a verdadeira princesa da minha vida. Que esses três anos sejam apenas as primeiras páginas de um livro lindo e infinito que continuaremos escrevendo juntos.`;

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
        this.showStatus('Carta selada e salva com sucesso!');
        this.switchMode('view');
      }
    }

    restoreDefault() {
      if (confirm('Deseja restaurar a carta original de celebração dos 3 anos?')) {
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

      // Fechamento nobre
      const closing = document.createElement('p');
      closing.className = 'parchment-closing';
      closing.innerHTML = 'Com todo o meu amor e admiração eterna,<br><strong>Para sempre seu. ❤️</strong>';
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
     6. CÉU DAS MEMÓRIAS (Constelações Interativas)
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
            trigger: star
          });
        });

        this.container.appendChild(star);
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. MAPA INTERATIVO (Pontos Especiais)
     -------------------------------------------------------------------------- */
  class AffectionateMap {
    constructor() {
      this.mapContainer = document.querySelector('#interactiveMap');
      this.infoBox = document.querySelector('#mapInfoBox');

      if (!this.mapContainer || !this.infoBox) return;
      this.init();
    }

    init() {
      const pins = this.mapContainer.querySelectorAll('.map-pin');
      pins.forEach((pin) => {
        pin.addEventListener('click', () => {
          const place = pin.getAttribute('data-place');
          const desc = pin.getAttribute('data-desc');
          this.infoBox.innerHTML = `<strong>${place}:</strong> ${desc}`;
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     8. SISTEMA DE NAVEGAÇÃO & DRAWER MOBILE
     -------------------------------------------------------------------------- */
  class NavigationManager {
    constructor() {
      this.toggleBtn = document.querySelector('#mobileMenuToggle');
      this.drawer = document.querySelector('#mobileDrawer');
      this.navLinks = document.querySelectorAll('.royal-nav a, .mobile-drawer a');

      if (!this.toggleBtn || !this.drawer) return;
      this.init();
    }

    init() {
      this.toggleBtn.addEventListener('click', () => {
        const isOpen = this.drawer.classList.contains('is-open');
        this.drawer.classList.toggle('is-open', !isOpen);
        this.drawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
        this.toggleBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });

      // Fechar drawer ao clicar em links
      this.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          this.drawer.classList.remove('is-open');
          this.drawer.setAttribute('aria-hidden', 'true');
          this.toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. CANVAS DE PARTÍCULAS AMBIENTE OTIMIZADO (Com Pause em Background)
     -------------------------------------------------------------------------- */
  class AmbientCanvas {
    constructor(canvasId) {
      this.canvas = document.querySelector(canvasId);
      if (!this.canvas) return;

      // Respeitar preferência por redução de movimento
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

      // Pausar renderização quando a aba estiver em segundo plano
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
      const count = Math.min(60, Math.floor(window.innerWidth / 20));

      this.particles = Array.from({ length: count }, () => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.35 + 0.1,
        speedX: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15
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
     10. CELEBRAÇÃO DE PÉTALAS REAIS (PetalBurst - Otimizado e Seguro)
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
        petal.style.fontSize = `${14 + Math.random() * 20}px`;
        petal.style.animationDuration = `${5 + Math.random() * 4}s`;
        petal.style.animationDelay = `${Math.random() * 0.5}s`;
        petal.style.opacity = `${0.6 + Math.random() * 0.4}`;

        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 9500);
      }
    }
  }

  /* --------------------------------------------------------------------------
     11. INICIALIZAÇÃO DA APLICAÇÃO (App Bootstrap)
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Abertura Solene
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

    // 2. Lightbox
    const lightbox = new LightboxManager();

    // 3. Player de Trilha Sonora
    const soundtrack = new SoundtrackManager(APP_CONFIG);

    // 4. Contador dos Três Anos
    new RelationshipCounter(APP_CONFIG.startDate);

    // 5. Carta de Amor Real
    new LoveLetterManager();

    // 6. Céu das Memórias
    new CelestialSky('#celestialVault', APP_CONFIG.skyMemories, lightbox);

    // 7. Mapa Afetivo
    new AffectionateMap();

    // 8. Navegação e Mobile Drawer
    new NavigationManager();

    // 9. Canvas Ambiente
    new AmbientCanvas('#ambientCanvas');

    // 10. Botão Secreto de Mensagem Íntima
    const secretSealBtn = document.querySelector('#secretSealBtn');
    if (secretSealBtn) {
      secretSealBtn.addEventListener('click', () => {
        lightbox.open({
          src: '',
          title: APP_CONFIG.secretMessage.title,
          description: APP_CONFIG.secretMessage.text,
          trigger: secretSealBtn
        });
      });
    }

    // 11. Botão de Celebração de Pétalas
    const celebrateBurstBtn = document.querySelector('#celebrateBurstBtn');
    if (celebrateBurstBtn) {
      celebrateBurstBtn.addEventListener('click', () => {
        PetalBurst.burst(30);
      });
    }

    // 12. Intersection Observer para Revelação Suave (Scroll Reveal)
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
