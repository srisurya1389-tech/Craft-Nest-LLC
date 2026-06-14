import { Outlet, createRootRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CartProvider } from '../context/CartContext'
import { CartDrawer } from '../components/CartDrawer'

import '../styles.css'

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  xDrift: string;
  yDrift: string;
  rotDrift: string;
}

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let starId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist < 14) return; // Only spawn star if mouse moves at least 14px

      lastX = e.clientX;
      lastY = e.clientY;

      const id = starId++;
      const size = Math.random() * 8 + 6; // Random size between 6px and 14px
      const xDrift = `${(Math.random() - 0.5) * 60}px`;
      const yDrift = `${(Math.random() - 0.5) * 60 - 30}px`; // Drifts slightly upwards
      const rotDrift = `${(Math.random() - 0.5) * 120}deg`;

      const newStar: Star = {
        id,
        x: e.clientX - size / 2,
        y: e.clientY - size / 2,
        size,
        xDrift,
        yDrift,
        rotDrift
      };

      setStars((prev) => [...prev, newStar]);

      // Remove the star after the animation completes (800ms)
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <CartProvider>
      <Outlet />
      <CartDrawer />
      {/* Global Gold Star Cursor Trail Particles Container */}
      {stars.map((star) => (
        <svg
          key={star.id}
          className="gold-star-particle"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            // Set animation custom properties (CSS variables) for drift translation
            ['--x-drift' as any]: star.xDrift,
            ['--y-drift' as any]: star.yDrift,
            ['--rot-drift' as any]: star.rotDrift,
            color: '#FFF0B5',
            filter: 'drop-shadow(0 0 5px #E8C96B)',
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Detailed 4-point star vector path for a clean boutique feel */}
          <path d="M12,2 L14.8,9.2 L22,12 L14.8,14.8 L12,22 L9.2,14.8 L2,12 L9.2,9.2 Z" />
        </svg>
      ))}
    </CartProvider>
  )
}

