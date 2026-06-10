import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let bgParticles = [];
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let mouseFrame = 0;
    let isDarkTheme = document.body.classList.contains("dark-theme");

    // Observe theme changes on body
    const observer = new MutationObserver(() => {
      isDarkTheme = document.body.classList.contains("dark-theme");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    class BgParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.25 + 0.08;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(28, 28, 26, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initBgParticles() {
      bgParticles = [];
      const count = window.innerWidth < 768 ? 20 : 45;
      for (let i = 0; i < count; i++) {
        bgParticles.push(new BgParticle());
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBgParticles();
    }
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = "#ffffff";
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.015;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      dot.style.transform = `translate(-50%, -50%) translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (isDarkTheme) {
        mouseFrame++;
        if (mouseFrame % 3 === 0) {
          particles.push(new Particle(mouseX, mouseY));
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Plexus Constellation lines in background
      const maxDistance = 120;
      const strokeColor = isDarkTheme ? "255, 255, 255" : "28, 28, 26";
      const lineAlphaCoeff = isDarkTheme ? 0.07 : 0.04;

      for (let i = 0; i < bgParticles.length; i++) {
        bgParticles[i].update();
        bgParticles[i].draw();

        for (let j = i + 1; j < bgParticles.length; j++) {
          const dx = bgParticles[i].x - bgParticles[j].x;
          const dy = bgParticles[i].y - bgParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * lineAlphaCoeff;
            ctx.beginPath();
            ctx.moveTo(bgParticles[i].x, bgParticles[i].y);
            ctx.lineTo(bgParticles[j].x, bgParticles[j].y);
            ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Cursor trail
      if (isDarkTheme) {
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          if (particles[i].alpha <= 0 || particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
          }
        }
      } else {
        particles = [];
      }

      // 3. Move ring
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(-50%, -50%) translate3d(${ringX}px, ${ringY}px, 0)`;

      animId = requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    const handleMouseOver = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const interactive = target.closest(
        "a, button, select, input, textarea, [data-action], .row-button, label"
      );
      if (interactive) {
        dot.classList.add("hover-active");
        ring.classList.add("hover-active");
      } else {
        dot.classList.remove("hover-active");
        ring.classList.remove("hover-active");
      }
    };
    document.addEventListener("mouseover", handleMouseOver);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="cursor-canvas" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
