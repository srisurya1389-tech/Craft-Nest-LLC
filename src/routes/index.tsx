import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Initialize scroll listener for sticky header background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hook to handle fade-in on scroll animations using Intersection Observer
  useScrollReveal()

  // Slideshow indices state
  const [slideIndices, setSlideIndices] = useState([0, 0, 0])
  // Modal state for product showcase
  const [activeModal, setActiveModal] = useState<string | null>(null)
  // Our Arts & Crafts manual slideshow index
  const [currentCraftIndex, setCurrentCraftIndex] = useState(0)
  // Pooja & Event Rentals manual slideshow index
  const [currentPoojaIndex, setCurrentPoojaIndex] = useState(0)

  // Shopping Cart State
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<{ title: string; price: number; quantity: number; img?: string }[]>([])

  const addToCart = (product: { title: string; price: number; img?: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.title === product.title);
      if (existing) {
        return prev.map(item => item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (title: string, amount: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.title === title) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (title: string) => {
    setCartItems(prev => prev.filter(item => item.title !== title));
  };

  // Slideshow auto-timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndices((prev) => [
        (prev[0] + 1) % 3,
        (prev[1] + 1) % 3,
        (prev[2] + 1) % 3,
      ])
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [contactData, setContactData] = useState({
    fullName: '',
    phoneNumber: '',
    serviceNeeded: '',
    eventDate: '',
    message: ''
  })

  // 3D Magnetic Card Tilt Handlers
  const handleMouseMove3D = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 16;
    const angleY = (x - xc) / 16;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  };

  const handleMouseLeave3D = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease-out';
  };

  // Touch Swipe Navigation for Mobile/Tablets
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      onSwipeLeft();
    } else if (distance < -50) {
      onSwipeRight();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  if (typeof window !== 'undefined') {
    (window as any).addToCart = addToCart;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#E8C96B]/30 selection:text-white">
      
      {/* Sticky Header / Navbar */}
      <header 
        className="fixed top-0 left-0 w-full z-[50] flex items-center justify-between px-6 md:px-16"
        style={
          isScrolled 
            ? {
                background: 'rgba(4, 20, 10, 0.94)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                height: '56px',
                transition: 'all 0.4s ease',
                borderBottom: '1px solid rgba(201, 168, 76, 0.25)',
                paddingTop: '0px',
                paddingBottom: '0px'
              }
            : {
                background: 'transparent',
                height: '92px',
                transition: 'all 0.4s ease',
                borderBottom: '1px solid transparent',
                paddingTop: '16px',
                paddingBottom: '16px'
              }
        }
      >
        {/* Brand Logo & Name */}
        <a 
          href="#"
          className="flex items-center gap-3 font-serif text-base md:text-xl text-[#C9A84C] hover:text-[#E8C96B] font-bold select-none uppercase hover:opacity-100 transition-opacity"
        >
          <svg 
            viewBox="0 0 100 80" 
            className="w-8 h-7 md:w-10 md:h-9 shiny-logo-hover" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.0" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Paint Palette Outer Shape */}
            <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.2" />
            {/* Large Thumb Hole */}
            <circle cx="37" cy="51" r="5.5" strokeWidth="1.8" />
            {/* 7 Paint Wells */}
            <circle cx="23" cy="49" r="3.2" strokeWidth="1.8" />
            <circle cx="20" cy="40" r="3.2" strokeWidth="1.8" />
            <circle cx="22" cy="31" r="3.2" strokeWidth="1.8" />
            <circle cx="28" cy="23" r="3.2" strokeWidth="1.8" />
            <circle cx="36" cy="23" r="3.2" strokeWidth="1.8" />
            <circle cx="43" cy="27" r="3.2" strokeWidth="1.8" />
            <circle cx="46" cy="35" r="3.2" strokeWidth="1.8" />
            {/* Detailed Paintbrush */}
            <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="1.8" />
            <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="1.8" />
            <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="1.8" />
          </svg>
          <span className="flex items-center tracking-[0.2em] md:tracking-[0.28em] pl-[0.2em] md:pl-[0.28em]">
            {"CRAFT NEST".split("").map((letter, index) => (
              letter === " " ? (
                <span key={index} className="inline-block w-[0.3em]" />
              ) : (
                <span key={index} className="shiny-letter">
                  {letter}
                </span>
              )
            ))}
          </span>
        </a>

        {/* Navigation Section Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[#C9A84C] font-sans text-xs tracking-[0.2em] font-semibold">
          <a href="#services" className="hover:text-white transition-colors uppercase">Our Services</a>
          <a href="#arts-crafts" className="hover:text-white transition-colors uppercase">Arts & Crafts</a>
          <a href="#pooja-rentals" className="hover:text-white transition-colors uppercase">Pooja Rentals</a>
          <a href="#our-story" className="hover:text-white transition-colors uppercase">Our Story</a>
          <a href="#contact" className="hover:text-white transition-colors uppercase">Contact</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.0]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8C96B] text-[#0B3D2E] text-[9px] font-sans font-bold rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="font-sans text-[10px] md:text-xs tracking-[0.2em] font-semibold border border-[#C9A84C] text-[#C9A84C] rounded-full px-6 py-2.5 hover:bg-[#C9A84C] hover:text-[#0B3D2E] transition-all duration-300 cursor-pointer"
          >
            ENQUIRE NOW
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen w-full flex flex-col justify-between items-center text-center px-4 overflow-hidden pt-0"
        style={{
          background: 'radial-gradient(ellipse 72% 68% at 50% 52%, #1C6038 0%, #134A2A 28%, #0C3220 55%, #071A10 80%, #040C07 100%)'
        }}
      >
        {/* Layered vignette overlay (NO warm colors) */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]" 
          style={{
            background: 'radial-gradient(ellipse 80% 75% at 50% 50%, transparent 20%, rgba(5, 18, 10, 0.55) 58%, rgba(3, 11, 6, 0.90) 100%)'
          }}
        />

        {/* Embossed gold-brown mandala overlay (FULL SIZE, edge-to-edge) */}
        <div 
          className="absolute pointer-events-none"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/diancfp03/image/upload/v1780162699/home_sa22ka.png')`,
            width: '110vw',
            height: '110vh',
            maxWidth: 'none',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            zIndex: 0,
            opacity: 0.60,
            mixBlendMode: 'multiply',
            filter: 'sepia(1) hue-rotate(2deg) saturate(1.4) brightness(0.55) contrast(1.15)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 55%, black 30%, black 55%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse 90% 85% at 50% 55%, black 30%, black 55%, transparent 80%)'
          }}
        />

        {/* Dummy spacer */}
        <div className="pt-24" />

        {/* Centered Hero Content */}
        <div 
          className="relative flex flex-col items-center justify-center max-w-4xl px-4 py-8 reveal-element revealed"
          style={{
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Custom Hand-Drawn Paint Palette & Brush SVG Logo (Increased Size & Ultra-Detaled Line-Art Outline) */}
          <div className="mb-6 flex flex-col items-center justify-center group select-none">
            <svg 
              viewBox="0 0 100 80" 
              className="w-36 h-30 md:w-48 md:h-40 shiny-logo-hover" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.0" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Paint Palette Outer Shape - Perfectly Matching Kidney Shape */}
              <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.5" />
              
              {/* Large Thumb Hole (Perfect open circle shifted inward) */}
              <circle cx="37" cy="51" r="5.5" strokeWidth="2.0" fill="none" />
              
              {/* 7 Uniform Paint Wells (Hollow circles shifted inward to prevent protrusion) */}
              <circle cx="23" cy="49" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="20" cy="40" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="22" cy="31" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="28" cy="23" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="36" cy="23" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="43" cy="27" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="46" cy="35" r="3.2" strokeWidth="2.0" fill="none" />
              
              {/* Precision Aligned Paintbrush */}
              {/* Hollow Handle (Rounded Pill shape) */}
              <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="2.0" fill="none" />
              {/* Tapered Ferrule / Collar Shape (Narrow top/bottom, wider middle) */}
              <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="2.0" fill="none" />
              {/* Bristles Outer Outline (Leaf/Flame shape pointing up) */}
              <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="2.0" fill="none" />
            </svg>
          </div>

          {/* Heading with text-shadow glow */}
          <h1 
            className="font-serif text-[clamp(2.0rem,6.8vw,4.8rem)] leading-none text-[#D4A843] uppercase select-none font-bold tracking-[0.25em] md:tracking-[0.38em] pl-[0.25em] md:pl-[0.38em]"
            style={{
              textShadow: '0 0 60px rgba(190, 145, 50, 0.3), 0 0 20px rgba(190, 145, 50, 0.15), 0 3px 12px rgba(0, 0, 0, 0.6)'
            }}
          >
            {"CRAFT NEST".split("").map((letter, index) => (
              letter === " " ? (
                <span key={index} className="inline-block w-[0.4em]" />
              ) : (
                <span key={index} className="shiny-letter">
                  {letter}
                </span>
              )
            ))}
          </h1>

          {/* Decorative Horizontal Divider */}
          <div 
            className="mx-auto block"
            style={{
              width: '280px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(237, 208, 106, 0.2) 15%, #EDD06A 50%, rgba(237, 208, 106, 0.2) 85%, transparent 100%)',
              margin: '12px auto 20px'
            }}
          />

          {/* Tagline */}
          <p className="font-serif italic text-xl md:text-3xl text-[#C4A050] tracking-wide mb-10 flex flex-wrap items-center justify-center gap-x-3">
            {"Handmade with Love".split(" ").map((word, index) => (
              <span key={index} className="shiny-word">
                {word}
              </span>
            ))}
          </p>

          {/* Explore Button */}
          <a 
            href="#services"
            className="font-sans font-semibold transition-all duration-300 uppercase cursor-pointer"
            style={{
              border: '1.5px solid rgba(201, 168, 76, 0.75)',
              color: '#D4AA56',
              background: 'transparent',
              letterSpacing: '0.2em',
              padding: '14px 40px',
              fontSize: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.12)';
              e.currentTarget.style.borderColor = '#E8C96B';
              e.currentTarget.style.color = '#F0D070';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.75)';
              e.currentTarget.style.color = '#D4AA56';
            }}
          >
            EXPLORE OUR ART
          </a>
        </div>

        {/* Bouncing Chevron down scroll indicator */}
        <div className="relative z-10 pb-10">
          <a 
            href="#services" 
            aria-label="Scroll Down"
            className="text-[#C9A84C] hover:text-[#E8C96B] animate-bounce transition-colors inline-block"
          >
            <ChevronDown className="w-7 h-7 stroke-[1.5]" />
          </a>
        </div>
      </section>
      
      {/* Decorative Crafts & Infinite Marquee Section */}
      <section 
        className="relative py-20 px-6 md:px-16 flex flex-col items-center justify-center overflow-hidden border-b border-[#C9A84C]/25"
        style={{
          background: 'radial-gradient(circle at center, #F6FAF7 0%, #EAF0EC 60%, #D8E5DC 100%)'
        }}
      >
        {/* Elegant Centered Header (Single Line) */}
        <div className="max-w-6xl w-full text-center flex flex-col items-center justify-center mb-10 reveal-element">
          
          <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
            {/* Left Decorative Flourish */}
            <div className="hidden lg:flex items-center gap-1.5 opacity-80 select-none">
              <div className="w-10 md:w-16 h-[1px] bg-[#C9A84C]" />
              <div className="w-2.5 h-2.5 rounded-full border border-[#C9A84C] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
              </div>
              <div className="w-4 h-[1px] bg-[#C9A84C]" />
            </div>

            <div className="text-center px-4">
              <h2 className="font-serif text-xl sm:text-2xl md:text-[28px] lg:text-[34px] text-[#0B3D2E] tracking-[0.08em] font-medium leading-relaxed flex flex-wrap items-center justify-center gap-1 md:gap-2">
                <span className="inline-block px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-[#D2E2D7] hover:scale-[1.03] cursor-pointer">
                  Handmade Crafts
                </span>
                <span className="text-[#C9A84C]/60 font-light select-none mx-1">|</span>
                <span className="inline-block px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-[#D2E2D7] hover:scale-[1.03] cursor-pointer">
                  Face Painting
                </span>
                <span className="text-[#C9A84C]/60 font-light select-none mx-1">|</span>
                <span className="inline-block px-4 py-1.5 rounded-full font-semibold transition-all duration-300 hover:bg-[#D2E2D7] hover:scale-[1.03] cursor-pointer">
                  Gifts
                </span>
              </h2>
            </div>

            {/* Right Decorative Flourish */}
            <div className="hidden lg:flex items-center gap-1.5 opacity-80 select-none">
              <div className="w-4 h-[1px] bg-[#C9A84C]" />
              <div className="w-2.5 h-2.5 rounded-full border border-[#C9A84C] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
              </div>
              <div className="w-10 md:w-16 h-[1px] bg-[#C9A84C]" />
            </div>
          </div>
        </div>

        {/* Infinite Moving Marquee Ticker */}
        <div className="w-full relative py-6 border-y border-[#C9A84C]/25" style={{ background: 'rgba(250, 246, 235, 0.45)' }}>
          <div className="marquee-container">
            <div className="marquee-content font-serif italic text-lg md:text-2xl text-[#C9A84C] tracking-widest">
              <span className="marquee-item">Mehandi</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Mandala</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Return Gifts</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Name Plates</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Jewellery</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Face Painting</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Kundan Bangles</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Lippan Art</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
            </div>
            
            {/* Duplicated for seamless loop */}
            <div className="marquee-content font-serif italic text-lg md:text-2xl text-[#C9A84C] tracking-widest" aria-hidden="true">
              <span className="marquee-item">Mehandi</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Mandala</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Return Gifts</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Name Plates</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Jewellery</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Face Painting</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Kundan Bangles</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
              <span className="marquee-item">Lippan Art</span>
              <span className="text-[#C9A84C]/45 select-none mx-2">•</span>
            </div>
          </div>
        </div>
      </section>

      {/* Large Brand Artistry Collage Banner Section */}
      <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden border-y border-[#C9A84C]/35">
        {/* Grid of All Specialties Pics */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 h-full w-full">
          
          {/* Collage Item 1: Face Painting */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img 
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600" 
              alt="Colorful Celebrations" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-[8px] md:text-[9px] font-sans font-bold tracking-[0.25em] text-[#E8C96B] uppercase block mb-1">CELEBRATION ART</span>
              <h4 className="font-serif text-sm md:text-base text-white font-medium">Face Painting</h4>
            </div>
          </div>

          {/* Collage Item 2: Return Gifts */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img 
              src="https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=600" 
              alt="Bespoke Return Gifts" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-[8px] md:text-[9px] font-sans font-bold tracking-[0.25em] text-[#E8C96B] uppercase block mb-1">HANDMADE MEMORIES</span>
              <h4 className="font-serif text-sm md:text-base text-white font-medium">Return Gifts</h4>
            </div>
          </div>

          {/* Collage Item 3: Crafts & Arts */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600" 
              alt="Sacred Mandala & Lippan Art" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-[8px] md:text-[9px] font-sans font-bold tracking-[0.25em] text-[#E8C96B] uppercase block mb-1">CREATIVE REALMS</span>
              <h4 className="font-serif text-sm md:text-base text-white font-medium">Crafts & Arts</h4>
            </div>
          </div>

          {/* Collage Item 4: Pooja & Event Rentals */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600" 
              alt="Bespoke Festive Props" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-[8px] md:text-[9px] font-sans font-bold tracking-[0.25em] text-[#E8C96B] uppercase block mb-1">DIVINE CELEBRATIONS</span>
              <h4 className="font-serif text-sm md:text-base text-white font-medium">Pooja Rentals</h4>
            </div>
          </div>

        </div>

        {/* Central Brand Stamp Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4">
          <div className="bg-[#04140E]/85 backdrop-blur-md border border-[#C9A84C]/45 rounded-[24px] p-6 md:p-8 text-center max-w-lg shadow-2xl relative gold-glow">
            <span className="text-[9px] tracking-[0.3em] font-sans font-bold text-[#C9A84C] uppercase mb-2 block">
              CRAFTNEST ARTISTRY
            </span>
            <h3 className="font-serif text-lg md:text-2xl font-medium text-white tracking-wide leading-tight">
              Handcrafted with Love, Shared with Joy
            </h3>
            <div className="w-16 h-[1px] bg-[#C9A84C]/35 mx-auto my-3" />
            <p className="font-sans text-[10px] md:text-xs text-[rgba(250,246,235,0.7)] tracking-wide">
              Face Painting • Return Gifts • Crafts & Arts • Pooja Rentals
            </p>
          </div>
        </div>
      </section>

      {/* Our Services & Featured Collections Section */}
      <section 
        id="services" 
        className="relative py-24 px-6 md:px-16 border-b border-[#C9A84C]/25"
        style={{
          background: 'linear-gradient(rgba(244, 249, 246, 0.85), rgba(228, 242, 234, 0.88)), url(https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=1200) center/cover no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 reveal-element">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#C9A84C] uppercase mb-3 block">
              FEATURED COLLECTIONS
            </span>
            <h2 className="font-serif text-3xl md:text-[46px] text-[#0B3D2E] font-medium tracking-wide">
              Our Services
            </h2>
            <div className="w-24 h-[1px] bg-[#C9A84C]/35 mx-auto mt-5" />
          </div>

          {/* Slideshow Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'jewellery',
                name: 'Handmade Jewellery',
                desc: 'Elegant, masterfully crafted organic and stone accessories designed to turn heads.',
                images: [
                  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
                ]
              },
              {
                id: 'gifts',
                name: 'Return Gifts',
                desc: 'Curated, handcrafted keepsakes that turn celebrations into lifetime memories.',
                images: [
                  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600',
                ]
              },
              {
                id: 'painting',
                name: 'Face Painting',
                desc: 'Whimsical, safe, and event-ready designs for every age and festive occasion.',
                images: [
                  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
                ]
              }
            ].map((card, cardIdx) => (
              <Link 
                key={card.id}
                to="/collection/$id"
                params={{ id: card.id }}
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
                className="reveal-element overflow-hidden bg-white/70 backdrop-blur-sm border border-[#C9A84C]/25 rounded-[16px] hover:border-[#E8C96B]/50 hover:bg-white/95 transition-all duration-300 shadow-[0_4px_30px_rgba(4,20,10,0.05)] hover:shadow-[0_10px_30px_rgba(201,168,76,0.1)] cursor-pointer group block"
              >
                {/* Slideshow Top Area */}
                <div className="relative h-64 overflow-hidden w-full rounded-t-[16px] bg-[#04140E]">
                  {card.images.map((imgUrl, imgIdx) => (
                    <img 
                      key={imgIdx}
                      src={imgUrl}
                      alt={`${card.name} slide ${imgIdx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${imgIdx === slideIndices[cardIdx] ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  
                  {/* Miniature Indicator Dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 z-10 select-none pointer-events-none">
                    {card.images.map((_, dotIdx) => (
                      <div 
                        key={dotIdx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${dotIdx === slideIndices[cardIdx] ? 'bg-[#E8C96B] scale-125' : 'bg-white/40'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Card Bottom Area */}
                <div className="p-6 text-left">
                  <h3 className="font-serif text-2xl text-[#0B3D2E] font-medium mb-3 group-hover:text-[#C9A84C] transition-colors">{card.name}</h3>
                  <p className="text-sm font-sans text-gray-700 leading-relaxed mb-6">{card.desc}</p>
                  <div className="pt-2">
                    <span 
                      className="inline-flex items-center text-[10px] tracking-[0.2em] font-semibold border border-[#C9A84C] text-[#C9A84C] rounded-full px-5 py-2.5 hover:bg-[#C9A84C] hover:text-white transition-all duration-300 uppercase cursor-pointer"
                    >
                      <span>SEE MORE</span>
                      <span className="ml-1.5 font-sans">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Arts & Crafts Section */}
      {(() => {
        const craftSlides = [
          {
            title: 'Lippan Art',
            img: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=800',
            desc: 'Traditional clay and mirror work showcasing intricate patterns and standard radial geometry that reflects light beautifully.',
            tag: 'LIPPAN ART'
          },
          {
            title: 'Custom Name Plates',
            img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
            desc: 'Bespoke hand-carved name plaques designed to represent family identity through stunning, hand-painted wooden contours.',
            tag: 'CUSTOM NAME PLATES'
          },
          {
            title: 'Mandala Art',
            img: 'https://res.cloudinary.com/diancfp03/image/upload/v1780162699/home_sa22ka.png',
            desc: 'Sacred concentric circular designs that capture cosmic symmetry, masterfully drafted using authentic artisan colors.',
            tag: 'MANDALA ART'
          },
          {
            title: 'Mehandi',
            img: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=800',
            desc: 'Intricate and traditional bridal-grade henna patterns hand-drawn with organic plant-based pastes.',
            tag: 'MEHANDI'
          },
          {
            title: 'Wood & Pot Painting',
            img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
            desc: 'Vibrant acrylic detailing applied on natural clay vessels and high-quality seasoned wood objects.',
            tag: 'WOOD AND POT PAINTING'
          },
          {
            title: 'Canvas Painting',
            img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
            desc: 'Premium traditional paintings on high-quality stretched canvas, capturing cultural scenes and geometric alignments.',
            tag: 'CANVAS PAINTING'
          }
        ];

        const activeSlide = craftSlides[currentCraftIndex];

        return (
          <section 
            id="arts-crafts" 
            className="relative py-20 px-6 md:px-16 border-b border-[#C9A84C]/25"
            style={{
              background: 'linear-gradient(rgba(235, 225, 218, 0.88), rgba(248, 222, 203, 0.90)), url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200) center/cover no-repeat'
            }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16 reveal-element">
                <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#C9A84C] uppercase mb-3 block">
                  EXPLORE HERITAGE SKILLS
                </span>
                <h2 className="font-serif text-3xl md:text-[46px] text-[#0B3D2E] font-medium tracking-wide">
                  Our Arts & Crafts
                </h2>
                <div className="w-24 h-[1px] bg-[#C9A84C]/35 mx-auto mt-5" />
              </div>

              {/* Premium 50/50 Card Split - Grand Height Layout */}
              <div className="relative rounded-[24px] overflow-hidden flex flex-col lg:flex-row border border-[#C9A84C]/30 shadow-2xl min-h-[500px] md:h-[550px]">
                
                {/* Left Side Content panel (Sage/Forest Green) */}
                <div className="w-full lg:w-[45%] bg-white/90 backdrop-blur-sm p-8 md:p-14 flex flex-col justify-between items-start text-left select-none relative z-10 border-r border-[#C9A84C]/20">
                  <div>
                    <span className="text-[10px] md:text-xs tracking-[0.3em] font-sans font-bold text-[#C9A84C] hover:text-[#E8C96B] transition-colors cursor-pointer uppercase mb-4 block inline-block">
                      ALSO FEATURING
                    </span>
                    <h3 className="font-serif text-3xl md:text-[42px] font-bold text-[#0B3D2E] tracking-wide leading-tight mb-6">
                      {activeSlide.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm leading-relaxed text-gray-700 mb-8 max-w-md">
                      {activeSlide.desc}
                    </p>
                    
                    {/* Dynamic tag buttons / capsules */}
                    <div className="flex flex-wrap gap-2.5 mb-8">
                      {craftSlides.map((slide, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentCraftIndex(idx)}
                          className={`text-[9px] md:text-[10px] tracking-[0.15em] font-bold px-4 py-2 rounded-full border transition-all duration-300 uppercase cursor-pointer ${
                            idx === currentCraftIndex
                              ? 'bg-[#0B3D2E] border-[#0B3D2E] text-white scale-105 shadow-md'
                              : 'border-[#C9A84C]/40 text-[#C9A84C]/80 hover:border-[#0B3D2E] hover:text-[#0B3D2E]'
                          }`}
                        >
                          {slide.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* "SEE MORE" Button placed on the left side */}
                  <Link 
                    to="/collection/$id" 
                    params={{ id: 'painting' }}
                    className="inline-flex items-center text-[10px] md:text-xs tracking-[0.2em] font-bold border border-[#0B3D2E] text-[#0B3D2E] rounded-full px-7 py-3 hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E] transition-all duration-300 uppercase cursor-pointer"
                  >
                    <span>SEE MORE</span>
                    <span className="ml-2 font-sans">→</span>
                  </Link>
                </div>

                {/* Right Side Slideshow Showcase */}
                <div 
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(
                    () => setCurrentCraftIndex(prev => (prev + 1) % craftSlides.length),
                    () => setCurrentCraftIndex(prev => (prev - 1 + craftSlides.length) % craftSlides.length)
                  )}
                  className="w-full lg:w-[55%] h-[350px] lg:h-full relative overflow-hidden bg-[#04140E]"
                >
                  {/* Photo transition layer */}
                  {craftSlides.map((slide, idx) => (
                    <img 
                      key={idx}
                      src={slide.img} 
                      alt={slide.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        idx === currentCraftIndex ? 'opacity-100' : 'opacity-0'
                      }`} 
                    />
                  ))}
                  
                  {/* Glassmorphic overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Manual Arrow Controls Overlay */}
                  <button 
                    onClick={() => setCurrentCraftIndex(prev => (prev - 1 + craftSlides.length) % craftSlides.length)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#0B3D2E] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg z-20"
                    aria-label="Previous Slide"
                  >
                    <span className="text-xl font-bold">←</span>
                  </button>

                  <button 
                    onClick={() => setCurrentCraftIndex(prev => (prev + 1) % craftSlides.length)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#0B3D2E] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg z-20"
                    aria-label="Next Slide"
                  >
                    <span className="text-xl font-bold">→</span>
                  </button>

                  {/* Dynamic Slide Title Overlay at the Bottom */}
                  <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end select-none pointer-events-none">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#E8C96B] font-bold mb-1.5 block">
                        {activeSlide.tag}
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl text-white font-medium">
                        {activeSlide.title}
                      </h4>
                    </div>
                    {/* Progress indicator */}
                    <div className="text-white/60 font-sans text-xs tracking-widest font-semibold">
                      {currentCraftIndex + 1} / {craftSlides.length}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* Pooja & Event Rentals Section - Reversed Split Layout */}
      {(() => {
        const poojaSlides = [
          {
            title: 'Brass Samai Lamps',
            img: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
            desc: 'Stunning polished brass lamps (Kuthu Vilakku) designed to bring divine and traditional light to any home celebration.',
            tag: 'DIVINE LIGHTS'
          },
          {
            title: 'Traditional Backdrops',
            img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=800',
            desc: 'Elegant event backdrop walls decorated with marigolds, green leaves, and sacred lotus medallion borders.',
            tag: 'STAGE BACKDROPS'
          },
          {
            title: 'Artisan Urli Bowls',
            img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
            desc: 'Hammered brass bowls ideal for floating flowers, candles, and welcoming guests with classical Indian charm.',
            tag: 'DECORATIVE URLIS'
          },
          {
            title: 'Pooja Mandir & Chowkis',
            img: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800',
            desc: 'Hand-carved premium wooden temples and low-height decorated stools (chowkis) finished with gold leafing.',
            tag: 'SACRED CHOWKIS'
          },
          {
            title: 'Traditional Umbrellas & Props',
            img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800',
            desc: 'Stunning parasols, hanging brass bells, and decorative elements to elevate the festive ambiance.',
            tag: 'FESTIVE PROPS'
          }
        ];

        const activeSlide = poojaSlides[currentPoojaIndex];

        return (
          <section 
            id="pooja-rentals" 
            className="relative py-20 px-6 md:px-16 border-b border-[#C9A84C]/25"
            style={{
              background: 'linear-gradient(rgba(235, 225, 218, 0.88), rgba(248, 222, 203, 0.90)), url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200) center/cover no-repeat'
            }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16 reveal-element">
                <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#C9A84C] uppercase mb-3 block">
                  CELEBRATIONS MADE DIVINE
                </span>
                <h2 className="font-serif text-3xl md:text-[46px] text-[#0B3D2E] font-medium tracking-wide">
                  Pooja & Event Rentals
                </h2>
                <div className="w-24 h-[1px] bg-[#C9A84C]/35 mx-auto mt-5" />
              </div>

              {/* Premium 50/50 Card Split - Reversed Layout (Slideshow Left, Details Right) */}
              <div className="relative rounded-[24px] overflow-hidden flex flex-col lg:flex-row border border-[#C9A84C]/30 shadow-2xl min-h-[500px] md:h-[550px]">
                
                {/* LEFT Side Slideshow Showcase */}
                <div 
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(
                    () => setCurrentPoojaIndex(prev => (prev + 1) % poojaSlides.length),
                    () => setCurrentPoojaIndex(prev => (prev - 1 + poojaSlides.length) % poojaSlides.length)
                  )}
                  className="w-full lg:w-[55%] h-[350px] lg:h-full relative overflow-hidden bg-[#04140E] order-2 lg:order-1"
                >
                  {/* Photo transition layer */}
                  {poojaSlides.map((slide, idx) => (
                    <img 
                      key={idx}
                      src={slide.img} 
                      alt={slide.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        idx === currentPoojaIndex ? 'opacity-100' : 'opacity-0'
                      }`} 
                    />
                  ))}
                  
                  {/* Glassmorphic overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Manual Arrow Controls Overlay */}
                  <button 
                    onClick={() => setCurrentPoojaIndex(prev => (prev - 1 + poojaSlides.length) % poojaSlides.length)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#0B3D2E] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg z-20"
                    aria-label="Previous Slide"
                  >
                    <span className="text-xl font-bold">←</span>
                  </button>

                  <button 
                    onClick={() => setCurrentPoojaIndex(prev => (prev + 1) % poojaSlides.length)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#0B3D2E] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg z-20"
                    aria-label="Next Slide"
                  >
                    <span className="text-xl font-bold">→</span>
                  </button>

                  {/* Dynamic Slide Title Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end select-none pointer-events-none">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#E8C96B] font-bold mb-1.5 block">
                        {activeSlide.tag}
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl text-white font-medium">
                        {activeSlide.title}
                      </h4>
                    </div>
                    {/* Progress indicator */}
                    <div className="text-white/60 font-sans text-xs tracking-widest font-semibold">
                      {currentPoojaIndex + 1} / {poojaSlides.length}
                    </div>
                  </div>
                </div>

                {/* RIGHT Side Content panel (Sage/Forest Green) */}
                <div className="w-full lg:w-[45%] bg-white/90 backdrop-blur-sm p-8 md:p-14 flex flex-col justify-between items-start text-left select-none relative z-10 border-l border-[#C9A84C]/20 order-1 lg:order-2">
                  <div>
                    <span className="text-[10px] md:text-xs tracking-[0.3em] font-sans font-bold text-[#C9A84C] hover:text-[#E8C96B] transition-colors cursor-pointer uppercase mb-4 block inline-block">
                      ALSO FEATURING
                    </span>
                    <h3 className="font-serif text-3xl md:text-[42px] font-bold text-[#0B3D2E] tracking-wide leading-tight mb-6">
                      {activeSlide.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm leading-relaxed text-gray-700 mb-8 max-w-md">
                      {activeSlide.desc}
                    </p>
                    
                    {/* Dynamic tag buttons / capsules */}
                    <div className="flex flex-wrap gap-2.5 mb-8">
                      {poojaSlides.map((slide, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPoojaIndex(idx)}
                          className={`text-[9px] md:text-[10px] tracking-[0.15em] font-bold px-4 py-2 rounded-full border transition-all duration-300 uppercase cursor-pointer ${
                            idx === currentPoojaIndex
                              ? 'bg-[#0B3D2E] border-[#0B3D2E] text-white scale-105 shadow-md'
                              : 'border-[#C9A84C]/40 text-[#C9A84C]/80 hover:border-[#0B3D2E] hover:text-[#0B3D2E]'
                          }`}
                        >
                          {slide.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* "SEE MORE" Button placed on the right side details block */}
                  <Link 
                    to="/collection/$id" 
                    params={{ id: 'gifts' }}
                    className="inline-flex items-center text-[10px] md:text-xs tracking-[0.2em] font-bold border border-[#0B3D2E] text-[#0B3D2E] rounded-full px-7 py-3 hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E] transition-all duration-300 uppercase cursor-pointer"
                  >
                    <span>SEE MORE</span>
                    <span className="ml-2 font-sans">→</span>
                  </Link>
                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* Our Story Section */}
      <section 
        id="our-story"
        className="relative py-24 px-6 md:px-16 border-b border-[#C9A84C]/25"
        style={{
          background: 'linear-gradient(rgba(244, 249, 246, 0.85), rgba(228, 242, 234, 0.88)), url(https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200) center/cover no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
          
          {/* LEFT SIDE - Narrative Prose */}
          <div className="w-full lg:w-[48%] text-left">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] text-[#C9A84C] uppercase mb-4 block">
              OUR STORY
            </span>
            <h2 className="font-serif text-3xl md:text-[46px] text-[#0B3D2E] font-medium leading-tight mb-8">
              Where Creativity<br />Meets Celebration
            </h2>
            <div className="w-20 h-[1.5px] bg-[#C9A84C]/45 mb-8" />
            
            <div className="space-y-6 font-sans text-xs md:text-sm leading-relaxed text-gray-700">
              <p className="font-medium text-[#0B3D2E] text-sm md:text-base leading-relaxed">
                Welcome to CraftNest, where creativity meets celebration!
              </p>
              <p>
                CraftNest was born from a passion for handmade art, personalized gifts, and creating memorable experiences for families and children. What started as a hobby of crafting unique handmade creations gradually grew into a business dedicated to bringing joy through art and creativity.
              </p>
              <p>
                At CraftNest, we believe handmade creations tell a story. Every item we create is crafted with love and designed to make your celebrations more meaningful and memorable.
              </p>
            </div>

            {/* Elegant Inline Project Showcase Pic */}
            <div className="mt-8 rounded-[16px] overflow-hidden border border-[#C9A84C]/25 shadow-md h-[180px] select-none">
              <img 
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800" 
                alt="CraftNest Handcrafted Art Project" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Support Message Box */}
            <div className="mt-8 p-6 rounded-[16px] bg-[#0B3D2E]/5 border border-[#C9A84C]/25 text-left relative overflow-hidden">
              <div className="absolute right-4 bottom-2 opacity-5 select-none font-serif text-8xl text-[#0B3D2E]">
                ”
              </div>
              <p className="font-serif italic text-xs md:text-sm text-gray-800 leading-relaxed relative z-10">
                "Thank you for supporting our small business and allowing us to be a part of your special moments."
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Specialties Cards Grid */}
          <div className="w-full lg:w-[48%] text-left">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] text-[#C9A84C] uppercase mb-6 block">
              WHAT WE SPECIALIZE IN
            </span>

            <div className="flex flex-col gap-6">
              {/* Specialty Item 1 */}
              <div 
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
                className="bg-white/70 backdrop-blur-sm border border-[#C9A84C]/25 rounded-[20px] p-6 md:p-8 shadow-sm hover:shadow-md hover:border-[#E8C96B]/50 hover:bg-white/95 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B3D2E] border border-[#C9A84C]/20 flex items-center justify-center text-xl shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#0B3D2E] transition-colors duration-300">
                    🎨
                  </div>
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-bold text-[#0B3D2E] mb-2 group-hover:text-[#C9A84C] transition-colors">
                      Face Painting
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                      Transforming birthdays, festivals, school events, and parties into colorful and unforgettable experiences with fun and creative face painting designs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Specialty Item 2 */}
              <div 
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
                className="bg-white/70 backdrop-blur-sm border border-[#C9A84C]/25 rounded-[20px] p-6 md:p-8 shadow-sm hover:shadow-md hover:border-[#E8C96B]/50 hover:bg-white/95 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B3D2E] border border-[#C9A84C]/20 flex items-center justify-center text-xl shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#0B3D2E] transition-colors duration-300">
                    🎁
                  </div>
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-bold text-[#0B3D2E] mb-2 group-hover:text-[#C9A84C] transition-colors">
                      Return Gifts
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                      Thoughtfully handcrafted return gifts that add a personal touch to every occasion. From custom hair accessories and bangles to unique keepsakes, we create gifts your guests will love and remember.
                    </p>
                  </div>
                </div>
              </div>

              {/* Specialty Item 3 */}
              <div 
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
                className="bg-white/70 backdrop-blur-sm border border-[#C9A84C]/25 rounded-[20px] p-6 md:p-8 shadow-sm hover:shadow-md hover:border-[#E8C96B]/50 hover:bg-white/95 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B3D2E] border border-[#C9A84C]/20 flex items-center justify-center text-xl shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#0B3D2E] transition-colors duration-300">
                    🖌️
                  </div>
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-bold text-[#0B3D2E] mb-2 group-hover:text-[#C9A84C] transition-colors">
                      Crafts & Arts
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                      From traditional Lippan Art and personalized nameplates to mandala art, canvas painting, wood painting, and custom handmade décor, every piece is designed with care, creativity, and attention to detail.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Fullscreen Blurred Interactive Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#04140E]/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in select-none"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#0B3D2E]/95 border border-[#C9A84C]/45 rounded-[24px] p-6 md:p-10 shadow-2xl flex flex-col justify-between overflow-y-auto max-h-[90vh] text-[#E8C96B] gold-glow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Exit Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#C9A84C]/35 hover:border-[#E8C96B] flex items-center justify-center text-[#C9A84C] hover:text-[#E8C96B] transition-all hover:scale-110 cursor-pointer"
              aria-label="Close Modal"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Content */}
            <div className="mb-8">
              <span className="text-[10px] md:text-xs font-sans tracking-[0.25em] text-[#C9A84C] font-semibold uppercase block mb-2">
                {activeModal === 'jewellery' && 'Geometric Sacred Adornment'}
                {activeModal === 'gifts' && 'Artisan Keepsake Customization'}
                {activeModal === 'painting' && 'Sacred Body Art Geometry'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#E8C96B] font-medium leading-none">
                {activeModal === 'jewellery' && 'Handmade Jewellery Collection'}
                {activeModal === 'gifts' && 'Return Gifts & Keepsakes'}
                {activeModal === 'painting' && 'Face Painting Masterpieces'}
              </h2>
              <div className="w-20 h-[1.5px] bg-[#C9A84C]/40 mt-4" />
            </div>

            {/* Showcase Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {activeModal === 'jewellery' && [
                {
                  title: 'Chakra Mandala Necklace',
                  geom: 'Sacred Octagon Geometry',
                  desc: 'Handcrafted copper-wire wrapped necklace, aligned with sacred octagonal geometry for energy shielding.'
                },
                {
                  title: 'Kundalini Gold Bangles',
                  geom: 'Fibonacci Spiral Contours',
                  desc: 'Solid gold alloy bangles engraved with the Fibonacci golden spiral curves and inset rubies.'
                },
                {
                  title: 'Golden Lotus Studs',
                  geom: 'Lotus-Petal Concentrics',
                  desc: 'Perfect concentric petals crafted in 22K yellow gold, representing standard lotus growth symmetry.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-[#0F5C42]/50 border border-[#C9A84C]/25 rounded-[16px] hover:border-[#E8C96B]/80 hover:scale-[1.03] transition-all duration-300 shadow-lg flex flex-col justify-between group cursor-default text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A84C]/70 font-semibold">{item.geom}</span>
                    <h4 className="font-serif text-lg text-white font-medium mt-1 mb-3 group-hover:text-[#E8C96B] transition-colors">{item.title}</h4>
                    <p className="text-xs font-sans text-[rgba(232,201,107,0.7)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}

              {activeModal === 'gifts' && [
                {
                  title: 'Torus Sacred Keepsake Case',
                  geom: '3D Sacred Torus Engraving',
                  desc: 'Premium walnut wood box featuring laser-carved Sacred Torus lines, padded with ivory velvet.'
                },
                {
                  title: 'Cube-in-Cube Gold Box',
                  geom: 'Metatron Hypercube Frame',
                  desc: 'Folding metallic return-gift casing aligned with 4D hypercube frames, layered in thin gold foil.'
                },
                {
                  title: 'Meridian Brass Gifting Urn',
                  geom: 'Concentric brass rings',
                  desc: 'A gorgeous decorative gifting vessel crafted with perfect lathe concentric brass alignments.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-[#0F5C42]/50 border border-[#C9A84C]/25 rounded-[16px] hover:border-[#E8C96B]/80 hover:scale-[1.03] transition-all duration-300 shadow-lg flex flex-col justify-between group cursor-default text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A84C]/70 font-semibold">{item.geom}</span>
                    <h4 className="font-serif text-lg text-white font-medium mt-1 mb-3 group-hover:text-[#E8C96B] transition-colors">{item.title}</h4>
                    <p className="text-xs font-sans text-[rgba(232,201,107,0.7)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}

              {activeModal === 'painting' && [
                {
                  title: 'Fractal Butterfly Design',
                  geom: 'Symmetrical Fractal Shapes',
                  desc: 'Full-face colorful butterfly mask painted using perfect organic fractal grid alignments.'
                },
                {
                  title: 'Golden Spiral Eye Frame',
                  geom: 'Golden Ratio Eye Curves',
                  desc: 'Elegant orbital strokes applied around the temple and eyes in shimmering gold, based on golden ratios.'
                },
                {
                  title: 'Mandala forehead Piece',
                  geom: 'Sacred Concentric Mandala',
                  desc: 'Intricate micro-mandala center dot painted centered on the forehead using organic natural dyes.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-[#0F5C42]/50 border border-[#C9A84C]/25 rounded-[16px] hover:border-[#E8C96B]/80 hover:scale-[1.03] transition-all duration-300 shadow-lg flex flex-col justify-between group cursor-default text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A84C]/70 font-semibold">{item.geom}</span>
                    <h4 className="font-serif text-lg text-white font-medium mt-1 mb-3 group-hover:text-[#E8C96B] transition-colors">{item.title}</h4>
                    <p className="text-xs font-sans text-[rgba(232,201,107,0.7)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom Detail */}
            <div className="text-center text-xs text-[#C9A84C]/65 border-t border-[#C9A84C]/20 pt-6">
              *All items are handmade, custom-designed, and aligned with traditional sacred geometry principles.
            </div>
          </div>
        </div>
      )}


      {/* Premium Sliding Cart Drawer */}
      <div 
        className={`fixed inset-0 z-[99999] transition-all duration-500 ease-in-out ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsCartOpen(false)}
          className={`absolute inset-0 bg-[#04140E]/80 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Drawer container panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#071A10] border-l border-[#C9A84C]/35 shadow-[0_0_50px_rgba(4,20,10,0.8)] flex flex-col justify-between transition-transform duration-500 ease-in-out transform ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#C9A84C]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E8C96B]" />
              <h3 className="font-serif text-xl font-bold text-white tracking-wide uppercase">Your Selection</h3>
              <span className="bg-[#E8C96B] text-[#0B3D2E] text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border border-[#C9A84C]/30 hover:border-[#E8C96B] flex items-center justify-center text-[#C9A84C] hover:text-[#E8C96B] transition-all cursor-pointer"
              aria-label="Close Cart"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Item List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
                <span className="text-4xl">🎁</span>
                <p className="font-serif text-base text-[#E8C96B]">Your cart is empty</p>
                <p className="font-sans text-xs text-white/50 max-w-[240px]">Explore our featured collections and select custom keepsakes to begin.</p>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    const servicesSection = document.getElementById('services');
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="font-sans text-[10px] tracking-[0.2em] font-semibold border border-[#C9A84C] text-[#C9A84C] rounded-full px-5 py-2.5 hover:bg-[#C9A84C] hover:text-[#0B3D2E] transition-all duration-300 uppercase cursor-pointer"
                >
                  Browse Art
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-[#0B3D2E]/60 border border-[#C9A84C]/20 rounded-[16px] flex items-center justify-between gap-4 animate-scale-in text-left"
                >
                  <div className="flex-1">
                    <h4 className="font-serif text-sm font-semibold text-white leading-tight mb-1">{item.title}</h4>
                    <p className="font-sans text-xs text-[#E8C96B] font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.title, -1)}
                      className="w-6 h-6 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0B3D2E] flex items-center justify-center text-xs transition-all cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="font-sans text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.title, 1)}
                      className="w-6 h-6 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0B3D2E] flex items-center justify-center text-xs transition-all cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove button */}
                  <button 
                    onClick={() => removeFromCart(item.title)}
                    className="text-white/40 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    aria-label="Remove Item"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer details with total & Checkout Enquire button */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#C9A84C]/25 bg-[#04140E] space-y-4">
              <div className="flex items-center justify-between font-serif text-white">
                <span className="text-sm font-medium tracking-wide">SUBTOTAL</span>
                <span className="text-lg font-bold text-[#E8C96B]">
                  ₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('en-IN')}
                </span>
              </div>
              
              <button 
                onClick={() => {
                  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                  const itemsList = cartItems.map(item => `• *${item.title}* (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n');
                  
                  const messageString = `Hello CraftNest! I would like to enquire about the following handcrafted items in my cart:\n\n${itemsList}\n\n*Total Estimated Order:* ₹${subtotal.toLocaleString('en-IN')}\n\nPlease let me know how we can proceed. Thank you!`;
                  
                  const encodedMessage = encodeURIComponent(messageString);
                  const whatsappRedirectUrl = `https://wa.me/14704527988?text=${encodedMessage}`;
                  window.open(whatsappRedirectUrl, '_blank');
                }}
                className="w-full bg-[#E8C96B] hover:bg-[#EDD06A] text-[#0B3D2E] py-4 rounded-[12px] text-xs tracking-[0.25em] font-sans font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.727-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.83.001-2.628-1.02-5.1-2.871-6.953C16.596 1.968 14.12 .946 11.5 .944 6.066.944 1.65 5.356 1.647 10.782c-.001 1.732.463 3.42 1.343 4.927l-.988 3.6 3.69-.966z" />
                </svg>
                <span>Enquire Cart via WhatsApp</span>
              </button>

              <button 
                onClick={() => setCartItems([])}
                className="w-full text-center text-[10px] tracking-widest text-[#C9A84C]/60 hover:text-white uppercase transition-colors py-1 cursor-pointer font-bold"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>



      {/* Contact Section - "Let's Create Together" */}
      <section 
        id="contact"
        className="relative py-24 px-6 md:px-16"
        style={{
          background: 'linear-gradient(rgba(11, 61, 46, 0.92), rgba(5, 26, 18, 0.95)), url(/contact_shop_inquiry.png) center/cover no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
          {/* LEFT SIDE - Info & Socials */}
          <div className="w-full lg:w-[48%] text-left">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] text-[#C9A84C] uppercase mb-4 block">
              CONTACT US
            </span>
            <h2 className="font-serif text-4xl md:text-[56px] text-[#E8C96B] font-medium leading-[1.1] mb-6">
              Let's Create<br />Together
            </h2>
            <p className="font-sans text-xs md:text-sm leading-relaxed text-white/85 mb-10 max-w-md">
              Have a custom request or planning an event? Reach out for bespoke art pieces, professional face painting, or luxury gift packages.
            </p>

            {/* Icon Contact Rows */}
            <div className="flex flex-col gap-5 mb-10">
              {/* Phone row */}
              <div className="flex items-center gap-4 text-[#C9A84C] font-sans text-xs md:text-sm">
                <div className="w-10 h-10 rounded-full border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C] shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 00.6 3.79 1 1 0 01-.27 1.11z"/>
                  </svg>
                </div>
                <span className="text-white/90 font-semibold">+1 (470) 452-7988</span>
              </div>

              {/* Location row */}
              <div className="flex items-center gap-4 text-[#C9A84C] font-sans text-xs md:text-sm">
                <div className="w-10 h-10 rounded-full border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C] shrink-0">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-white/90 font-semibold">Hyderabad, India</span>
              </div>

              {/* Web row */}
              <div className="flex items-center gap-4 text-[#C9A84C] font-sans text-xs md:text-sm">
                <div className="w-10 h-10 rounded-full border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C] shrink-0">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="text-white/90 font-semibold">www.craftnestshop.com</span>
              </div>
            </div>

            {/* Social Pill Buttons */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://wa.me/14704527988" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#00C28A] hover:bg-[#00B07C] text-white px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>WhatsApp Us</span>
              </a>

              <a 
                href="https://www.instagram.com/jewelryhivebycraftnest/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE - Enquiry Card Form */}
          <div className="w-full lg:w-[46%]">
            <div className="bg-[#071A10]/90 backdrop-blur-md border border-[#C9A84C]/35 rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden select-none gold-glow">
              <h3 className="font-serif text-2xl font-semibold text-[#E8C96B] tracking-wide mb-6">
                Send an Enquiry
              </h3>

              {formSubmitted ? (
                <div className="py-16 text-center flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#E8C96B]/10 flex items-center justify-center text-[#E8C96B] mb-6">
                    <svg className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#E8C96B] mb-2">Thank you!</h4>
                  <p className="font-sans text-xs text-white/80 max-w-xs mx-auto leading-relaxed">
                    Your custom request has been successfully submitted. We will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setContactData({ fullName: '', phoneNumber: '', serviceNeeded: '', eventDate: '', message: '' });
                      setFormSubmitted(false);
                    }}
                    className="mt-8 text-xs font-bold text-[#E8C96B] border-b border-[#E8C96B] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all tracking-wider uppercase cursor-pointer"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    
                    // Construct a beautifully formatted and pre-filled WhatsApp message sentence structure
                    const messageString = `Hello! I would like to submit an enquiry. Here are my details:

• *Full Name:* ${contactData.fullName}
• *Phone Number:* ${contactData.phoneNumber}
• *Service Needed:* ${contactData.serviceNeeded}
• *Event Date:* ${contactData.eventDate}
• *Details/Requirement:* ${contactData.message}`;

                    const encodedMessage = encodeURIComponent(messageString);
                    const whatsappRedirectUrl = `https://wa.me/14704527988?text=${encodedMessage}`;
                    
                    // Open the pre-filled WhatsApp message in a new window/tab
                    window.open(whatsappRedirectUrl, '_blank');
                    
                    // Set submitted state to show success layout on the website
                    setFormSubmitted(true);
                  }} 
                  className="space-y-5 text-left"
                >
                  <div>
                    <label className="text-[9px] md:text-[10px] tracking-wider text-[#C9A84C] font-bold uppercase mb-1.5 block">
                      FULL NAME
                    </label>
                    <input 
                      type="text" 
                      required
                      value={contactData.fullName}
                      onChange={(e) => setContactData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-[#C9A84C]/35 rounded-[8px] px-4 py-3 text-xs md:text-sm text-white bg-[#0B3D2E]/50 placeholder-white/30 focus:outline-none focus:border-[#E8C96B] focus:ring-1 focus:ring-[#E8C96B] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] md:text-[10px] tracking-wider text-[#C9A84C] font-bold uppercase mb-1.5 block">
                      PHONE NUMBER
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={contactData.phoneNumber}
                      onChange={(e) => setContactData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="Your contact number"
                      className="w-full border border-[#C9A84C]/35 rounded-[8px] px-4 py-3 text-xs md:text-sm text-white bg-[#0B3D2E]/50 placeholder-white/30 focus:outline-none focus:border-[#E8C96B] focus:ring-1 focus:ring-[#E8C96B] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] md:text-[10px] tracking-wider text-[#C9A84C] font-bold uppercase mb-1.5 block">
                      SERVICE NEEDED
                    </label>
                    <select 
                      required
                      value={contactData.serviceNeeded}
                      onChange={(e) => setContactData(prev => ({ ...prev, serviceNeeded: e.target.value }))}
                      className="w-full border border-[#C9A84C]/35 rounded-[8px] px-4 py-3 text-xs md:text-sm text-white bg-[#0B3D2E]/50 focus:outline-none focus:border-[#E8C96B] focus:ring-1 focus:ring-[#E8C96B] transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#0B3D2E] text-white">Select...</option>
                      <option value="Handmade Jewellery" className="bg-[#0B3D2E] text-white">Handmade Jewellery</option>
                      <option value="Arts & Crafts" className="bg-[#0B3D2E] text-white">Arts & Crafts</option>
                      <option value="Pooja & Event Rentals" className="bg-[#0B3D2E] text-white">Pooja & Event Rentals</option>
                      <option value="Custom Return Gifts" className="bg-[#0B3D2E] text-white">Custom Return Gifts & Keepsakes</option>
                      <option value="Other" className="bg-[#0B3D2E] text-white">Other Bespoke Requests</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] md:text-[10px] tracking-wider text-[#C9A84C] font-bold uppercase mb-1.5 block">
                      EVENT DATE
                    </label>
                    <input 
                      type="date" 
                      required
                      value={contactData.eventDate}
                      onChange={(e) => setContactData(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full border border-[#C9A84C]/35 rounded-[8px] px-4 py-3 text-xs md:text-sm text-white bg-[#0B3D2E]/50 focus:outline-none focus:border-[#E8C96B] focus:ring-1 focus:ring-[#E8C96B] transition-all cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] md:text-[10px] tracking-wider text-[#C9A84C] font-bold uppercase mb-1.5 block">
                      MESSAGE
                    </label>
                    <textarea 
                      rows={3}
                      required
                      value={contactData.message}
                      onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your requirement..."
                      className="w-full border border-[#C9A84C]/35 rounded-[8px] px-4 py-3 text-xs md:text-sm text-white bg-[#0B3D2E]/50 placeholder-white/30 focus:outline-none focus:border-[#E8C96B] focus:ring-1 focus:ring-[#E8C96B] transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#E8C96B] hover:bg-[#EDD06A] text-[#0B3D2E] py-4 rounded-[8px] text-[10px] md:text-xs tracking-[0.25em] font-sans font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01]"
                  >
                    <svg className="w-3.5 h-3.5 fill-current transform rotate-45" viewBox="0 0 24 24">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                    </svg>
                    <span>SEND ENQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Us / Proprietor Section */}
      <section 
        id="about-proprietor" 
        className="relative py-24 px-6 md:px-16 border-t border-[#C9A84C]/25"
        style={{
          background: 'linear-gradient(rgba(244, 249, 246, 0.94), rgba(228, 242, 234, 0.96)), url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200) center/cover no-repeat'
        }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          
          {/* Top Description & Contact Details Summary */}
          <div className="mb-12 reveal-element">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] text-[#C9A84C] hover:text-[#E8C96B] transition-colors cursor-pointer uppercase mb-4 block inline-block">
              OUR HERITAGE
            </span>
            <p className="font-serif italic text-base md:text-xl text-[#0B3D2E] leading-relaxed max-w-2xl mx-auto mb-6">
              "CraftNest is an artistic sanctuary dedicated to handcrafting bespoke legacy art, luxury return gifts, and creative event experiences that connect homes and hearts with traditional Indian heritage."
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#0B3D2E] font-sans text-xs md:text-sm font-semibold tracking-wide">
              <span>📞 +1 (470) 452-7988</span>
              <span className="text-[#C9A84C]/50">•</span>
              <span>📍 Hyderabad, India</span>
              <span className="text-[#C9A84C]/50">•</span>
              <span>🌐 www.craftnestshop.com</span>
            </div>
            <div className="w-20 h-[1px] bg-[#C9A84C]/35 mx-auto mt-8" />
          </div>

          {/* Center Brand Logo */}
          <div className="mb-4 reveal-element flex flex-col items-center justify-center select-none">
            <svg 
              viewBox="0 0 100 80" 
              className="w-28 h-24 shiny-logo-hover" 
              fill="none" 
              stroke="#0B3D2E" 
              strokeWidth="2.0" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Paint Palette Outer Shape */}
              <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.5" />
              {/* Large Thumb Hole */}
              <circle cx="37" cy="51" r="5.5" strokeWidth="2.0" fill="none" />
              {/* 7 Paint Wells */}
              <circle cx="23" cy="49" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="20" cy="40" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="22" cy="31" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="28" cy="23" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="36" cy="23" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="43" cy="27" r="3.2" strokeWidth="2.0" fill="none" />
              <circle cx="46" cy="35" r="3.2" strokeWidth="2.0" fill="none" />
              {/* Paintbrush */}
              <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="2.0" fill="none" />
              <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="2.0" fill="none" />
              <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="2.0" fill="none" />
            </svg>
          </div>

          {/* Name of Company - CRAFT NEST */}
          <h3 className="font-serif text-2xl md:text-3xl text-[#0B3D2E] tracking-[0.3em] pl-[0.3em] font-extrabold uppercase mb-2 reveal-element">
            CRAFT NEST
          </h3>

          {/* Role/Title */}
          <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3 reveal-element">
            Owner, Proprietor & Founder
          </span>

          {/* Custom Bizarre Handwriting Signature for Prasanthi Ganta */}
          <div className="reveal-element select-none py-2 flex items-center justify-center scale-105 md:scale-110">
            <div className="flex items-baseline font-cursive select-none">
              <span className="text-6xl md:text-7xl text-[#0B3D2E] font-serif font-extrabold leading-none italic select-none">P</span>
              <span className="text-3xl md:text-4xl text-[#C9A84C] tracking-wide font-normal -ml-1 select-none mr-3" style={{ fontFamily: 'var(--font-cursive)' }}>rasanthi</span>
              <span className="text-6xl md:text-7xl text-[#0B3D2E] font-serif font-extrabold leading-none italic select-none">G</span>
              <span className="text-3xl md:text-4xl text-[#C9A84C] tracking-wide font-normal -ml-1 select-none" style={{ fontFamily: 'var(--font-cursive)' }}>anta</span>
            </div>
          </div>

        </div>
      </section>



      {/* Footer Details */}
      <footer className="bg-[#0B3D2E] py-8 text-center text-xs tracking-widest text-[#C9A84C]/60 border-t border-[#C9A84C]/15">
        <p>© {new Date().getFullYear()} CRAFT NEST. ALL RIGHTS RESERVED. HANDMADE WITH PRIDE IN INDIA.</p>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <a 
          href="https://wa.me/14704527988" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Contact on WhatsApp"
          className="flex items-center justify-center w-[52px] h-[52px] bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ease-out hover:shadow-[0_4px_20px_rgba(37,211,102,0.4)] group"
        >
          {/* Custom SVG WhatsApp logo in white */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.004 2c-5.51 0-9.99 4.49-9.99 10 0 2 .59 3.88 1.61 5.47l-1.07 3.93 4.07-1.07c1.51.82 3.22 1.29 5.02 1.29 5.51 0 10-4.49 10-10s-4.49-10-10-10zm6.5 13.91c-.24.67-1.18 1.24-1.92 1.32-.51.05-1.18.08-3.41-.85-2.85-1.18-4.69-4.08-4.83-4.27-.14-.19-1.15-1.53-1.15-2.92S7.92 7.4 8.16 7.15c.24-.24.52-.31.7-.31.17 0 .34.01.49.02.16.01.37-.06.57.43.2.5.7 1.7.76 1.83.06.13.1.28.01.46-.09.18-.14.29-.28.45-.14.16-.3.36-.43.48-.15.14-.31.3-.13.61.18.31.8 1.31 1.71 2.12.91.81 1.67 1.06 2.05 1.25.31.16.49.14.67-.06.19-.22.82-.95 1.04-1.28.22-.33.45-.28.76-.16.31.12 1.97.93 2.31 1.1.34.17.57.25.65.39.09.14.09.82-.15 1.49z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
