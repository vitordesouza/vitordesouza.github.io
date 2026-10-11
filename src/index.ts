const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
const debug = (message: string, details?: unknown) => {
  if (import.meta.env.DEV) console.debug(`[site] ${message}`, details ?? '');
};

interface ThemeTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}
type ThemeDocument = Document & {
  startViewTransition?: (update: () => void) => ThemeTransition;
};

function initTheme() {
  const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle');
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!toggle) return;
  const sync = () => {
    const night = root.classList.contains('dark');
    toggle.setAttribute('aria-label', `Switch to ${night ? 'day' : 'night'} mode`);
    toggle.setAttribute('aria-pressed', String(night));
    if (meta) meta.content = night ? '#11110F' : '#F3F2EE';
  };
  sync();
  let transitioning = false;
  let revealAnimation: Animation | undefined;
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && revealAnimation?.playState === 'running') revealAnimation.finish();
  });
  toggle.addEventListener('click', async () => {
    if (transitioning) return;
    const night = !root.classList.contains('dark');
    const update = () => {
      root.classList.toggle('dark', night);
      sync();
      try {
        localStorage.setItem('mode', night ? 'night' : 'day');
      } catch (error) {
        debug('theme preference could not be saved', error);
      }
      debug('theme changed', { night });
    };
    const doc = document as ThemeDocument;
    if (reducedMotion.matches || !doc.startViewTransition) {
      update();
      return;
    }
    const { x, y, width, height } = toggle.getBoundingClientRect();
    const cx = x + width / 2;
    const cy = y + height / 2;
    const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    transitioning = true;
    try {
      const transition = doc.startViewTransition(update);
      await transition.ready;
      if (!reducedMotion.matches) {
        revealAnimation = root.animate(
          { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`] },
          { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' },
        );
      }
      await transition.finished;
    } catch (error) {
      // A hidden tab or unsupported pseudo-element may skip the transition.
      if (root.classList.contains('dark') !== night) update();
      debug('theme reveal skipped', error);
    } finally {
      revealAnimation = undefined;
      transitioning = false;
    }
  });
}

function initClock() {
  const clock = document.querySelector<HTMLElement>('#lisbon-clock');
  if (!clock) return;
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const tick = () => { clock.textContent = formatter.format(new Date()); };
    tick();
    window.setInterval(tick, 1000);
    debug('Lisbon clock initialized');
  } catch (error) {
    clock.textContent = 'local time';
    debug('Lisbon clock unavailable', error);
  }
}

function initObservers() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const loops = document.querySelectorAll<HTMLElement>('[data-loop]');
  if (!('IntersectionObserver' in window)) {
    loops.forEach((element) => element.setAttribute('data-active', ''));
    debug('IntersectionObserver unavailable; content stays visible');
    return;
  }
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.setAttribute('data-in', '');
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  const syncMotion = () => {
    reveal.disconnect();
    if (reducedMotion.matches) {
      root.removeAttribute('data-motion');
    } else {
      root.setAttribute('data-motion', 'on');
      targets.forEach((element) => {
        if (!element.hasAttribute('data-in')) reveal.observe(element);
      });
    }
  };
  syncMotion();
  reducedMotion.addEventListener('change', syncMotion);
  const activity = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.toggleAttribute('data-active', entry.isIntersecting));
  });
  loops.forEach((element) => activity.observe(element));
  debug('observers initialized', { reveals: targets.length, loops: loops.length });
}

function initScribbles() {
  const highlights = document.querySelectorAll<HTMLElement>('.hl');
  const animations = new Map<HTMLElement, Animation>();
  const draw = (highlight: HTMLElement, duration: number, delay = 0) => {
    const scribble = highlight.querySelector<SVGSVGElement>('svg');
    const previous = animations.get(highlight);
    if (!scribble || reducedMotion.matches || previous?.playState === 'running') return;
    // Reveal the full curve independently of SVG scaling and round stroke caps.
    animations.set(highlight, scribble.animate(
      { clipPath: ['inset(-8px 100% -8px 0px)', 'inset(-8px -8px -8px -8px)'] },
      { duration, delay, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' },
    ));
  };
  const reveal = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      draw(entry.target as HTMLElement, 1200, 350);
      reveal?.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }) : undefined;
  highlights.forEach((highlight) => {
    if (highlight.closest('h1')) draw(highlight, 1200, 1150);
    else reveal?.observe(highlight);
    highlight.addEventListener('pointerenter', (event) => {
      if (finePointer.matches && event.pointerType !== 'touch') draw(highlight, 900);
    });
    // Pointer leave lets the current draw finish; it never restarts the entrance.
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) animations.forEach((animation) => {
      if (animation.playState === 'running') animation.finish();
    });
  });
  debug('scribbles initialized', { count: highlights.length });
}

function initPointer() {
  const dot = document.querySelector<HTMLElement>('#cursor');
  const label = document.querySelector<HTMLElement>('#cursor-label');
  const photo = document.querySelector<HTMLElement>('#floating-photo');
  const name = document.querySelector<HTMLElement>('#hero-name');
  const heading = document.querySelector('h1');
  if (!dot || !label || !photo || !name || !heading) return;
  let tx = -200, ty = -200, cx = -200, cy = -200, px = -200, py = -200;
  let frame = 0;
  let enabled = false;
  let currentLabel = '';
  const hidePhoto = () => {
    photo.removeAttribute('data-on');
    heading.removeAttribute('data-name-hover');
  };
  const hide = () => {
    dot.removeAttribute('data-on');
    hidePhoto();
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const loop = () => {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    px += (tx - px) * 0.1;
    py += (ty - py) * 0.1;
    const tilt = Math.max(-12, Math.min(12, (tx - px) * 0.15));
    photo.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -115%) rotate(${tilt}deg)`;
    frame = requestAnimationFrame(loop);
  };
  const sync = () => {
    enabled = finePointer.matches && !reducedMotion.matches;
    if (!enabled) hide();
  };
  sync();
  finePointer.addEventListener('change', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener('pointermove', (event) => {
    if (!enabled || event.pointerType === 'touch') return;
    tx = event.clientX;
    ty = event.clientY;
    if (!frame) {
      cx = px = tx;
      cy = py = ty;
      frame = requestAnimationFrame(loop);
    }
    dot.setAttribute('data-on', '');
    const hit = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor]') : null;
    const next = hit?.dataset.cursor ?? '';
    if (next !== currentLabel) {
      currentLabel = next;
      label.textContent = next;
      dot.toggleAttribute('data-label', Boolean(next));
    }
  }, { passive: true });
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  name.addEventListener('pointerenter', (event) => {
    if (!enabled || event.pointerType === 'touch') return;
    photo.setAttribute('data-on', '');
    heading.setAttribute('data-name-hover', '');
  });
  name.addEventListener('pointerleave', hidePhoto);
  debug('pointer initialized', { enabled });
}

function initCopy() {
  const button = document.querySelector<HTMLButtonElement>('#copy-email');
  const label = document.querySelector<HTMLElement>('#copy-label');
  if (!button || !label) return;
  let resetTimer = 0;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('joaovitor@boomich.pt');
      label.textContent = 'Copied';
      clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => { label.textContent = 'Copy'; }, 1800);
      debug('email copied');
    } catch (error) {
      debug('clipboard unavailable; opening mail client', error);
      window.location.href = 'mailto:joaovitor@boomich.pt';
    }
  });
}

debug('initializing', { reducedMotion: reducedMotion.matches, finePointer: finePointer.matches });
initTheme();
initClock();
initObservers();
initScribbles();
initPointer();
initCopy();
