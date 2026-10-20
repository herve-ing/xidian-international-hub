import React, { useEffect, useRef } from 'react';
import sequences from './binary-sequences.json';
export function AnimatedHubLogo() {
  return (
    <svg
      className="animated-hub-logo"
      viewBox="30 34 150 126"
      role="img"
      aria-label="Xidian Hub"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="hub-code-window">
          <rect x="100" y="45" width="65" height="78" />
        </clipPath>
        <linearGradient id="hub-code-fade">
          <stop stopColor="white" />
          <stop offset=".75" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id="hub-code-mask">
          <rect x="99" y="44" width="68" height="80" fill="url(#hub-code-fade)" />
        </mask>
      </defs>
      <image href="./media/hub-logo-live.jpg" width="200" height="200" />
      <g className="logo-live-code" aria-hidden="true">
        <rect x="130" y="43" width="37" height="79" fill="#fdfdfd" />
        <g clipPath="url(#hub-code-window)" mask="url(#hub-code-mask)">
          {sequences.logo.map((bits, i) => (
            <g
              key={i}
              className="logo-code-row"
              style={
                {
                  '--row-delay': `${-i * 1.3}s`,
                  '--row-duration': `${5 + i * 0.6}s`,
                } as React.CSSProperties
              }
            >
              <text x="97" y={56 + i * 14}>
                {bits}
              </text>
              <text x="223" y={56 + i * 14}>
                {bits}
              </text>
            </g>
          ))}
        </g>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            className="logo-code-pixel"
            x={105 + ((i * 7) % 27)}
            y={49 + ((i * 13) % 66)}
            width={i % 3 === 0 ? 2 : 1}
            height={i % 3 === 0 ? 2 : 1}
            style={{ animationDelay: `${-i * 0.47}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
type Point = { x: number; y: number };
type Trail = { from: Point; to: Point; age: number; red: boolean };
type Column = { x: number; y: number; speed: number; bits: string[] };

const CYAN = '#00f0ff';
const RED = '#8b1c24';
const TAIL_LENGTH = 10;
const TRAIL_SECONDS = 7;
const MAX_TRAILS = 500;
const FRAME_MS = 1000 / 60;

/** Canvas décoratif partagé sur les pages publiques, synchronisé avec le bouton Pause. */
export function BinaryBackground({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const synchronizeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx2d = context as CanvasRenderingContext2D;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fontSize = 13;
    const columnGap = 46;
    const rainSpeed = 17;
    const turtleSpeed = 48;
    const intensity = 0.2;
    let width = 1;
    let height = 1;
    let frame = 0;
    let lastPaint = 0;
    let lastUpdate = 0;
    let disposed = false;
    let columns: Column[] = [];
    let trails: Trail[] = [];
    let path: Point[] = [];
    let turtle: Point = { x: 0, y: 0 };
    let angle = 0;
    let red = false;

    const random = (min: number, max: number) => min + Math.random() * (max - min);

    function makePath() {
      const radius = Math.max(1, Math.min(width, height) * random(0.08, 0.17));
      const center = { x: random(radius, width - radius), y: random(radius, height - radius) };
      const sides = Math.random() < 0.55 ? 4 : 6;
      const rotation = sides === 4 ? Math.PI / 4 : random(0, Math.PI * 2);
      const vertices = Array.from({ length: sides }, (_, i) => ({
        x: center.x + Math.cos(rotation + (i * Math.PI * 2) / sides) * radius,
        y: center.y + Math.sin(rotation + (i * Math.PI * 2) / sides) * radius,
      }));
      path = [...vertices, { ...vertices[0] }];
      red = Math.random() < 0.16;
    }

    function advance(dt: number) {
      for (const column of columns) {
        column.y += column.speed * dt;
        if (column.y > height + TAIL_LENGTH * fontSize) column.y = -fontSize;
      }
      trails = trails.filter((trail) => (trail.age += dt) < TRAIL_SECONDS);
      let distance = turtleSpeed * dt;
      for (let step = 0; distance > 0 && step < 16; step++) {
        if (!path.length) makePath();
        const target = path[0];
        const dx = target.x - turtle.x;
        const dy = target.y - turtle.y;
        const length = Math.hypot(dx, dy);
        if (length < 0.001) {
          path.shift();
          continue;
        }
        const travel = Math.min(distance, length);
        const next = { x: turtle.x + (dx / length) * travel, y: turtle.y + (dy / length) * travel };
        angle = Math.atan2(dy, dx);
        trails.push({ from: { ...turtle }, to: next, age: 0, red });
        turtle = next;
        distance -= travel;
        if (travel === length) path.shift();
      }
      if (trails.length > MAX_TRAILS) trails.splice(0, trails.length - MAX_TRAILS);
    }

    function paint() {
      ctx2d.clearRect(0, 0, width, height);
      ctx2d.font = `${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      ctx2d.textBaseline = 'top';
      for (const column of columns) {
        const head = Math.floor(column.y / fontSize);
        for (let i = TAIL_LENGTH - 1; i >= 0; i--) {
          ctx2d.globalAlpha = intensity * (i === 0 ? 0.75 : 0.28 * (1 - i / TAIL_LENGTH) ** 2);
          ctx2d.fillStyle = i === 0 ? '#c8fcff' : CYAN;
          const index =
            (((head - i) % column.bits.length) + column.bits.length) % column.bits.length;
          ctx2d.fillText(column.bits[index], column.x, column.y - i * fontSize);
        }
      }
      ctx2d.lineWidth = 1;
      ctx2d.lineCap = 'round';
      for (const trail of trails) {
        ctx2d.globalAlpha = intensity * 0.65 * (1 - trail.age / TRAIL_SECONDS) ** 2;
        ctx2d.strokeStyle = trail.red ? RED : CYAN;
        ctx2d.beginPath();
        ctx2d.moveTo(trail.from.x, trail.from.y);
        ctx2d.lineTo(trail.to.x, trail.to.y);
        ctx2d.stroke();
      }
      ctx2d.save();
      ctx2d.translate(turtle.x, turtle.y);
      ctx2d.rotate(angle);
      ctx2d.globalAlpha = intensity * 0.8;
      ctx2d.fillStyle = red ? RED : CYAN;
      ctx2d.shadowColor = CYAN;
      ctx2d.shadowBlur = 7;
      ctx2d.beginPath();
      ctx2d.moveTo(5, 0);
      ctx2d.lineTo(-3, -2.5);
      ctx2d.lineTo(-3, 2.5);
      ctx2d.closePath();
      ctx2d.fill();
      ctx2d.restore();
      ctx2d.globalAlpha = 1;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(3_000_000 / (width * height)),
      );
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.ceil(width / columnGap));
      columns = Array.from({ length: count }, (_, i) => ({
        x: (i + 0.5) * (width / count),
        y: random(-height, height),
        speed: rainSpeed * random(0.55, 1.4),
        bits: Array.from({ length: 32 }, () => (Math.random() < 0.5 ? '0' : '1')),
      }));
      trails = [];
      turtle = { x: width * 0.22, y: height * 0.55 };
      makePath();
      paint();
    }

    function tick(now: number) {
      frame = 0;
      if (disposed) return;
      if (now - lastPaint >= FRAME_MS) {
        const dt = Math.min((now - lastUpdate) / 1000, 0.05);
        lastPaint = now - ((now - lastPaint) % FRAME_MS);
        lastUpdate = now;
        advance(dt);
        paint();
      }
      frame = requestAnimationFrame(tick);
    }

    function synchronize() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (disposed || document.hidden || reduceMotion.matches || pausedRef.current) return;
      lastUpdate = lastPaint = performance.now();
      frame = requestAnimationFrame(tick);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', synchronize);
    reduceMotion.addEventListener('change', synchronize);
    synchronizeRef.current = synchronize;
    synchronize();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', synchronize);
      reduceMotion.removeEventListener('change', synchronize);
      synchronizeRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    synchronizeRef.current();
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="binary-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    />
  );
}
