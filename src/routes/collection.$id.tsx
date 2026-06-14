import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const Route = createFileRoute('/collection/$id')({
  component: CollectionPage,
})

const collectionData: Record<string, {
  title: string
  subtitle: string
  tag: string
  bannerImg: string
  heroDesc: string
  promoTitle: string
  promoSubtitle: string
  filters: string[]
  products: { title: string; badge: string; desc: string; price: string; img: string; occasion: string }[]
}> = {
  jewellery: {
    title: 'Handmade Jewellery',
    subtitle: 'Worn with pride,\ncrafted with soul',
    tag: 'HANDMADE JEWELLERY',
    bannerImg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1400',
    heroDesc: 'Organic stones, sacred geometry, and artisan hands — every piece is a wearable story.',
    promoTitle: 'BUY 3 AT ₹2,999',
    promoSubtitle: 'Free gift wrapping + free shipping on bulk orders',
    filters: ['All', 'Bridal', 'Festival', 'Everyday', 'Custom'],
    products: [
      { title: 'Chakra Mandala Necklace', badge: 'Bestseller', desc: 'Copper-wire wrapped necklace aligned with sacred octagonal geometry for energy shielding.', price: '₹5,600', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600', occasion: 'Festival' },
      { title: 'Kundalini Gold Bangles', badge: 'Custom', desc: 'Solid gold-alloy bangles engraved with Fibonacci spiral curves and inset semi-precious stones.', price: '₹14,200', img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600', occasion: 'Bridal' },
      { title: 'Golden Lotus Studs', badge: 'New', desc: 'Perfect concentric petals crafted in 22K yellow gold, representing sacred lotus symmetry.', price: '₹3,900', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', occasion: 'Everyday' },
      { title: 'Sacred Geometry Earrings', badge: 'Limited', desc: 'Hand-cast brass earrings shaped with the Seed of Life fractal alignment, polished gold sheen.', price: '₹4,500', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', occasion: 'Festival' },
      { title: 'Fibonacci Gold Rings', badge: 'Custom', desc: 'Sleek minimalist gold rings contoured after the mathematical golden ratio spiral.', price: '₹8,200', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600', occasion: 'Everyday' },
      { title: 'Floral Lotus Choker', badge: 'Bridal', desc: 'Fine hand-woven golden choker in Torus layout with sacred lotus blossom medallions.', price: '₹11,500', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', occasion: 'Bridal' },
    ]
  },
  gifts: {
    title: 'Return Gifts',
    subtitle: 'Memories wrapped\nin craftsmanship',
    tag: 'RETURN GIFTS',
    bannerImg: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1400',
    heroDesc: 'Curated, handcrafted keepsakes your guests will treasure long after the celebration ends.',
    promoTitle: 'BUY 12 AT ₹4,999',
    promoSubtitle: 'Premium velvet wraps + personalised tags included',
    filters: ['All', 'Wedding', 'Birthday', 'Corporate', 'Festival', 'Custom'],
    products: [
      { title: 'Torus Sacred Keepsake Case', badge: 'Bestseller', desc: 'Premium walnut wood box featuring laser-carved Sacred Torus lines, padded with ivory velvet.', price: '₹1,800', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600', occasion: 'Wedding' },
      { title: 'Cube-in-Cube Gold Box', badge: 'New', desc: 'Folding metallic gift casing aligned with 4D hypercube frames, layered in thin gold foil.', price: '₹2,400', img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600', occasion: 'Festival' },
      { title: 'Meridian Brass Gifting Urn', badge: 'Custom', desc: 'A gorgeous decorative gifting vessel crafted with perfect lathe concentric brass alignments.', price: '₹1,500', img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600', occasion: 'Corporate' },
      { title: 'Hexagon Crystal Tray', badge: 'Limited', desc: 'An elegant glass return tray shaped in six-fold crystal geometry for hosting keepsakes.', price: '₹3,200', img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600', occasion: 'Wedding' },
      { title: 'Metatron Gift Box', badge: 'Festival', desc: 'Premium paper-board festive boxes printed with holographic Metatron vector matrices.', price: '₹2,100', img: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600', occasion: 'Festival' },
      { title: 'Flower of Life Hamper', badge: 'Bridal', desc: 'Artisan hampers containing select keepsakes, printed with the classical Flower of Life grid.', price: '₹4,800', img: 'https://images.unsplash.com/photo-1572913166580-c179c3a37319?auto=format&fit=crop&q=80&w=600', occasion: 'Wedding' },
    ]
  },
  painting: {
    title: 'Face Painting',
    subtitle: 'Art that wears\nthe crowd',
    tag: 'FACE PAINTING',
    bannerImg: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1400',
    heroDesc: 'Whimsical, safe, and event-ready designs. Only certified skin-safe colours. Perfect for all ages.',
    promoTitle: 'BOOK 3, GET 1 FREE',
    promoSubtitle: 'Natural organic paint upgrades included',
    filters: ['All', 'Kids', 'Adults', 'Festival', 'Corporate', 'Custom'],
    products: [
      { title: 'Fractal Butterfly Design', badge: 'Bestseller', desc: 'Full-face colorful butterfly mask painted using perfect organic fractal grid alignments.', price: '₹2,500', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=600', occasion: 'Kids' },
      { title: 'Golden Spiral Eye Frame', badge: 'Adults', desc: 'Elegant orbital strokes applied around the temple and eyes in shimmering gold, based on golden ratios.', price: '₹1,800', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600', occasion: 'Adults' },
      { title: 'Mandala Forehead Piece', badge: 'Festival', desc: 'Intricate micro-mandala center dot painted centered on the forehead using organic natural dyes.', price: '₹3,000', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600', occasion: 'Festival' },
      { title: 'Cosmic Solar Eye Paint', badge: 'New', desc: 'A gorgeous radial sunburst painted with copper and gold minerals surrounding the left temple.', price: '₹2,200', img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600', occasion: 'Adults' },
      { title: 'Tiger Fractal Pattern', badge: 'Kids', desc: 'A highly detailed fractal representation of tiger fur lines designed centered around the forehead and nose.', price: '₹3,500', img: 'https://images.unsplash.com/photo-1516062423079-7ca13cca77a8?auto=format&fit=crop&q=80&w=600', occasion: 'Kids' },
      { title: 'Tribal Geometry Strokes', badge: 'Custom', desc: 'Clean chevron cheek stripes and linear dots painted using vegan organic paints.', price: '₹1,500', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600', occasion: 'Corporate' },
    ]
  }
}

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-[#C9A84C] text-[#0B3D2E]',
  New: 'bg-emerald-600 text-white',
  Custom: 'bg-[#0F3D28] border border-[#C9A84C]/40 text-[#E8C96B]',
  Limited: 'bg-red-700/80 text-white',
  Bridal: 'bg-rose-700/80 text-white',
  Festival: 'bg-amber-700/80 text-white',
  Adults: 'bg-slate-700 text-white',
  Kids: 'bg-sky-700 text-white',
}

function CollectionPage() {
  const { id } = Route.useParams()
  const data = collectionData[id] || collectionData.jewellery
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [wishlist, setWishlist] = useState<string[]>([])

  const { cartItems, setIsCartOpen, addToCart } = useCart()

  const toggleWishlist = (t: string) =>
    setWishlist(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const visibleProducts = activeFilter === 'All'
    ? data.products
    : data.products.filter(p => p.occasion === activeFilter || p.badge === activeFilter)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col bg-[#04140E] overflow-x-hidden">

      {/* Sticky Header */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 h-[68px] transition-all duration-400"
        style={{
          background: isScrolled ? 'rgba(4,20,10,0.96)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(14px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(201,168,76,0.2)' : 'none',
        }}
      >
        <Link to="/" className="inline-flex items-center gap-2.5 font-serif text-xs text-[#E8C96B] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 100 80" className="w-7 h-6" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.2" />
            <circle cx="37" cy="51" r="5.5" strokeWidth="1.8" />
            <circle cx="23" cy="49" r="3.2" strokeWidth="1.8" /><circle cx="20" cy="40" r="3.2" strokeWidth="1.8" /><circle cx="22" cy="31" r="3.2" strokeWidth="1.8" />
            <circle cx="28" cy="23" r="3.2" strokeWidth="1.8" /><circle cx="36" cy="23" r="3.2" strokeWidth="1.8" /><circle cx="43" cy="27" r="3.2" strokeWidth="1.8" /><circle cx="46" cy="35" r="3.2" strokeWidth="1.8" />
            <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="1.8" />
            <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="1.8" />
            <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="1.8" />
          </svg>
          CRAFT NEST
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="/#services"
            className="inline-flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-[#C9A84C]/35 text-[#E8C96B] hover:bg-[#0F3D28] hover:border-[#E8C96B]/50 transition-all"
          >
            ← BACK TO SERVICES
          </a>

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

          <div className="relative">
            <button className="p-2.5 rounded-full border border-[#C9A84C]/40 text-[#E8C96B] hover:border-[#C9A84C] transition-all cursor-pointer">
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-red-400 stroke-red-400' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic Hero */}
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img src={data.bannerImg} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,20,10,0.3) 0%, rgba(4,20,10,0.55) 50%, rgba(4,20,10,0.95) 100%)' }} />

        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-14 max-w-7xl mx-auto left-0 right-0">
          <span className="text-[9px] md:text-[10px] tracking-[0.35em] text-[#C9A84C] font-bold uppercase mb-4 block">
            {data.tag}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium leading-tight whitespace-pre-line mb-4">
            {data.subtitle}
          </h1>
          <div className="w-20 h-[1.5px] bg-[#C9A84C]/60 mb-4" />
          <p className="font-sans text-xs md:text-sm text-white/55 max-w-md leading-relaxed">
            {data.heroDesc}
          </p>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="border-y border-[#C9A84C]/15 py-5 px-6 md:px-16" style={{ background: 'rgba(15,61,40,0.6)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] tracking-[0.3em] text-[#C9A84C] font-bold uppercase block mb-1">SPECIAL CAMPAIGN</span>
            <p className="font-serif text-xl md:text-2xl text-white font-medium">{data.promoTitle}</p>
            <p className="font-sans text-[11px] text-white/45 mt-1">{data.promoSubtitle}</p>
          </div>
          <a
            href={`https://wa.me/14704527988?text=${encodeURIComponent(`Hi CraftNest! I'd like to know more about the ${data.title} offer.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[10px] tracking-[0.2em] font-bold uppercase px-6 py-3 rounded-full transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            CLAIM OFFER
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[68px] z-40 border-b border-[#C9A84C]/10 px-6 md:px-16 py-4 overflow-x-auto" style={{ background: 'rgba(4,20,10,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 max-w-7xl mx-auto min-w-max">
          <span className="text-[9px] tracking-[0.25em] text-[#C9A84C]/50 font-bold uppercase mr-2 shrink-0">FILTER</span>
          {data.filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[9px] md:text-[10px] tracking-[0.15em] font-bold px-4 py-2 rounded-full border transition-all duration-250 uppercase cursor-pointer whitespace-nowrap ${
                activeFilter === f
                  ? 'bg-[#E8C96B] border-[#E8C96B] text-[#0B3D2E]'
                  : 'border-[#C9A84C]/25 text-[#C9A84C]/60 hover:border-[#C9A84C]/60 hover:text-[#C9A84C]'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-[9px] text-[#C9A84C]/35 font-sans shrink-0 pl-4">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <main className="flex-grow px-6 md:px-16 py-12 max-w-7xl mx-auto w-full">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-white/30">No items match this filter.</p>
            <button onClick={() => setActiveFilter('All')} className="mt-6 text-[10px] tracking-[0.2em] font-bold uppercase text-[#C9A84C] border border-[#C9A84C]/30 px-6 py-3 rounded-full hover:border-[#C9A84C] transition-all cursor-pointer">
              Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleProducts.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[#C9A84C]/15 hover:border-[#C9A84C]/45 transition-all duration-400 hover:shadow-[0_12px_40px_rgba(201,168,76,0.1)]"
                style={{ background: 'rgba(15,29,22,0.9)' }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1D16]/60 to-transparent" />

                  {/* Badge */}
                  <span className={`absolute top-3 left-3 text-[8px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full ${badgeColors[item.badge] ?? 'bg-[#0B3D2E] text-[#E8C96B]'}`}>
                    {item.badge}
                  </span>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(item.title)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${wishlist.includes(item.title) ? 'fill-red-400 stroke-red-400' : 'text-white/70'}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-lg text-white font-medium mb-2 group-hover:text-[#E8C96B] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[11px] text-white/45 leading-relaxed mb-5 flex-grow">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#C9A84C]/10">
                    <span className="font-serif text-lg text-[#E8C96B] font-medium">{item.price}</span>
                    <button
                      onClick={() => {
                        const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10)
                        addToCart({
                          title: item.title,
                          price: numericPrice,
                          img: item.img
                        })
                      }}
                      className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] font-bold uppercase bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] px-4 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_2px_12px_rgba(201,168,76,0.15)] hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2.0]" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add More CTA (placeholder for when more products are added) */}
        <div className="text-center mt-20 border-t border-[#C9A84C]/10 pt-16">
          <p className="font-sans text-xs text-[#C9A84C]/35 tracking-[0.25em] uppercase mb-4">Can't find what you're looking for?</p>
          <a
            href={`https://wa.me/14704527988?text=${encodeURIComponent(`Hi CraftNest! I'm looking for a custom ${data.title} order. Can you help?`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-[#C9A84C]/40 text-[#C9A84C] hover:border-[#E8C96B] hover:text-[#E8C96B] text-[10px] tracking-[0.2em] font-bold uppercase px-8 py-4 rounded-full transition-all hover:scale-105 cursor-pointer"
          >
            REQUEST CUSTOM ORDER →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#C9A84C]/10 py-8 text-center">
        <p className="font-sans text-[10px] tracking-[0.25em] text-[#C9A84C]/35 uppercase">
          © {new Date().getFullYear()} Craft Nest · Handmade with Pride in India
        </p>
      </footer>
    </div>
  )
}
