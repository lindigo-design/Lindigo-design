/*
 * Рідина в першому екрані: картинка з макета сама стає рідиною.
 * Основа симуляції: WebGL-Fluid-Simulation, Pavel Dobryakov (MIT), див. shaders.ts.
 *
 * Як це працює:
 *  1. Під полотном лежить звичайний <img> (постер). Його видно одразу.
 *  2. Полотно малює ту саму картинку. Поки зсув дорівнює нулю, кадр збігається з постером.
 *  3. Мишка додає лише швидкість. Рідина переносить зсув, і картинка тече.
 *  4. Зсув щокадру згасає (uRestore) — картинка збирається назад.
 */
import { config as C } from './config';
import * as S from './shaders';

type Theme = 'dark' | 'light';

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface Format {
  internalFormat: number;
  format: number;
}

interface ImageLayer {
  texture: WebGLTexture;
  box: [number, number, number, number];
  scale: [number, number];
  /** object-position картинки (0–1, y знизу) */
  pos: [number, number];
}

let started = false;

export function initHeroFluid(): void {
  if (started) return;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = hero?.querySelector<HTMLCanvasElement>('[data-fluid]');
  if (!hero || !canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return; // Немає WebGL — лишається картинка
  gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('EXT_color_buffer_half_float');

  started = true;
  const glc: WebGL2RenderingContext = gl;
  const heroEl: HTMLElement = hero;
  const canvasEl: HTMLCanvasElement = canvas;

  /* ---------- Формати текстур ---------- */
  function supportsFormat(internalFormat: number, format: number): boolean {
    const tex = glc.createTexture();
    glc.bindTexture(glc.TEXTURE_2D, tex);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.NEAREST);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.NEAREST);
    glc.texImage2D(glc.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, glc.HALF_FLOAT, null);
    const fbo = glc.createFramebuffer();
    glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
    glc.framebufferTexture2D(glc.FRAMEBUFFER, glc.COLOR_ATTACHMENT0, glc.TEXTURE_2D, tex, 0);
    const ok = glc.checkFramebufferStatus(glc.FRAMEBUFFER) === glc.FRAMEBUFFER_COMPLETE;
    glc.bindFramebuffer(glc.FRAMEBUFFER, null);
    glc.deleteFramebuffer(fbo);
    glc.deleteTexture(tex);
    return ok;
  }

  function pickFormat(candidates: Format[]): Format | null {
    return candidates.find((f) => supportsFormat(f.internalFormat, f.format)) ?? null;
  }

  const rgba: Format = { internalFormat: glc.RGBA16F, format: glc.RGBA };
  const formatRG = pickFormat([{ internalFormat: glc.RG16F, format: glc.RG }, rgba]);
  const formatR = pickFormat([{ internalFormat: glc.R16F, format: glc.RED }, { internalFormat: glc.RG16F, format: glc.RG }, rgba]);
  if (!formatRG || !formatR) {
    started = false;
    return; // Не вміємо малювати у float-текстури — лишається картинка
  }

  /* ---------- Програми ---------- */
  function compile(type: number, source: string): WebGLShader {
    const shader = glc.createShader(type)!;
    glc.shaderSource(shader, source);
    glc.compileShader(shader);
    if (!glc.getShaderParameter(shader, glc.COMPILE_STATUS)) {
      throw new Error(glc.getShaderInfoLog(shader) ?? 'shader error');
    }
    return shader;
  }

  class Program {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation> = {};

    constructor(vertex: WebGLShader, fragmentSource: string) {
      this.program = glc.createProgram()!;
      glc.attachShader(this.program, vertex);
      glc.attachShader(this.program, compile(glc.FRAGMENT_SHADER, fragmentSource));
      glc.bindAttribLocation(this.program, 0, 'aPosition');
      glc.linkProgram(this.program);
      if (!glc.getProgramParameter(this.program, glc.LINK_STATUS)) {
        throw new Error(glc.getProgramInfoLog(this.program) ?? 'link error');
      }
      const count = glc.getProgramParameter(this.program, glc.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const name = glc.getActiveUniform(this.program, i)!.name;
        this.uniforms[name] = glc.getUniformLocation(this.program, name)!;
      }
    }

    bind() {
      glc.useProgram(this.program);
    }
  }

  let programs: Record<string, Program>;
  try {
    const vertex = compile(glc.VERTEX_SHADER, S.baseVertex);
    programs = {
      clear: new Program(vertex, S.clearShader),
      splat: new Program(vertex, S.splatShader),
      advection: new Program(vertex, S.advectionShader),
      displacement: new Program(vertex, S.displacementShader),
      divergence: new Program(vertex, S.divergenceShader),
      curl: new Program(vertex, S.curlShader),
      vorticity: new Program(vertex, S.vorticityShader),
      pressure: new Program(vertex, S.pressureShader),
      gradientSubtract: new Program(vertex, S.gradientSubtractShader),
      display: new Program(vertex, S.displayShader),
    };
  } catch (error) {
    console.warn('[hero fluid] shader error, showing the static image', error);
    started = false;
    return; // Помилка шейдера — лишається картинка
  }
  const P = programs;

  /* ---------- Повноекранний прямокутник ---------- */
  glc.bindBuffer(glc.ARRAY_BUFFER, glc.createBuffer());
  glc.bufferData(glc.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), glc.STATIC_DRAW);
  glc.bindBuffer(glc.ELEMENT_ARRAY_BUFFER, glc.createBuffer());
  glc.bufferData(glc.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), glc.STATIC_DRAW);
  glc.vertexAttribPointer(0, 2, glc.FLOAT, false, 0, 0);
  glc.enableVertexAttribArray(0);

  function blit(target: FBO | null) {
    if (target) {
      glc.viewport(0, 0, target.width, target.height);
      glc.bindFramebuffer(glc.FRAMEBUFFER, target.fbo);
    } else {
      glc.viewport(0, 0, glc.drawingBufferWidth, glc.drawingBufferHeight);
      glc.bindFramebuffer(glc.FRAMEBUFFER, null);
    }
    glc.drawElements(glc.TRIANGLES, 6, glc.UNSIGNED_SHORT, 0);
  }

  /* ---------- Кадрові буфери ---------- */
  function createFBO(w: number, h: number, f: Format): FBO {
    glc.activeTexture(glc.TEXTURE0);
    const texture = glc.createTexture()!;
    glc.bindTexture(glc.TEXTURE_2D, texture);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
    glc.texImage2D(glc.TEXTURE_2D, 0, f.internalFormat, w, h, 0, f.format, glc.HALF_FLOAT, null);
    const fbo = glc.createFramebuffer()!;
    glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
    glc.framebufferTexture2D(glc.FRAMEBUFFER, glc.COLOR_ATTACHMENT0, glc.TEXTURE_2D, texture, 0);
    glc.viewport(0, 0, w, h);
    glc.clearColor(0, 0, 0, 1);
    glc.clear(glc.COLOR_BUFFER_BIT);
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        glc.activeTexture(glc.TEXTURE0 + id);
        glc.bindTexture(glc.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(w: number, h: number, f: Format): DoubleFBO {
    let a = createFBO(w, h, f);
    let b = createFBO(w, h, f);
    return {
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      get read() {
        return a;
      },
      get write() {
        return b;
      },
      swap() {
        [a, b] = [b, a];
      },
    };
  }

  function deleteFBO(f: FBO) {
    glc.deleteFramebuffer(f.fbo);
    glc.deleteTexture(f.texture);
  }

  function getResolution(resolution: number) {
    let aspect = glc.drawingBufferWidth / glc.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    return glc.drawingBufferWidth > glc.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
  }

  let dyeResolution = window.innerWidth < 768 ? C.DYE_RESOLUTION_MOBILE : C.DYE_RESOLUTION;
  let velocity: DoubleFBO;
  let displacement: DoubleFBO;
  let divergence: FBO;
  let curl: FBO;
  let pressure: DoubleFBO;
  let buffersReady = false;

  function initFramebuffers() {
    if (buffersReady) {
      [velocity.read, velocity.write, displacement.read, displacement.write, pressure.read, pressure.write, divergence, curl].forEach(deleteFBO);
    }
    const sim = getResolution(C.SIM_RESOLUTION);
    const dye = getResolution(dyeResolution);
    glc.disable(glc.BLEND);
    velocity = createDoubleFBO(sim.width, sim.height, formatRG!);
    displacement = createDoubleFBO(dye.width, dye.height, formatRG!);
    divergence = createFBO(sim.width, sim.height, formatR!);
    curl = createFBO(sim.width, sim.height, formatR!);
    pressure = createDoubleFBO(sim.width, sim.height, formatR!);
    buffersReady = true;
  }

  /* ---------- Картинки ---------- */
  const imageFor = (theme: Theme) => heroEl.querySelector<HTMLImageElement>(`[data-fluid-src="${theme}"]`);
  const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

  function whenLoaded(img: HTMLImageElement): Promise<boolean> {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve(true);
    return new Promise((resolve) => {
      img.addEventListener('load', () => resolve(true), { once: true });
      img.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  function uploadImage(img: HTMLImageElement): WebGLTexture {
    const texture = glc.createTexture()!;
    glc.activeTexture(glc.TEXTURE0);
    glc.bindTexture(glc.TEXTURE_2D, texture);
    glc.pixelStorei(glc.UNPACK_FLIP_Y_WEBGL, true);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
    glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, glc.RGBA, glc.UNSIGNED_BYTE, img);
    glc.pixelStorei(glc.UNPACK_FLIP_Y_WEBGL, false);
    return texture;
  }

  /** Рамка <img> у координатах полотна (y знизу) і масштаб object-fit: cover. */
  /** object-position у частках 0–1 (y знизу, як у текстурі). Підтримуються відсотки, як у Hero.astro */
  function objectPosition(img: HTMLImageElement): ImageLayer['pos'] {
    const [x = '50%', y = '50%'] = getComputedStyle(img).objectPosition.split(/\s+/);
    const part = (v: string) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5);
    return [part(x), 1 - part(y)];
  }

  function measure(img: HTMLImageElement): Pick<ImageLayer, 'box' | 'scale' | 'pos'> {
    const c = canvasEl.getBoundingClientRect();
    const r = img.getBoundingClientRect();
    const box: ImageLayer['box'] = [
      (r.left - c.left) / c.width,
      1 - (r.top - c.top + r.height) / c.height,
      r.width / c.width,
      r.height / c.height,
    ];
    const boxRatio = r.width / r.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const scale: ImageLayer['scale'] = boxRatio > imgRatio ? [1, imgRatio / boxRatio] : [boxRatio / imgRatio, 1];
    return { box, scale, pos: objectPosition(img) };
  }

  let image: ImageLayer | null = null;
  let prevImage: ImageLayer | null = null;
  let imageEl: HTMLImageElement | null = null;
  let mixStart = -Infinity;
  let themeUntil = -Infinity;

  /* ---------- Розмір полотна ---------- */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, C.MAX_DPR);
    const w = Math.max(1, Math.floor(canvasEl.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvasEl.clientHeight * dpr));
    if (canvasEl.width === w && canvasEl.height === h && buffersReady) return;
    canvasEl.width = w;
    canvasEl.height = h;
    initFramebuffers();
    if (image && imageEl) Object.assign(image, measure(imageEl));
    if (running) render();
  }

  /* ---------- Поштовхи ---------- */
  function splat(x: number, y: number, dx: number, dy: number) {
    if (!buffersReady) return;
    const aspect = canvasEl.width / canvasEl.height;
    P.splat.bind();
    glc.uniform1i(P.splat.uniforms.uTarget, velocity.read.attach(0));
    glc.uniform1f(P.splat.uniforms.aspectRatio, aspect);
    glc.uniform2f(P.splat.uniforms.point, x, y);
    glc.uniform3f(P.splat.uniforms.color, dx, dy, 0);
    let radius = C.SPLAT_RADIUS / 100;
    if (aspect > 1) radius *= aspect;
    glc.uniform1f(P.splat.uniforms.radius, radius);
    blit(velocity.write);
    velocity.swap();
  }

  /** Лівіше 45 % ширини сила плавно падає до нуля, щоб рідина не затікала під заголовок. */
  function mask(x: number) {
    if (window.innerWidth < C.MASK_MIN_WIDTH) return 1;
    const t = Math.min(1, Math.max(0, (x - C.MASK_FROM) / (C.MASK_TO - C.MASK_FROM)));
    return t * t * (3 - 2 * t);
  }

  function push(x: number, y: number, dxUv: number, dyUv: number, force = C.SPLAT_FORCE) {
    const aspect = canvasEl.width / canvasEl.height;
    if (aspect < 1) dxUv *= aspect;
    if (aspect > 1) dyUv /= aspect;
    const m = mask(x);
    if (m <= 0) return;
    splat(x, y, dxUv * force * m, dyUv * force * m);
  }

  const toUv = (clientX: number, clientY: number) => {
    const r = canvasEl.getBoundingClientRect();
    return { x: (clientX - r.left) / r.width, y: 1 - (clientY - r.top) / r.height };
  };

  let lastMove = -Infinity;
  let lastPointer: { x: number; y: number } | null = null;

  function move(clientX: number, clientY: number) {
    // Під відкритим меню рідина не реагує на мишку й дотик
    if (!running || menuOpen) return;
    const p = toUv(clientX, clientY);
    if (lastPointer) push(p.x, p.y, p.x - lastPointer.x, p.y - lastPointer.y);
    lastPointer = p;
    lastMove = performance.now();
  }

  // Слухаємо всю секцію: інакше текст і кнопки перекриють мишку
  heroEl.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') move(e.clientX, e.clientY);
  });
  heroEl.addEventListener('pointerleave', () => (lastPointer = null));
  // Телефон: дотик і прокрутка
  heroEl.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      if (t) lastPointer = toUv(t.clientX, t.clientY);
    },
    { passive: true },
  );
  heroEl.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    },
    { passive: true },
  );
  heroEl.addEventListener('touchend', () => (lastPointer = null), { passive: true });

  const noHover = window.matchMedia('(hover: none)');
  let lastScrollY = window.scrollY;
  let scrollQueued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!noHover.matches || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        const delta = Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        if (!running || delta === 0) return;
        // Слабкий поштовх угору
        const strength = Math.min(delta / window.innerHeight, 0.04);
        push(0.35 + Math.random() * 0.55, 0.2 + Math.random() * 0.5, 0, strength, C.SPLAT_FORCE / C.IDLE_FORCE_DIVIDER);
      });
    },
    { passive: true },
  );

  /* ---------- Крок симуляції ---------- */
  function step(dt: number, restore: number) {
    glc.disable(glc.BLEND);
    const tx = velocity.texelSizeX;
    const ty = velocity.texelSizeY;

    P.curl.bind();
    glc.uniform2f(P.curl.uniforms.texelSize, tx, ty);
    glc.uniform1i(P.curl.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    P.vorticity.bind();
    glc.uniform2f(P.vorticity.uniforms.texelSize, tx, ty);
    glc.uniform1i(P.vorticity.uniforms.uVelocity, velocity.read.attach(0));
    glc.uniform1i(P.vorticity.uniforms.uCurl, curl.attach(1));
    glc.uniform1f(P.vorticity.uniforms.curl, C.CURL);
    glc.uniform1f(P.vorticity.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    P.divergence.bind();
    glc.uniform2f(P.divergence.uniforms.texelSize, tx, ty);
    glc.uniform1i(P.divergence.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    P.clear.bind();
    glc.uniform1i(P.clear.uniforms.uTexture, pressure.read.attach(0));
    glc.uniform1f(P.clear.uniforms.value, C.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    P.pressure.bind();
    glc.uniform2f(P.pressure.uniforms.texelSize, tx, ty);
    glc.uniform1i(P.pressure.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < C.PRESSURE_ITERATIONS; i++) {
      glc.uniform1i(P.pressure.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    P.gradientSubtract.bind();
    glc.uniform2f(P.gradientSubtract.uniforms.texelSize, tx, ty);
    glc.uniform1i(P.gradientSubtract.uniforms.uPressure, pressure.read.attach(0));
    glc.uniform1i(P.gradientSubtract.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    P.advection.bind();
    glc.uniform2f(P.advection.uniforms.texelSize, tx, ty);
    const velocityId = velocity.read.attach(0);
    glc.uniform1i(P.advection.uniforms.uVelocity, velocityId);
    glc.uniform1i(P.advection.uniforms.uSource, velocityId);
    glc.uniform1f(P.advection.uniforms.dt, dt);
    glc.uniform1f(P.advection.uniforms.dissipation, C.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    P.displacement.bind();
    glc.uniform2f(P.displacement.uniforms.texelSize, tx, ty);
    glc.uniform1i(P.displacement.uniforms.uVelocity, velocity.read.attach(0));
    glc.uniform1i(P.displacement.uniforms.uDisp, displacement.read.attach(1));
    glc.uniform1f(P.displacement.uniforms.dt, dt);
    glc.uniform1f(P.displacement.uniforms.restore, restore);
    glc.uniform1f(P.displacement.uniforms.strength, C.DISPLACEMENT_STRENGTH);
    blit(displacement.write);
    displacement.swap();
  }

  function render() {
    if (!image) return;
    const now = performance.now();
    const t = Math.min(1, (now - mixStart) / (C.THEME_BLEND * 1000));
    const mix = prevImage ? t * t * (3 - 2 * t) : 1;

    P.display.bind();
    const u = P.display.uniforms;
    glc.uniform1i(u.uDisp, displacement.read.attach(0));
    glc.activeTexture(glc.TEXTURE1);
    glc.bindTexture(glc.TEXTURE_2D, image.texture);
    glc.uniform1i(u.uImage, 1);
    glc.uniform4f(u.uBox, ...image.box);
    glc.uniform2f(u.uScale, ...image.scale);
    glc.uniform2f(u.uPos, ...image.pos);
    const prev = prevImage ?? image;
    glc.activeTexture(glc.TEXTURE2);
    glc.bindTexture(glc.TEXTURE_2D, prev.texture);
    glc.uniform1i(u.uPrevImage, 2);
    glc.uniform4f(u.uPrevBox, ...prev.box);
    glc.uniform2f(u.uPrevScale, ...prev.scale);
    glc.uniform2f(u.uPrevPos, ...prev.pos);
    glc.uniform1f(u.uMix, mix);
    blit(null);

    if (prevImage && t >= 1) {
      glc.deleteTexture(prevImage.texture);
      prevImage = null;
    }
  }

  /* ---------- Цикл ---------- */
  let running = false;
  let inView = true;
  let raf = 0;
  let lastTime = 0;
  let ready = false;
  let nextIdle = 0;
  let lowFpsTime = 0;
  let smoothFps = 60;
  let warmup = 1;
  let degraded = false;
  let destroyed = false;
  /* Меню бургера закриває екран готовим розмитим фоном: рідину під ним не видно,
     тож поки меню відкрите, симуляція на паузі й не реагує на мишку */
  let menuOpen = false;

  function currentRestore(now: number) {
    const sinceMove = (now - lastMove) / 1000;
    let r = C.RESTORE_MOVING;
    if (sinceMove > C.RESTORE_DELAY) {
      const k = Math.min(1, (sinceMove - C.RESTORE_DELAY) / C.RESTORE_RAMP);
      r = C.RESTORE_MOVING + (C.RESTORE_IDLE - C.RESTORE_MOVING) * k;
    }
    if (now < themeUntil) r = Math.max(r, C.RESTORE_THEME);
    return r;
  }

  function idlePush(now: number) {
    if (now < nextIdle) return;
    nextIdle = now + (C.IDLE_MIN + Math.random() * (C.IDLE_MAX - C.IDLE_MIN)) * 1000;
    if (now - lastMove < 1000) return;
    // Права половина, випадковий напрям, у 5–6 разів слабше за мишку
    const angle = Math.random() * Math.PI * 2;
    const amount = 0.008;
    push(
      0.55 + Math.random() * 0.4,
      0.2 + Math.random() * 0.6,
      Math.cos(angle) * amount,
      Math.sin(angle) * amount,
      C.SPLAT_FORCE / C.IDLE_FORCE_DIVIDER,
    );
  }

  function watchFps(realDt: number) {
    if (warmup > 0) {
      warmup -= realDt;
      return;
    }
    smoothFps = smoothFps * 0.9 + (1 / Math.max(realDt, 0.001)) * 0.1;
    lowFpsTime = smoothFps < C.MIN_FPS ? lowFpsTime + realDt : 0;
    if (lowFpsTime < C.LOW_FPS_TIME) return;
    lowFpsTime = 0;
    warmup = 1;
    if (!degraded) {
      degraded = true;
      dyeResolution = Math.round(dyeResolution / 2);
      initFramebuffers();
    } else {
      destroy(); // Не допомогло — лишаємо картинку
    }
  }

  function frame(time: number) {
    raf = 0;
    if (!running || destroyed) return;
    const realDt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
    lastTime = time;
    const dt = Math.min(realDt, 1 / 60);
    const now = performance.now();

    idlePush(now);
    // uRestore задано на кадр при 60 к/с; перераховуємо під реальний крок
    const restore = 1 - Math.pow(1 - currentRestore(now), dt * 60);
    step(dt, restore);
    render();

    if (!ready) {
      ready = true;
      canvasEl.classList.add('is-ready');
    }
    watchFps(realDt);
    raf = requestAnimationFrame(frame);
  }

  function updateRunning() {
    const should = !destroyed && image !== null && inView && !document.hidden && !menuOpen;
    if (should === running) return;
    running = should;
    if (running) {
      lastTime = 0;
      lastPointer = null;
      raf = requestAnimationFrame(frame);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function destroy() {
    destroyed = true;
    updateRunning();
    canvasEl.classList.remove('is-ready');
  }

  // Пауза поза екраном і в неактивній вкладці
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateRunning();
  }).observe(heroEl);
  document.addEventListener('visibilitychange', updateRunning);
  window.addEventListener('lindigo:menu', (event) => {
    menuOpen = (event as CustomEvent<{ open: boolean }>).detail.open;
    lastPointer = null;
    warmup = 0.5; // перші кадри після паузи не рахуємо
    updateRunning();
  });
  reduceMotion.addEventListener('change', (e) => e.matches && destroy());
  canvasEl.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    destroy();
  });
  new ResizeObserver(() => !destroyed && resize()).observe(canvasEl);

  /* ---------- Зміна теми: стара рідина перетікає в нову картинку ---------- */
  window.addEventListener('lindigo:theme', async (event) => {
    if (destroyed || !image) return;
    const theme = (event as CustomEvent<Theme>).detail;
    const img = imageFor(theme);
    if (!img || !(await whenLoaded(img)) || destroyed) return;
    if (prevImage) glc.deleteTexture(prevImage.texture);
    prevImage = image;
    imageEl = img;
    image = { texture: uploadImage(img), ...measure(img) };
    const now = performance.now();
    mixStart = now;
    themeUntil = now + C.THEME_BLEND * 1000;
    // Трохи розмішуємо, щоб перехід був схожий на переливання фарби
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2;
      push(0.55 + Math.random() * 0.4, 0.2 + Math.random() * 0.6, Math.cos(a) * 0.01, Math.sin(a) * 0.01);
    }
    if (!running) render();
  });

  /* ---------- Запуск ---------- */
  (async () => {
    const img = imageFor(currentTheme());
    if (!img || !(await whenLoaded(img)) || destroyed) {
      destroy();
      return;
    }
    resize();
    imageEl = img;
    image = { texture: uploadImage(img), ...measure(img) };
    nextIdle = performance.now() + 2500;
    updateRunning();
  })();
}
