import React, { useEffect, useRef } from 'react';

interface GlobalParticleBackgroundProps {
  darkMode: boolean;
}

export const GlobalParticleBackground: React.FC<GlobalParticleBackgroundProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 80;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color Palettes
    const darkColors = ['#00F0FF', '#3B82F6', '#6366F1', '#06B6D4', '#38BDF8'];
    const lightColors = ['#0284C7', '#2563EB', '#4F46E5', '#0891B2', '#0284C7'];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      pulsePhase: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = darkMode ? darkColors : lightColors;

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.45 + 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // Very slow drifting velocity
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background soft ambient gradient blobs
      if (darkMode) {
        const radGrad1 = ctx.createRadialGradient(
          width * 0.2, height * 0.3, 10,
          width * 0.2, height * 0.3, isMobile ? 300 : 600
        );
        radGrad1.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
        radGrad1.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = radGrad1;
        ctx.fillRect(0, 0, width, height);

        const radGrad2 = ctx.createRadialGradient(
          width * 0.8, height * 0.7, 10,
          width * 0.8, height * 0.7, isMobile ? 350 : 650
        );
        radGrad2.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
        radGrad2.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = radGrad2;
        ctx.fillRect(0, 0, width, height);
      } else {
        const radGradLight = ctx.createRadialGradient(
          width * 0.5, height * 0.2, 10,
          width * 0.5, height * 0.2, isMobile ? 300 : 700
        );
        radGradLight.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        radGradLight.addColorStop(1, 'rgba(248, 250, 252, 0)');
        ctx.fillStyle = radGradLight;
        ctx.fillRect(0, 0, width, height);
      }

      // Update & Draw Particles
      const maxConnectDistance = isMobile ? 85 : 125;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle slowly
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen edges smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Gentle pulse effect
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.18;

        // Draw particle node
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
        ctx.shadowColor = p.color;
        ctx.shadowBlur = darkMode ? 8 : 4;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with thin subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * (darkMode ? 0.22 : 0.15);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = darkMode ? `rgba(56, 189, 248, ${lineAlpha})` : `rgba(2, 132, 199, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
