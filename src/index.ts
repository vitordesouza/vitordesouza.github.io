const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
const debug = (message: string, details?: unknown) => {
  if (import.meta.env.DEV) console.debug(`[site] ${message}`, details ?? '');
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
    if (reducedMotion.matches || typeof document.startViewTransition !== 'function') {
      update();
      return;
    }
    const { x, y, width, height } = toggle.getBoundingClientRect();
    const cx = x + width / 2;
    const cy = y + height / 2;
    const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    transitioning = true;
    try {
      const transition = document.startViewTransition(update);
      await transition.ready;
      if (!reducedMotion.matches) {
        revealAnimation = root.animate(
          {
            clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`],
          },
          {
            duration: 600,
            easing: 'cubic-bezier(.16,1,.3,1)',
            pseudoElement: '::view-transition-new(root)',
          },
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
      timeZone: 'Europe/Lisbon',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => {
      clock.textContent = formatter.format(new Date());
    };
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
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-in', '');
        reveal.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  );
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
  const highlights = document.querySelectorAll<HTMLElement>('.highlight');
  const animations = new Map<HTMLElement, Animation>();
  const draw = (highlight: HTMLElement, duration: number, delay = 0) => {
    const scribble = highlight.querySelector<SVGSVGElement>('svg');
    const previous = animations.get(highlight);
    if (!scribble || reducedMotion.matches || previous?.playState === 'running') return;
    // Reveal the full curve independently of SVG scaling and round stroke caps.
    animations.set(
      highlight,
      scribble.animate(
        { clipPath: ['inset(-8px 100% -8px 0px)', 'inset(-8px -8px -8px -8px)'] },
        { duration, delay, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' },
      ),
    );
  };
  const reveal =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              draw(entry.target as HTMLElement, 1200, 350);
              reveal?.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
        )
      : undefined;
  highlights.forEach((highlight) => {
    if (highlight.closest('h1')) draw(highlight, 1200, 1150);
    else reveal?.observe(highlight);
    highlight.addEventListener('pointerenter', (event) => {
      if (finePointer.matches && event.pointerType !== 'touch') draw(highlight, 900);
    });
    // Pointer leave lets the current draw finish; it never restarts the entrance.
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches)
      animations.forEach((animation) => {
        if (animation.playState === 'running') animation.finish();
      });
  });
  debug('scribbles initialized', { count: highlights.length });
}

interface PointerState {
  x: number;
  y: number;
  velocityX: number;
  enabled: boolean;
}

function initBoomichReveal(pointer: PointerState, wake: () => void) {
  const link = document.querySelector<HTMLAnchorElement>('#boomich-link');
  const card = document.querySelector<HTMLElement>('#boomich-reveal');
  const base = document.querySelector<SVGPathElement>('#boomich-net-base');
  const loaded = document.querySelector<SVGPathElement>('#boomich-net-loaded');
  const load = document.querySelector<SVGRectElement>('#boomich-load');
  const readout = document.querySelector<HTMLElement>('#boomich-deflection');
  if (!link || !card || !base || !loaded || !load || !readout) return;

  const columns = 10;
  const rows = 5;
  const nodeCount = (columns + 1) * (rows + 1);
  const rest = new Float64Array(nodeCount * 2);
  const positions = new Float64Array(nodeCount * 2);
  const pinned = new Uint8Array(nodeCount);
  const memberCount = columns * (rows + 1) + rows * (columns + 1) + columns * rows;
  const members = new Uint16Array(memberCount * 2);
  let memberIndex = 0;
  const node = (column: number, row: number) => row * (columns + 1) + column;
  const addMember = (a: number, b: number) => {
    members[memberIndex++] = a;
    members[memberIndex++] = b;
  };
  // Allocate the grid and its connectivity once; frames only update coordinates and SVG strings.
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const index = node(column, row);
      rest[index * 2] = (column * 280) / columns;
      rest[index * 2 + 1] = (row * 140) / rows;
      pinned[index] = Number((column === 0 || column === columns) && (row === 0 || row === rows));
      if (column < columns) addMember(index, node(column + 1, row));
      if (row < rows) addMember(index, node(column, row + 1));
      if (column < columns && row < rows) {
        if ((column + row) % 2) addMember(index, node(column + 1, row + 1));
        else addMember(node(column + 1, row), node(column, row + 1));
      }
    }
  }

  let visible = false;
  let shown = false;
  let amplitude = 0;
  let cardX = 0;
  let cardY = 0;

  const renderNet = (loadX: number) => {
    let maxDeflection = 0;
    let loadedNode = -1;
    for (let index = 0; index < nodeCount; index++) {
      const x = rest[index * 2];
      const y = rest[index * 2 + 1];
      const dx = loadX - x;
      const dy = 64 - y;
      const distanceSquared = dx * dx + dy * dy;
      const force = pinned[index] ? 0 : amplitude * Math.exp(-distanceSquared / (2 * 46 * 46));
      const displacedX = x + (dx / Math.max(1, Math.sqrt(distanceSquared))) * force * 0.35;
      const displacedY = y + force * 0.9;
      positions[index * 2] = displacedX;
      positions[index * 2 + 1] = displacedY;
      const deflection = Math.hypot(displacedX - x, displacedY - y);
      if (deflection > maxDeflection) {
        maxDeflection = deflection;
        loadedNode = index;
      }
    }
    let basePath = '';
    let loadedPath = '';
    for (let index = 0; index < members.length; index += 2) {
      const a = members[index];
      const b = members[index + 1];
      const segment = `M${positions[a * 2].toFixed(1)} ${positions[a * 2 + 1].toFixed(1)}L${positions[b * 2].toFixed(1)} ${positions[b * 2 + 1].toFixed(1)}`;
      if (amplitude > 0.5 && (a === loadedNode || b === loadedNode)) loadedPath += segment;
      else basePath += segment;
    }
    base.setAttribute('d', basePath);
    loaded.setAttribute('d', loadedPath);
    load.setAttribute('x', loadedNode < 0 ? '-10' : (positions[loadedNode * 2] - 3).toFixed(1));
    load.setAttribute('y', loadedNode < 0 ? '-10' : (positions[loadedNode * 2 + 1] - 3).toFixed(1));
    readout.textContent = maxDeflection.toFixed(1);
  };
  renderNet(140);

  link.addEventListener('pointerenter', (event) => {
    if (!pointer.enabled || event.pointerType === 'touch') return;
    visible = true;
    cardX = pointer.x = event.clientX;
    cardY = pointer.y = event.clientY;
    card.setAttribute('data-on', '');
    if (!shown) {
      debug('boomich reveal first show');
      shown = true;
    }
    wake();
  });
  link.addEventListener('pointerleave', () => {
    visible = false;
    card.removeAttribute('data-on');
  });

  return {
    update() {
      if (!visible && amplitude === 0) return false;
      cardX += (pointer.x - cardX) * 0.12;
      cardY += (pointer.y - cardY) * 0.12;
      const lag = pointer.x - cardX;
      const targetAmplitude = visible ? Math.min(26, 6 + Math.abs(pointer.velocityX) * 1.4) : 0;
      amplitude += (targetAmplitude - amplitude) * 0.15;
      if (!visible && amplitude < 0.05) amplitude = 0;
      renderNet(Math.max(30, Math.min(250, 140 - lag * 0.9)));
      const tilt = Math.max(-10, Math.min(10, lag * 0.12)) - 3;
      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) translate(-50%, -118%) rotate(${tilt}deg)`;
      return visible || amplitude > 0;
    },
    hide() {
      visible = false;
      amplitude = 0;
      card.removeAttribute('data-on');
    },
  };
}

function initPointer() {
  const dot = document.querySelector<HTMLElement>('#cursor');
  const label = document.querySelector<HTMLElement>('#cursor-label');
  const photo = document.querySelector<HTMLElement>('#floating-photo');
  const name = document.querySelector<HTMLElement>('#hero-name');
  const heading = document.querySelector('h1');
  if (!dot || !label || !photo || !name || !heading) return;
  const pointer: PointerState = { x: -200, y: -200, velocityX: 0, enabled: false };
  let cursorX = -200,
    cursorY = -200;
  let photoX = -200,
    photoY = -200;
  let frame = 0;
  let photoVisible = false;
  let currentLabel = '';
  const boomich = initBoomichReveal(pointer, requestFrame);
  const hidePhoto = () => {
    photoVisible = false;
    photo.removeAttribute('data-on');
    heading.removeAttribute('data-name-hover');
  };
  const hide = () => {
    dot.removeAttribute('data-on');
    hidePhoto();
    boomich?.hide();
    pointer.velocityX = 0;
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const loop = () => {
    cursorX += (pointer.x - cursorX) * 0.2;
    cursorY += (pointer.y - cursorY) * 0.2;
    const cursorMoving = Math.hypot(pointer.x - cursorX, pointer.y - cursorY) > 0.1;
    if (!cursorMoving) {
      cursorX = pointer.x;
      cursorY = pointer.y;
    }
    dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    let photoMoving = false;
    if (photoVisible) {
      photoX += (pointer.x - photoX) * 0.1;
      photoY += (pointer.y - photoY) * 0.1;
      photoMoving = Math.hypot(pointer.x - photoX, pointer.y - photoY) > 0.1;
      if (!photoMoving) {
        photoX = pointer.x;
        photoY = pointer.y;
      }
      const tilt = Math.max(-12, Math.min(12, (pointer.x - photoX) * 0.15));
      photo.style.transform = `translate3d(${photoX}px, ${photoY}px, 0) translate(-50%, -115%) rotate(${tilt}deg)`;
    }
    const boomichMoving = boomich?.update() ?? false;
    pointer.velocityX *= 0.85;
    // All pointer effects share this loop and rest once their movement settles.
    frame = cursorMoving || photoMoving || boomichMoving ? requestAnimationFrame(loop) : 0;
  };
  function requestFrame() {
    if (!frame) frame = requestAnimationFrame(loop);
  }
  const sync = () => {
    pointer.enabled = finePointer.matches && !reducedMotion.matches;
    if (!pointer.enabled) hide();
    if (boomich) debug('boomich reveal enabled', { enabled: pointer.enabled });
  };
  sync();
  finePointer.addEventListener('change', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener(
    'pointermove',
    (event) => {
      if (!pointer.enabled || event.pointerType === 'touch') return;
      pointer.velocityX = event.clientX - pointer.x;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!dot.hasAttribute('data-on')) {
        cursorX = photoX = pointer.x;
        cursorY = photoY = pointer.y;
        pointer.velocityX = 0;
      }
      requestFrame();
      dot.setAttribute('data-on', '');
      const hit =
        event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor]') : null;
      const next = hit?.dataset.cursor ?? '';
      if (next !== currentLabel) {
        currentLabel = next;
        label.textContent = next;
        dot.toggleAttribute('data-label', Boolean(next));
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
  name.addEventListener('pointerenter', (event) => {
    if (!pointer.enabled || event.pointerType === 'touch') return;
    photoVisible = true;
    photoX = pointer.x = event.clientX;
    photoY = pointer.y = event.clientY;
    photo.setAttribute('data-on', '');
    heading.setAttribute('data-name-hover', '');
    requestFrame();
  });
  name.addEventListener('pointerleave', hidePhoto);
  debug('pointer initialized', { enabled: pointer.enabled });
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
      resetTimer = window.setTimeout(() => {
        label.textContent = 'Copy';
      }, 1800);
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
