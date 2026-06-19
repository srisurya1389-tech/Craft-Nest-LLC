import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  LayoutDashboard, ImageIcon, LogOut, Plus, Pencil, Settings,
  Trash2, X, Eye, EyeOff, ShieldCheck, Gem, Gift, Palette,
  CheckCircle2, AlertCircle, RefreshCw, Search, ChevronDown,
} from 'lucide-react'
import {
  getAdminData, addProduct, updateProduct, deleteProduct,
  addGalleryItem, deleteGalleryItem, resetToDefaults,
  type Product, type GalleryItem, type AdminData,
} from '../data/adminStore'

export const Route = createFileRoute('/admin')({
  component: AdminPanel,
})

const ADMIN_USERS = [
  { email: 'srisurya1389@gmail.com', password: 'AP39DY1437', name: 'Owner' },
  // Second person — add credentials below when ready:
  // { email: 'secondperson@example.com', password: 'TheirPassword', name: 'Manager' },
]

const SESSION_KEY = 'craftnest_admin_auth'

type Tab = 'dashboard' | 'jewellery' | 'gifts' | 'painting' | 'gallery' | 'settings'
type Category = 'jewellery' | 'gifts' | 'painting'

const BADGES = ['Bestseller', 'Popular', 'New', 'Custom', 'Bridal', 'Festival', 'Traditional', 'Adults', 'Kids', 'Limited']
const GALLERY_CATS = ['events', 'arts', 'other'] as const

const BADGE_COLORS: Record<string, string> = {
  Bestseller:  'bg-[#C9A84C] text-[#0B3D2E]',
  New:         'bg-emerald-600 text-white',
  Custom:      'bg-[#0F3D28] border border-[#C9A84C]/40 text-[#E8C96B]',
  Limited:     'bg-red-700/80 text-white',
  Bridal:      'bg-rose-700/80 text-white',
  Festival:    'bg-amber-700/80 text-white',
  Adults:      'bg-slate-700 text-white',
  Kids:        'bg-sky-700 text-white',
  Traditional: 'bg-amber-900/70 text-amber-200',
  Popular:     'bg-teal-800/80 text-teal-100',
}

// ── Toast ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error'
interface ToastMsg { id: number; msg: string; type: ToastType }

function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const show = (msg: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }
  return { toasts, show }
}

function ToastContainer({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium backdrop-blur-md border transition-all duration-300 ${
            t.type === 'success'
              ? 'bg-[#0A2E1A]/95 border-[#C9A84C]/30 text-[#E8C96B]'
              : 'bg-red-950/95 border-red-500/30 text-red-300'
          }`}
        >
          {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── Product Modal ────────────────────────────────────────────────────────────

interface ProductModalProps {
  category: Category
  product: Product | null
  onSave: (p: Product) => void
  onClose: () => void
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = { title: '', badge: 'Bestseller', desc: '', price: '', img: '', occasion: '' }

function ProductModal({ category, product, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(product ? { ...product } : { ...EMPTY_PRODUCT })
  const [imgPreviewError, setImgPreviewError] = useState(false)
  const isEdit = !!product

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.img.trim()) return
    onSave({ ...form, id: product?.id ?? '' })
  }

  const categoryLabel = category === 'jewellery' ? 'Jewellery' : category === 'gifts' ? 'Return Gift' : 'Face Painting'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#C9A84C]/20 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #061A0F 0%, #0A2318 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#C9A84C]/10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#C9A84C]/60 uppercase font-bold mb-0.5">
              {isEdit ? 'Edit' : 'Add New'} · {categoryLabel}
            </p>
            <h2 className="text-xl font-serif text-white">{isEdit ? 'Update Product' : 'New Product'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Image URL + preview */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Image URL *</label>
            <input
              type="url"
              value={form.img}
              onChange={e => { set('img', e.target.value); setImgPreviewError(false) }}
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              required
            />
            {form.img && !imgPreviewError && (
              <div className="mt-3 h-36 rounded-xl overflow-hidden border border-[#C9A84C]/10">
                <img
                  src={form.img}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={() => setImgPreviewError(true)}
                />
              </div>
            )}
            {imgPreviewError && (
              <p className="mt-2 text-xs text-red-400/80">Image URL not loading — check the link</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Handmade Jhumka"
                className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                required
              />
            </div>

            {/* Price */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Price</label>
              <input
                type="text"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="e.g. ₹450 or $25"
                className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Badge</label>
            <div className="flex flex-wrap gap-2">
              {BADGES.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set('badge', b)}
                  className={`text-[9px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    form.badge === b
                      ? (BADGE_COLORS[b] ?? 'bg-[#C9A84C] text-[#04140E]') + ' border-transparent scale-105'
                      : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Description</label>
            <textarea
              value={form.desc}
              onChange={e => set('desc', e.target.value)}
              rows={3}
              placeholder="Short description shown on the product card..."
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEdit ? 'Save Changes' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-[11px] tracking-[0.2em] uppercase font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Gallery Modal ────────────────────────────────────────────────────────────

function GalleryModal({ onSave, onClose }: { onSave: (item: Omit<GalleryItem, 'id'>) => void; onClose: () => void }) {
  const [src, setSrc] = useState('')
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState<'events' | 'arts' | 'other'>('arts')
  const [imgError, setImgError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!src.trim()) return
    onSave({ src, caption, category })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-3xl border border-[#C9A84C]/20 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #061A0F 0%, #0A2318 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#C9A84C]/10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#C9A84C]/60 uppercase font-bold mb-0.5">Gallery</p>
            <h2 className="text-xl font-serif text-white">Add Photo</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Image URL *</label>
            <input
              type="url"
              value={src}
              onChange={e => { setSrc(e.target.value); setImgError(false) }}
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              required
            />
            {src && !imgError && (
              <div className="mt-3 h-32 rounded-xl overflow-hidden border border-[#C9A84C]/10">
                <img src={src} alt="preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="e.g. Bridal Mehandi"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-2">Category</label>
            <div className="flex gap-2">
              {GALLERY_CATS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`flex-1 text-[9px] font-bold tracking-[0.12em] uppercase py-2.5 rounded-full border transition-all cursor-pointer capitalize ${
                    category === c
                      ? 'bg-[#C9A84C] text-[#04140E] border-transparent'
                      : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-[11px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-3xl border border-red-500/20 p-8 text-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1A0606 0%, #230A0A 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-serif text-white mb-2">Delete this item?</h3>
        <p className="text-sm text-white/40 mb-6 leading-relaxed">
          "<span className="text-white/60">{label}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] tracking-[0.2em] uppercase py-3 rounded-full transition-all cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-white/10 text-white/50 hover:text-white hover:border-white/25 font-bold text-[11px] tracking-[0.2em] uppercase py-3 rounded-full transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [shaking, setShaking]   = useState(false)

  const shake = () => {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = ADMIN_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )
    if (user) {
      sessionStorage.setItem(SESSION_KEY, user.name)
      onLogin(user.name)
    } else {
      const emailMatch = ADMIN_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
      setError(emailMatch ? 'Incorrect password. Try again.' : 'Email not recognised.')
      shake()
      setPassword('')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, #0A2E1A 0%, #04140E 60%, #020C08 100%)' }}
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

      <div
        className={`relative w-full max-w-md rounded-3xl border border-[#C9A84C]/15 shadow-[0_40px_80px_rgba(0,0,0,0.5)] ${shaking ? 'animate-[shake_0.4s_ease]' : ''}`}
        style={{ background: 'linear-gradient(160deg, #061A0F 0%, #091E13 50%, #0A2318 100%)' }}
      >
        <div className="p-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#C9A84C]/25 mb-5" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <svg viewBox="0 0 100 80" className="w-9 h-8" fill="none" stroke="#C9A84C" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.2" />
                <circle cx="37" cy="51" r="5.5" strokeWidth="1.8" />
                <circle cx="23" cy="49" r="3.2" strokeWidth="1.8" /><circle cx="20" cy="40" r="3.2" strokeWidth="1.8" />
                <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="1.8" />
                <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="1.8" />
                <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="1.8" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-white mb-1">Craft Nest</h1>
            <p className="text-[10px] tracking-[0.3em] text-[#C9A84C]/60 uppercase font-bold">Admin Control Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/60 uppercase font-bold mb-2.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                autoFocus
                required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white/90 text-sm placeholder-white/15 focus:outline-none transition-colors ${
                  error ? 'border-red-500/60 focus:border-red-500' : 'border-[#C9A84C]/15 focus:border-[#C9A84C]/50'
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/60 uppercase font-bold mb-2.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter your password"
                  required
                  className={`w-full bg-white/5 border rounded-xl px-4 pr-12 py-3.5 text-white/90 text-sm placeholder-white/15 focus:outline-none transition-colors ${
                    error ? 'border-red-500/60 focus:border-red-500' : 'border-[#C9A84C]/15 focus:border-[#C9A84C]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-400/80 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[11px] tracking-[0.25em] uppercase py-4 rounded-full transition-all hover:scale-[1.02] cursor-pointer shadow-[0_4px_24px_rgba(201,168,76,0.35)] mt-2"
            >
              <ShieldCheck className="w-4 h-4" /> Enter Admin Panel
            </button>
          </form>

          <p className="text-center text-[10px] text-white/15 mt-8 tracking-[0.1em]">
            Authorised access only · Craft Nest
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/10 p-6 hover:border-[#C9A84C]/25 transition-all"
      style={{ background: 'rgba(10,35,24,0.8)' }}
    >
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-5" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-2" style={{ color }}>{label}</p>
          <p className="text-4xl font-serif text-white">{value}</p>
          <p className="text-[10px] text-white/30 mt-1">items</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: `${color}10`, borderColor: `${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ data, onNavigate }: { data: AdminData; onNavigate: (tab: Tab) => void }) {
  const total = data.products.jewellery.length + data.products.gifts.length + data.products.painting.length

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-white mb-1">Welcome back</h2>
        <p className="text-sm text-white/35">Here's an overview of your CraftNest catalogue.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Gem}          label="Jewellery"    value={data.products.jewellery.length} color="#C9A84C" />
        <StatCard icon={Gift}         label="Return Gifts" value={data.products.gifts.length}     color="#5DBEA3" />
        <StatCard icon={Palette}      label="Face Painting" value={data.products.painting.length} color="#E87D7D" />
        <StatCard icon={ImageIcon}    label="Gallery"      value={data.gallery.length}             color="#8BA4F8" />
      </div>

      <div className="rounded-2xl border border-[#C9A84C]/10 p-6" style={{ background: 'rgba(10,35,24,0.8)' }}>
        <h3 className="text-[10px] tracking-[0.25em] text-[#C9A84C]/60 uppercase font-bold mb-4">Total Catalogue</h3>
        <p className="font-serif text-5xl text-white mb-1">{total + data.gallery.length}</p>
        <p className="text-sm text-white/30">{total} products · {data.gallery.length} gallery photos</p>
      </div>

      <div>
        <h3 className="text-[10px] tracking-[0.25em] text-[#C9A84C]/60 uppercase font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Manage Jewellery', tab: 'jewellery' as Tab, icon: Gem, color: '#C9A84C' },
            { label: 'Manage Return Gifts', tab: 'gifts' as Tab, icon: Gift, color: '#5DBEA3' },
            { label: 'Manage Face Painting', tab: 'painting' as Tab, icon: Palette, color: '#E87D7D' },
            { label: 'Manage Gallery', tab: 'gallery' as Tab, icon: ImageIcon, color: '#8BA4F8' },
          ].map(({ label, tab, icon: Icon, color }) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-[#C9A84C]/20 text-left transition-all group cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/90 font-medium transition-colors">{label}</span>
              <span className="ml-auto text-white/20 group-hover:text-[#C9A84C]/60 transition-colors text-lg">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab({
  category, data, onAdd, onEdit, onDelete
}: {
  category: Category
  data: AdminData
  onAdd: () => void
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
}) {
  const [search, setSearch] = useState('')
  const products = data.products[category]
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.badge.toLowerCase().includes(search.toLowerCase())
  )

  const label = category === 'jewellery' ? 'Jewellery' : category === 'gifts' ? 'Return Gifts' : 'Face Painting'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white">{label}</h2>
          <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mt-0.5">{products.length} products</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-white/5 border border-[#C9A84C]/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/40 w-48 transition-colors"
            />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_2px_16px_rgba(201,168,76,0.25)] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/20 font-serif text-xl mb-2">{search ? 'No results found' : 'No products yet'}</p>
          {!search && (
            <button onClick={onAdd} className="mt-4 text-[#C9A84C] text-sm hover:underline cursor-pointer">
              + Add your first product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => (
            <div
              key={product.id}
              className="group relative rounded-2xl border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 overflow-hidden transition-all"
              style={{ background: 'rgba(10,35,24,0.8)' }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04140E]/80 to-transparent" />
                <span className={`absolute top-3 left-3 text-[8px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full ${BADGE_COLORS[product.badge] ?? 'bg-[#C9A84C] text-[#04140E]'}`}>
                  {product.badge}
                </span>
              </div>

              <div className="p-4">
                <h4 className="font-serif text-white text-sm mb-1 leading-snug">{product.title}</h4>
                {product.price && (
                  <p className="text-[#C9A84C] text-xs font-bold mb-2">{product.price}</p>
                )}
                <p className="text-white/30 text-[10px] leading-relaxed line-clamp-2">{product.desc}</p>
              </div>

              <div className="flex border-t border-[#C9A84C]/10">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] tracking-[0.15em] uppercase font-bold text-[#C9A84C]/60 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all cursor-pointer"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <div className="w-px bg-[#C9A84C]/10" />
                <button
                  onClick={() => onDelete(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] tracking-[0.15em] uppercase font-bold text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Gallery Tab ──────────────────────────────────────────────────────────────

function GalleryTab({
  data, onAdd, onDelete
}: {
  data: AdminData
  onAdd: () => void
  onDelete: (item: GalleryItem) => void
}) {
  const [filter, setFilter] = useState<'all' | 'events' | 'arts' | 'other'>('all')
  const items = filter === 'all' ? data.gallery : data.gallery.filter(g => g.category === filter)

  const catLabel: Record<string, string> = { all: 'All', events: 'Events', arts: 'Arts', other: 'Other' }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white">Gallery</h2>
          <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mt-0.5">{data.gallery.length} photos</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-[#C9A84C]/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
            {(['all', 'events', 'arts', 'other'] as const).map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-[9px] tracking-[0.15em] font-bold uppercase px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  filter === c
                    ? 'bg-[#C9A84C] text-[#04140E]'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                {catLabel[c]}
              </button>
            ))}
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_2px_16px_rgba(201,168,76,0.25)] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Photo
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/20 font-serif text-xl mb-2">No photos in this category</p>
          <button onClick={onAdd} className="mt-4 text-[#C9A84C] text-sm hover:underline cursor-pointer">
            + Add a photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all aspect-square">
              <img src={item.src} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04140E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category badge */}
              <span className="absolute top-2 left-2 text-[8px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full bg-black/50 text-white/70 backdrop-blur-sm">
                {item.category}
              </span>

              {/* Caption + delete */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {item.caption && (
                  <p className="text-[10px] text-white/80 font-medium leading-tight mb-2 line-clamp-1">{item.caption}</p>
                )}
                <button
                  onClick={() => onDelete(item)}
                  className="w-full flex items-center justify-center gap-1.5 bg-red-600/80 hover:bg-red-500 text-white text-[9px] font-bold tracking-[0.15em] uppercase py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ show }: { show: (msg: string, t?: 'success' | 'error') => void }) {
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    resetToDefaults()
    setConfirmReset(false)
    show('Data reset to factory defaults. Reload the page.')
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="font-serif text-2xl text-white mb-1">Settings</h2>
        <p className="text-sm text-white/35">Manage your admin panel preferences.</p>
      </div>

      <div className="rounded-2xl border border-red-500/15 p-6" style={{ background: 'rgba(30,8,8,0.6)' }}>
        <h3 className="text-sm font-bold text-red-400 mb-2">Reset to Defaults</h3>
        <p className="text-xs text-white/35 mb-4 leading-relaxed">
          This will remove all custom products and gallery photos, restoring the original hardcoded data. This cannot be undone.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 border border-red-500/30 text-red-400/70 hover:text-red-400 hover:border-red-500/60 text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All Data
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer"
            >
              Yes, Reset Everything
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="border border-white/10 text-white/40 hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#C9A84C]/10 p-6" style={{ background: 'rgba(10,35,24,0.8)' }}>
        <h3 className="text-sm font-bold text-white/60 mb-2">Admin Password</h3>
        <p className="text-xs text-white/30 leading-relaxed">
          The current password is set in code. Ask your developer to update it in <code className="text-[#C9A84C]/70">src/routes/admin.tsx</code> line with <code className="text-[#C9A84C]/70">ADMIN_PASSWORD</code>.
        </p>
      </div>
    </div>
  )
}

// ── Main Admin Panel ─────────────────────────────────────────────────────────

function AdminPanel() {
  const storedName = sessionStorage.getItem(SESSION_KEY)
  const [authed, setAuthed] = useState(() => !!storedName)
  const [userName, setUserName] = useState(() => storedName ?? '')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [data, setData] = useState<AdminData>(() => getAdminData())
  const [productModal, setProductModal] = useState<{ open: boolean; product: Product | null; category: Category }>({
    open: false, product: null, category: 'jewellery',
  })
  const [galleryModal, setGalleryModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product'; product: Product; category: Category } | { type: 'gallery'; item: GalleryItem } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toasts, show } = useToast()

  const refresh = () => setData(getAdminData())

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
    setUserName('')
  }

  // Product CRUD
  const handleSaveProduct = (p: Product) => {
    const cat = productModal.category
    if (productModal.product) {
      updateProduct(cat, p)
      show(`"${p.title}" updated successfully`)
    } else {
      addProduct(cat, p)
      show(`"${p.title}" added to ${cat}`)
    }
    refresh()
    setProductModal({ open: false, product: null, category: cat })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'product') {
      deleteProduct(deleteTarget.category, deleteTarget.product.id)
      show(`"${deleteTarget.product.title}" deleted`)
    } else {
      deleteGalleryItem(deleteTarget.item.id)
      show('Photo removed from gallery')
    }
    refresh()
    setDeleteTarget(null)
  }

  // Gallery CRUD
  const handleSaveGallery = (item: Omit<typeof data.gallery[0], 'id'>) => {
    addGalleryItem(item)
    refresh()
    setGalleryModal(false)
    show('Photo added to gallery')
  }

  if (!authed) return <LoginScreen onLogin={(name) => { setUserName(name); setAuthed(true) }} />

  const NAV: { id: Tab; label: string; icon: React.ElementType; sub?: string }[] = [
    { id: 'dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'jewellery',  label: 'Jewellery',       icon: Gem,     sub: `${data.products.jewellery.length} items` },
    { id: 'gifts',      label: 'Return Gifts',    icon: Gift,    sub: `${data.products.gifts.length} items` },
    { id: 'painting',   label: 'Face Painting',   icon: Palette, sub: `${data.products.painting.length} items` },
    { id: 'gallery',    label: 'Gallery',         icon: ImageIcon, sub: `${data.gallery.length} photos` },
    { id: 'settings',   label: 'Settings',        icon: Settings },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: '#03100A' }}>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[#C9A84C]/10 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg, #061A0F 0%, #04140E 100%)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#C9A84C]/10">
          <div className="w-9 h-9 rounded-xl border border-[#C9A84C]/25 flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.08)' }}>
            <svg viewBox="0 0 100 80" className="w-5 h-4" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" />
              <circle cx="37" cy="51" r="5.5" /><circle cx="23" cy="49" r="3.2" />
              <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" />
              <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" />
              <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#E8C96B] tracking-[0.1em] uppercase">Craft Nest</p>
            <p className="text-[9px] text-white/25 tracking-[0.1em]">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon, sub }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                tab === id
                  ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#E8C96B]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/3 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${tab === id ? 'text-[#C9A84C]' : 'text-white/30 group-hover:text-white/50'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold tracking-[0.08em] ${tab === id ? '' : ''}`}>{label}</p>
                {sub && <p className="text-[9px] text-white/20 mt-0.5">{sub}</p>}
              </div>
              {tab === id && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />}
            </button>
          ))}
        </nav>

        {/* View Site + Logout */}
        <div className="px-3 py-4 border-t border-[#C9A84C]/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/60 hover:bg-white/3 text-[11px] font-bold tracking-[0.08em] transition-all"
          >
            <Eye className="w-4 h-4" /> View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-500/5 text-[11px] font-bold tracking-[0.08em] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-[#C9A84C]/10 sticky top-0 z-30" style={{ background: 'rgba(3,16,10,0.97)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-white/10 text-white/40 hover:text-white cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <div>
              <p className="text-[9px] tracking-[0.25em] text-[#C9A84C]/50 uppercase font-bold">
                {NAV.find(n => n.id === tab)?.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/20 hidden sm:block">Logged in as {userName}</span>
            <div className="w-7 h-7 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-5 lg:px-8 py-8 overflow-x-hidden">
          {tab === 'dashboard' && <Dashboard data={data} onNavigate={setTab} />}

          {(tab === 'jewellery' || tab === 'gifts' || tab === 'painting') && (
            <ProductsTab
              category={tab}
              data={data}
              onAdd={() => setProductModal({ open: true, product: null, category: tab })}
              onEdit={p => setProductModal({ open: true, product: p, category: tab })}
              onDelete={p => setDeleteTarget({ type: 'product', product: p, category: tab })}
            />
          )}

          {tab === 'gallery' && (
            <GalleryTab
              data={data}
              onAdd={() => setGalleryModal(true)}
              onDelete={item => setDeleteTarget({ type: 'gallery', item })}
            />
          )}

          {tab === 'settings' && <SettingsTab show={show} />}
        </main>
      </div>

      {/* Modals */}
      {productModal.open && (
        <ProductModal
          category={productModal.category}
          product={productModal.product}
          onSave={handleSaveProduct}
          onClose={() => setProductModal(m => ({ ...m, open: false }))}
        />
      )}

      {galleryModal && (
        <GalleryModal
          onSave={handleSaveGallery}
          onClose={() => setGalleryModal(false)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          label={deleteTarget.type === 'product' ? deleteTarget.product.title : deleteTarget.item.caption || 'this photo'}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
