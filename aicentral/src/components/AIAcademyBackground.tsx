import React, { useEffect, useRef } from 'react';

export const AIAcademyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 65;
    const shapeCount = isMobile ? 4 : 10;

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // ---------------------------------------------------------------
    // 1. PARTICLES (Glowing Moving Blue/Cyan Nodes)
    // ---------------------------------------------------------------
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = ['#00F0FF', '#0072FF', '#3B82F6', '#06B6D4', '#60A5FA'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // ---------------------------------------------------------------
    // 2. 3D AI NEURAL SPHERE / CORE MATH
    // ---------------------------------------------------------------
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    const spherePoints: Point3D[] = [];
    const sphereRadius = isMobile ? 120 : 190;
    const latitudeBands = isMobile ? 12 : 20;
    const longitudeBands = isMobile ? 12 : 20;

    for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = (lat * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= longitudeBands; lon++) {
        const phi = (lon * 2 * Math.PI) / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        spherePoints.push({
          x: sphereRadius * sinTheta * cosPhi,
          y: sphereRadius * cosTheta,
          z: sphereRadius * sinTheta * sinPhi,
        });
      }
    }

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    // ---------------------------------------------------------------
    // 3. FLOATING GEOMETRIC SHAPES
    // ---------------------------------------------------------------
    interface GeoShape {
      x: number;
      y: number;
      size: number;
      rot: number;
      rotSpeed: number;
      vx: number;
      vy: number;
      type: 'cube' | 'diamond';
    }

    const geoShapes: GeoShape[] = [];
    for (let i = 0; i < shapeCount; i++) {
      geoShapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 10,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        type: i % 2 === 0 ? 'cube' : 'diamond',
      });
    }

    // ---------------------------------------------------------------
    // MAIN RENDER LOOP
    // ---------------------------------------------------------------
    let time = 0;

    const render = () => {
      time += 0.015;

      // 1. Deep Navy Canvas Base Background (#050B1A)
      ctx.fillStyle = '#050B1A';
      ctx.fillRect(0, 0, width, height);

      // 2. Soft Animated Blue / Cyan Light Waves & Radial Gradients
      const gradX = width * 0.8;
      const gradY = height * 0.3 + Math.sin(time * 0.5) * 30;
      const radialGrad = ctx.createRadialGradient(gradX, gradY, 20, gradX, gradY, isMobile ? 300 : 550);
      radialGrad.addColorStop(0, 'rgba(0, 240, 255, 0.18)');
      radialGrad.addColorStop(0.5, 'rgba(0, 114, 255, 0.08)');
      radialGrad.addColorStop(1, 'rgba(5, 11, 26, 0)');

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Left Ambient Glow
      const leftGradX = width * 0.15;
      const leftGradY = height * 0.7 + Math.cos(time * 0.4) * 25;
      const leftRadial = ctx.createRadialGradient(leftGradX, leftGradY, 10, leftGradX, leftGradY, isMobile ? 250 : 450);
      leftRadial.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      leftRadial.addColorStop(1, 'rgba(5, 11, 26, 0)');

      ctx.fillStyle = leftRadial;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Floating Particles & Neural Lines
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulse
        p.alpha += Math.sin(time * 2 + i) * 0.005;
        p.alpha = Math.max(0.2, Math.min(0.8, p.alpha));

        // Draw Particle Glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with thin neural lines
        const maxDist = isMobile ? 70 : 110;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / maxDist) * 0.25})`;
            ctx.stroke();
          }
        }
      }

      // 4. Render 3D AI Neural Sphere / Core in Background Right
      const sphereCenterX = isMobile ? width * 0.5 : width * 0.78;
      const sphereCenterY = isMobile ? height * 0.25 : height * 0.45;

      rotX += 0.003;
      rotY += 0.005;
      rotZ += 0.002;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      const projectedPoints: { px: number; py: number; pz: number }[] = [];

      for (let i = 0; i < spherePoints.length; i++) {
        const pt = spherePoints[i];

        // Rotation on X
        let y1 = pt.y * cosX - pt.z * sinX;
        let z1 = pt.y * sinX + pt.z * cosX;

        // Rotation on Y
        let x2 = pt.x * cosY + z1 * sinY;
        let z2 = -pt.x * sinY + z1 * cosY;

        // Rotation on Z
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;

        // Perspective Projection
        const fov = 400;
        const scale = fov / (fov + z2 + 300);
        const px = sphereCenterX + x3 * scale;
        const py = sphereCenterY + y3 * scale;

        projectedPoints.push({ px, py, pz: z2 });
      }

      // Draw 3D Sphere Vector Network Lines
      ctx.lineWidth = 0.5;
      const connectStep = isMobile ? 6 : 4;
      for (let i = 0; i < projectedPoints.length; i += connectStep) {
        const pt1 = projectedPoints[i];
        for (let j = i + 1; j < Math.min(i + 15, projectedPoints.length); j += connectStep) {
          const pt2 = projectedPoints[j];
          const dx = pt1.px - pt2.px;
          const dy = pt1.py - pt2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < (isMobile ? 35 : 55)) {
            const alpha = (1 - dist / 55) * 0.18;
            ctx.beginPath();
            ctx.moveTo(pt1.px, pt1.py);
            ctx.lineTo(pt2.px, pt2.py);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw 3D Sphere Node Glowing Dots
      for (let i = 0; i < projectedPoints.length; i += (isMobile ? 3 : 2)) {
        const pt = projectedPoints[i];
        const depthAlpha = Math.max(0.1, (pt.pz + sphereRadius) / (2 * sphereRadius));

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = pt.pz > 0 ? '#00F0FF' : '#0072FF';
        ctx.globalAlpha = depthAlpha * 0.7;
        ctx.fill();
      }

      // Draw Glowing Core at Sphere Center
      ctx.save();
      const corePulse = Math.sin(time * 2) * 8;
      const coreGrad = ctx.createRadialGradient(
        sphereCenterX, sphereCenterY, 5,
        sphereCenterX, sphereCenterY, (isMobile ? 60 : 100) + corePulse
      );
      coreGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      coreGrad.addColorStop(0.5, 'rgba(0, 114, 255, 0.15)');
      coreGrad.addColorStop(1, 'rgba(5, 11, 26, 0)');

      ctx.beginPath();
      ctx.arc(sphereCenterX, sphereCenterY, (isMobile ? 60 : 100) + corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();
      ctx.restore();

      // 5. Floating Geometric Wireframe Shapes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < geoShapes.length; i++) {
        const shape = geoShapes[i];
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rot += shape.rotSpeed;

        if (shape.x < -20) shape.x = width + 20;
        if (shape.x > width + 20) shape.x = -20;
        if (shape.y < -20) shape.y = height + 20;
        if (shape.y > height + 20) shape.y = -20;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rot);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';

        if (shape.type === 'cube') {
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -shape.size);
          ctx.lineTo(shape.size, 0);
          ctx.lineTo(0, shape.size);
          ctx.lineTo(-shape.size, 0);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Center Overlay Mask (Ensures readability for UI cards & text)
      const centerMask = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 100,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.7
      );
      centerMask.addColorStop(0, 'rgba(5, 11, 26, 0.55)');
      centerMask.addColorStop(0.6, 'rgba(5, 11, 26, 0.75)');
      centerMask.addColorStop(1, 'rgba(5, 11, 26, 0.95)');

      ctx.fillStyle = centerMask;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
