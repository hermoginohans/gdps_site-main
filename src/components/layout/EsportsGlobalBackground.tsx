import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'circle' | 'diamond' | 'cross';
  alpha: number;
  alphaSpeed: number;
  baseAlpha: number;
  seed: number;
}

export const EsportsGlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const currentMouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [motionReduced, setMotionReduced] = useState(false);

  // Detect user's reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMotionReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Global mouse tracking across the entire website
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Full-viewport Canvas Particle & Dynamic Cyber Mesh Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    const colors = [
      '#F5A623', // Brand championship gold
      '#FFD15C', // Electric gold
      '#00F0FF', // Cyber cyan
      '#8B5CF6', // Neon violet
      '#38BDF8', // Cyan glow
    ];

    const initCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Adapt particle count for mobile vs desktop
      const isMobile = width < 768;
      const particleCount = motionReduced ? 16 : (isMobile ? 24 : 52);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const shapeType: 'circle' | 'diamond' | 'cross' =
          i % 4 === 0 ? 'diamond' : i % 7 === 0 ? 'cross' : 'circle';

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(Math.random() * 0.45 + 0.2), // Upward floating tournament embers
          size: Math.random() * 2.2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapeType,
          alpha: Math.random() * 0.5 + 0.2,
          alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
          baseAlpha: Math.random() * 0.35 + 0.25,
          seed: Math.random() * 100,
        });
      }
    };

    initCanvas();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initCanvas, 150);
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse coordinates for smooth spotlight following
      if (mouseRef.current.active) {
        if (currentMouseRef.current.x === -1000) {
          currentMouseRef.current.x = mouseRef.current.x;
          currentMouseRef.current.y = mouseRef.current.y;
        } else {
          currentMouseRef.current.x += (mouseRef.current.x - currentMouseRef.current.x) * 0.07;
          currentMouseRef.current.y += (mouseRef.current.y - currentMouseRef.current.y) * 0.07;
        }

        const cx = currentMouseRef.current.x;
        const cy = currentMouseRef.current.y;

        // Subtle interactive player spotlight
        const mouseGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
        mouseGlow.addColorStop(0, 'rgba(0, 240, 255, 0.09)');
        mouseGlow.addColorStop(0.4, 'rgba(245, 166, 35, 0.05)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);

        // Faint tactical targeting ring around cursor (pure geometry, NO text)
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw particle connections (Squad Tactical Cyber Mesh)
      const connectDist = 80;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const lineAlpha = (1 - dist / connectDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Update and render particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.seed) * 0.2;
        p.y += p.vy;

        p.alpha += p.alphaSpeed;
        if (p.alpha > p.baseAlpha + 0.25 || p.alpha < 0.1) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Mouse proximity reaction
        if (mouseRef.current.active) {
          const mdx = p.x - currentMouseRef.current.x;
          const mdy = p.y - currentMouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 130 && mDist > 0) {
            const force = (130 - mDist) / 130;
            p.x += (mdx / mDist) * force * 1.4;
            p.y += (mdy / mDist) * force * 1.4;
            p.alpha = Math.min(0.9, p.alpha + 0.12);
          }
        }

        // Wrap around viewport boundaries
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size * 1.3);
          ctx.lineTo(p.x + p.size * 1.3, p.y);
          ctx.lineTo(p.x, p.y + p.size * 1.3);
          ctx.lineTo(p.x - p.size * 1.3, p.y);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'cross') {
          const arm = p.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x - arm, p.y);
          ctx.lineTo(p.x + arm, p.y);
          ctx.moveTo(p.x, p.y - arm);
          ctx.lineTo(p.x, p.y + arm);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      });

      if (!motionReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [motionReduced]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. LAYERED DRIFTING NEBULA / ENERGY AURORAS */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[140px] opacity-25 pointer-events-none bg-gradient-to-br from-brand-gold/30 via-brand-purple/15 to-transparent esports-nebula-1" 
      />
      <div 
        className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-20 pointer-events-none bg-gradient-to-bl from-brand-cyan/25 via-brand-purple/20 to-transparent esports-nebula-2" 
      />
      <div 
        className="absolute bottom-[-15%] left-[25%] w-[55vw] h-[55vw] rounded-full blur-[160px] opacity-20 pointer-events-none bg-gradient-to-tr from-brand-purple/25 via-brand-gold/15 to-transparent esports-nebula-1" 
      />

      {/* 2. SWEEPING TOURNAMENT STADIUM SPOTLIGHTS */}
      {!motionReduced && (
        <>
          {/* Left Stage Spotlight (Electric Cyan) */}
          <div className="absolute -top-40 -left-10 w-[420px] h-[1000px] pointer-events-none opacity-20 esports-beam-left">
            <div className="w-full h-full bg-gradient-to-b from-brand-cyan/35 via-brand-cyan/10 to-transparent blur-2xl transform origin-top" />
          </div>

          {/* Right Stage Spotlight (Champion Gold) */}
          <div className="absolute -top-40 -right-10 w-[420px] h-[1000px] pointer-events-none opacity-20 esports-beam-right">
            <div className="w-full h-full bg-gradient-to-b from-brand-gold/35 via-brand-gold/10 to-transparent blur-2xl transform origin-top" />
          </div>
        </>
      )}

      {/* 3. 3D PERSPECTIVE CYBER ARENA FLOOR GRID */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh] overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-x-[-20%] bottom-[-30px] h-[360px] esports-perspective-grid opacity-25"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.2) 65%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.2) 65%, transparent 100%)'
          }}
        />
      </div>

      {/* 4. FULL-VIEWPORT CANVAS FOR INTERACTIVE PARTICLES & SQUAD MESH */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. PURE GEOMETRIC TACTICAL HUD RETICLES (NO TEXT) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Rotating Concentric Cyber Rings (Top Right) */}
        <div className="absolute top-24 right-[10%] w-44 h-44 opacity-[0.07] pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-brand-cyan animate-hud-rotate">
            <circle cx="50" cy="50" r="46" fill="none" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="50" cy="50" r="34" fill="none" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="22" fill="none" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="50" y1="4" x2="50" y2="96" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="4" y1="50" x2="96" y2="50" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Rotating Hexagonal HUD Wireframe (Bottom Left) */}
        <div className="absolute bottom-36 left-[8%] w-36 h-36 opacity-[0.06] pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-brand-gold animate-hud-rotate-rev">
            <polygon points="50,6 90,26 90,74 50,94 10,74 10,26" fill="none" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="24" fill="none" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="4" fill="#F5A623" />
          </svg>
        </div>

        {/* Tactical Corner Brackets on Screen Edges (Pure Geometry, NO text) */}
        <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-brand-gold/25 hidden xl:block" />
        <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-brand-cyan/25 hidden xl:block" />
        <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-brand-cyan/25 hidden xl:block" />
        <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-brand-gold/25 hidden xl:block" />
      </div>

      {/* 6. SUBTLE HIGH-TECH MATRIX MESH & SCANLINES */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px'
        }}
      />
    </div>
  );
};
