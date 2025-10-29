import React, { useRef, useEffect } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.maxLife = Math.random() * 40 + 30;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX * 0.5;
    this.y += this.speedY * 0.5;
    this.life -= 1;
  }

  draw(context: CanvasRenderingContext2D) {
    const opacity = Math.max(0, this.life / this.maxLife);
    context.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}

export const CursorParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  // FIX: `useRef` with a specific type argument requires an initial value. Initializing with `null` is the correct approach here.
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasDimensions();


    const handleMouseMove = (event: MouseEvent) => {
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push(new Particle(event.clientX, event.clientY));
      }
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        particle.update();
        particle.draw(context);
        if (particle.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', setCanvasDimensions);
    
    animate();

    return () => {
      // FIX: The previous check `if (animationFrameId.current)` was buggy as it would fail for a valid frame ID of 0. Checking against null is more robust.
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute top-0 left-0 w-full h-full z-5" />;
};
