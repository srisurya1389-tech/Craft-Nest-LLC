import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import {
  LayoutDashboard, ImageIcon, LogOut, Plus, Pencil, Settings,
  Trash2, X, Eye, EyeOff, ShieldCheck, Gem, Gift, Palette,
  CheckCircle2, AlertCircle, RefreshCw, Search,
  Star, EyeOff as HideIcon, Download, Upload, GripVertical, Home,
  MessageCircle, Megaphone, Link, Camera, Menu,
} from 'lucide-react'
import {
  getAdminData, saveSettings, addProduct, updateProduct, deleteProduct,
  reorderProducts, addGalleryItem, deleteGalleryItem,
  addHeroImage, removeHeroImage, reorderHeroImages,
  exportProductsCSV, uploadToCloudinary, resetToDefaults,
  type Product, type GalleryItem, type AdminData, type SiteSettings, type Category,
} from '../data/adminStore'

export const Route = createFileRoute('/admin')({ component: AdminPanel })

// ── Auth ──────────────────────────────────────────────────────────────────────

type Role = 'owner' | 'staff'
const ADMIN_USERS: { email: string; password: string; name: string; role: Role }[] = [
  { email: 'srisurya1389@gmail.com', password: 'AP39DY1437', name: 'Owner', role: 'owner' },
  // { email: 'secondperson@example.com', password: 'TheirPassword', name: 'Manager', role: 'staff' },
]
const SESSION_KEY = 'craftnest_admin_auth'

type Tab = 'dashboard' | 'jewellery' | 'gifts' | 'painting' | 'gallery' | 'hero' | 'settings'

const BADGES = ['Bestseller','Popular','New','Custom','Bridal','Festival','Traditional','Adults','Kids','Limited']
const GALLERY_CATS = ['events','arts','other'] as const
const STOCK_OPTIONS: { value: Product['stock']; label: string; color: string }[] = [
  { value: 'available',     label: '✅ Available',     color: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30' },
  { value: 'limited',       label: '⚡ Limited Stock', color: 'bg-amber-600/20 text-amber-400 border-amber-600/30' },
  { value: 'made-to-order', label: '🛠 Made to Order', color: 'bg-sky-600/20 text-sky-400 border-sky-600/30' },
  { value: 'out-of-stock',  label: '🔴 Out of Stock',  color: 'bg-red-600/20 text-red-400 border-red-600/30' },
]
const BADGE_COLORS: Record<string, string> = {
  Bestseller:'bg-[#C9A84C] text-[#0B3D2E]', New:'bg-emerald-600 text-white',
  Custom:'bg-[#0F3D28] border border-[#C9A84C]/40 text-[#E8C96B]', Limited:'bg-red-700/80 text-white',
  Bridal:'bg-rose-700/80 text-white', Festival:'bg-amber-700/80 text-white',
  Adults:'bg-slate-700 text-white', Kids:'bg-sky-700 text-white',
  Traditional:'bg-amber-900/70 text-amber-200', Popular:'bg-teal-800/80 text-teal-100',
}

// ── Toast ─────────────────────────────────────────────────────────────────────

type ToastMsg = { id: number; msg: string; type: 'success' | 'error' }
function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const show = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }
  return { toasts, show }
}
function ToastContainer({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none max-w-xs w-full">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold backdrop-blur-md border ${t.type === 'success' ? 'bg-[#0A2E1A]/95 border-[#C9A84C]/30 text-[#E8C96B]' : 'bg-red-950/95 border-red-500/30 text-red-300'}`}>
          {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0"/> : <AlertCircle className="w-4 h-4 shrink-0"/>}
          <span className="min-w-0 break-words">{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex items-center shrink-0 w-11 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer focus:outline-none ${on ? 'bg-emerald-500 border-emerald-500' : 'bg-white/10 border-white/20'}`}
    >
      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0.5'}`}/>
    </button>
  )
}

// ── Cloudinary Image Field ────────────────────────────────────────────────────

function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr]             = useState('')
  const [imgErr, setImgErr]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); setErr(''); setImgErr(false)
    try { onChange(await uploadToCloudinary(file)) } catch (ex) { setErr((ex as Error).message) }
    finally { setUploading(false) }
  }

  return (
    <div className="space-y-2">
      <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold">Image *</label>
      <div className="flex gap-2 min-w-0">
        <input
          type="url" value={value}
          onChange={e => { onChange(e.target.value); setImgErr(false) }}
          placeholder="https://res.cloudinary.com/… or upload →"
          className="min-w-0 flex-1 bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 shrink-0 px-3 py-2.5 rounded-xl border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/10 text-[10px] font-bold uppercase transition-all cursor-pointer disabled:opacity-40"
        >
          {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Camera className="w-3.5 h-3.5"/>}
          <span className="hidden sm:inline">{uploading ? 'Uploading…' : 'Upload'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
      </div>
      {err && <p className="text-[10px] text-red-400">{err}</p>}
      {value && (
        <div className="h-28 rounded-xl overflow-hidden border border-[#C9A84C]/10 relative">
          <img src={value} alt="" className="w-full h-full object-cover" onError={() => setImgErr(true)}/>
          {imgErr && <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 text-xs text-red-400">Image not loading</div>}
        </div>
      )}
    </div>
  )
}

// ── Product Modal ─────────────────────────────────────────────────────────────

const EMPTY: Omit<Product,'id'> = { title:'', badge:'Bestseller', desc:'', price:'', img:'', occasion:'', visible:true, featured:false, stock:'available', whatsappMsg:'' }

function ProductModal({ category, product, onSave, onClose }: { category: Category; product: Product | null; onSave: (p: Product) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Product,'id'>>(product ? { ...product } : { ...EMPTY })
  const set = (k: keyof typeof form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))
  const isEdit = !!product
  const catLabel = category === 'jewellery' ? 'Jewellery' : category === 'gifts' ? 'Return Gift' : 'Face Painting'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.img.trim()) return
    onSave({ ...form, id: product?.id ?? '' })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div
        className="relative w-full sm:max-w-xl max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[#C9A84C]/20 shadow-2xl"
        style={{ background:'linear-gradient(135deg,#061A0F 0%,#0A2318 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/10 sticky top-0 z-10" style={{ background:'rgba(6,26,15,0.98)' }}>
          <div>
            <p className="text-[9px] tracking-[0.3em] text-[#C9A84C]/60 uppercase font-bold">{isEdit ? 'Edit' : 'Add'} · {catLabel}</p>
            <h2 className="text-lg font-serif text-white">{isEdit ? 'Update Product' : 'New Product'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white cursor-pointer shrink-0"><X className="w-5 h-5"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <ImageField value={form.img} onChange={v => set('img', v)}/>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => set('title',e.target.value)} placeholder="e.g. Kundan Necklace" required
                className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"/>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Price</label>
              <input type="text" value={form.price} onChange={e => set('price',e.target.value)} placeholder="e.g. ₹450"
                className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"/>
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Badge</label>
            <div className="flex flex-wrap gap-1.5">
              {BADGES.map(b => (
                <button key={b} type="button" onClick={() => set('badge',b)}
                  className={`text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer ${form.badge===b ? (BADGE_COLORS[b]??'bg-[#C9A84C] text-[#04140E]')+' border-transparent' : 'border-white/10 text-white/40 hover:text-white/60'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Stock Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STOCK_OPTIONS.map(s => (
                <button key={s.value} type="button" onClick={() => set('stock',s.value)}
                  className={`text-[10px] font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer text-left ${form.stock===s.value ? s.color : 'border-white/10 text-white/40 hover:text-white/60'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Description</label>
            <textarea value={form.desc} onChange={e => set('desc',e.target.value)} rows={2} placeholder="Short description…"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"/>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1">
              WhatsApp Message <span className="text-white/25 normal-case tracking-normal font-normal text-[10px]">(blank = default)</span>
            </label>
            <textarea value={form.whatsappMsg} onChange={e => set('whatsappMsg',e.target.value)} rows={2}
              placeholder={`Hi CraftNest! I'm interested in the "${form.title||'product'}". Please share details.`}
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"/>
          </div>

          {/* Visibility + Featured toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => set('visible', !form.visible)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-bold tracking-[0.08em] uppercase transition-all cursor-pointer ${form.visible ? 'bg-emerald-600/15 border-emerald-600/40 text-emerald-400' : 'border-white/10 text-white/30'}`}>
              <Eye className="w-3.5 h-3.5"/> {form.visible ? 'Visible' : 'Hidden'}
            </button>
            <button type="button" onClick={() => set('featured', !form.featured)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-bold tracking-[0.08em] uppercase transition-all cursor-pointer ${form.featured ? 'bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#E8C96B]' : 'border-white/10 text-white/30'}`}>
              <Star className="w-3.5 h-3.5"/> {form.featured ? 'Featured' : 'Normal'}
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] tracking-[0.18em] uppercase px-4 py-3 rounded-full transition-all hover:scale-[1.02] cursor-pointer shadow-[0_4px_16px_rgba(201,168,76,0.3)]">
              <CheckCircle2 className="w-4 h-4"/> {isEdit ? 'Save Changes' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-3 rounded-full border border-white/10 text-white/50 hover:text-white text-[10px] font-bold tracking-[0.18em] uppercase transition-all cursor-pointer shrink-0">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Gallery Modal ─────────────────────────────────────────────────────────────

function GalleryModal({ onSave, onClose }: { onSave: (item: Omit<GalleryItem,'id'>) => void; onClose: () => void }) {
  const [src, setSrc]           = useState('')
  const [caption, setCaption]   = useState('')
  const [category, setCategory] = useState<'events'|'arts'|'other'>('arts')
  const [uploading, setUploading] = useState(false)
  const [err, setErr]           = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); setErr('')
    try { setSrc(await uploadToCloudinary(file)) } catch (ex) { setErr((ex as Error).message) }
    finally { setUploading(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-[#C9A84C]/20 shadow-2xl overflow-hidden"
        style={{ background:'linear-gradient(135deg,#061A0F 0%,#0A2318 100%)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/10">
          <div><p className="text-[9px] tracking-[0.3em] text-[#C9A84C]/60 uppercase font-bold">Gallery</p><h2 className="text-lg font-serif text-white">Add Photo</h2></div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Image URL or Upload</label>
            <div className="flex gap-2 min-w-0">
              <input type="url" value={src} onChange={e => setSrc(e.target.value)} placeholder="https://res.cloudinary.com/…"
                className="min-w-0 flex-1 bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/10 cursor-pointer disabled:opacity-40">
                {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Camera className="w-3.5 h-3.5"/>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
            </div>
            {err && <p className="text-[10px] text-red-400 mt-1">{err}</p>}
            {src && <div className="mt-2 h-24 rounded-xl overflow-hidden border border-[#C9A84C]/10"><img src={src} alt="" className="w-full h-full object-cover"/></div>}
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Caption</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Bridal Mehandi"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/70 uppercase font-bold mb-1.5">Category</label>
            <div className="flex gap-2">
              {GALLERY_CATS.map(c => (
                <button key={c} type="button" onClick={() => setCategory(c)}
                  className={`flex-1 text-[9px] font-bold tracking-[0.1em] uppercase py-2.5 rounded-full border transition-all cursor-pointer capitalize ${category===c ? 'bg-[#C9A84C] text-[#04140E] border-transparent' : 'border-white/10 text-white/40 hover:text-white/70'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if(src) onSave({src,caption,category}) }} disabled={!src}
              className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-[#04140E] font-bold text-[10px] tracking-[0.18em] uppercase py-3 rounded-full transition-all cursor-pointer">
              <Plus className="w-4 h-4"/> Add Photo
            </button>
            <button onClick={onClose} className="px-5 py-3 rounded-full border border-white/10 text-white/50 hover:text-white text-[10px] font-bold uppercase cursor-pointer shrink-0">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
      <div className="relative w-full max-w-sm rounded-3xl border border-red-500/20 p-7 text-center shadow-2xl"
        style={{ background:'linear-gradient(135deg,#1A0606 0%,#230A0A 100%)' }} onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3"><Trash2 className="w-5 h-5 text-red-400"/></div>
        <h3 className="text-base font-serif text-white mb-2">Delete this item?</h3>
        <p className="text-xs text-white/40 mb-5 leading-relaxed">"{label}" will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] tracking-[0.2em] uppercase py-3 rounded-full transition-all cursor-pointer">Delete</button>
          <button onClick={onCancel} className="flex-1 border border-white/10 text-white/50 hover:text-white font-bold text-[10px] tracking-[0.2em] uppercase py-3 rounded-full cursor-pointer">Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [shaking, setShaking]   = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = ADMIN_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password)
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, role: user.role }))
      onLogin(user.name)
    } else {
      const emailOk = ADMIN_USERS.some(u => u.email.toLowerCase() === email.trim().toLowerCase())
      setError(emailOk ? 'Incorrect password.' : 'Email not recognised.')
      setShaking(true); setTimeout(() => setShaking(false), 500); setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background:'radial-gradient(ellipse at 30% 40%,#0A2E1A 0%,#04140E 60%,#020C08 100%)' }}>
      <div className={`relative w-full max-w-[380px] rounded-3xl border border-[#C9A84C]/15 shadow-2xl ${shaking ? 'animate-[shake_0.4s_ease]' : ''}`}
        style={{ background:'linear-gradient(160deg,#061A0F 0%,#091E13 50%,#0A2318 100%)' }}>
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-[#C9A84C]/25 mb-4" style={{ background:'rgba(201,168,76,0.08)' }}>
              <svg viewBox="0 0 100 80" className="w-8 h-7" fill="none" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z"/>
                <circle cx="37" cy="51" r="5.5" strokeWidth="1.8"/><circle cx="23" cy="49" r="3.2" strokeWidth="1.8"/>
                <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="1.8"/>
                <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="1.8"/>
                <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="1.8"/>
              </svg>
            </div>
            <h1 className="font-serif text-xl text-white mb-1">Craft Nest</h1>
            <p className="text-[9px] tracking-[0.3em] text-[#C9A84C]/50 uppercase font-bold">Admin Control Panel</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/60 uppercase font-bold mb-2">Email</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="your@email.com" autoFocus required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white/90 text-sm placeholder-white/15 focus:outline-none transition-colors ${error ? 'border-red-500/60' : 'border-[#C9A84C]/15 focus:border-[#C9A84C]/50'}`}/>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/60 uppercase font-bold mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder="Enter password" required
                  className={`w-full bg-white/5 border rounded-xl px-4 pr-11 py-3 text-white/90 text-sm placeholder-white/15 focus:outline-none transition-colors ${error ? 'border-red-500/60' : 'border-[#C9A84C]/15 focus:border-[#C9A84C]/50'}`}/>
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              {error && <p className="mt-1.5 text-[11px] text-red-400/80 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0"/>{error}</p>}
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[11px] tracking-[0.25em] uppercase py-3.5 rounded-full transition-all hover:scale-[1.02] cursor-pointer shadow-[0_4px_24px_rgba(201,168,76,0.35)] mt-1">
              <ShieldCheck className="w-4 h-4"/> Enter Admin Panel
            </button>
          </form>
          <p className="text-center text-[9px] text-white/15 mt-6 tracking-[0.1em]">Authorised access only · Craft Nest</p>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 hover:border-[#C9A84C]/25 transition-all" style={{ background:'rgba(10,35,24,0.8)' }}>
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-5" style={{ background:`radial-gradient(circle,${color},transparent)` }}/>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] tracking-[0.2em] uppercase font-bold mb-1 truncate" style={{ color }}>{label}</p>
          <p className="text-3xl sm:text-4xl font-serif text-white">{value}</p>
          {sub && <p className="text-[9px] text-white/25 mt-0.5 truncate">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0" style={{ background:`${color}10`, borderColor:`${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }}/>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ data, onNavigate, role }: { data: AdminData; onNavigate: (t: Tab) => void; role: Role }) {
  const all = [...data.products.jewellery, ...data.products.gifts, ...data.products.painting]
  const total    = all.length
  const visible  = all.filter(p => p.visible).length
  const featured = all.filter(p => p.featured).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-white mb-0.5">Welcome back</h2>
        <p className="text-xs text-white/35">Your CraftNest catalogue at a glance.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon={Gem}       label="Jewellery"  value={data.products.jewellery.length} sub={`${data.products.jewellery.filter(p=>p.visible).length} visible`} color="#C9A84C"/>
        <StatCard icon={Gift}      label="Gifts"      value={data.products.gifts.length}     sub={`${data.products.gifts.filter(p=>p.visible).length} visible`}     color="#5DBEA3"/>
        <StatCard icon={Palette}   label="Face Paint" value={data.products.painting.length}  sub={`${data.products.painting.filter(p=>p.visible).length} visible`}  color="#E87D7D"/>
        <StatCard icon={ImageIcon} label="Gallery"    value={data.gallery.length}            color="#8BA4F8"/>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Total Products', value:total,    color:'#C9A84C' },
          { label:'Live / Visible', value:visible,  color:'#5DBEA3' },
          { label:'Featured',       value:featured, color:'#E8C96B' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5" style={{ background:'rgba(10,35,24,0.8)' }}>
            <p className="text-[9px] tracking-[0.18em] uppercase font-bold mb-1 truncate" style={{ color }}>{label}</p>
            <p className="text-2xl sm:text-3xl font-serif text-white">{value}</p>
          </div>
        ))}
      </div>

      {data.settings.announcementEnabled && (
        <div className="rounded-2xl border border-amber-500/20 p-3 sm:p-4 flex items-start gap-3" style={{ background:'rgba(30,20,5,0.8)' }}>
          <Megaphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"/>
          <p className="text-xs text-amber-200/80 flex-1 min-w-0">{data.settings.announcementText}</p>
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-emerald-400 shrink-0 self-center">LIVE</span>
        </div>
      )}

      <div>
        <h3 className="text-[9px] tracking-[0.25em] text-[#C9A84C]/50 uppercase font-bold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {([
            { label:'Jewellery',      tab:'jewellery' as Tab, icon:Gem,       color:'#C9A84C' },
            { label:'Return Gifts',   tab:'gifts'     as Tab, icon:Gift,      color:'#5DBEA3' },
            { label:'Face Painting',  tab:'painting'  as Tab, icon:Palette,   color:'#E87D7D' },
            { label:'Gallery',        tab:'gallery'   as Tab, icon:ImageIcon, color:'#8BA4F8' },
            { label:'Hero Carousel',  tab:'hero'      as Tab, icon:Home,      color:'#F5A623' },
            ...(role==='owner' ? [{ label:'Site Settings', tab:'settings' as Tab, icon:Settings, color:'#9B8EFF' }] : []),
          ]).map(({ label, tab, icon: Icon, color }) => (
            <button key={tab} onClick={() => onNavigate(tab)}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/5 hover:border-[#C9A84C]/20 text-left transition-all group cursor-pointer"
              style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
                <Icon className="w-4 h-4" style={{ color }}/>
              </div>
              <span className="text-sm text-white/55 group-hover:text-white/90 font-medium transition-colors">{label}</span>
              <span className="ml-auto text-white/15 group-hover:text-[#C9A84C]/50 transition-colors">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Products Tab ──────────────────────────────────────────────────────────────

function ProductsTab({ category, data, role, onAdd, onEdit, onDelete, onToggleV, onToggleF, onReorder }:
  { category: Category; data: AdminData; role: Role; onAdd: () => void; onEdit: (p:Product) => void; onDelete: (p:Product) => void; onToggleV:(p:Product)=>void; onToggleF:(p:Product)=>void; onReorder: (cat:Category, items:Product[]) => void }) {

  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all'|'visible'|'hidden'|'featured'>('all')
  const [dragId, setDragId]   = useState<string|null>(null)
  const products = data.products[category]
  const label = category === 'jewellery' ? 'Jewellery' : category === 'gifts' ? 'Return Gifts' : 'Face Painting'

  let filtered = products
  if (filter === 'visible')  filtered = products.filter(p => p.visible)
  if (filter === 'hidden')   filtered = products.filter(p => !p.visible)
  if (filter === 'featured') filtered = products.filter(p => p.featured)
  if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.badge.toLowerCase().includes(search.toLowerCase()))

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!dragId || dragId === targetId) return
    const items = [...products]
    const from  = items.findIndex(p => p.id === dragId)
    const to    = items.findIndex(p => p.id === targetId)
    if (from < 0 || to < 0) return
    items.splice(to, 0, items.splice(from, 1)[0])
    onReorder(category, items)
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl text-white truncate">{label}</h2>
            <p className="text-[9px] tracking-[0.18em] text-white/30 uppercase mt-0.5">
              {products.length} total · {products.filter(p=>p.visible).length} visible · {products.filter(p=>p.featured).length} featured
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {role === 'owner' && (
              <button onClick={() => exportProductsCSV()}
                className="flex items-center gap-1 border border-[#C9A84C]/20 text-[#C9A84C]/60 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 text-[9px] font-bold tracking-[0.1em] uppercase px-3 py-2 rounded-full transition-all cursor-pointer">
                <Download className="w-3 h-3"/> CSV
              </button>
            )}
            <button onClick={onAdd}
              className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_2px_12px_rgba(201,168,76,0.25)]">
              <Plus className="w-3.5 h-3.5"/> Add
            </button>
          </div>
        </div>

        {/* Filter + Search row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 p-1 rounded-full border border-white/5" style={{ background:'rgba(255,255,255,0.02)' }}>
            {(['all','visible','hidden','featured'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full transition-all cursor-pointer capitalize ${filter===f ? 'bg-[#C9A84C] text-[#04140E]' : 'text-white/30 hover:text-white/60'}`}>{f}</button>
            ))}
          </div>
          <div className="relative min-w-0 flex-1" style={{ maxWidth: 180 }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="w-full bg-white/5 border border-[#C9A84C]/10 rounded-full pl-7 pr-3 py-1.5 text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"/>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/20 font-serif text-xl">{search ? 'No results' : 'No products yet'}</p>
          {!search && <button onClick={onAdd} className="mt-4 text-[#C9A84C] text-sm hover:underline cursor-pointer">+ Add first product</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(product => {
            const stockOpt = STOCK_OPTIONS.find(s => s.value === (product.stock ?? 'available')) ?? STOCK_OPTIONS[0]
            return (
              <div key={product.id}
                draggable
                onDragStart={() => setDragId(product.id)}
                onDragEnd={() => setDragId(null)}
                onDragOver={e => handleDragOver(e, product.id)}
                className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all ${!product.visible ? 'opacity-50' : ''} ${dragId===product.id ? 'opacity-30 scale-95' : ''} border-[#C9A84C]/10 hover:border-[#C9A84C]/30`}
                style={{ background:'rgba(10,35,24,0.8)' }}
              >
                {/* Drag handle */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <div className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <GripVertical className="w-3 h-3 text-white/60"/>
                  </div>
                </div>

                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04140E]/80 to-transparent"/>
                  <span className={`absolute top-2.5 left-2.5 text-[8px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${BADGE_COLORS[product.badge]??'bg-[#C9A84C] text-[#04140E]'}`}>{product.badge}</span>
                  {product.featured && <span className="absolute top-2.5 left-16 text-[8px] font-bold px-2 py-0.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E8C96B] whitespace-nowrap">⭐ Featured</span>}
                  <span className={`absolute bottom-2.5 left-2.5 text-[8px] font-bold px-2 py-0.5 rounded-full border ${stockOpt.color}`}>{stockOpt.label}</span>
                </div>

                <div className="p-3.5 flex flex-col flex-grow min-w-0">
                  <h4 className="font-serif text-white text-sm mb-1 leading-snug line-clamp-2">{product.title}</h4>
                  {product.price && <p className="text-[#C9A84C] text-xs font-bold mb-0.5">{product.price}</p>}
                  <p className="text-white/30 text-[10px] leading-relaxed line-clamp-2 flex-grow">{product.desc}</p>
                </div>

                {/* Action bar */}
                <div className={`border-t border-[#C9A84C]/10 grid ${role==='owner' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  <button onClick={() => onToggleV(product)} title={product.visible ? 'Hide' : 'Show'}
                    className={`flex items-center justify-center py-2.5 transition-all cursor-pointer ${product.visible ? 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/5' : 'text-red-400/50 hover:text-red-400 hover:bg-red-500/5'}`}>
                    {product.visible ? <Eye className="w-3.5 h-3.5"/> : <HideIcon className="w-3.5 h-3.5"/>}
                  </button>
                  <button onClick={() => onToggleF(product)} title={product.featured ? 'Unfeature' : 'Feature'}
                    className={`flex items-center justify-center py-2.5 transition-all cursor-pointer ${product.featured ? 'text-[#E8C96B] hover:bg-[#C9A84C]/5' : 'text-white/25 hover:text-[#C9A84C]/60 hover:bg-[#C9A84C]/5'}`}>
                    <Star className="w-3.5 h-3.5"/>
                  </button>
                  <button onClick={() => onEdit(product)}
                    className="flex items-center justify-center py-2.5 text-[#C9A84C]/50 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all cursor-pointer">
                    <Pencil className="w-3.5 h-3.5"/>
                  </button>
                  {role === 'owner' && (
                    <button onClick={() => onDelete(product)}
                      className="flex items-center justify-center py-2.5 text-red-400/40 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Gallery Tab ───────────────────────────────────────────────────────────────

function GalleryTab({ data, role, onAdd, onDelete }: { data: AdminData; role: Role; onAdd: () => void; onDelete: (item:GalleryItem) => void }) {
  const [filter, setFilter] = useState<'all'|'events'|'arts'|'other'>('all')
  const items = filter === 'all' ? data.gallery : data.gallery.filter(g => g.category === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-serif text-xl sm:text-2xl text-white">Gallery</h2><p className="text-[9px] tracking-[0.18em] text-white/30 uppercase mt-0.5">{data.gallery.length} photos</p></div>
          <button onClick={onAdd}
            className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_2px_12px_rgba(201,168,76,0.25)] shrink-0">
            <Plus className="w-3.5 h-3.5"/> Add
          </button>
        </div>
        <div className="flex gap-1 p-1 rounded-full border border-white/5 w-fit" style={{ background:'rgba(255,255,255,0.02)' }}>
          {(['all','events','arts','other'] as const).map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full transition-all cursor-pointer capitalize ${filter===c ? 'bg-[#C9A84C] text-[#04140E]' : 'text-white/30 hover:text-white/60'}`}>{c}</button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20"><p className="text-white/20 font-serif text-xl">No photos yet</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all aspect-square">
              <img src={item.src} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#04140E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <span className="absolute top-2 left-2 text-[7px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full bg-black/50 text-white/60 backdrop-blur-sm capitalize">{item.category}</span>
              <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {item.caption && <p className="text-[9px] text-white/80 font-medium mb-1 line-clamp-1">{item.caption}</p>}
                {role === 'owner' && (
                  <button onClick={() => onDelete(item)}
                    className="w-full flex items-center justify-center gap-1 bg-red-600/80 hover:bg-red-500 text-white text-[8px] font-bold uppercase py-1.5 rounded-full transition-all cursor-pointer">
                    <Trash2 className="w-2.5 h-2.5"/> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Hero Tab ──────────────────────────────────────────────────────────────────

function HeroTab({ data, onAdd, onRemove, onReorder }: { data: AdminData; onAdd: (url:string) => void; onRemove: (url:string) => void; onReorder: (imgs:string[]) => void }) {
  const [newUrl, setNewUrl]     = useState('')
  const [uploading, setUploading] = useState(false)
  const [err, setErr]           = useState('')
  const [dragIdx, setDragIdx]   = useState<number|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); setErr('')
    try { onAdd(await uploadToCloudinary(file)) } catch (ex) { setErr((ex as Error).message) }
    finally { setUploading(false) }
  }

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === targetIdx) return
    const imgs = [...data.heroImages]
    imgs.splice(targetIdx, 0, imgs.splice(dragIdx, 1)[0])
    onReorder(imgs); setDragIdx(targetIdx)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-white mb-0.5">Hero Carousel</h2>
        <p className="text-xs text-white/35">{data.heroImages.length} images · Drag to reorder</p>
      </div>

      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 space-y-3" style={{ background:'rgba(10,35,24,0.8)' }}>
        <label className="block text-[10px] tracking-[0.2em] text-[#C9A84C]/60 uppercase font-bold">Add Image</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Paste Cloudinary URL…"
            className="flex-1 min-w-0 bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/10 text-[10px] font-bold uppercase cursor-pointer disabled:opacity-40">
              {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Upload className="w-3.5 h-3.5"/>}
              <span className="hidden sm:inline">{uploading ? 'Uploading…' : 'Upload'}</span>
            </button>
            <button onClick={() => { if(newUrl.trim()) { onAdd(newUrl.trim()); setNewUrl('') } }}
              className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] uppercase px-4 py-2.5 rounded-xl cursor-pointer">
              <Plus className="w-3.5 h-3.5"/> Add
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          </div>
        </div>
        {err && <p className="text-[10px] text-red-400">{err}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {data.heroImages.map((url, idx) => (
          <div key={url+idx}
            draggable onDragStart={() => setDragIdx(idx)} onDragEnd={() => setDragIdx(null)}
            onDragOver={e => handleDragOver(e, idx)}
            className={`group relative rounded-2xl overflow-hidden border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all aspect-square cursor-grab active:cursor-grabbing ${dragIdx===idx ? 'opacity-30 scale-95' : ''}`}>
            <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#04140E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
            <div className="absolute top-2 left-2 w-5 h-5 rounded-md bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-white/60"/>
            </div>
            <span className="absolute top-2 right-2 text-[8px] font-bold text-white/50 bg-black/40 rounded-md px-1.5 py-0.5">#{idx+1}</span>
            <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button onClick={() => onRemove(url)}
                className="w-full flex items-center justify-center gap-1 bg-red-600/80 hover:bg-red-500 text-white text-[8px] font-bold uppercase py-1.5 rounded-full cursor-pointer">
                <Trash2 className="w-2.5 h-2.5"/> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab({ data, show }: { data: AdminData; show: (msg:string, t?: 'success'|'error') => void }) {
  const [form, setForm]         = useState<SiteSettings>({ ...data.settings })
  const [confirmReset, setConfirmReset] = useState(false)
  const set = (k: keyof SiteSettings, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSave  = () => { saveSettings(form); show('Settings saved') }
  const handleReset = () => { resetToDefaults(); setConfirmReset(false); show('Data reset — please reload.') }

  return (
    <div className="space-y-5 w-full max-w-2xl">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-white mb-0.5">Site Settings</h2>
        <p className="text-xs text-white/35">Control global site options.</p>
      </div>

      {/* Announcement Banner */}
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(10,35,24,0.8)' }}>
        <div className="flex items-center gap-3">
          <Megaphone className="w-4 h-4 text-amber-400 shrink-0"/>
          <span className="text-sm font-bold text-white flex-1 min-w-0">Announcement Banner</span>
          <Toggle on={form.announcementEnabled} onChange={() => set('announcementEnabled', !form.announcementEnabled)}/>
        </div>
        <textarea
          value={form.announcementText}
          onChange={e => set('announcementText', e.target.value)}
          rows={2}
          placeholder="e.g. 🎉 Free gifting on orders above ₹1000!"
          className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 resize-none"
        />
        {form.announcementEnabled && (
          <p className="text-[10px] text-emerald-400/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0 animate-pulse"/>
            This banner is currently showing on the website.
          </p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(10,35,24,0.8)' }}>
        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0"/>
          <span className="text-sm font-bold text-white">WhatsApp Number</span>
        </div>
        <input type="text" value={form.whatsappNumber} onChange={e => set('whatsappNumber', e.target.value)}
          placeholder="e.g. 14704527988 (no + sign)"
          className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
        <p className="text-[10px] text-white/25 leading-relaxed">Include country code without + sign. E.g. 14704527988 for US, 919876543210 for India.</p>
      </div>

      {/* Social Links */}
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(10,35,24,0.8)' }}>
        <div className="flex items-center gap-3">
          <Link className="w-4 h-4 text-[#C9A84C] shrink-0"/>
          <span className="text-sm font-bold text-white">Social Links</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-1.5">Instagram URL</label>
            <input type="url" value={form.instagramUrl} onChange={e => set('instagramUrl', e.target.value)}
              placeholder="https://instagram.com/craftnest"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-1.5">Facebook URL</label>
            <input type="url" value={form.facebookUrl} onChange={e => set('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/craftnest"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
          </div>
        </div>
      </div>

      {/* Cloudinary */}
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(10,35,24,0.8)' }}>
        <div className="flex items-center gap-3">
          <Upload className="w-4 h-4 text-[#C9A84C] shrink-0"/>
          <span className="text-sm font-bold text-white">Image Upload (Cloudinary)</span>
        </div>
        <p className="text-[11px] text-white/35 leading-relaxed">
          Create an <strong className="text-white/50">unsigned upload preset</strong> in Cloudinary dashboard → Settings → Upload → Add Preset → set to Unsigned. Then enter the preset name below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-1.5">Cloud Name</label>
            <input type="text" value={form.cloudinaryCloud} onChange={e => set('cloudinaryCloud', e.target.value)}
              placeholder="e.g. diancfp03"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-1.5">Upload Preset</label>
            <input type="text" value={form.cloudinaryPreset} onChange={e => set('cloudinaryPreset', e.target.value)}
              placeholder="e.g. craftnest_upload"
              className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50"/>
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_4px_20px_rgba(201,168,76,0.3)]">
        <CheckCircle2 className="w-4 h-4"/> Save All Settings
      </button>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/15 p-4 sm:p-5" style={{ background:'rgba(30,8,8,0.6)' }}>
        <h3 className="text-sm font-bold text-red-400 mb-1.5">Danger Zone</h3>
        <p className="text-[11px] text-white/35 mb-4 leading-relaxed">Removes all custom products, gallery, and settings. Restores original data. Cannot be undone.</p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 border border-red-500/30 text-red-400/70 hover:text-red-400 hover:border-red-500/60 text-[10px] font-bold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5"/> Reset Everything
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button onClick={handleReset} className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full cursor-pointer transition-colors">Yes, Reset</button>
            <button onClick={() => setConfirmReset(false)} className="border border-white/10 text-white/40 hover:text-white text-[10px] font-bold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full cursor-pointer">Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────

function AdminPanel() {
  const stored        = sessionStorage.getItem(SESSION_KEY)
  const parsedSession = stored ? JSON.parse(stored) as { name: string; role: Role } : null

  const [authed,   setAuthed]   = useState(() => !!parsedSession)
  const [userName, setUserName] = useState(() => parsedSession?.name ?? '')
  const [userRole, setUserRole] = useState<Role>(() => parsedSession?.role ?? 'staff')
  const [tab,      setTab]      = useState<Tab>('dashboard')
  const [data,     setData]     = useState<AdminData>(() => getAdminData())
  const [productModal, setProductModal] = useState<{ open:boolean; product:Product|null; category:Category }>({ open:false, product:null, category:'jewellery' })
  const [galleryModal, setGalleryModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type:'product'; product:Product; category:Category } | { type:'gallery'; item:GalleryItem } | null>(null)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const { toasts, show } = useToast()

  const refresh = () => setData(getAdminData())

  const handleLogout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); setUserName(''); setUserRole('staff') }

  const handleSaveProduct = (p: Product) => {
    const cat = productModal.category
    if (productModal.product) { updateProduct(cat, p); show(`"${p.title}" updated`) }
    else { addProduct(cat, p); show(`"${p.title}" added`) }
    refresh(); setProductModal(m => ({ ...m, open:false }))
  }

  const handleToggleV = (cat: Category, p: Product) => { updateProduct(cat, { ...p, visible:!p.visible }); refresh() }
  const handleToggleF = (cat: Category, p: Product) => { updateProduct(cat, { ...p, featured:!p.featured }); refresh() }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'product') { deleteProduct(deleteTarget.category, deleteTarget.product.id); show(`Deleted "${deleteTarget.product.title}"`) }
    else { deleteGalleryItem(deleteTarget.item.id); show('Photo removed') }
    refresh(); setDeleteTarget(null)
  }

  if (!authed) return <LoginScreen onLogin={(name) => {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}') as { name:string; role:Role }
    setUserName(name); setUserRole(session.role ?? 'staff'); setAuthed(true)
  }}/>

  type NavItem = { id: Tab; label: string; icon: React.ElementType; sub?: string; ownerOnly?: boolean }
  const NAV: NavItem[] = ([
    { id:'dashboard' as Tab, label:'Dashboard',     icon:LayoutDashboard },
    { id:'jewellery' as Tab, label:'Jewellery',     icon:Gem,       sub:`${data.products.jewellery.length} items` },
    { id:'gifts'     as Tab, label:'Return Gifts',  icon:Gift,      sub:`${data.products.gifts.length} items` },
    { id:'painting'  as Tab, label:'Face Painting', icon:Palette,   sub:`${data.products.painting.length} items` },
    { id:'gallery'   as Tab, label:'Gallery',       icon:ImageIcon, sub:`${data.gallery.length} photos` },
    { id:'hero'      as Tab, label:'Hero Carousel', icon:Home,      sub:`${data.heroImages.length} images` },
    { id:'settings'  as Tab, label:'Settings',      icon:Settings,  ownerOnly:true },
  ] as NavItem[]).filter(n => !n.ownerOnly || userRole === 'owner')

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background:'#03100A' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-56 sm:w-60 border-r border-[#C9A84C]/10 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background:'linear-gradient(180deg,#061A0F 0%,#04140E 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#C9A84C]/10 shrink-0">
          <div className="w-8 h-8 rounded-xl border border-[#C9A84C]/25 flex items-center justify-center shrink-0" style={{ background:'rgba(201,168,76,0.08)' }}>
            <svg viewBox="0 0 100 80" className="w-5 h-4" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z"/>
              <circle cx="37" cy="51" r="5.5"/><circle cx="23" cy="49" r="3.2"/>
              <rect x="57.5" y="32" width="3.0" height="40" rx="1.5"/>
              <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z"/>
              <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#E8C96B] tracking-[0.08em] uppercase truncate">Craft Nest</p>
            <p className="text-[9px] text-white/25 capitalize">{userRole} Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white cursor-pointer shrink-0 p-1"><X className="w-4 h-4"/></button>
        </div>

        {/* User badge */}
        <div className="px-3 py-3 border-b border-[#C9A84C]/8 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background:'rgba(201,168,76,0.05)' }}>
            <div className="w-7 h-7 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]"/>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white/80 truncate">{userName}</p>
              <p className="text-[9px] text-white/25 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV.map(({ id, label, icon:Icon, sub }) => (
            <button key={id} onClick={() => { setTab(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer border min-w-0 ${tab===id ? 'bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#E8C96B]' : 'text-white/40 hover:text-white/70 hover:bg-white/3 border-transparent'}`}>
              <Icon className={`w-4 h-4 shrink-0 ${tab===id ? 'text-[#C9A84C]' : 'text-white/30 group-hover:text-white/50'}`}/>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold tracking-[0.06em] truncate">{label}</p>
                {sub && <p className="text-[9px] text-white/20 mt-0.5">{sub}</p>}
              </div>
              {tab===id && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0"/>}
            </button>
          ))}
        </nav>

        {/* Footer links */}
        <div className="px-2 py-3 border-t border-[#C9A84C]/10 space-y-0.5 shrink-0">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/60 hover:bg-white/3 text-[11px] font-bold tracking-[0.06em] transition-all">
            <Eye className="w-4 h-4 shrink-0"/> View Website
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-500/5 text-[11px] font-bold tracking-[0.06em] transition-all cursor-pointer">
            <LogOut className="w-4 h-4 shrink-0"/> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:ml-0">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-[#C9A84C]/10 sticky top-0 z-30 shrink-0"
          style={{ background:'rgba(3,16,10,0.97)', backdropFilter:'blur(12px)' }}
        >
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-white/10 text-white/40 hover:text-white cursor-pointer shrink-0">
            <Menu className="w-4 h-4"/>
          </button>
          <p className="text-[9px] tracking-[0.25em] text-[#C9A84C]/50 uppercase font-bold truncate flex-1">
            {NAV.find(n => n.id===tab)?.label ?? 'Admin'}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-white/20 hidden sm:block truncate max-w-[120px]">{userName}</span>
            <div className="w-7 h-7 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]"/>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
          {tab === 'dashboard' && <Dashboard data={data} onNavigate={setTab} role={userRole}/>}

          {(tab === 'jewellery' || tab === 'gifts' || tab === 'painting') && (
            <ProductsTab
              category={tab} data={data} role={userRole}
              onAdd={() => setProductModal({ open:true, product:null, category:tab })}
              onEdit={p => setProductModal({ open:true, product:p, category:tab })}
              onDelete={p => setDeleteTarget({ type:'product', product:p, category:tab })}
              onToggleV={p => handleToggleV(tab, p)}
              onToggleF={p => handleToggleF(tab, p)}
              onReorder={(cat, items) => { reorderProducts(cat, items); refresh() }}
            />
          )}

          {tab === 'gallery' && (
            <GalleryTab data={data} role={userRole}
              onAdd={() => setGalleryModal(true)}
              onDelete={item => setDeleteTarget({ type:'gallery', item })}
            />
          )}

          {tab === 'hero' && (
            <HeroTab data={data}
              onAdd={url => { addHeroImage(url); refresh(); show('Image added') }}
              onRemove={url => { removeHeroImage(url); refresh(); show('Image removed') }}
              onReorder={imgs => { reorderHeroImages(imgs); refresh() }}
            />
          )}

          {tab === 'settings' && userRole === 'owner' && <SettingsTab data={data} show={show}/>}
        </main>
      </div>

      {/* ── Modals ── */}
      {productModal.open && (
        <ProductModal
          category={productModal.category} product={productModal.product}
          onSave={handleSaveProduct}
          onClose={() => setProductModal(m => ({ ...m, open:false }))}
        />
      )}
      {galleryModal && (
        <GalleryModal
          onSave={item => { addGalleryItem(item); refresh(); setGalleryModal(false); show('Photo added') }}
          onClose={() => setGalleryModal(false)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          label={deleteTarget.type==='product' ? deleteTarget.product.title : deleteTarget.item.caption || 'this photo'}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts}/>
    </div>
  )
}
