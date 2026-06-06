import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'

export const Route = createFileRoute('/collection/$id')({
  component: CollectionPage,
})

// Collection Product Data
const collectionData: Record<string, {
  title: string
  subtitle: string
  bannerImg: string
  promoTitle: string
  promoSubtitle: string
  products: { title: string; geom: string; desc: string; price: string; img: string }[]
}> = {
  jewellery: {
    title: 'Handmade Jewellery',
    subtitle: 'Handmade Jewellery',
    bannerImg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    promoTitle: 'BUY 3 AT ₹2,999/-',
    promoSubtitle: '+ free gift + free shipping',
    products: [
      {
        title: 'Chakra Mandala Necklace',
        geom: 'Sacred Octagon Geometry',
        desc: 'Handcrafted copper-wire wrapped necklace, aligned with sacred octagonal geometry for energy shielding.',
        price: '₹5,600',
        img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Kundalini Gold Bangles',
        geom: 'Fibonacci Spiral Contours',
        desc: 'Solid gold alloy bangles engraved with the Fibonacci golden spiral curves and inset rubies.',
        price: '₹14,200',
        img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Golden Lotus Studs',
        geom: 'Lotus-Petal Concentrics',
        desc: 'Perfect concentric petals crafted in 22K yellow gold, representing standard lotus growth symmetry.',
        price: '₹3,900',
        img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Sacred Geometry Earring',
        geom: 'Seed of Life Brass',
        desc: 'Hand-cast brass earrings shaped with the Seed of Life fractal alignment, polished in gold sheen.',
        price: '₹4,500',
        img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Fibonacci Gold Rings',
        geom: 'Golden Ratio Contours',
        desc: 'Sleek minimalist gold rings contoured after the mathematical golden ratio spiral.',
        price: '₹8,200',
        img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Floral Lotus Choker',
        geom: 'Lotus-Torus Alignment',
        desc: 'Fine hand-woven golden choker aligned in Torus layout with sacred lotus blossom medallions.',
        price: '₹11,500',
        img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  gifts: {
    title: 'Return Gifts',
    subtitle: 'Return Gifts',
    bannerImg: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
    promoTitle: 'BUY 12 AT ₹4,999/-',
    promoSubtitle: '+ premium velvet wraps',
    products: [
      {
        title: 'Torus Sacred Keepsake Case',
        geom: '3D Sacred Torus Engraving',
        desc: 'Premium walnut wood box featuring laser-carved Sacred Torus lines, padded with ivory velvet.',
        price: '₹1,800',
        img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Cube-in-Cube Gold Box',
        geom: 'Metatron Hypercube Frame',
        desc: 'Folding metallic return-gift casing aligned with 4D hypercube frames, layered in thin gold foil.',
        price: '₹2,400',
        img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Meridian Brass Gifting Urn',
        geom: 'Concentric brass rings',
        desc: 'A gorgeous decorative gifting vessel crafted with perfect lathe concentric brass alignments.',
        price: '₹1,500',
        img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Hexagon Crystal Tray',
        geom: 'Crystal Hexagon Layout',
        desc: 'An elegant glass return tray shaped in six-fold crystal geometry for hosting keepsakes.',
        price: '₹3,200',
        img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Metatron Gift Box',
        geom: 'Metatron Vector Matrix',
        desc: 'Premium paper-board festive boxes printed with holographic Metatron vector matrices.',
        price: '₹2,100',
        img: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Flower of Life Hamper',
        geom: 'Concentric Grid Medallions',
        desc: 'Artisan hampers containing select keepsakes, printed with the classical Flower of Life grid.',
        price: '₹4,800',
        img: 'https://images.unsplash.com/photo-1572913166580-c179c3a37319?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  painting: {
    title: 'Face Painting',
    subtitle: 'Face Painting',
    bannerImg: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200',
    promoTitle: 'BOOK 3 KIDS GET 1 FREE',
    promoSubtitle: '+ natural organic paint upgrades',
    products: [
      {
        title: 'Fractal Butterfly Design',
        geom: 'Symmetrical Fractal Shapes',
        desc: 'Full-face colorful butterfly mask painted using perfect organic fractal grid alignments.',
        price: '₹2,500',
        img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Golden Spiral Eye Frame',
        geom: 'Golden Ratio Eye Curves',
        desc: 'Elegant orbital strokes applied around the temple and eyes in shimmering gold, based on golden ratios.',
        price: '₹1,800',
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Mandala forehead Piece',
        geom: 'Sacred Concentric Mandala',
        desc: 'Intricate micro-mandala center dot painted centered on the forehead using organic natural dyes.',
        price: '₹3,000',
        img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Cosmic Solar Eye Paint',
        geom: 'Concentric Solar Rays',
        desc: 'A gorgeous radial sunburst painted with copper and gold minerals surrounding the left temple.',
        price: '₹2,200',
        img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Tiger Fractal Pattern',
        geom: 'Symmetrical Tiger Alignments',
        desc: 'A highly detailed fractal representation of tiger fur lines designed centered around the forehead and nose.',
        price: '₹3,500',
        img: 'https://images.unsplash.com/photo-1516062423079-7ca13cca77a8?auto=format&fit=crop&q=80&w=300'
      },
      {
        title: 'Tribal Geometry Strokes',
        geom: 'Linear Chevron Borders',
        desc: 'Clean chevron cheek stripes and linear dots painted using vegan organic paints.',
        price: '₹1,500',
        img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=300'
      }
    ]
  }
}

function CollectionPage() {
  const { id } = Route.useParams()
  const data = collectionData[id] || collectionData.jewellery
  const [isScrolled, setIsScrolled] = useState(false)

  // Local state for wishlist and shopping cart
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<string[]>([])

  const toggleWishlist = (productTitle: string) => {
    setWishlist(prev => 
      prev.includes(productTitle) 
        ? prev.filter(title => title !== productTitle) 
        : [...prev, productTitle]
    )
  }

  const addToCart = (productTitle: string) => {
    setCart(prev => [...prev, productTitle])
  }

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

  return (
    <div 
      className="relative min-h-screen flex flex-col justify-between overflow-x-hidden"
      style={{
        background: `linear-gradient(rgba(244, 249, 246, 0.92), rgba(228, 242, 234, 0.94)), url(${data.bannerImg}) center/cover no-repeat fixed`
      }}
    >
      {/* Sticky Header / Navbar */}
      <header 
        className="fixed top-0 left-0 w-full z-[50] flex items-center justify-between px-6 md:px-16"
        style={
          isScrolled 
            ? {
                background: 'rgba(4, 20, 10, 0.94)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                height: '72px',
                transition: 'background 0.4s ease, padding 0.4s ease'
              }
            : {
                background: 'transparent',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                borderBottom: 'none',
                boxShadow: 'none',
                height: '72px',
                transition: 'background 0.4s ease, padding 0.4s ease'
              }
        }
      >
        {/* Logo in Top Left */}
        <div className="flex-1">
          <Link to="/" className="inline-flex items-center gap-2.5 font-serif text-xs md:text-sm text-[#E8C96B] font-bold select-none uppercase hover:opacity-100 transition-opacity">
            <svg 
              viewBox="0 0 100 80" 
              className="w-7 h-6 shiny-logo-hover" 
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
              {/* 7 Uniform Paint Wells */}
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
            <span className="flex items-center tracking-[0.16em] md:tracking-[0.24em] pl-[0.16em] md:pl-[0.24em]">
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
          </Link>
        </div>

        {/* Top Corner Wishlist and Cart Status Buttons (Right corner) */}
        <div className="flex-1 flex items-center justify-end gap-4 py-2">
          {/* Love Symbol Button (Wishlist) */}
          <div className="relative">
            <button 
              className="relative p-2.5 md:p-3 rounded-full border border-[#C9A84C]/40 text-[#E8C96B] hover:text-red-400 hover:border-[#C9A84C] hover:scale-105 bg-black/10 transition-all duration-300 cursor-pointer"
              title="Your Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 md:w-5 md:h-5 ${wishlist.length > 0 ? 'fill-red-500 stroke-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-sans text-[8px] md:text-[9px] font-bold w-4.5 h-4.5 md:w-5 md:h-5 rounded-full flex items-center justify-center border border-[#04140E]">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Cart Status Button */}
          <div className="relative">
            <button 
              className="relative p-2.5 md:p-3 rounded-full border border-[#C9A84C]/40 text-[#E8C96B] hover:text-[#FFF0B5] hover:border-[#C9A84C] hover:scale-105 bg-black/10 transition-all duration-300 cursor-pointer"
              title="Shopping Cart Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5 md:w-5 md:h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-[#0B3D2E] font-sans text-[8px] md:text-[9px] font-bold w-4.5 h-4.5 md:w-5 md:h-5 rounded-full flex items-center justify-center border border-[#04140E]">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 pb-20 flex-grow">
        
        {/* Dynamic Category Header with Back Button Beside It */}
        <div className="w-full text-center mb-8">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-4 md:gap-6">
            {/* Elegant Back arrow icon beside the heading with modern hover animation */}
            <Link 
              to="/" 
              className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0B3D2E] hover:scale-110 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              title="Back to Home"
            >
              <span className="text-lg md:text-xl font-bold transition-transform duration-300 group-hover:-translate-x-1">←</span>
            </Link>
            
            <h2 className="font-serif text-3xl md:text-5xl text-[#0B3D2E] font-medium tracking-wide">
              {data.subtitle}
            </h2>
          </div>
          {/* Intense full-width gold line stretching edge-to-edge */}
          <div className="w-full h-[2.5px] bg-[#C9A84C] mt-6 shadow-[0_1px_4px_rgba(201,168,76,0.3)] opacity-95" />
        </div>

        {/* Dynamic Infinite Moving Marquee Ticker */}
        {(() => {
          const marqueeItems = id === 'jewellery' 
            ? ['Thread Bangles', 'Handmade Earrings', 'Hair Clips', 'Hair Bands', 'Saree Pins']
            : data.products.map(p => p.title);
            
          return (
            <div className="max-w-6xl mx-auto relative py-4 border-y border-[#C9A84C]/25 mb-6 select-none overflow-hidden" style={{ background: 'rgba(250, 246, 235, 0.45)' }}>
              <div className="marquee-container">
                <div className="marquee-content font-serif italic text-base md:text-xl text-[#0B3D2E] tracking-widest">
                  {marqueeItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="inline-block transition-all duration-300 hover:text-[#C9A84C] hover:scale-110 cursor-pointer">
                        {item}
                      </span>
                      <span className="text-[#0B3D2E]/30 select-none mx-3">•</span>
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Duplicated for seamless loop */}
                <div className="marquee-content font-serif italic text-base md:text-xl text-[#0B3D2E] tracking-widest" aria-hidden="true">
                  {marqueeItems.map((item, idx) => (
                    <React.Fragment key={`dup-${idx}`}>
                      <span className="inline-block transition-all duration-300 hover:text-[#C9A84C] hover:scale-110 cursor-pointer">
                        {item}
                      </span>
                      <span className="text-[#0B3D2E]/30 select-none mx-3">•</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Premium E-commerce Split-Banner (Exactly matching user's attached layout) - Full screen edge-to-edge */}
        <div className="w-full mb-20 overflow-hidden">
          <div 
            className="relative flex flex-col md:flex-row border-y border-[#C9A84C]/30 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FAF6EB 0%, #EBE4DF 100%)'
            }}
          >
            {/* Left Image Showcase */}
            <div className="w-full md:w-1/2 h-[420px] md:h-[580px] relative overflow-hidden">
              <img 
                src={data.bannerImg} 
                alt={`${data.title} Banner`}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#EBE4DF]/80 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#EBE4DF]/90 to-transparent block md:hidden" />
            </div>

            {/* Right Promo Text Content (Replicating "BUY 12 AT ₹999/-") */}
            <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center items-center md:items-start text-center md:text-left select-none">
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-sans font-bold text-[#C9A84C] uppercase mb-4">
                SPECIAL FESTIVE CAMPAIGN
              </span>
              <h3 className="font-serif text-4xl md:text-6xl font-bold text-[#0B3D2E] uppercase tracking-wide leading-none mb-6">
                {data.promoTitle}
              </h3>
              <p className="font-sans text-xs md:text-base font-semibold text-[#0B3D2E]/80 tracking-widest uppercase mb-10">
                {data.promoSubtitle} + free gift + free shipping
              </p>
              
              {/* Shimmering CTA Ribbon */}
              <div className="bg-[#0B3D2E] text-[#E8C96B] font-sans text-xs tracking-[0.2em] font-semibold uppercase px-8 py-4 rounded-full shadow-xl border border-[#C9A84C]/30 animate-pulse">
                LIMITED OFFER AVAILABLE NOW
              </div>
            </div>

            {/* floating overlay badges */}
            <div className="absolute top-6 left-6 bg-red-600 text-white font-sans font-bold text-xs tracking-wider uppercase px-4 py-1.5 rounded-full shadow-md">
              SALE
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.products.map((item, idx) => (
              <div 
                key={idx} 
                className="overflow-hidden bg-white/70 backdrop-blur-md border border-[#C9A84C]/30 rounded-[20px] hover:border-[#C9A84C]/80 hover:bg-white hover:scale-[1.02] transition-all duration-300 shadow-[0_4px_30px_rgba(11,61,46,0.03)] hover:shadow-[0_12px_35px_rgba(201,168,76,0.12)] group"
              >
                {/* Product Image Area */}
                <div className="h-64 w-full bg-[#1A7A58]/20 relative overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#04140E]/15" />
                  <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest bg-[#0B3D2E]/90 text-[#E8C96B] border border-[#C9A84C]/30 px-3 py-1 rounded-full font-semibold select-none">
                    {item.geom}
                  </span>
                  
                  {/* Love Symbol Button on Bottom-Right of Image Area */}
                  <button 
                    onClick={() => toggleWishlist(item.title)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/85 hover:bg-white border border-[#C9A84C]/30 flex items-center justify-center shadow-md transition-all duration-300 group/heart cursor-pointer z-10"
                    title="Toggle Wishlist"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors duration-300 ${
                        wishlist.includes(item.title) 
                          ? 'fill-red-500 stroke-red-500' 
                          : 'text-[#0B3D2E] hover:stroke-red-500'
                      }`} 
                    />
                  </button>
                </div>

                {/* Product Detail Area */}
                <div className="p-6">
                  <h4 className="font-serif text-xl text-[#0B3D2E] font-medium mb-2 group-hover:text-[#C9A84C] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs font-sans text-[#0B3D2E]/70 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  
                  {/* Card Action Row */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#C9A84C]/15">
                    <span className="text-[#0B3D2E] font-bold text-base">{item.price}</span>
                    <button 
                      onClick={() => addToCart(item.title)}
                      className="text-[11px] md:text-xs tracking-[0.2em] font-semibold border border-[#C9A84C] text-[#C9A84C] rounded-full px-6 py-3 hover:bg-[#C9A84C] hover:text-[#0B3D2E] transition-all duration-300 uppercase cursor-pointer"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B3D2E] py-8 text-center text-xs tracking-widest text-[#C9A84C]/60 border-t border-[#C9A84C]/15">
        <p>© {new Date().getFullYear()} CRAFT NEST. ALL RIGHTS RESERVED. HANDMADE WITH PRIDE IN INDIA.</p>
      </footer>
    </div>
  )
}
