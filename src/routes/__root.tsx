import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CartProvider } from '../context/CartContext'
import { CartDrawer } from '../components/CartDrawer'

import '../styles.css'

const WA_NUMBER = '14704527988'
const WA_DEFAULT_MSG = 'Hi CraftNest! I have a question.'

function FloatingButtons() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return (
    <div className="fixed bottom-6 right-5 z-[999] flex flex-col items-center gap-3">
      {/* Chatbot placeholder */}
      <button
        title="Chat with us"
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-[#C9A84C]/30 transition-all hover:scale-110 cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#0A2318,#061A0F)' }}
        onClick={() => {}}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <circle cx="9" cy="10" r="0.8" fill="#C9A84C" stroke="none"/>
          <circle cx="12" cy="10" r="0.8" fill="#C9A84C" stroke="none"/>
          <circle cx="15" cy="10" r="0.8" fill="#C9A84C" stroke="none"/>
        </svg>
      </button>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`}
        target="_blank" rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-all"
        style={{ background: '#25D366' }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

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
      <FloatingButtons />
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

