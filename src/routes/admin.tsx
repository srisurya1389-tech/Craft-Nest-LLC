import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard, ImageIcon, LogOut, Plus, Pencil, Settings,
  Trash2, X, Eye, EyeOff, ShieldCheck, Gem, Gift, Palette,
  CheckCircle2, AlertCircle, RefreshCw, Search,
  Star, EyeOff as HideIcon, Download, Upload, GripVertical, Home,
  MessageCircle, Megaphone, Link, Camera, Menu,
  BookOpen, ChevronRight, ChevronLeft, Info, Lightbulb, Copy, Zap, Image as ImageIcon2,
  CalendarDays, Bot, Sparkles, Layers,
} from 'lucide-react'
import {
  getAdminData, saveSettings, addProduct, updateProduct, deleteProduct,
  reorderProducts, addGalleryItem, deleteGalleryItem,
  addHeroImage, removeHeroImage, reorderHeroImages,
  exportProductsCSV, uploadToCloudinary, resetToDefaults,
  setScheduleEntry, removeScheduleEntry,
  addExtraService, updateExtraService, deleteExtraService, setExtraServicesTemplate,
  type Product, type GalleryItem, type AdminData, type SiteSettings, type Category,
  type ScheduleStatus, type ScheduleEntry, type ExtraService,
} from '../data/adminStore'

export const Route = createFileRoute('/admin')({ component: AdminPanel })

// ── Auth ──────────────────────────────────────────────────────────────────────

type Role = 'owner' | 'staff'
const ADMIN_USERS: { email: string; password: string; name: string; role: Role }[] = [
  { email: 'srisurya1389@gmail.com', password: 'AP39DY1437', name: 'Owner', role: 'owner' },
  // { email: 'secondperson@example.com', password: 'TheirPassword', name: 'Manager', role: 'staff' },
]
const SESSION_KEY = 'craftnest_admin_auth'

type Tab = 'dashboard' | 'jewellery' | 'gifts' | 'painting' | 'gallery' | 'hero' | 'media' | 'schedule' | 'extras' | 'settings' | 'guide'

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
      style={{ background:'radial-gradient(ellipse at 30% 40%,#201860 0%,#0E0E2C 55%,#08081A 100%)' }}>
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
    <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 hover:border-[#C9A84C]/25 transition-all" style={{ background:'rgba(18,18,50,0.92)' }}>
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
          <div key={label} className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5" style={{ background:'rgba(18,18,50,0.92)' }}>
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
                style={{ background:'rgba(18,18,50,0.92)' }}
              >
                {/* Drag handle */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <div className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <GripVertical className="w-3 h-3 text-white/60"/>
                  </div>
                </div>

                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090E]/80 to-transparent"/>
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
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

      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 space-y-3" style={{ background:'rgba(18,18,50,0.92)' }}>
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
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

// ── Media / Image Converter Tab ───────────────────────────────────────────────

type UploadedItem = { file: File; previewUrl: string; cloudUrl: string | null; status: 'idle' | 'uploading' | 'done' | 'error'; err: string }

function MediaTab({ onGoSettings }: { onGoSettings: () => void }) {
  const [items, setItems]       = useState<UploadedItem[]>([])
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied]     = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const newItems: UploadedItem[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ file:f, previewUrl:URL.createObjectURL(f), cloudUrl:null, status:'idle', err:'' }))
    setItems(prev => [...newItems, ...prev])
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const convertOne = async (idx: number) => {
    setItems(prev => prev.map((it, i) => i===idx ? { ...it, status:'uploading', err:'' } : it))
    try {
      const url = await uploadToCloudinary(items[idx].file)
      setItems(prev => prev.map((it, i) => i===idx ? { ...it, cloudUrl:url, status:'done' } : it))
    } catch (ex) {
      setItems(prev => prev.map((it, i) => i===idx ? { ...it, status:'error', err:(ex as Error).message } : it))
    }
  }

  const convertAll = async () => {
    const pending = items.map((it, i) => ({ it, i })).filter(x => x.it.status === 'idle' || x.it.status === 'error')
    for (const { i } of pending) await convertOne(i)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(url); setTimeout(() => setCopied(null), 2000)
  }

  const remove = (idx: number) => {
    URL.revokeObjectURL(items[idx].previewUrl)
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const hasPending = items.some(it => it.status === 'idle' || it.status === 'error')
  const settings   = (() => { try { return JSON.parse(localStorage.getItem('craftnest_admin_data') || '{}')?.settings } catch { return null } })()
  const presetOk   = !!(settings?.cloudinaryPreset)

  return (
    <div className="space-y-5 w-full">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-white mb-0.5">Image Converter</h2>
        <p className="text-xs text-white/35">Drop or pick images → Convert to a link → Copy and paste into any image field.</p>
      </div>

      {/* Setup warning */}
      {!presetOk && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-500/25" style={{ background:'rgba(30,20,5,0.85)' }}>
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"/>
          <div className="min-w-0">
            <p className="text-xs font-bold text-amber-300 mb-1">One-time setup required</p>
            <p className="text-[11px] text-amber-200/60 leading-relaxed">
              To convert images you need a Cloudinary Upload Preset. Go to <strong className="text-amber-300">Settings → Image Upload</strong> and enter your Cloud Name + Preset. See the Starter Guide for step-by-step instructions.
            </p>
            <button onClick={onGoSettings} className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-amber-300 hover:text-amber-100 cursor-pointer">
              <Settings className="w-3 h-3"/> Go to Settings →
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[180px] sm:min-h-[220px] ${dragging ? 'border-[#C9A84C] bg-[#C9A84C]/8 scale-[1.01]' : 'border-[#C9A84C]/20 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5'}`}
        style={{ background: dragging ? 'rgba(201,168,76,0.06)' : 'rgba(13,13,38,0.64)' }}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${dragging ? 'border-[#C9A84C]/60 bg-[#C9A84C]/15' : 'border-[#C9A84C]/20 bg-[#C9A84C]/5'}`}>
          {dragging
            ? <Zap className="w-7 h-7 text-[#C9A84C]"/>
            : <ImageIcon2 className="w-7 h-7 text-[#C9A84C]/50"/>
          }
        </div>
        <div className="text-center px-4">
          <p className="text-sm font-bold text-white/70 mb-1">{dragging ? 'Drop to add images' : 'Drag & Drop images here'}</p>
          <p className="text-[11px] text-white/30">or <span className="text-[#C9A84C]/70 underline underline-offset-2">click to browse files</span> from your device</p>
          <p className="text-[10px] text-white/20 mt-1">Supports JPG · PNG · WEBP · GIF</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)}/>
      </div>

      {/* Convert All button */}
      {items.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={convertAll}
            disabled={!hasPending || !presetOk}
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-[#04140E] font-bold text-[10px] tracking-[0.2em] uppercase px-6 py-3 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_4px_16px_rgba(201,168,76,0.3)]"
          >
            <Zap className="w-3.5 h-3.5"/>
            Convert All to Links
          </button>
          <button onClick={() => setItems([])} className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/25 hover:text-white/50 cursor-pointer">Clear All</button>
          <span className="text-[10px] text-white/25 ml-auto">{items.filter(i=>i.status==='done').length}/{items.length} converted</span>
        </div>
      )}

      {/* Item list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.status==='done' ? 'border-emerald-600/20 bg-emerald-950/20' : item.status==='error' ? 'border-red-500/20 bg-red-950/20' : 'border-[#C9A84C]/10'}`}
              style={item.status!=='done' && item.status!=='error' ? { background:'rgba(18,18,50,0.92)' } : {}}>
              {/* Preview */}
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover"/>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white/70 truncate mb-1">{item.file.name}</p>
                <p className="text-[10px] text-white/25">{(item.file.size / 1024).toFixed(0)} KB</p>

                {item.status === 'done' && item.cloudUrl && (
                  <div className="mt-1.5 flex items-center gap-2 min-w-0">
                    <input
                      readOnly value={item.cloudUrl}
                      className="flex-1 min-w-0 text-[10px] bg-white/5 border border-emerald-600/20 rounded-lg px-2.5 py-1.5 text-emerald-300/80 focus:outline-none font-mono truncate cursor-text"
                      onClick={e => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => copyUrl(item.cloudUrl!)}
                      className={`shrink-0 flex items-center gap-1 text-[9px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${copied===item.cloudUrl ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/15'}`}
                    >
                      <Copy className="w-3 h-3"/> {copied===item.cloudUrl ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}

                {item.status === 'error' && (
                  <p className="text-[10px] text-red-400 mt-1">{item.err || 'Upload failed'}</p>
                )}
              </div>

              {/* Action */}
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                {item.status === 'idle' && (
                  <button onClick={() => convertOne(idx)} disabled={!presetOk}
                    className="flex items-center gap-1 text-[9px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/25 cursor-pointer disabled:opacity-40 whitespace-nowrap">
                    <Zap className="w-3 h-3"/> Convert
                  </button>
                )}
                {item.status === 'uploading' && (
                  <span className="flex items-center gap-1 text-[9px] text-white/40 uppercase font-bold">
                    <RefreshCw className="w-3 h-3 animate-spin"/> Uploading…
                  </span>
                )}
                {item.status === 'done' && (
                  <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold"><CheckCircle2 className="w-3 h-3"/> Done</span>
                )}
                {item.status === 'error' && (
                  <button onClick={() => convertOne(idx)} className="flex items-center gap-1 text-[9px] font-bold text-red-400 hover:text-red-300 cursor-pointer uppercase">
                    <RefreshCw className="w-3 h-3"/> Retry
                  </button>
                )}
                <button onClick={() => remove(idx)} className="text-white/20 hover:text-white/50 cursor-pointer p-0.5"><X className="w-3.5 h-3.5"/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="rounded-2xl border border-[#C9A84C]/8 p-4" style={{ background:'rgba(13,13,38,0.55)' }}>
          <p className="text-[10px] tracking-[0.2em] text-[#C9A84C]/40 uppercase font-bold mb-3">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { num:'1', icon:ImageIcon2, color:'#C9A84C', label:'Pick or Drop',    detail:'Drag images from your computer onto the drop zone, or click it to open your file explorer.' },
              { num:'2', icon:Zap,        color:'#5DBEA3', label:'Convert to Link', detail:'Click "Convert" on each image or "Convert All" to upload everything to the cloud at once.' },
              { num:'3', icon:Copy,       color:'#8BA4F8', label:'Copy & Paste',    detail:'Copy the generated URL and paste it into any image field in your products, gallery, or hero.' },
            ].map(({ num, icon:Icon, color, label, detail }) => (
              <div key={num} className="flex flex-col items-center text-center gap-2 p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background:`${color}12`, borderColor:`${color}25` }}>
                  <Icon className="w-5 h-5" style={{ color }}/>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white/70 mb-0.5"><span style={{ color }} className="mr-1">{num}.</span>{label}</p>
                  <p className="text-[10px] text-white/30 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Schedule Tab ──────────────────────────────────────────────────────────────

const SCHED_STATUS: Record<ScheduleStatus, { label: string; dot: string; pill: string; glow: string }> = {
  free:    { label: '✅ Free / Available',  dot: 'bg-emerald-400', pill: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',  glow: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]' },
  limited: { label: '⚡ Limited Slots',      dot: 'bg-amber-400',   pill: 'border-amber-500/40  bg-amber-500/10  text-amber-300',    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]'  },
  busy:    { label: '🔴 Busy / Occupied',    dot: 'bg-red-400',     pill: 'border-red-500/40    bg-red-500/10    text-red-300',      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]'   },
  booked:  { label: '📅 Fully Booked',       dot: 'bg-purple-400',  pill: 'border-purple-500/40 bg-purple-500/10 text-purple-300',   glow: 'shadow-[0_0_8px_rgba(168,85,247,0.4)]'  },
}

const CN_SERVICES = ['Face Painting', 'Handmade Jewellery', 'Return Gifts']
const CAL_MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const CAL_DAYS    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function ScheduleTab({ data, show, onRefresh }: { data: AdminData; show: (msg:string, t?:'success'|'error') => void; onRefresh: () => void }) {
  const today    = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selDate,   setSelDate]   = useState<string | null>(null)
  const [hovered,   setHovered]   = useState<string | null>(null)   // Feature 2: tooltip
  const [form, setForm] = useState<{ status: ScheduleStatus; note: string; services: string[]; amStatus: ScheduleStatus|''; pmStatus: ScheduleStatus|'' }>({
    status: 'free', note: '', services: [...CN_SERVICES], amStatus: '', pmStatus: '',
  })

  const schedule    = data.schedule ?? {}
  const fmt         = (y: number, m: number, d: number) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Build week rows for Feature 3 (bulk-mark) and Feature 14 (mini strips)
  const weeks: (number|null)[][] = []
  let wk: (number|null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) { wk.push(d); if (wk.length === 7) { weeks.push(wk); wk = [] } }
  while (wk.length > 0 && wk.length < 7) wk.push(null)
  if (wk.length) weeks.push(wk)

  // Feature 1: Jump to Today
  const goToday   = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()) }
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1) } else setViewMonth(m => m-1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1) } else setViewMonth(m => m+1) }

  const selectDate = (dateStr: string) => {
    setSelDate(dateStr)
    const ex = schedule[dateStr]
    setForm(ex
      ? { status: ex.status, note: ex.note, services: ex.services ?? [...CN_SERVICES], amStatus: ex.amStatus ?? '', pmStatus: ex.pmStatus ?? '' }
      : { status: 'free', note: '', services: [...CN_SERVICES], amStatus: '', pmStatus: '' })
  }

  const handleSave = () => {
    if (!selDate) return
    const [y,m,d] = selDate.split('-').map(Number)
    const label = new Date(y, m-1, d).toLocaleDateString('en-US', { month:'long', day:'numeric' })
    const entry: ScheduleEntry = { date: selDate, status: form.status, note: form.note, services: form.services }
    if (form.amStatus) entry.amStatus = form.amStatus
    if (form.pmStatus) entry.pmStatus = form.pmStatus
    setScheduleEntry(entry)
    onRefresh(); show(`Schedule saved for ${label}`)
  }

  const handleClear = () => {
    if (!selDate) return
    removeScheduleEntry(selDate); onRefresh(); show('Schedule entry removed'); setSelDate(null)
  }

  // Feature 3: Bulk-mark entire week row
  const bulkMarkWeek = (wkDays: (number|null)[]) => {
    let n = 0
    wkDays.forEach(d => {
      if (!d) return
      const dateStr = fmt(viewYear, viewMonth, d)
      const ex = schedule[dateStr] ?? {}
      setScheduleEntry({ ...(ex as ScheduleEntry), date: dateStr, status: form.status, note: form.note, services: form.services })
      n++
    })
    onRefresh(); show(`${n} days marked as ${SCHED_STATUS[form.status].label}`)
  }

  // Feature 4: Copy current month entries to next month
  const copyToNext = () => {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear
    const nextDim = new Date(ny, nm + 1, 0).getDate()
    let n = 0
    Object.values(schedule).forEach(e => {
      const [ey, em, ed] = e.date.split('-').map(Number)
      if (ey === viewYear && em - 1 === viewMonth && ed <= nextDim) { setScheduleEntry({ ...e, date: fmt(ny, nm, ed) }); n++ }
    })
    onRefresh(); show(n ? `Copied ${n} entries to ${CAL_MONTHS[nm]}` : 'No entries to copy')
  }

  const toggleService = (s: string) =>
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }))

  const selEntry   = selDate ? schedule[selDate] : null
  const selDisplay = selDate ? (() => { const [y,m,d] = selDate.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) })() : ''

  // Feature 6: Monthly summary for current view
  const mEntries   = Object.values(schedule).filter(e => { const [y,m] = e.date.split('-').map(Number); return y===viewYear && m-1===viewMonth })
  const mFree      = mEntries.filter(e=>e.status==='free').length
  const mLimited   = mEntries.filter(e=>e.status==='limited').length
  const mBusy      = mEntries.filter(e=>e.status==='busy').length
  const mBooked    = mEntries.filter(e=>e.status==='booked').length

  // Feature 5: Upcoming busy/booked/limited
  const upcoming   = Object.values(schedule).filter(e => e.date >= todayStr && e.status !== 'free').sort((a,b) => a.date.localeCompare(b.date)).slice(0, 8)

  // Feature 14: Ghost rows from prev / next month
  const prevDim    = new Date(viewMonth===0?viewYear-1:viewYear, viewMonth===0?12:viewMonth, 0).getDate()
  const daysAfter  = (7 - (firstDay + daysInMonth) % 7) % 7

  // Feature 8: Keyboard shortcuts
  useEffect(() => {
    if (!selDate) return
    const h = (e: KeyboardEvent) => {
      if (['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)) return
      const [y,m,d] = selDate.split('-').map(Number)
      const go = (days: number) => {
        const nd = new Date(y, m-1, d+days)
        const ns = `${nd.getFullYear()}-${String(nd.getMonth()+1).padStart(2,'0')}-${String(nd.getDate()).padStart(2,'0')}`
        selectDate(ns); setViewYear(nd.getFullYear()); setViewMonth(nd.getMonth())
      }
      if (e.key==='ArrowRight'){ e.preventDefault(); go(1) }
      if (e.key==='ArrowLeft') { e.preventDefault(); go(-1) }
      if (e.key==='ArrowDown') { e.preventDefault(); go(7) }
      if (e.key==='ArrowUp')   { e.preventDefault(); go(-7) }
      if (e.key==='Enter')     { e.preventDefault(); handleSave() }
      if (e.key==='Escape')    { e.preventDefault(); setSelDate(null) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [selDate, form])

  const STATUS_FILL: Record<ScheduleStatus, string> = {
    free:'rgba(52,211,153,0.08)', limited:'rgba(245,158,11,0.09)', busy:'rgba(239,68,68,0.09)', booked:'rgba(168,85,247,0.09)',
  }

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-white mb-0.5">Schedule Manager</h2>
          <p className="text-xs text-white/35">Set your availability. The chatbot reads this in real time to answer booking queries.</p>
        </div>
        {/* Feature 8 hint */}
        <div className="flex items-center gap-1.5 text-[9px] text-white/20 border border-white/8 rounded-lg px-2.5 py-1.5 shrink-0">
          <span>← → ↑ ↓ navigate</span><span className="opacity-40 mx-1">·</span><span>↵ save</span><span className="opacity-40 mx-1">·</span><span>Esc close</span>
        </div>
      </div>

      {/* Legend + global counts */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-3">
          {(Object.entries(SCHED_STATUS) as [ScheduleStatus, typeof SCHED_STATUS[ScheduleStatus]][]).map(([k,v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full shrink-0 ${v.dot}`}/>
              <span className="text-[10px] text-white/45">{v.label}</span>
            </div>
          ))}
        </div>
        <div className="ml-auto flex gap-3 shrink-0">
          {[{l:'Free',v:Object.values(schedule).filter(e=>e.status==='free').length,c:'text-emerald-400'},
            {l:'Busy',v:Object.values(schedule).filter(e=>e.status==='busy').length,c:'text-red-400'},
            {l:'Booked',v:Object.values(schedule).filter(e=>e.status==='booked'||e.status==='limited').length,c:'text-purple-400'}
          ].map(({l,v,c}) => (
            <div key={l} className="text-center">
              <p className={`text-sm font-bold ${c}`}>{v}</p>
              <p className="text-[9px] text-white/20">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar + Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,560px)_380px] gap-4 items-start">

        {/* ── Calendar ── */}
        <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5" style={{ background:'rgba(18,18,50,0.92)' }}>

          {/* Month nav + Feature 1: Today button */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-[#C9A84C]/30 transition-all cursor-pointer"><ChevronLeft className="w-4 h-4"/></button>
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-sm font-serif text-white">{CAL_MONTHS[viewMonth]}</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-white/30">{viewYear}</p>
                {(viewYear!==today.getFullYear()||viewMonth!==today.getMonth()) && (
                  <button onClick={goToday} className="text-[8px] font-bold text-[#C9A84C]/60 hover:text-[#C9A84C] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded px-1.5 py-0.5 transition-all cursor-pointer">Today</button>
                )}
              </div>
            </div>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-[#C9A84C]/30 transition-all cursor-pointer"><ChevronRight className="w-4 h-4"/></button>
          </div>

          {/* Feature 4: Copy to next month */}
          <button onClick={copyToNext} className="w-full flex items-center justify-center gap-1.5 mb-3 py-1.5 rounded-lg border border-[#C9A84C]/12 text-[9px] font-bold text-[#C9A84C]/40 hover:text-[#C9A84C]/80 hover:border-[#C9A84C]/35 transition-all cursor-pointer">
            <Copy className="w-3 h-3"/> Copy this month's schedule → {CAL_MONTHS[viewMonth===11?0:viewMonth+1].slice(0,3)}
          </button>

          {/* Day headers — Feature 12: weekend shading */}
          <div className="grid grid-cols-[20px_repeat(7,1fr)] mb-1">
            <div/>
            {CAL_DAYS.map((d,i) => (
              <div key={d} className="text-center text-[9px] font-bold tracking-wider py-1 rounded-t"
                style={{ color:(i===0||i===6)?'rgba(232,201,107,0.55)':'rgba(255,255,255,0.22)', background:(i===0||i===6)?'rgba(201,168,76,0.035)':'transparent' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Feature 14: Prev month ghost row */}
          {firstDay > 0 && (
            <div className="grid grid-cols-[20px_repeat(7,1fr)] gap-0.5 mb-0.5">
              <div className="text-[7px] text-white/10 flex items-center justify-center">·</div>
              {Array.from({length:firstDay}).map((_,i)=>(
                <div key={i} className="h-8 flex items-center justify-center text-[10px] rounded-lg" style={{color:'rgba(255,255,255,0.1)'}}>{prevDim-firstDay+1+i}</div>
              ))}
              {Array.from({length:7-firstDay}).map((_,i)=><div key={i}/>)}
            </div>
          )}

          {/* Main grid — Features 2, 3, 12, 13 */}
          <div className="relative space-y-0.5">
            {/* Feature 2: Hover tooltip */}
            {hovered && schedule[hovered] && (() => {
              const e = schedule[hovered]
              return (
                <div className="absolute z-20 left-6 top-0 pointer-events-none" style={{ background:'rgba(5,20,12,0.97)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:'10px', padding:'8px 12px', minWidth:'170px', boxShadow:'0 8px 24px rgba(0,0,0,0.6)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-2 h-2 rounded-full ${SCHED_STATUS[e.status].dot}`}/>
                    <p className="text-[10px] font-bold text-white">{SCHED_STATUS[e.status].label}</p>
                  </div>
                  {e.amStatus && <p className="text-[8px] text-white/35">🌅 AM: {SCHED_STATUS[e.amStatus].label}</p>}
                  {e.pmStatus && <p className="text-[8px] text-white/35">🌆 PM: {SCHED_STATUS[e.pmStatus].label}</p>}
                  {e.note && <p className="text-[9px] text-white/40 mt-1 leading-relaxed">{e.note}</p>}
                  {e.services?.length ? <p className="text-[8px] text-emerald-400/50 mt-0.5">{e.services.join(' · ')}</p> : null}
                </div>
              )
            })()}

            {weeks.map((wkDays, wi) => (
              <div key={wi} className="grid grid-cols-[20px_repeat(7,1fr)] gap-0.5">
                {/* Feature 3: Week label / bulk-mark */}
                <button onClick={()=>bulkMarkWeek(wkDays)} title={`Mark all ${wkDays.filter(Boolean).length} days as ${SCHED_STATUS[form.status].label}`}
                  className="h-9 text-[7px] font-bold text-white/12 hover:text-[#C9A84C]/50 hover:bg-[#C9A84C]/5 rounded transition-all cursor-pointer flex items-center justify-center">
                  {wi+1}
                </button>
                {wkDays.map((d, di) => {
                  if (!d) return <div key={`e${di}`} className="h-9 rounded-lg" style={{background:(di===0||di===6)?'rgba(201,168,76,0.02)':'transparent'}}/>
                  const dateStr  = fmt(viewYear, viewMonth, d)
                  const entry    = schedule[dateStr]
                  const isToday  = dateStr === todayStr
                  const isSel    = selDate === dateStr
                  const isPast   = new Date(viewYear,viewMonth,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate())
                  const isWeekend= di===0||di===6
                  return (
                    <button key={d}
                      onClick={()=>selectDate(dateStr)}
                      onMouseEnter={()=>entry?setHovered(dateStr):undefined}
                      onMouseLeave={()=>setHovered(null)}
                      className={`relative h-9 w-full flex flex-col items-center justify-center rounded-lg text-[11px] font-bold transition-all cursor-pointer border
                        ${isSel ? 'border-[#C9A84C] text-[#04140E]'+(entry?' '+SCHED_STATUS[entry.status].glow:'')
                          : isToday  ? 'border-[#C9A84C]/40 text-[#E8C96B]'
                          : isPast   ? 'border-transparent text-white/18 hover:text-white/35'
                          : entry    ? 'border-white/8 text-white/80 hover:border-[#C9A84C]/30'
                          : isWeekend? 'border-transparent text-white/30 hover:text-white/55'
                          : 'border-transparent text-white/45 hover:text-white/75'}`}
                      style={{ background: isSel?'#C9A84C' : isToday?'rgba(201,168,76,0.1)' : isWeekend?'rgba(201,168,76,0.025)' : entry?STATUS_FILL[entry.status]:'' }}
                    >
                      <span className="text-xs leading-none">{d}</span>
                      {entry && !isSel && <div className={`w-1 h-1 rounded-full mt-0.5 ${SCHED_STATUS[entry.status].dot}`}/>}
                      {entry && isSel  && <div className="w-1 h-1 rounded-full mt-0.5 bg-[#04140E]/50"/>}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Feature 14: Next month ghost row */}
          {daysAfter > 0 && (
            <div className="grid grid-cols-[20px_repeat(7,1fr)] gap-0.5 mt-0.5">
              <div className="text-[7px] text-white/10 flex items-center justify-center">·</div>
              {Array.from({length:7-daysAfter}).map((_,i)=><div key={i}/>)}
              {Array.from({length:daysAfter}).map((_,i)=>(
                <div key={i} className="h-8 flex items-center justify-center text-[10px] rounded-lg" style={{color:'rgba(255,255,255,0.1)'}}>{i+1}</div>
              ))}
            </div>
          )}

          {/* Feature 6: Monthly summary bar */}
          {mEntries.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2.5 px-3 py-2 rounded-xl border border-white/5" style={{background:'rgba(255,255,255,0.02)'}}>
              <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{CAL_MONTHS[viewMonth].slice(0,3)} Summary</p>
              {([['Free',mFree,'#34D399'],['Limited',mLimited,'#FBBF24'],['Busy',mBusy,'#F87171'],['Booked',mBooked,'#C084FC']] as [string,number,string][]).filter(([,v])=>v>0).map(([l,v,c])=>(
                <div key={l} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:c}}/>
                  <span className="text-[9px]" style={{color:c+'99'}}>{v} {l}</span>
                </div>
              ))}
            </div>
          )}

          {/* Chatbot info */}
          <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl border border-[#C9A84C]/10" style={{background:'rgba(201,168,76,0.04)'}}>
            <Bot className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5"/>
            <p className="text-[10px] text-white/30 leading-relaxed">Chatbot reads this live. Customers can ask "Are you free on [date]?", "What's available this week?", or "Free for face painting on Saturday?" and get instant answers.</p>
          </div>
        </div>

        {/* ── Day Panel ── */}
        {selDate ? (
          <div className="rounded-2xl border border-[#C9A84C]/15 p-4 sm:p-5 space-y-4 sticky top-20" style={{background:'rgba(13,13,38,0.98)'}}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] tracking-[0.2em] text-[#C9A84C]/50 uppercase font-bold mb-0.5">Selected Date</p>
                <p className="text-sm font-bold text-white leading-snug">{selDisplay}</p>
                {selEntry && <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1 ${SCHED_STATUS[selEntry.status].pill}`}>{SCHED_STATUS[selEntry.status].label}</span>}
              </div>
              <button onClick={()=>setSelDate(null)} className="shrink-0 p-1.5 rounded-lg text-white/25 hover:text-white cursor-pointer"><X className="w-4 h-4"/></button>
            </div>

            {/* Overall status */}
            <div>
              <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-2">Overall Status</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(SCHED_STATUS) as [ScheduleStatus, typeof SCHED_STATUS[ScheduleStatus]][]).map(([k,v]) => (
                  <button key={k} type="button" onClick={()=>setForm(f=>({...f,status:k}))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${form.status===k ? v.pill+' '+v.glow : 'border-white/8 text-white/30 hover:text-white/60 hover:border-white/15'}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${v.dot} ${form.status!==k?'opacity-40':''}`}/>
                    <span className="truncate">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature 7: AM / PM time slots */}
            <div>
              <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-2">Time Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {(['amStatus','pmStatus'] as const).map((field,fi) => (
                  <div key={field}>
                    <p className="text-[9px] text-white/25 font-bold mb-1">{fi===0?'🌅 Morning':'🌆 Afternoon'}</p>
                    <select value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value as ScheduleStatus|''}))}
                      className="w-full rounded-lg px-2 py-2 text-[10px] text-white/65 focus:outline-none cursor-pointer"
                      style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,168,76,0.15)'}}>
                      <option value="">— Same as overall</option>
                      {(Object.entries(SCHED_STATUS) as [ScheduleStatus, typeof SCHED_STATUS[ScheduleStatus]][]).map(([k,v])=>(
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-1.5">Notes <span className="text-white/20 normal-case tracking-normal font-normal">(shown in chatbot)</span></label>
              <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} rows={2}
                placeholder="e.g. Birthday party 10am–4pm · Jewellery orders still OK"
                className="w-full bg-white/5 border border-[#C9A84C]/15 rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 resize-none transition-colors"/>
            </div>

            {/* Services */}
            <div>
              <label className="block text-[10px] tracking-[0.18em] text-[#C9A84C]/60 uppercase font-bold mb-1.5">Services Available</label>
              <div className="space-y-1.5">
                {CN_SERVICES.map(s => (
                  <button key={s} type="button" onClick={()=>toggleService(s)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-sm transition-all cursor-pointer text-left ${form.services.includes(s)?'border-emerald-600/30 bg-emerald-600/8 text-white/80':'border-white/8 text-white/30 hover:border-white/15'}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${form.services.includes(s)?'bg-emerald-500 border-emerald-500':'border-white/20'}`}>
                      {form.services.includes(s) && <CheckCircle2 className="w-3 h-3 text-white"/>}
                    </div>
                    <span className="font-medium text-[11px]">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-[10px] tracking-[0.18em] uppercase py-3 rounded-full transition-all hover:scale-[1.02] cursor-pointer shadow-[0_4px_16px_rgba(201,168,76,0.3)]">
                <CheckCircle2 className="w-4 h-4"/> Save (↵)
              </button>
              {selEntry && (
                <button onClick={handleClear} className="px-5 py-3 rounded-full border border-red-500/25 text-red-400/70 hover:text-red-400 hover:border-red-500/50 text-[10px] font-bold tracking-[0.18em] uppercase transition-all cursor-pointer shrink-0">Clear</button>
              )}
            </div>
            <p className="text-[8px] text-white/12 text-center">←→↑↓ navigate dates · Esc to close</p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-[#C9A84C]/12 flex flex-col items-center justify-center gap-3 p-10 text-center">
            <CalendarDays className="w-8 h-8 text-[#C9A84C]/25"/>
            <p className="text-sm font-serif text-white/30">Click any date on the calendar</p>
            <p className="text-[11px] text-white/20 max-w-[200px] leading-relaxed">Set it as Free, Busy, Limited, or Fully Booked so the chatbot knows your availability.</p>
          </div>
        )}
      </div>

      {/* Feature 5: Upcoming bookings panel */}
      {upcoming.length > 0 && (
        <div className="rounded-2xl border border-[#C9A84C]/10 p-4" style={{background:'rgba(13,13,38,0.75)'}}>
          <p className="text-[10px] tracking-[0.18em] text-[#C9A84C]/55 uppercase font-bold mb-3">📋 Upcoming Busy / Booked Dates</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {upcoming.map(e => {
              const [y,m,d] = e.date.split('-').map(Number)
              const disp = new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
              const s = SCHED_STATUS[e.status]
              return (
                <button key={e.date} onClick={()=>{selectDate(e.date);setViewYear(y);setViewMonth(m-1)}}
                  className="flex items-start gap-2 p-2.5 rounded-xl border transition-all hover:border-[#C9A84C]/25 cursor-pointer text-left"
                  style={{background:'rgba(255,255,255,0.02)',borderColor:'rgba(255,255,255,0.06)'}}>
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${s.dot}`}/>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-white/65">{disp}</p>
                    <p className="text-[8px] font-bold text-white/30">{s.label}</p>
                    {e.note && <p className="text-[8px] text-white/20 truncate mt-0.5">{e.note}</p>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
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
    <div className="space-y-5 w-full">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-white mb-0.5">Site Settings</h2>
        <p className="text-xs text-white/35">Control global site options.</p>
      </div>

      {/* Announcement Banner */}
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(18,18,50,0.92)' }}>
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
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(18,18,50,0.92)' }}>
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
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(18,18,50,0.92)' }}>
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
      <div className="rounded-2xl border border-[#C9A84C]/10 p-4 sm:p-5 space-y-3" style={{ background:'rgba(18,18,50,0.92)' }}>
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

// ── Starter Guide Tab ─────────────────────────────────────────────────────────

type GuideSection = {
  id: string
  icon: React.ElementType
  color: string
  title: string
  badge?: string
  intro: string
  steps?: { label: string; detail: string }[]
  tips?: string[]
  warning?: string
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'overview',
    icon: LayoutDashboard,
    color: '#C9A84C',
    title: 'Dashboard — Your Home Base',
    intro: 'The Dashboard is the first screen you see after logging in. It gives you a bird\'s eye view of your entire store at a glance.',
    steps: [
      { label: 'Stat cards (top row)',       detail: 'Shows how many products are in each category and how many are currently visible to customers.' },
      { label: 'Summary row',                detail: 'Total products, how many are live on the site, and how many are marked as "featured".' },
      { label: 'Announcement banner status', detail: 'If your announcement banner is turned ON you will see it here with a green "LIVE" badge.' },
      { label: 'Quick Actions',              detail: 'Shortcut buttons to jump directly to any section — saves time instead of using the sidebar.' },
    ],
    tips: ['Check the dashboard each time you log in to quickly see if anything looks wrong before customers do.'],
  },
  {
    id: 'products',
    icon: Gem,
    color: '#C9A84C',
    title: 'Managing Products (Jewellery · Return Gifts · Face Painting)',
    intro: 'These three tabs work identically. Each one manages products in that category. You can add, edit, hide, feature, reorder, and delete products.',
    steps: [
      { label: '① Add a Product',   detail: 'Click the gold "Add" button (top right). A form slides up. Fill in: Title (required), Image (required), Price, Description, Badge, Stock status, and optionally a custom WhatsApp message. Click "Add Product" when done.' },
      { label: '② Edit a Product',  detail: 'Click the pencil ✏️ icon on any product card. The same form opens pre-filled with existing data. Change anything and click "Save Changes".' },
      { label: '③ Hide / Show',     detail: 'Click the eye 👁 icon. When a product is hidden it turns faded on this page and completely disappears from the customer-facing website. Perfect for temporarily removing a sold-out or seasonal item without deleting it.' },
      { label: '④ Feature a Product', detail: 'Click the star ⭐ icon. Featured products move to the TOP of the collection page so customers see them first. Use this for your best sellers or new arrivals.' },
      { label: '⑤ Drag to Reorder', detail: 'Hover over a card — a grip handle (⠿) appears top-right. Click and drag the card to a new position. The order here is exactly the order customers see on the website.' },
      { label: '⑥ Delete',         detail: 'Owner-only. Click the red trash 🗑 icon. A confirmation screen appears — you must confirm before it deletes. Deleted products cannot be recovered.' },
    ],
    tips: [
      'You can filter the view to show only "visible", "hidden" or "featured" products using the pill buttons at the top.',
      'Use the Search bar to quickly find a product by name or badge.',
      'Click "CSV" to download all products as a spreadsheet — great for record keeping or printing a catalogue.',
    ],
    warning: 'Deleting a product is permanent. If you just want to stop showing it to customers, use Hide instead of Delete.',
  },
  {
    id: 'badges',
    icon: Star,
    color: '#E8C96B',
    title: 'Badges & Stock Status — What They Mean',
    intro: 'Every product has two label systems: a Badge (visual category label) and a Stock Status (availability indicator).',
    steps: [
      { label: 'Badges',            detail: 'Bestseller · Popular · New · Custom · Bridal · Festival · Traditional · Adults · Kids · Limited. These are coloured pills shown on the product image. Choose the one that best describes the product\'s appeal.' },
      { label: '✅ Available',       detail: 'Product is ready to order — shows a green pill and WhatsApp button is fully active.' },
      { label: '⚡ Limited Stock',   detail: 'Only a few remaining — shows an amber warning pill. Customers can still enquire.' },
      { label: '🛠 Made to Order',   detail: 'Not pre-made; custom-crafted when ordered. Customers can still enquire via WhatsApp.' },
      { label: '🔴 Out of Stock',    detail: 'Completely unavailable. The WhatsApp enquiry button is greyed out on the customer page so customers know not to enquire.' },
    ],
    tips: ['Change stock status any time — it updates the live website instantly without reloading the page.'],
  },
  {
    id: 'gallery',
    icon: ImageIcon,
    color: '#8BA4F8',
    title: 'Gallery — Showcase Your Work',
    intro: 'The Gallery tab manages the photo grid shown on the main website. These are event photos, art samples, and behind-the-scenes shots — not product listings.',
    steps: [
      { label: 'Add a photo',    detail: 'Click "Add". Paste a Cloudinary URL or click the camera icon to upload directly from your device. Add a caption (optional) and choose a category: Events, Arts, or Other. Click "Add Photo".' },
      { label: 'Filter by type', detail: 'Use the All / Events / Arts / Other pills to filter the gallery view so you can find photos quickly.' },
      { label: 'Remove a photo', detail: 'Hover over any photo — a red "Remove" button slides up. Click it (Owner only). Confirmation is not required for gallery items.' },
    ],
    tips: ['Add event photos after every booking to keep the gallery fresh. Customers trust businesses with active, real galleries.'],
  },
  {
    id: 'hero',
    icon: Home,
    color: '#F5A623',
    title: 'Hero Carousel — The Homepage Slideshow',
    intro: 'These are the large rotating images customers see the moment they land on craftnestshop.com. First impression matters — keep these beautiful and up to date.',
    steps: [
      { label: 'Add an image',     detail: 'Paste a Cloudinary image URL in the box and click "Add", OR click the Upload button to pick a file from your device (requires Cloudinary preset configured in Settings).' },
      { label: 'Reorder images',   detail: 'Drag any image card to change its position. The first image (#1) is shown first when the page loads. Put your most impressive photo first.' },
      { label: 'Remove an image',  detail: 'Hover over a card and click the red "Remove" button. The carousel will adjust automatically.' },
    ],
    tips: [
      'Use landscape (wide) photos — they look best in a full-width carousel.',
      'Keep 4–8 images for a good pace. Too few looks empty; too many slows the site.',
    ],
    warning: 'If the Cloudinary Upload Preset is not configured in Settings, direct file upload will show an error. You can always use copy-paste URL instead.',
  },
  {
    id: 'settings',
    icon: Settings,
    color: '#9B8EFF',
    title: 'Site Settings — Control the Whole Website',
    badge: 'Owner Only',
    intro: 'Settings lets you change global things that affect the entire website — not just one product. Only the Owner role can access this tab.',
    steps: [
      { label: 'Announcement Banner', detail: 'Toggle ON to show a coloured announcement bar at the top of the website (e.g. "🎉 Free gifting on orders above ₹1000"). Toggle OFF to hide it. Edit the text in the box below the toggle. Click "Save All Settings" to apply.' },
      { label: 'WhatsApp Number',     detail: 'This number is used on ALL "Enquire on WhatsApp" buttons across the site. Enter digits only — no + sign (e.g. 14704527988 for US, 919876543210 for India).' },
      { label: 'Social Links',        detail: 'Paste the full URL for your Instagram and Facebook pages. These appear in the website footer.' },
      { label: 'Cloudinary Config',   detail: 'Cloud Name is your Cloudinary account name (e.g. diancfp03). Upload Preset is a name you create in Cloudinary for unsigned uploads. Both are required for the "Upload" button in product/gallery/hero forms to work.' },
      { label: 'Save Button',         detail: 'Always click "Save All Settings" after making changes. Nothing is saved until you click this button.' },
      { label: 'Reset Everything',    detail: 'DANGER: This deletes all your custom products, gallery photos, and settings and restores the original demo data. Only use this if you want to start completely fresh.' },
    ],
    tips: [
      'After saving settings, refresh the main website to see changes like the announcement banner.',
      'If you change the WhatsApp number, test one product enquiry button to confirm it goes to the right number.',
    ],
    warning: 'Reset Everything cannot be undone. All products and gallery photos you added will be permanently lost.',
  },
  {
    id: 'upload',
    icon: Upload,
    color: '#5DBEA3',
    title: 'Uploading Images — Step-by-Step Setup',
    intro: 'To use the "Upload from device" button in product, gallery, and hero forms you need a free Cloudinary account and one-time setup. Here is the exact process.',
    steps: [
      { label: 'Step 1 — Go to cloudinary.com', detail: 'Sign up for a free account if you don\'t have one. Log in and note your Cloud Name (shown on the dashboard).' },
      { label: 'Step 2 — Create Upload Preset', detail: 'In Cloudinary dashboard → click Settings (gear icon) → Upload → scroll to "Upload presets" → click "Add upload preset". Set "Signing mode" to Unsigned. Give it a name like "craftnest_upload". Click Save.' },
      { label: 'Step 3 — Enter in Admin Settings', detail: 'In this admin panel go to Settings tab. Enter your Cloud Name and the Upload Preset name you just created. Click "Save All Settings".' },
      { label: 'Step 4 — Test it',    detail: 'Go to any product → Edit → click the camera/upload button → pick a photo from your device. It should upload and show a preview URL. Done!' },
    ],
    tips: [
      'Free Cloudinary accounts allow 25 GB storage and 25 GB bandwidth per month — more than enough for a craft store.',
      'You only do this setup once. After that, the Upload button works everywhere in the admin panel.',
    ],
  },
  {
    id: 'roles',
    icon: ShieldCheck,
    color: '#E87D7D',
    title: 'User Roles — Owner vs Staff',
    intro: 'The admin panel supports two types of users with different levels of access. This protects important settings from accidental changes by helpers.',
    steps: [
      { label: '👑 Owner (Full Access)',  detail: 'Can do everything: add/edit/delete products, manage gallery, manage hero images, access Site Settings, reset all data, and export CSVs.' },
      { label: '🧑‍💼 Staff (Limited Access)', detail: 'Can add and edit products, toggle visibility and featured status, and manage gallery — but CANNOT delete products, CANNOT access Site Settings, and CANNOT reset data.' },
    ],
    tips: [
      'When you give someone staff access, they can help keep products updated but cannot break anything critical.',
      'To add a second user, the developer needs to add their email and password to the ADMIN_USERS list in admin.tsx.',
    ],
    warning: 'Never share your Owner credentials. Create a Staff account for anyone who needs limited access.',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    color: '#25D366',
    title: 'WhatsApp Messages — Custom Enquiry Text',
    intro: 'Every product on the website has an "Enquire on WhatsApp" button. When a customer taps it, a pre-filled message opens in WhatsApp. You can customise this message per product.',
    steps: [
      { label: 'Default message',       detail: 'If you leave the "Custom WhatsApp Message" field blank, the button uses the default: "Hi CraftNest! I\'m interested in the [Product Name]. Please share more details."' },
      { label: 'Custom message',        detail: 'In the product edit form, fill in the "WhatsApp Message" field with exactly what you want customers to send. For example: "Hi! I want to order 50 Kundan sets for a wedding. Please share bulk pricing."' },
      { label: 'Out-of-stock products', detail: 'When stock is set to "Out of Stock", the WhatsApp button is greyed out and disabled — customers cannot enquire. Change stock status to re-enable it.' },
    ],
    tips: [
      'Write WhatsApp messages in the language your customers prefer.',
      'For made-to-order products, include details like: "Please share your event date and quantity so we can advise on delivery time."',
    ],
  },
  {
    id: 'schedule',
    icon: CalendarDays,
    color: '#5DBEA3',
    title: 'Schedule Manager — Set Your Availability',
    intro: 'The Schedule tab lets you mark each date as Free, Busy, Limited, or Fully Booked. The website chatbot reads this in real time — so when customers ask "Are you free on July 4th?" they get an instant, accurate answer.',
    steps: [
      { label: 'Open Schedule tab', detail: 'Click "Schedule" in the sidebar. You will see a full monthly calendar on the left side.' },
      { label: 'Click any date',    detail: 'Tap a date on the calendar. A settings panel slides in on the right with options for that day.' },
      { label: 'Pick a status',     detail: '✅ Free = available for all bookings. ⚡ Limited = only a few slots left. 🔴 Busy = occupied but can still take other enquiries. 📅 Fully Booked = nothing more that day.' },
      { label: 'Add a note (optional)', detail: 'Describe why the day is busy, e.g. "Birthday party in Marietta 10am–4pm". This note appears in the chatbot reply to customers.' },
      { label: 'Choose services',   detail: 'Tick which services are available on that day — Face Painting, Handmade Jewellery, and/or Return Gifts.' },
      { label: 'Save',             detail: 'Click "Save Schedule". The dot on the calendar updates immediately. Next time a customer asks the chatbot about that date, it will read your setting and reply in real time.' },
    ],
    tips: [
      'Set upcoming weekend dates every Monday morning — it takes less than 2 minutes and keeps the chatbot accurate all week.',
      'Use the note field to tell customers exactly what you\'re doing: "Fully booked for a wedding — available after 5pm for small orders."',
      'If a date is not set, the chatbot tells customers to confirm on WhatsApp — so it\'s safe to leave unknown dates blank.',
    ],
    warning: 'The chatbot reads the schedule directly from your admin data. If you don\'t set a date, it will say "not yet scheduled" and prompt the customer to WhatsApp you. This is safe — but setting dates gives a much better customer experience.',
  },
  {
    id: 'tips',
    icon: Lightbulb,
    color: '#F5A623',
    title: 'Pro Tips — Get the Most Out of Your Admin Panel',
    intro: 'Practical advice from working with the admin panel every day.',
    steps: [
      { label: 'Use Featured smartly',        detail: 'Feature your 2–4 best products in each category. These appear first on the collection page. Rotate them seasonally — feature festival items before Diwali, bridal sets before wedding season.' },
      { label: 'Keep gallery fresh',           detail: 'Add at least 2–3 new photos every month. Recent photos build customer confidence that the business is active.' },
      { label: 'Update hero before events',    detail: 'Before a big festival or event, add a dramatic photo to the hero carousel and put it at position #1 so it\'s the first thing customers see.' },
      { label: 'Hide instead of Delete',       detail: 'When a product is temporarily unavailable, hide it rather than delete it. You can make it visible again in one click.' },
      { label: 'Reorder by popularity',        detail: 'Drag your best-selling products to the top of each category. Customers rarely scroll past the first 6–8 cards.' },
      { label: 'Export CSV monthly',           detail: 'Download your product CSV every month and save it. It\'s your product backup and useful for creating printed catalogues or price lists.' },
      { label: 'Test on your phone',           detail: 'After making changes, open craftnestshop.com on your phone and check how the products look. Mobile traffic is likely your biggest audience.' },
      { label: 'Log out when done',            detail: 'Always log out after your admin session, especially if using a shared computer. Your session stays active in the browser until you log out or close it.' },
    ],
  },
  {
    id: 'knowme',
    icon: Info,
    color: '#FF6B9D',
    title: 'No More About Me 😄 — The Whole Shebang Explained',
    badge: 'KNOW ME',
    intro: 'A completely unhinged, 100% honest, slightly chaotic breakdown of what this website actually IS and what this admin panel actually DOES. Written by someone who clearly has too much coffee. ☕😂',
    steps: [
      {
        label: '🌐 THE WEBSITE — What Even Is This Place? 😅',
        detail: 'OK so. craftnestshop.com is a gorgeous handcrafted arts & crafts website for CraftNest — a business in Georgia, USA that sells jewellery, return gifts, and face painting 🎨💎🎁. The homepage hits you with a full-screen HERO CAROUSEL (fancy slideshow, very dramatic, very "look at us") followed by a live ANNOUNCEMENT BANNER that scrolls across like breaking news — except the news is beautiful handmade stuff, not catastrophe (refreshing, honestly 😌). Below that? Three glorious product collections — Jewellery, Return Gifts, and Face Painting — each with their own dedicated pages. Customers can browse, fall in love, add to cart, and then... WhatsApp opens 😂 because that\'s how we roll. No complicated checkout. No OTP drama. Just "Hi I want this" and boom, done. The website also has a full GALLERY page (basically Instagram but make it ours), a STAR CURSOR TRAIL that makes your mouse feel like a wizard wand ✨, and a floating chatbot in the corner that actually knows stuff about the business. It\'s basically a whole vibe.',
      },
      {
        label: '🤖 THE CHATBOT — Our Tiny AI Employee 😂',
        detail: 'There\'s a little chat button floating in the bottom-right corner of the website. Click it and BAM — meet the CraftNest AI Assistant 🤖✨. This little dude knows EVERYTHING. Ask it about jewellery? It responds like a jewellery professor. Ask about face painting? It\'s suddenly a professional event planner. Ask if we\'re free on July 4th? It literally checks the Schedule Manager (which YOU set in admin) and tells the customer in real time — "Sorry bestie, we\'re BOOKED 📅" or "YES come in we are FREE 🎉". It also has a WhatsApp button that pre-fills a message so the customer doesn\'t even have to type. That\'s the kind of lazy-friendly innovation this world needs 😄. There\'s also a big green WhatsApp button floating right below it for people who just want to skip straight to the chat. We stan efficiency.',
      },
      {
        label: '🛒 THE CART — Drama in Three Clicks 😭',
        detail: 'Customers browse, they see something they love (obviously, because have you SEEN our products?), they click "Add to Cart" 🛒, and a drawer slides in from the right like a very polished salesman. They can add multiple items, remove things, change their mind seventeen times (we don\'t judge 😅), and when they\'re ready, they hit "Order via WhatsApp" — which opens WhatsApp with a beautifully formatted message listing every item they picked. The owner (that\'s you!) reads it, confirms, and the deal is done. No payment gateway fees, no integration nightmares, no "your card has been declined" trauma. Simple. Elegant. Effective. Chef\'s kiss 🤌.',
      },
      {
        label: '🧑‍💼 THE ADMIN PANEL — Your Secret Headquarters 🏛️😄',
        detail: 'Now THIS is where the magic happens behind the curtain. Log in at craftnestshop.com/admin with your email and password (only you and approved staff know it, obviously 🔐). You\'re greeted with a DASHBOARD — your bird\'s eye view of everything. How many products? How many gallery items? Any announcement running? Quick links to every section? It\'s basically the cockpit of a plane, except the plane is your business and you\'re the pilot and co-pilot simultaneously 😂✈️. The sidebar has tabs for Jewellery, Return Gifts, Face Painting, Gallery, Hero Carousel, Image Converter, Schedule, Settings, and this very Starter Guide you\'re reading right now. Meta? Very. 🤯',
      },
      {
        label: '💎🎁🎨 PRODUCTS — Add, Edit, Hide, Reorder, Feature, Repeat 😅',
        detail: 'Each of the three product categories (Jewellery, Return Gifts, Face Painting) has its own tab. Inside each tab you can ADD a new product (give it a title, price, description, badge like "NEW" or "BESTSELLER", stock status, and an image uploaded to Cloudinary ☁️). You can EDIT any product at any time. You can HIDE products temporarily instead of deleting them (perfect for "sold out but coming back" situations 👻). You can FEATURE your star products — they get a gold crown badge and appear at the top for customers 👑. You can DRAG to reorder them however you like. You can even mark stock as "Low Stock" or "Out of Stock" and it shows as a badge on the website. Basically you are the God of this product universe 😂🌍.',
      },
      {
        label: '🖼️ GALLERY & HERO CAROUSEL — The Pretty Stuff Department 📸',
        detail: 'The GALLERY tab lets you upload beautiful photos of your work. Each photo gets a title and optional category tag. They appear on the public gallery page in a masonry grid that makes everything look like a Pinterest board. Very aesthetic 😍. The HERO CAROUSEL tab manages the big dramatic slideshow images on the homepage. Add images, rearrange them by dragging, remove old ones. Pro tip: put your most jaw-dropping photo at position #1. First impressions and all that 💅. Both upload to Cloudinary so your images are served fast from the cloud — no slow loading, just vibes.',
      },
      {
        label: '🔄 IMAGE CONVERTER — Secretly Extremely Useful 😂',
        detail: 'You know how you take a photo on your phone and it\'s 8MB and uploads like it\'s crawling through mud? The Image Converter tab fixes that. Drop any image in, set the quality and target format (WebP, JPEG, PNG), and download a compressed version ready for web upload. It runs entirely in your browser — no account, no upload, no waiting. It\'s that unassuming quiet person in the group who actually does the most work 😄.',
      },
      {
        label: '📅 SCHEDULE MANAGER — "Are We Free?" Answered Instantly 🗓️',
        detail: 'The Schedule tab has a beautiful compact calendar. Click any date and a panel slides in letting you mark it as: ✅ Free (come get us!), ⚡ Limited Slots (hurry!), 🔴 Busy (sorry bestie), or 📅 Fully Booked (absolutely not 😂). You can add a note ("Birthday party 10am–4pm, jewellery orders still OK") and tick which services are available that day. SAVE it, and immediately — without any extra steps — the chatbot on the website can answer customer questions like "Are you free on December 25th?" with accurate, real-time information from THIS calendar. It\'s like having a receptionist who never sleeps and never asks for a raise 😄🤖.',
      },
      {
        label: '⚙️ SETTINGS — The Control Room 🎛️',
        detail: 'Only the OWNER account can see Settings (staff gets locked out — trust issues 😅). Here you can update: WhatsApp number (the one customers message when they click any WhatsApp button), Instagram URL (links all over the site), Announcement Banner text (the scrolling message on the homepage), Cloudinary cloud name and upload preset (for image uploads), and website tagline. Change the WhatsApp number and EVERY button on the site updates instantly. No code needed. Just type and save. It\'s basically a remote control for the whole website 🎮.',
      },
      {
        label: '👥 WHO GETS TO LOG IN? — The Role System 🔐😄',
        detail: 'CraftNest admin supports two roles: OWNER (that\'s you — full access to everything, including Settings and the ability to delete products and reset data 💪) and STAFF (trusted helpers who can add/edit products and gallery photos but can\'t touch Settings or delete things 🙅). When logged in, your name shows in the top-right corner of the admin sidebar — a small reminder that yes, you ARE in charge and yes, you DO have power. Use it wisely 😂👑. Your session is remembered until you log out, so you don\'t have to type the password every single time.',
      },
    ],
  },
]

function GuideSection({ section, expanded, onToggle }: { section: GuideSection; expanded: boolean; onToggle: () => void }) {
  const Icon = section.icon
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${expanded ? 'border-[#C9A84C]/30' : 'border-white/5 hover:border-white/10'}`}
      style={{ background: expanded ? 'rgba(13,13,38,0.98)' : 'rgba(13,13,38,0.55)' }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 text-left cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all"
          style={{ background: `${section.color}12`, borderColor: `${section.color}30` }}>
          <Icon className="w-4 h-4" style={{ color: section.color }}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white group-hover:text-[#E8C96B] transition-colors truncate">{section.title}</span>
            {section.badge && (
              <span className="shrink-0 text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-[#9B8EFF]/30 text-[#9B8EFF] bg-[#9B8EFF]/10">
                {section.badge}
              </span>
            )}
          </div>
          {!expanded && <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{section.intro}</p>}
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 text-white/25 transition-transform duration-200 ${expanded ? 'rotate-90 text-[#C9A84C]' : 'group-hover:translate-x-0.5'}`}/>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          <p className="text-xs sm:text-sm text-white/55 leading-relaxed">{section.intro}</p>

          <SectionVisual id={section.id}/>

          {section.steps && section.steps.length > 0 && (
            <div className="space-y-2">
              {section.steps.map((step, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.03)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:`${section.color}18`, border:`1px solid ${section.color}30` }}>
                    <span className="text-[8px] font-bold" style={{ color: section.color }}>{i + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white/80 mb-0.5">{step.label}</p>
                    <p className="text-[11px] text-white/40 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.tips && section.tips.length > 0 && (
            <div className="space-y-2">
              {section.tips.map((tip, i) => (
                <div key={i} className="flex gap-2.5 p-3 rounded-xl border border-[#C9A84C]/10" style={{ background:'rgba(201,168,76,0.05)' }}>
                  <Lightbulb className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5"/>
                  <p className="text-[11px] text-[#E8C96B]/70 leading-relaxed min-w-0">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {section.warning && (
            <div className="flex gap-2.5 p-3 rounded-xl border border-red-500/20" style={{ background:'rgba(180,40,40,0.08)' }}>
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5"/>
              <p className="text-[11px] text-red-300/70 leading-relaxed min-w-0"><strong className="text-red-400">Warning:</strong> {section.warning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Visual diagram helpers ────────────────────────────────────────────────────

function MockSidebar() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 w-28 shrink-0" style={{ background:'#061A0F' }}>
      <div className="px-2.5 py-2 border-b border-white/10"><div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-[#C9A84C]/20 border border-[#C9A84C]/30"/><p className="text-[8px] font-bold text-[#E8C96B]">CRAFT NEST</p></div></div>
      {['Dashboard','Jewellery','Return Gifts','Gallery','Settings','Guide'].map((l,i) => (
        <div key={l} className={`flex items-center gap-1.5 px-2.5 py-1.5 ${i===0?'bg-[#C9A84C]/10 border-l-2 border-[#C9A84C]':''}`}>
          <div className={`w-2.5 h-2.5 rounded shrink-0 ${i===0?'bg-[#C9A84C]/60':'bg-white/10'}`}/>
          <p className={`text-[7px] font-bold truncate ${i===0?'text-[#E8C96B]':'text-white/30'}`}>{l}</p>
        </div>
      ))}
    </div>
  )
}

function MockProductCard({ featured, hidden, badge }: { featured?: boolean; hidden?: boolean; badge?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden border w-32 shrink-0 ${hidden ? 'opacity-40 border-white/10' : 'border-[#C9A84C]/20'}`} style={{ background:'rgba(10,35,24,0.9)' }}>
      <div className="relative h-16 bg-gradient-to-br from-[#1A1A40] to-[#0E0E28] flex items-center justify-center">
        <ImageIcon className="w-5 h-5 text-white/10"/>
        {badge && <span className="absolute top-1 left-1 text-[6px] font-bold px-1.5 py-0.5 rounded-full bg-[#C9A84C] text-[#04140E]">{badge}</span>}
        {featured && <span className="absolute top-1 right-1 text-[7px]">⭐</span>}
        {hidden && <div className="absolute inset-0 flex items-center justify-center"><EyeOff className="w-4 h-4 text-white/30"/></div>}
      </div>
      <div className="p-2">
        <div className="h-1.5 w-3/4 rounded bg-white/15 mb-1"/>
        <div className="h-1 w-1/2 rounded bg-white/8"/>
        <div className="mt-2 flex justify-around border-t border-white/5 pt-1.5">
          <Eye className="w-3 h-3 text-emerald-400/60"/><Star className="w-3 h-3 text-[#C9A84C]/40"/><Pencil className="w-3 h-3 text-white/20"/><Trash2 className="w-3 h-3 text-red-400/30"/>
        </div>
      </div>
    </div>
  )
}

function MockDropZone({ active }: { active?: boolean }) {
  return (
    <div className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${active ? 'border-[#C9A84C] bg-[#C9A84C]/8' : 'border-white/15'}`} style={{ minHeight:90 }}>
      <ImageIcon2 className={`w-5 h-5 ${active ? 'text-[#C9A84C]' : 'text-white/20'}`}/>
      <p className="text-[7px] text-white/30 text-center">Drag & Drop or Click</p>
      {active && <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A84C] cursor-pointer"><Zap className="w-2.5 h-2.5 text-[#04140E]"/><span className="text-[7px] font-bold text-[#04140E]">Convert</span></div>}
    </div>
  )
}

function VisualDiagram({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#C9A84C]/10 overflow-hidden" style={{ background:'rgba(5,15,10,0.8)' }}>
      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/50"/><div className="w-2 h-2 rounded-full bg-amber-500/50"/><div className="w-2 h-2 rounded-full bg-emerald-500/50"/></div>
        <p className="text-[8px] text-white/25 font-mono">{title}</p>
      </div>
      <div className="p-3 flex gap-3 overflow-x-auto">{children}</div>
    </div>
  )
}

// ── Per-section visual diagrams ───────────────────────────────────────────────

function SectionVisual({ id }: { id: string }) {
  if (id === 'overview') return (
    <VisualDiagram title="Dashboard — your store at a glance">
      <div className="flex-1 space-y-1.5 min-w-[200px]">
        <div className="grid grid-cols-4 gap-1">
          {([['Jewellery','#C9A84C'],['Gifts','#5DBEA3'],['Painting','#E87D7D'],['Gallery','#8BA4F8']] as [string,string][]).map(([l,c])=>(
            <div key={l} className="rounded-lg p-1.5" style={{background:'rgba(255,255,255,0.04)'}}>
              <p className="text-[6px] font-bold truncate" style={{color:c}}>{l}</p>
              <p className="text-[11px] font-bold text-white/60">3</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {([['Total Products','#C9A84C','12'],['Live / Visible','#5DBEA3','10'],['Featured','#E8C96B','4']] as [string,string,string][]).map(([l,c,v])=>(
            <div key={l} className="rounded-lg p-1.5 text-center" style={{background:'rgba(255,255,255,0.04)'}}>
              <p className="text-[5px] font-bold leading-tight" style={{color:c}}>{l}</p>
              <p className="text-base font-bold text-white/60">{v}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 rounded-lg p-1.5 border border-amber-500/15" style={{background:'rgba(30,20,5,0.6)'}}>
          <Megaphone className="w-2.5 h-2.5 text-amber-400 shrink-0"/>
          <p className="text-[6px] text-amber-200/40 flex-1 truncate">🎉 Free gifting on orders above ₹1000!</p>
          <span className="text-[6px] font-bold text-emerald-400 shrink-0">LIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {['Jewellery →','Return Gifts →','Gallery →','Settings →'].map(l=>(
            <div key={l} className="flex items-center gap-1.5 p-1.5 rounded-lg" style={{background:'rgba(255,255,255,0.02)'}}>
              <div className="w-3 h-3 rounded shrink-0" style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.15)'}}/>
              <p className="text-[6px] text-white/25">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </VisualDiagram>
  )

  if (id === 'products') return (
    <VisualDiagram title="Products Tab — card actions explained">
      <MockProductCard badge="Bestseller" featured/>
      <MockProductCard badge="Bridal" hidden/>
      <div className="flex flex-col justify-center gap-2 min-w-[150px]">
        <p className="text-[7px] text-white/25 font-bold uppercase tracking-[0.1em]">Icons on every card:</p>
        {[
          { Ic: Eye,          cls: 'text-emerald-400',  label: '👁 Eye — show / hide product' },
          { Ic: Star,         cls: 'text-[#E8C96B]',    label: '⭐ Star — feature (shows on top)' },
          { Ic: Pencil,       cls: 'text-white/40',     label: '✏️ Pencil — edit all details' },
          { Ic: Trash2,       cls: 'text-red-400/40',   label: '🗑 Trash — delete (Owner only)' },
          { Ic: GripVertical, cls: 'text-white/25',     label: '⠿ Grip — drag to reorder' },
        ].map(({ Ic, cls, label }, i) => (
          <div key={i} className="flex items-center gap-2">
            <Ic className={`w-3 h-3 ${cls} shrink-0`}/>
            <p className="text-[7px] text-white/35">{label}</p>
          </div>
        ))}
      </div>
    </VisualDiagram>
  )

  if (id === 'badges') return (
    <VisualDiagram title="Badges & Stock Status — visual reference">
      <div className="flex-1 space-y-2.5 min-w-[220px]">
        <div>
          <p className="text-[7px] text-white/30 font-bold mb-1.5 tracking-[0.1em] uppercase">Badge labels — pick one per product</p>
          <div className="flex flex-wrap gap-1">
            {(['Bestseller','Popular','New','Bridal','Festival','Custom','Limited','Adults','Kids','Traditional'] as const).map(b=>(
              <span key={b} className={`text-[6px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_COLORS[b]??'bg-[#C9A84C] text-[#04140E]'}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="h-px bg-white/5"/>
        <div>
          <p className="text-[7px] text-white/30 font-bold mb-1.5 tracking-[0.1em] uppercase">Stock status — controls WhatsApp button</p>
          <div className="grid grid-cols-2 gap-1">
            {STOCK_OPTIONS.map(s=>(
              <div key={s.value} className={`text-[6px] font-bold px-2 py-1 rounded-lg border ${s.color}`}>{s.label}</div>
            ))}
          </div>
        </div>
      </div>
    </VisualDiagram>
  )

  if (id === 'gallery') return (
    <VisualDiagram title="Gallery Tab — photo grid">
      <div className="flex-1 space-y-2 min-w-[200px]">
        <div className="flex items-center gap-1 flex-wrap">
          {(['All','Events','Arts','Other'] as const).map((c,i)=>(
            <span key={c} className={`text-[6px] font-bold px-2 py-0.5 rounded-full ${i===0?'bg-[#C9A84C] text-[#04140E]':'border border-white/10 text-white/30'}`}>{c}</span>
          ))}
          <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20">
            <Plus className="w-2 h-2 text-[#C9A84C]"/><p className="text-[6px] font-bold text-[#C9A84C]">Add Photo</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(['events','arts','arts','other','events','arts','other','events'] as const).map((cat,i)=>(
            <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-[#1A1A40] to-[#0E0E28] flex items-center justify-center relative overflow-hidden border border-[#C9A84C]/10">
              <ImageIcon className="w-2.5 h-2.5 text-white/10"/>
              <span className="absolute bottom-0 left-0 right-0 text-[4px] text-center text-white/25 bg-black/30 capitalize py-0.5">{cat}</span>
            </div>
          ))}
        </div>
        <p className="text-[6px] text-white/20">Hover any photo → red Remove button slides up from the bottom</p>
      </div>
    </VisualDiagram>
  )

  if (id === 'hero') return (
    <VisualDiagram title="Hero Carousel — homepage slideshow">
      <div className="flex-1 space-y-2 min-w-[200px]">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-6 rounded-lg border border-[#C9A84C]/15 bg-white/5 px-2 flex items-center min-w-0">
            <p className="text-[6px] text-white/20 truncate">Paste image URL or upload a file →</p>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg border border-[#C9A84C]/25 shrink-0">
            <Upload className="w-2 h-2 text-[#C9A84C]"/><p className="text-[5px] font-bold text-[#C9A84C]">Upload</p>
          </div>
          <div className="flex items-center px-2 py-1 rounded-lg bg-[#C9A84C] shrink-0">
            <p className="text-[6px] font-bold text-[#04140E]">+Add</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[1,2,3,4].map(n=>(
            <div key={n} className={`aspect-square rounded-lg bg-gradient-to-br from-[#1A1A40] to-[#0E0E28] relative flex items-center justify-center border ${n===1?'border-[#C9A84C]/30':'border-white/5'}`}>
              <Home className="w-3 h-3 text-white/10"/>
              <span className="absolute top-0.5 right-0.5 text-[5px] font-bold text-white/30">#{n}</span>
              <GripVertical className="absolute top-0.5 left-0.5 w-2 h-2 text-white/20"/>
              {n===1 && <span className="absolute bottom-0 left-0 right-0 text-center text-[4px] bg-[#C9A84C]/20 text-[#E8C96B]/60 py-0.5">Shows first</span>}
            </div>
          ))}
        </div>
        <p className="text-[6px] text-white/20">Drag images to reorder · Image #1 appears first when customers open the website</p>
      </div>
    </VisualDiagram>
  )

  if (id === 'settings') return (
    <VisualDiagram title="Settings Tab — global site controls (Owner only)">
      <div className="flex-1 grid grid-cols-2 gap-1.5 min-w-[240px]">
        {[
          { Ic: Megaphone,    color: '#F5A623', title: 'Announcement Banner', detail: 'Toggle ON → bar at top of website' },
          { Ic: MessageCircle,color: '#25D366', title: 'WhatsApp Number',     detail: 'One number controls all enquiry buttons' },
          { Ic: Link,         color: '#8BA4F8', title: 'Social Links',        detail: 'Instagram & Facebook appear in footer' },
          { Ic: Upload,       color: '#5DBEA3', title: 'Cloudinary Upload',   detail: 'Cloud Name + Preset for image upload' },
          { Ic: CheckCircle2, color: '#C9A84C', title: 'Save All Settings',   detail: 'Must click — nothing saves until you do' },
          { Ic: RefreshCw,    color: '#E87D7D', title: 'Reset Everything',    detail: '⚠️ Deletes all data — cannot be undone' },
        ].map(({ Ic, color, title, detail }) => (
          <div key={title} className="flex items-start gap-1.5 p-1.5 rounded-lg" style={{background:'rgba(255,255,255,0.03)'}}>
            <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5" style={{background:`${color}15`}}>
              <Ic className="w-2.5 h-2.5" style={{color}}/>
            </div>
            <div className="min-w-0">
              <p className="text-[6px] font-bold text-white/60 leading-tight">{title}</p>
              <p className="text-[5px] text-white/25 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </VisualDiagram>
  )

  if (id === 'upload') return (
    <VisualDiagram title="Cloudinary Setup — one-time, 4 steps">
      <div className="flex-1 space-y-1.5 min-w-[220px]">
        {[
          { n:'1', text:'Go to cloudinary.com → create a free account (no credit card needed)' },
          { n:'2', text:'Cloudinary dashboard → Settings → Upload → "Add upload preset" → set Signing Mode to Unsigned → Save' },
          { n:'3', text:'In this admin: Settings tab → enter Cloud Name + Preset name → click Save All Settings' },
          { n:'4', text:'Test it: edit any product → click camera icon → pick a photo — if it shows a preview URL, you\'re done! ✅' },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-start gap-2 p-1.5 rounded-xl" style={{background:'rgba(255,255,255,0.03)'}}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{background:'rgba(93,190,163,0.15)',border:'1px solid rgba(93,190,163,0.3)'}}>
              <span className="text-[8px] font-bold text-[#5DBEA3]">{n}</span>
            </div>
            <p className="text-[6px] text-white/40 leading-relaxed">{text}</p>
          </div>
        ))}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-[#5DBEA3]/15 mt-1" style={{background:'rgba(93,190,163,0.05)'}}>
          <CheckCircle2 className="w-3 h-3 text-[#5DBEA3] shrink-0"/>
          <p className="text-[6px] text-[#5DBEA3]/70">After setup: Upload button works everywhere — products, gallery, hero carousel, image converter</p>
        </div>
      </div>
    </VisualDiagram>
  )

  if (id === 'roles') return (
    <VisualDiagram title="Owner vs Staff — access levels side by side">
      <div className="flex gap-2 flex-1 min-w-[210px]">
        <div className="flex-1 rounded-xl border border-[#C9A84C]/20 p-2 space-y-0.5" style={{background:'rgba(201,168,76,0.05)'}}>
          <p className="text-[8px] font-bold text-[#E8C96B] mb-1.5">👑 Owner</p>
          {['Add & edit products','Delete products','Manage gallery','Hero carousel','Site Settings','CSV Export','Reset data'].map(a=>(
            <div key={a} className="flex items-center gap-1">
              <CheckCircle2 className="w-2 h-2 text-emerald-400 shrink-0"/>
              <p className="text-[6px] text-white/45">{a}</p>
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-xl border border-white/10 p-2 space-y-0.5" style={{background:'rgba(255,255,255,0.02)'}}>
          <p className="text-[8px] font-bold text-white/40 mb-1.5">🧑 Staff</p>
          {([['Add & edit products',true],['Delete products',false],['Manage gallery',true],['Hero carousel',true],['Site Settings',false],['CSV Export',false],['Reset data',false]] as [string,boolean][]).map(([a,ok])=>(
            <div key={a} className="flex items-center gap-1">
              {ok ? <CheckCircle2 className="w-2 h-2 text-emerald-400 shrink-0"/> : <X className="w-2 h-2 text-red-400/40 shrink-0"/>}
              <p className={`text-[6px] ${ok?'text-white/40':'text-white/20'}`}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </VisualDiagram>
  )

  if (id === 'whatsapp') return (
    <VisualDiagram title="WhatsApp enquiry flow — from button to customer">
      <div className="flex-1 space-y-2 min-w-[200px]">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0 mt-0.5">
            <MessageCircle className="w-3 h-3 text-[#25D366]"/>
          </div>
          <div className="rounded-2xl rounded-tl-sm p-2" style={{background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.15)'}}>
            <p className="text-[6px] text-white/50 leading-relaxed">Hi CraftNest! I'm interested in the <span className="text-[#25D366]/70 font-bold">Kundan Necklace</span>. Please share details.</p>
          </div>
        </div>
        <p className="text-[6px] text-white/20 text-center">↑ This message auto-opens in WhatsApp when customer taps the Enquire button</p>
        <div className="rounded-xl border border-[#C9A84C]/10 p-2" style={{background:'rgba(255,255,255,0.03)'}}>
          <p className="text-[6px] text-white/25 mb-1 font-bold">Custom WhatsApp Message field (in product edit form):</p>
          <div className="h-5 rounded-lg border border-[#C9A84C]/15 bg-white/5 px-2 flex items-center">
            <p className="text-[6px] text-white/25 truncate">Hi! I want to order 50 Kundan sets for a wedding event…</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-red-500/15" style={{background:'rgba(180,40,40,0.05)'}}>
          <EyeOff className="w-2.5 h-2.5 text-red-400/50 shrink-0"/>
          <p className="text-[6px] text-red-300/40">Out of Stock → Enquire button is greyed out and disabled for customers</p>
        </div>
      </div>
    </VisualDiagram>
  )

  if (id === 'schedule') return (
    <VisualDiagram title="Schedule Manager — calendar + day panel">
      <div className="flex gap-2 flex-1 min-w-[240px]">
        {/* Mini calendar */}
        <div className="rounded-xl border border-[#C9A84C]/15 p-2 flex-1" style={{background:'rgba(5,20,10,0.8)'}}>
          <div className="flex items-center justify-between mb-1.5">
            <ChevronLeft className="w-2.5 h-2.5 text-white/30"/>
            <p className="text-[7px] font-bold text-white/60">June 2025</p>
            <ChevronRight className="w-2.5 h-2.5 text-white/30"/>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-0.5">
            {['S','M','T','W','T','F','S'].map((d,i)=>(
              <p key={i} className="text-center text-[5px] text-white/20 font-bold">{d}</p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {[...Array(6).fill(null),1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d,i)=>(
              <div key={i} className={`flex flex-col items-center justify-center aspect-square rounded text-[6px] font-bold relative
                ${d===15?'bg-[#C9A84C] text-[#04140E]':d?'text-white/40 hover:text-white/70':''}`}>
                {d && <span>{d}</span>}
                {d===7  && <div className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-0"/>}
                {d===12 && <div className="w-1 h-1 rounded-full bg-red-400 absolute bottom-0"/>}
                {d===20 && <div className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-0"/>}
                {d===25 && <div className="w-1 h-1 rounded-full bg-purple-400 absolute bottom-0"/>}
              </div>
            ))}
          </div>
        </div>
        {/* Mini day panel */}
        <div className="rounded-xl border border-[#C9A84C]/15 p-2 w-28 space-y-1.5" style={{background:'rgba(5,20,10,0.8)'}}>
          <p className="text-[6px] font-bold text-[#C9A84C]/60 uppercase tracking-[0.1em]">June 15</p>
          <div className="grid grid-cols-2 gap-0.5">
            {[{l:'✅ Free',c:'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'},{l:'⚡ Limited',c:'border-amber-500/20 text-amber-400/40 border'},{l:'🔴 Busy',c:'border-red-500/20 text-red-400/40 border'},{l:'📅 Booked',c:'border-purple-500/20 text-purple-400/40 border'}].map(({l,c})=>(
              <div key={l} className={`text-[4.5px] font-bold px-1 py-0.5 rounded border text-center ${c}`}>{l}</div>
            ))}
          </div>
          <div className="h-6 rounded bg-white/5 border border-white/8"/>
          <p className="text-[5px] text-white/30 font-bold">Services:</p>
          {['Face Painting','Jewellery','Gifts'].map(s=>(
            <div key={s} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-1.5 h-1.5 text-white"/>
              </div>
              <p className="text-[5px] text-white/40">{s}</p>
            </div>
          ))}
          <div className="w-full text-center text-[5px] font-bold py-0.5 rounded-full bg-[#C9A84C] text-[#04140E]">Save Schedule</div>
        </div>
      </div>
    </VisualDiagram>
  )

  if (id === 'knowme') return (
    <VisualDiagram title="CraftNest — Know Me 😄">
      <div className="flex-1 min-w-[220px] flex flex-col gap-2">
        {/* Smiley wallpaper strip */}
        <div className="relative rounded-xl overflow-hidden p-2" style={{ background:'rgba(255,107,157,0.06)', border:'1px solid rgba(255,107,157,0.15)' }}>
          <div className="absolute inset-0 flex flex-wrap gap-1 p-1 opacity-10 pointer-events-none select-none overflow-hidden">
            {Array.from({length:40}).map((_,i)=>(
              <span key={i} className="text-[10px]">{['😄','😂','🤣','😅','😜','🥳','🎉','✨','😎','🤩'][i%10]}</span>
            ))}
          </div>
          <div className="relative z-10 text-center py-1">
            <p className="text-[8px] font-bold tracking-widest uppercase" style={{color:'#FF6B9D'}}>⭐⭐⭐⭐⭐ &nbsp;CUSTOMER RATING</p>
            <p className="text-[6px] text-white/50 mt-0.5">craftnestshop.com · The Website 🌐</p>
          </div>
        </div>
        {/* Website rating card */}
        <div className="rounded-xl p-2 space-y-1" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,107,157,0.12)'}}>
          <p className="text-[6.5px] font-bold text-white/70">🌐 The Website</p>
          {[['Hero + Carousel','#C9A84C','100%'],['Collections (3)','#5DBEA3','100%'],['Gallery','#8BA4F8','100%'],['Chatbot + WhatsApp','#25D366','100%'],['Star Cursor Trail ✨','#E8C96B','Priceless 😂']].map(([l,c,v])=>(
            <div key={l as string} className="flex items-center gap-1.5">
              <p className="text-[5.5px] text-white/40 w-20 shrink-0">{l}</p>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                <div className="h-full rounded-full" style={{width: v==='Priceless 😂'?'100%':v, background:c as string}}/>
              </div>
              <p className="text-[5px] font-bold shrink-0" style={{color:c as string}}>{v}</p>
            </div>
          ))}
        </div>
        {/* Admin rating card */}
        <div className="rounded-xl p-2 space-y-1" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,168,76,0.15)'}}>
          <p className="text-[6.5px] font-bold" style={{color:'#C9A84C'}}>🧑‍💼 The Admin Panel</p>
          {[['Dashboard','#C9A84C','100%'],['Products (3 cats)','#5DBEA3','100%'],['Gallery + Hero','#8BA4F8','100%'],['Schedule Manager','#FF6B9D','100%'],['Image Converter','#F5A623','100%'],['Settings 🔐','#9B8EFF','Owner Only 😅']].map(([l,c,v])=>(
            <div key={l as string} className="flex items-center gap-1.5">
              <p className="text-[5.5px] text-white/40 w-20 shrink-0">{l}</p>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                <div className="h-full rounded-full" style={{width:'100%', background:c as string}}/>
              </div>
              <p className="text-[5px] font-bold shrink-0" style={{color:c as string}}>{v}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[6px] text-white/20">Built with ♥ · No bugs (probably 😂) · 100% handcrafted</p>
      </div>
    </VisualDiagram>
  )

  if (id === 'tips') return (
    <VisualDiagram title="Pro Tips — quick reference card">
      <div className="flex-1 grid grid-cols-2 gap-1.5 min-w-[220px]">
        {[
          { Ic: Star,         color: '#E8C96B', tip: 'Feature 2–4 top products per category' },
          { Ic: ImageIcon,    color: '#8BA4F8', tip: 'Add 2–3 gallery photos every month' },
          { Ic: Home,         color: '#F5A623', tip: 'Update hero before festivals & events' },
          { Ic: EyeOff,       color: '#5DBEA3', tip: 'Hide instead of Delete — reversible' },
          { Ic: GripVertical, color: '#C9A84C', tip: 'Drag best-sellers to the top of list' },
          { Ic: Download,     color: '#9B8EFF', tip: 'Export CSV monthly as a backup' },
          { Ic: MessageCircle,color: '#25D366', tip: 'Test WhatsApp after editing the number' },
          { Ic: LogOut,       color: '#E87D7D', tip: 'Log out after every admin session' },
        ].map(({ Ic, color, tip }) => (
          <div key={tip} className="flex items-start gap-1.5 p-1.5 rounded-lg" style={{background:'rgba(255,255,255,0.03)'}}>
            <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{background:`${color}12`}}>
              <Ic className="w-2.5 h-2.5" style={{color}}/>
            </div>
            <p className="text-[6px] text-white/35 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </VisualDiagram>
  )

  return null
}

// ── Extra Services Tab ────────────────────────────────────────────────────────

// ── Mock data used inside template preview thumbnails ─────────────────────────
const PREVIEW_MOCKS = [
  { label:'Balloon Art',    price:'₹800',  c1:'#1A3A2A', c2:'#0F2A1A' },
  { label:'Custom Cake',   price:'₹1200', c1:'#2A1A3A', c2:'#1A0F2A' },
  { label:'Photo Booth',   price:'₹1500', c1:'#3A2A1A', c2:'#2A1A0F' },
  { label:'Live Band',     price:'₹3000', c1:'#1A2A3A', c2:'#0F1A2A' },
]

function MiniServiceCard({ m, wide=false }:{ m:typeof PREVIEW_MOCKS[0]; wide?:boolean }) {
  return (
    <div className={`relative rounded-lg overflow-hidden border border-white/8 ${wide?'flex-1':'shrink-0 w-[90px]'}`} style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}>
      <div className="absolute bottom-0 inset-x-0 p-1.5" style={{background:'rgba(0,0,0,0.55)'}}>
        <div className="h-[2px] w-2/3 rounded mb-0.5" style={{background:'rgba(255,255,255,0.55)'}}/>
        <div className="h-[2px] w-1/2 rounded" style={{background:'rgba(201,168,76,0.6)'}}/>
      </div>
    </div>
  )
}

type TplId = 'mosaic'|'strips'|'showcase'|'cards'|'carousel'

function ExtraServicesTab({ data, show, onRefresh }: { data: AdminData; show: (msg:string, t?:'success'|'error') => void; onRefresh: () => void }) {
  const [selId,        setSelId]        = useState<string|null>(null)
  const [uploading,    setUploading]    = useState(false)
  const [previewModal, setPreviewModal] = useState<TplId|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<Omit<ExtraService,'id'>>({
    name:'', emoji:'🎨', price:'', description:'', img:'', whatsappMsg:'', visible:true,
  })

  const services = data.extraServices ?? []
  const template = (data.extraServicesTemplate ?? 'mosaic') as TplId
  const isNew    = selId === '__new__'

  const startAdd  = () => { setSelId('__new__'); setForm({ name:'', emoji:'🎨', price:'', description:'', img:'', whatsappMsg:'', visible:true }) }
  const startEdit = (s: ExtraService) => { setSelId(s.id); setForm({ name:s.name, emoji:s.emoji, price:s.price, description:s.description, img:s.img, whatsappMsg:s.whatsappMsg, visible:s.visible }) }

  const handleSave = () => {
    if (!form.name.trim()) { show('Service name is required', 'error'); return }
    if (isNew) { addExtraService(form) } else if (selId) { updateExtraService({ ...form, id: selId }) }
    onRefresh(); show('Service saved'); setSelId(null)
  }

  const handleDelete = (id: string) => {
    deleteExtraService(id); onRefresh(); show('Service removed')
    if (selId === id) setSelId(null)
  }

  const handleImg = async (file: File) => {
    setUploading(true)
    try { const url = await uploadToCloudinary(file); setForm(f => ({ ...f, img: url })); show('Image uploaded') }
    catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  const pickTemplate = (t: TplId) => {
    setExtraServicesTemplate(t); onRefresh(); show(`Layout changed to ${t}`)
  }

  // ── Big modal previews (realistic mockup) ────────────────────────────────────
  const BIG_PREVIEWS: Record<TplId, React.ReactNode> = {
    mosaic: (
      <div className="space-y-1.5">
        <div className="flex gap-1.5" style={{height:'140px'}}>
          <div className="flex-[2] rounded-xl overflow-hidden relative border border-white/10" style={{background:`linear-gradient(135deg,${PREVIEW_MOCKS[0].c1},${PREVIEW_MOCKS[0].c2})`}}>
            <div className="absolute bottom-0 inset-x-0 p-3" style={{background:'linear-gradient(to top,rgba(0,0,0,0.9),transparent)'}}>
              <p className="text-white text-xs font-serif font-medium">Balloon Art</p>
              <span className="text-[9px]" style={{color:'#C9A84C'}}>₹800</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            {PREVIEW_MOCKS.slice(1,3).map(m => (
              <div key={m.label} className="flex-1 rounded-xl overflow-hidden relative border border-white/8" style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}>
                <div className="absolute bottom-0 inset-x-0 p-1.5" style={{background:'rgba(0,0,0,0.7)'}}>
                  <p className="text-white text-[9px] font-medium truncate">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5" style={{height:'80px'}}>
          {PREVIEW_MOCKS.map(m => (
            <div key={m.label} className="rounded-xl overflow-hidden relative border border-white/8" style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}>
              <div className="absolute bottom-0 inset-x-0 p-1" style={{background:'rgba(0,0,0,0.7)'}}>
                <p className="text-white text-[8px] truncate">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    strips: (
      <div className="divide-y divide-white/8 rounded-xl overflow-hidden border border-white/8">
        {PREVIEW_MOCKS.slice(0,3).map((m,i) => (
          <div key={m.label} className={`flex ${i%2===1?'flex-row-reverse':''}`} style={{height:'68px'}}>
            <div className="w-[55%] relative border-r border-white/6" style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}>
              {i%2===1 && <div className="absolute inset-0 border-l border-white/6"/>}
            </div>
            <div className="flex-1 flex flex-col justify-center px-3 py-2 gap-1" style={{background:'rgba(20,20,28,0.95)'}}>
              <div className="flex items-center justify-between">
                <p className="text-white text-[9px] font-serif font-medium">{m.label}</p>
                <span className="text-[8px] font-bold" style={{color:'#C9A84C'}}>{m.price}</span>
              </div>
              <div className="h-[2px] w-4/5 rounded" style={{background:'rgba(255,255,255,0.12)'}}/>
              <div className="h-[2px] w-1/2 rounded" style={{background:'rgba(255,255,255,0.06)'}}/>
            </div>
          </div>
        ))}
      </div>
    ),
    showcase: (
      <div className="border border-white/8 rounded-xl overflow-hidden divide-y divide-white/6" style={{background:'rgba(13,13,38,0.98)'}}>
        {PREVIEW_MOCKS.map((m,i) => (
          <div key={m.label} className="flex items-center gap-3 px-3 py-2.5">
            <span className="text-[10px] font-black tabular-nums shrink-0 w-5" style={{color:'rgba(201,168,76,0.55)'}}>0{i+1}</span>
            <p className="flex-1 text-white text-[10px] font-serif font-medium">{m.label}</p>
            <span className="text-[8px] font-bold shrink-0" style={{color:'#C9A84C'}}>{m.price}</span>
            <span className="text-white/25 text-xs">›</span>
          </div>
        ))}
      </div>
    ),
    cards: (
      <div className="grid grid-cols-3 gap-2">
        {PREVIEW_MOCKS.slice(0,3).map(m => (
          <div key={m.label} className="rounded-xl overflow-hidden border border-white/8" style={{background:'rgba(18,18,26,0.95)'}}>
            <div className="h-16 relative" style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}/>
            <div className="p-1.5">
              <p className="text-white text-[8px] font-medium truncate">{m.label}</p>
              <span className="text-[8px]" style={{color:'#C9A84C'}}>{m.price}</span>
              <div className="mt-1 h-4 rounded-md flex items-center justify-center" style={{background:'rgba(201,168,76,0.15)'}}>
                <span className="text-[7px] font-bold" style={{color:'#C9A84C'}}>ENQUIRE</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    carousel: (
      <div className="flex gap-2 overflow-hidden rounded-xl">
        {PREVIEW_MOCKS.map((m,i) => (
          <div key={m.label} className={`shrink-0 rounded-xl overflow-hidden border border-white/8 transition-all ${i===0?'w-[45%]':'w-[38%]'}`} style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`,height:'120px'}}>
            <div className="absolute bottom-0 inset-x-0 p-2" style={{background:'rgba(0,0,0,0.65)'}}>
              <p className="text-white text-[9px] font-serif">{m.label}</p>
              <span className="text-[8px]" style={{color:'#C9A84C'}}>{m.price}</span>
            </div>
          </div>
        ))}
        <div className="shrink-0 w-6 rounded-xl border border-white/6 flex items-center justify-center" style={{background:'rgba(255,255,255,0.02)',height:'120px'}}>
          <span className="text-white/20 text-xs">›</span>
        </div>
      </div>
    ),
  }

  // ── Compact thumbnail previews (shown on the picker cards) ───────────────────
  const TEMPLATES: { id:TplId; label:string; badge:string; desc:string; thumb:React.ReactNode }[] = [
    {
      id:'mosaic', label:'Mosaic Grid', badge:'BENTO', desc:'Featured card large + smaller cards. Best for 4+ services.',
      thumb:(
        <div className="flex gap-1 h-[96px]">
          <MiniServiceCard m={PREVIEW_MOCKS[0]} wide/>
          <div className="flex flex-col gap-1 w-[42%]">
            <MiniServiceCard m={PREVIEW_MOCKS[1]} wide/>
            <MiniServiceCard m={PREVIEW_MOCKS[2]} wide/>
          </div>
        </div>
      ),
    },
    {
      id:'strips', label:'Alternating Strips', badge:'CINEMATIC', desc:'Full-width image rows alternating left/right. Premium look.',
      thumb:(
        <div className="space-y-1 h-[96px]">
          {[0,1,2].map(i => (
            <div key={i} className={`flex gap-1 ${i%2===1?'flex-row-reverse':''}`} style={{height:'20px'}}>
              <div className="w-[55%] rounded-md border border-white/8" style={{background:`linear-gradient(90deg,${PREVIEW_MOCKS[i].c1},${PREVIEW_MOCKS[i].c2})`}}/>
              <div className="flex-1 rounded-md border border-white/6 flex flex-col justify-center px-1 gap-0.5" style={{background:'rgba(18,18,26,0.95)'}}>
                <div className="h-[2px] w-3/4 rounded" style={{background:'rgba(255,255,255,0.2)'}}/>
                <div className="h-[2px] w-1/2 rounded" style={{background:'rgba(201,168,76,0.35)'}}/>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id:'showcase', label:'Showcase List', badge:'ACCORDION', desc:'Numbered rows that expand on click. Clean & minimal.',
      thumb:(
        <div className="space-y-1 h-[96px] flex flex-col justify-between">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-1.5 pb-1 border-b border-white/6">
              <span className="text-[8px] font-black tabular-nums shrink-0" style={{color:'rgba(201,168,76,0.5)'}}>0{i}</span>
              <div className="flex-1 h-[2px] rounded" style={{background:'rgba(255,255,255,0.12)'}}/>
              <div className="h-[2px] w-4 rounded" style={{background:'rgba(201,168,76,0.3)'}}/>
              <span className="text-white/15 text-[8px]">›</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id:'cards', label:'Card Grid', badge:'MODERN', desc:'Equal-size cards in 2-3 columns. Great for any number of services.',
      thumb:(
        <div className="grid grid-cols-3 gap-1 h-[96px]">
          {PREVIEW_MOCKS.slice(0,3).map(m => (
            <div key={m.label} className="rounded-lg overflow-hidden border border-white/8 flex flex-col" style={{background:'rgba(18,18,26,0.95)'}}>
              <div className="flex-[2]" style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}/>
              <div className="px-1 py-0.5">
                <div className="h-[2px] rounded mb-0.5" style={{background:'rgba(255,255,255,0.2)'}}/>
                <div className="h-[2px] w-1/2 rounded" style={{background:'rgba(201,168,76,0.35)'}}/>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id:'carousel', label:'Carousel Scroll', badge:'SWIPE', desc:'Horizontal scrolling cards. Perfect for mobile visitors.',
      thumb:(
        <div className="flex gap-1 h-[96px] overflow-hidden">
          {PREVIEW_MOCKS.map((m,i) => (
            <div key={m.label} className={`shrink-0 rounded-lg overflow-hidden border border-white/8 relative ${i===0?'w-[48%]':'w-[38%]'}`} style={{background:`linear-gradient(135deg,${m.c1},${m.c2})`}}>
              {i===0 && <div className="absolute bottom-0 inset-x-0 p-1" style={{background:'rgba(0,0,0,0.6)'}}>
                <div className="h-[2px] w-2/3 rounded" style={{background:'rgba(255,255,255,0.4)'}}/>
              </div>}
            </div>
          ))}
          <div className="shrink-0 w-5 rounded-lg border border-white/6 flex items-center justify-center" style={{background:'rgba(255,255,255,0.02)'}}>
            <span className="text-white/20 text-[9px]">›</span>
          </div>
        </div>
      ),
    },
  ]

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none transition-colors"
  const inputSt  = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.15)' } as React.CSSProperties

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-white mb-1">Extra Services</h2>
        <p className="text-xs text-white/35 leading-relaxed">Add custom services that appear on your website below the main three. Choose a layout, add services, and they go live instantly.</p>
      </div>

      {/* ── Template Picker ── */}
      <div>
        <p className="text-xs tracking-[0.15em] text-[#C9A84C]/70 uppercase font-bold mb-4">Choose Display Layout</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {TEMPLATES.map(t => (
            <div key={t.id} className="relative">
              {/* Select card */}
              <button type="button" onClick={() => pickTemplate(t.id)}
                className="w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                style={{ background: template===t.id ? 'rgba(201,168,76,0.10)' : 'rgba(255,255,255,0.035)', borderColor: template===t.id ? 'rgba(201,168,76,0.50)' : 'rgba(255,255,255,0.10)' }}>
                {/* Thumbnail */}
                <div className="mb-3">{t.thumb}</div>
                {/* Label row */}
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <p className="text-xs font-bold text-white leading-tight">{t.label}</p>
                  {template===t.id && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{background:'rgba(201,168,76,0.22)',color:'#E8C96B'}}>ACTIVE</span>}
                </div>
                <span className="inline-block text-[9px] font-bold tracking-[0.10em] px-2 py-0.5 rounded-full border mb-1.5" style={{borderColor:'rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.45)'}}>
                  {t.badge}
                </span>
                <p className="text-[10px] text-white/40 leading-relaxed">{t.desc}</p>
              </button>
              {/* Info (ⓘ) button */}
              <button type="button" onClick={() => setPreviewModal(t.id)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 z-10"
                style={{background:'rgba(201,168,76,0.16)',border:'1px solid rgba(201,168,76,0.30)',color:'rgba(201,168,76,0.85)'}}>
                <Info className="w-3.5 h-3.5"/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services list + Edit panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 items-start">
        {/* Left: list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.15em] text-[#C9A84C]/70 uppercase font-bold">{services.length} Service{services.length!==1?'s':''}</p>
            <button onClick={startAdd}
              className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_4px_20px_rgba(201,168,76,0.30)]">
              <Plus className="w-4 h-4"/> Add Service
            </button>
          </div>

          {services.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-12 text-center" style={{borderColor:'rgba(201,168,76,0.10)'}}>
              <Sparkles className="w-8 h-8" style={{color:'rgba(201,168,76,0.20)'}}/>
              <p className="text-sm font-serif text-white/25">No extra services yet</p>
              <p className="text-[11px] text-white/18 max-w-xs leading-relaxed">Click "Add Service" above to add custom services that will appear on your website below the main three.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {services.map(svc => (
                <div key={svc.id}
                  className="flex items-center gap-3 p-4 rounded-2xl border transition-all"
                  style={{ background: selId===svc.id?'rgba(201,168,76,0.06)':'rgba(255,255,255,0.02)', borderColor: selId===svc.id?'rgba(201,168,76,0.25)':'rgba(255,255,255,0.06)', opacity: svc.visible?1:0.50 }}>
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden border border-white/8 flex items-center justify-center text-2xl" style={{background:'rgba(255,255,255,0.04)'}}>
                    {svc.img ? <img src={svc.img} alt={svc.name} className="w-full h-full object-cover"/> : <span>{svc.emoji}</span>}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-base font-bold text-white truncate">{svc.name || 'Untitled'}</p>
                      {svc.price && <span className="text-[9px] font-bold shrink-0 px-1.5 py-0.5 rounded-full" style={{background:'rgba(201,168,76,0.10)',color:'rgba(201,168,76,0.80)'}}>{svc.price}</span>}
                    </div>
                    <p className="text-xs text-white/38 truncate">{svc.description || 'No description'}</p>
                  </div>
                  {/* Actions — aligned right, equal size buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { updateExtraService({...svc, visible:!svc.visible}); onRefresh() }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white cursor-pointer transition-colors"
                      title={svc.visible?'Hide':'Show'}>
                      {svc.visible ? <Eye className="w-3.5 h-3.5"/> : <EyeOff className="w-3.5 h-3.5"/>}
                    </button>
                    <button onClick={() => startEdit(svc)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-[#C9A84C] cursor-pointer transition-colors">
                      <Pencil className="w-3.5 h-3.5"/>
                    </button>
                    <button onClick={() => handleDelete(svc.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 cursor-pointer transition-colors">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: edit / empty state */}
        {selId ? (
          <div className="rounded-2xl border p-5 space-y-4 xl:sticky xl:top-20" style={{background:'rgba(13,13,38,0.98)', borderColor:'rgba(201,168,76,0.15)'}}>
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.15em] text-[#C9A84C]/70 uppercase font-bold">{isNew ? 'New Service' : 'Edit Service'}</p>
              <button onClick={() => setSelId(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white cursor-pointer transition-colors">
                <X className="w-4 h-4"/>
              </button>
            </div>

            {/* Name + Emoji */}
            <div className="grid grid-cols-[1fr_76px] gap-2 items-end">
              <div>
                <label className="block text-xs tracking-[0.12em] text-[#C9A84C]/65 uppercase font-bold mb-2">Service Name *</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  placeholder="e.g. Balloon Art" className={inputCls} style={inputSt}
                  onFocus={e=>e.target.style.borderColor='rgba(201,168,76,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.15)'}/>
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] text-[#C9A84C]/65 uppercase font-bold mb-2">Emoji</label>
                <input value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))}
                  maxLength={4} className="w-full rounded-xl px-2 py-2.5 text-white/90 text-center text-xl focus:outline-none transition-colors" style={inputSt}
                  onFocus={e=>e.target.style.borderColor='rgba(201,168,76,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.15)'}/>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs tracking-[0.12em] text-[#C9A84C]/65 uppercase font-bold mb-2">
                Starting Price <span className="text-white/20 normal-case tracking-normal font-normal text-[10px]">(e.g. From ₹500)</span>
              </label>
              <input value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}
                placeholder="From ₹500" className={inputCls} style={inputSt}
                onFocus={e=>e.target.style.borderColor='rgba(201,168,76,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.15)'}/>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs tracking-[0.12em] text-[#C9A84C]/65 uppercase font-bold mb-2">Description</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                rows={2} placeholder="Short description shown on your website..."
                className="w-full rounded-xl px-3 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none resize-none transition-colors" style={inputSt}
                onFocus={e=>e.target.style.borderColor='rgba(201,168,76,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.15)'}/>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-xs tracking-[0.12em] text-[#C9A84C]/65 uppercase font-bold mb-2">
                Photo <span className="text-white/20 normal-case tracking-normal font-normal text-[10px]">(optional)</span>
              </label>
              {form.img ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 group">
                  <img src={form.img} alt="" className="w-full h-full object-cover"/>
                  <button onClick={()=>setForm(f=>({...f,img:''}))}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/65 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3"/>
                  </button>
                </div>
              ) : (
                <button onClick={()=>fileRef.current?.click()} disabled={uploading}
                  className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
                  style={{borderColor:'rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.28)'}}>
                  {uploading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <><Upload className="w-4 h-4"/> Upload Photo</>}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0] && handleImg(e.target.files[0])}/>
            </div>

            {/* WhatsApp message */}
            <div>
              <label className="block text-xs tracking-[0.12em] text-[#C9A84C]/65 uppercase font-bold mb-2">WhatsApp Enquiry Message</label>
              <input value={form.whatsappMsg} onChange={e=>setForm(f=>({...f,whatsappMsg:e.target.value}))}
                placeholder="Hi! I'd like to know about Balloon Art..."
                className={inputCls} style={inputSt}
                onFocus={e=>e.target.style.borderColor='rgba(201,168,76,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.15)'}/>
            </div>

            {/* Visibility toggle */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
              style={{background:'rgba(255,255,255,0.025)', borderColor:'rgba(255,255,255,0.07)'}}>
              <div>
                <p className="text-sm font-semibold text-white/75">Visible on website</p>
                <p className="text-xs text-white/35">{form.visible ? 'Shown to visitors' : 'Hidden from visitors'}</p>
              </div>
              <button type="button" onClick={()=>setForm(f=>({...f,visible:!f.visible}))}
                className="relative w-11 h-6 rounded-full transition-all cursor-pointer shrink-0 ml-3"
                style={{background:form.visible?'#10B981':'rgba(255,255,255,0.14)'}}>
                <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
                  style={{left: form.visible ? 'calc(100% - 20px)' : '4px'}}/>
              </button>
            </div>

            {/* Save */}
            <button onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-xs tracking-[0.15em] uppercase py-3 rounded-full transition-all hover:scale-[1.02] cursor-pointer shadow-[0_4px_20px_rgba(201,168,76,0.35)]">
              <CheckCircle2 className="w-4 h-4"/> Save Service
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-10 text-center xl:min-h-[240px]"
            style={{borderColor:'rgba(201,168,76,0.09)'}}>
            <Layers className="w-8 h-8" style={{color:'rgba(201,168,76,0.16)'}}/>
            <p className="text-sm font-serif text-white/22">Select a service to edit</p>
            <p className="text-[11px] text-white/15 max-w-[190px] leading-relaxed">Or click "Add Service" to create a new one.</p>
          </div>
        )}
      </div>

      {/* ── Big Layout Preview Modal ── */}
      {previewModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={()=>setPreviewModal(null)}
          style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)'}}>
          <div className="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl border p-5 space-y-4"
            style={{background:'rgba(14,14,20,0.99)', borderColor:'rgba(201,168,76,0.20)'}}
            onClick={e=>e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <div>
                {(() => { const t = TEMPLATES.find(t=>t.id===previewModal)!; return (
                  <>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-white text-sm">{t.label}</p>
                      <span className="text-[7px] font-bold tracking-[0.12em] px-1.5 py-0.5 rounded-full border" style={{borderColor:'rgba(201,168,76,0.25)',color:'#C9A84C'}}>{t.badge}</span>
                    </div>
                    <p className="text-[11px] text-white/40">{t.desc}</p>
                  </>
                )})()}
              </div>
              <button onClick={()=>setPreviewModal(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white cursor-pointer transition-colors shrink-0"
                style={{background:'rgba(255,255,255,0.05)'}}>
                <X className="w-4 h-4"/>
              </button>
            </div>
            <div className="h-px" style={{background:'rgba(255,255,255,0.07)'}}/>
            <p className="text-xs tracking-[0.15em] text-[#C9A84C]/60 uppercase font-bold">Layout Preview</p>
            {/* Big preview */}
            <div className="rounded-2xl overflow-hidden border border-white/8 p-3" style={{background:'rgba(8,8,12,0.95)'}}>
              {BIG_PREVIEWS[previewModal]}
            </div>
            {/* Select button */}
            <div className="flex gap-2">
              <button onClick={() => { pickTemplate(previewModal); setPreviewModal(null) }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] font-bold text-xs tracking-[0.15em] uppercase py-3 rounded-full transition-all cursor-pointer">
                <CheckCircle2 className="w-3.5 h-3.5"/>
                {template===previewModal ? 'Already Active' : 'Use This Layout'}
              </button>
              <button onClick={()=>setPreviewModal(null)}
                className="px-5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white rounded-full border border-white/10 cursor-pointer transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Guide Tab ─────────────────────────────────────────────────────────────────

function GuideTab({ onGoMedia, onGoSettings }: { onGoMedia: () => void; onGoSettings: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>('overview')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const jumpTo = (id: string) => {
    const isOpening = expandedId !== id
    setExpandedId(expandedId === id ? null : id)
    if (isOpening) {
      setTimeout(() => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="rounded-2xl border border-[#C9A84C]/20 p-5 flex flex-col sm:flex-row items-start gap-4" style={{ background:'linear-gradient(135deg,rgba(13,13,38,0.98),rgba(20,20,28,0.92))' }}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-[#C9A84C]/25" style={{ background:'rgba(201,168,76,0.1)' }}>
          <BookOpen className="w-5 h-5 text-[#C9A84C]"/>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-serif text-xl sm:text-2xl text-white">Starter Guide</h2>
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-[#C9A84C]">Handbook</span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">Visual step-by-step guide for every feature. Click a section to expand it.</p>
        </div>
      </div>

      {/* Quick jump chips */}
      <div>
        <p className="text-[9px] tracking-[0.2em] text-[#C9A84C]/40 uppercase font-bold mb-2">Jump to topic</p>
        <div className="flex flex-wrap gap-1.5">
          {GUIDE_SECTIONS.map(s => (
            <button key={s.id} onClick={() => jumpTo(s.id)}
              className={`flex items-center gap-1 text-[9px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer ${expandedId===s.id ? 'border-transparent text-[#04140E]' : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'}`}
              style={expandedId===s.id ? { background:s.color } : {}}>
              <s.icon className="w-2.5 h-2.5"/>
              <span className="hidden sm:inline">{s.title.split(' — ')[0].split(' · ')[0].split(' (')[0]}</span>
              <span className="sm:hidden capitalize">{s.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Visual Quick-Start Flow ── */}
      <div className="rounded-2xl border border-[#C9A84C]/15 p-4 space-y-3" style={{ background:'rgba(13,13,38,0.75)' }}>
        <p className="text-[10px] tracking-[0.2em] text-[#C9A84C]/60 uppercase font-bold">Visual Walkthrough — How the admin panel works</p>

        {/* Step 1 — Sidebar navigation */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-white/60 flex items-center gap-2"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-[#04140E] shrink-0" style={{ background:'#C9A84C' }}>1</span>Use the sidebar to navigate between sections</p>
          <VisualDiagram title="craftnestshop.com/admin — Sidebar">
            <MockSidebar/>
            <div className="flex flex-col justify-center gap-2 min-w-[130px]">
              {[['Dashboard','See your store at a glance'],['Jewellery','Manage jewellery products'],['Gallery','Add/remove photos'],['Settings','WhatsApp, banner, upload']].map(([k,v])=>(
                <div key={k} className="flex items-start gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#C9A84C]/50 shrink-0 mt-0.5"/>
                  <div><p className="text-[8px] font-bold text-white/60">{k}</p><p className="text-[7px] text-white/25">{v}</p></div>
                </div>
              ))}
            </div>
          </VisualDiagram>
        </div>

        {/* Step 2 — Product cards */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-white/60 flex items-center gap-2"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-[#04140E] shrink-0" style={{ background:'#C9A84C' }}>2</span>Add and manage products — use the card action icons</p>
          <VisualDiagram title="Products Tab — Card Actions">
            <MockProductCard badge="Bestseller" featured/>
            <MockProductCard badge="Bridal" hidden/>
            <div className="flex flex-col justify-center gap-2.5 min-w-[150px]">
              {[
                [Eye,'w-3 h-3 text-emerald-400','👁 Visible — click to hide'],
                [Star,'w-3 h-3 text-[#E8C96B]','⭐ Featured — shows on top'],
                [Pencil,'w-3 h-3 text-white/40','✏️ Edit product details'],
                [Trash2,'w-3 h-3 text-red-400/50','🗑 Delete (Owner only)'],
              ].map(([Icon, cls, label],i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* @ts-ignore */}
                  <Icon className={cls as string}/>
                  <p className="text-[8px] text-white/40">{label as string}</p>
                </div>
              ))}
            </div>
          </VisualDiagram>
        </div>

        {/* Step 3 — Image Converter */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-white/60 flex items-center gap-2"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-[#04140E] shrink-0" style={{ background:'#C9A84C' }}>3</span>Upload images → get a URL → paste into any image field</p>
          <VisualDiagram title="Image Converter Tab — How to get a link">
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <MockDropZone/>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-6 bg-white/10"/>
                  <ChevronRight className="w-3 h-3 text-white/20"/>
                </div>
                <div className="flex-1 rounded-xl border border-emerald-600/20 p-2" style={{ background:'rgba(5,30,15,0.8)' }}>
                  <p className="text-[7px] text-white/30 mb-1">Your image link:</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-3 rounded bg-emerald-900/40 border border-emerald-600/20"/>
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-600 cursor-pointer">
                      <Copy className="w-2 h-2 text-white"/><span className="text-[6px] font-bold text-white">Copy</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[7px] text-white/25">
                <span className="shrink-0">Then paste this link into</span>
                <div className="flex-1 h-3 rounded border border-[#C9A84C]/15 bg-white/5 px-1.5 flex items-center"><span className="text-[6px] text-white/20">Image URL field in product form</span></div>
              </div>
            </div>
          </VisualDiagram>
          <button onClick={onGoMedia} className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-[#C9A84C]/70 hover:text-[#C9A84C] cursor-pointer transition-colors">
            <ImageIcon2 className="w-3 h-3"/> Open Image Converter →
          </button>
        </div>

        {/* Step 4 — Settings */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-white/60 flex items-center gap-2"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-[#04140E] shrink-0" style={{ background:'#C9A84C' }}>4</span>Control global site options from Settings (Owner only)</p>
          <VisualDiagram title="Settings Tab — Key controls">
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[
                { icon:Megaphone, color:'#F5A623', label:'Announcement Banner', detail:'Toggle ON/OFF — shows a bar at top of website' },
                { icon:MessageCircle, color:'#25D366', label:'WhatsApp Number', detail:'Changes all enquiry buttons across the site' },
                { icon:Upload, color:'#5DBEA3', label:'Cloudinary Preset', detail:'Required for file upload in all image fields' },
                { icon:Link, color:'#8BA4F8', label:'Social Links', detail:'Instagram & Facebook shown in footer' },
              ].map(({ icon:Icon, color, label, detail }) => (
                <div key={label} className="flex items-start gap-1.5 p-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)' }}>
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background:`${color}15` }}>
                    <Icon className="w-2.5 h-2.5" style={{ color }}/>
                  </div>
                  <div><p className="text-[7px] font-bold text-white/60">{label}</p><p className="text-[6px] text-white/25 leading-relaxed">{detail}</p></div>
                </div>
              ))}
            </div>
          </VisualDiagram>
          <button onClick={onGoSettings} className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-[#C9A84C]/70 hover:text-[#C9A84C] cursor-pointer transition-colors">
            <Settings className="w-3 h-3"/> Open Settings →
          </button>
        </div>
      </div>

      {/* Text sections */}
      <div className="space-y-2">
        {GUIDE_SECTIONS.map(section => (
          <div key={section.id} ref={el => { sectionRefs.current[section.id] = el }} className="scroll-mt-16">
            <GuideSection section={section} expanded={expandedId===section.id}
              onToggle={() => setExpandedId(expandedId===section.id ? null : section.id)}/>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 p-4 flex items-start gap-3" style={{ background:'rgba(255,255,255,0.02)' }}>
        <Info className="w-4 h-4 text-white/20 shrink-0 mt-0.5"/>
        <p className="text-[11px] text-white/25 leading-relaxed min-w-0">
          This guide lives in the sidebar — always accessible. For technical changes (new users, colours, payments) contact your developer at <span className="text-[#C9A84C]/50">craftnestshop.com</span>.
        </p>
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
    { id:'gallery'   as Tab, label:'Gallery',        icon:ImageIcon, sub:`${data.gallery.length} photos` },
    { id:'hero'      as Tab, label:'Hero Carousel',  icon:Home,      sub:`${data.heroImages.length} images` },
    { id:'media'     as Tab, label:'Image Converter',icon:ImageIcon2 },
    { id:'schedule'  as Tab, label:'Schedule',        icon:CalendarDays },
    { id:'extras'    as Tab, label:'Extra Services',  icon:Sparkles, ownerOnly:true },
    { id:'settings'  as Tab, label:'Settings',       icon:Settings,  ownerOnly:true },
    { id:'guide'     as Tab, label:'Starter Guide',  icon:BookOpen },
  ] as NavItem[]).filter(n => !n.ownerOnly || userRole === 'owner')

  return (
    <div className="min-h-screen" style={{ background:'#0B0B1E' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* ── Sidebar — always fixed, never scrolls ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-56 sm:w-64 border-r border-[#C9A84C]/18 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background:'linear-gradient(180deg,#151535 0%,#0C0C26 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#C9A84C]/14 shrink-0">
          <div className="w-10 h-10 rounded-xl border border-[#C9A84C]/30 flex items-center justify-center shrink-0" style={{ background:'rgba(201,168,76,0.10)', boxShadow:'0 0 16px rgba(201,168,76,0.12)' }}>
            <svg viewBox="0 0 100 80" className="w-6 h-5" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z"/>
              <circle cx="37" cy="51" r="5.5"/><circle cx="23" cy="49" r="3.2"/>
              <rect x="57.5" y="32" width="3.0" height="40" rx="1.5"/>
              <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z"/>
              <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#E8C96B] tracking-[0.06em] uppercase truncate">Craft Nest</p>
            <p className="text-[10px] text-white/35 capitalize">{userRole} Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white cursor-pointer shrink-0 p-1"><X className="w-4 h-4"/></button>
        </div>

        {/* User badge */}
        <div className="px-3 py-3 border-b border-[#C9A84C]/10 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background:'rgba(201,168,76,0.07)', border:'1px solid rgba(201,168,76,0.12)' }}>
            <div className="w-8 h-8 rounded-full bg-[#C9A84C]/18 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]"/>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white/90 truncate">{userName}</p>
              <p className="text-[10px] text-[#C9A84C]/50 capitalize font-medium">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Nav — no scroll, all items visible */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-hidden">
          {NAV.map(({ id, label, icon:Icon, sub }) => (
            <button key={id} onClick={() => { setTab(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer border min-w-0 ${tab===id ? 'border-[#C9A84C]/30 text-[#E8C96B] shadow-[0_2px_12px_rgba(201,168,76,0.10)]' : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04] border-transparent'}`}
              style={tab===id ? {background:'linear-gradient(135deg,rgba(201,168,76,0.14),rgba(201,168,76,0.06))'} : {}}>
              <Icon className={`w-4 h-4 shrink-0 ${tab===id ? 'text-[#C9A84C]' : 'text-white/35 group-hover:text-white/60'}`}/>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold tracking-[0.02em] truncate leading-tight">{label}</p>
                {sub && <p className="text-[9px] text-white/28 leading-tight mt-0.5">{sub}</p>}
              </div>
              {tab===id && <div className="w-2 h-2 rounded-full bg-[#C9A84C] shrink-0 shadow-[0_0_6px_#C9A84C]"/>}
            </button>
          ))}
        </nav>

        {/* Footer links */}
        <div className="px-2.5 py-3 border-t border-[#C9A84C]/12 space-y-1 shrink-0">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/38 hover:text-white/70 hover:bg-white/[0.04] text-xs font-semibold tracking-[0.02em] transition-all">
            <Eye className="w-4 h-4 shrink-0"/> View Website
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-500/5 text-xs font-semibold tracking-[0.02em] transition-all cursor-pointer">
            <LogOut className="w-4 h-4 shrink-0"/> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content — offset by sidebar width on desktop ── */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        {/* Top bar — sticky inside scrolling column */}
        <header
          className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#C9A84C]/14 sticky top-0 z-30 shrink-0"
          style={{ background:'rgba(11,11,30,0.97)', backdropFilter:'blur(16px)' }}
        >
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-white/12 text-white/40 hover:text-white cursor-pointer shrink-0">
            <Menu className="w-4 h-4"/>
          </button>
          <p className="text-xs tracking-[0.20em] text-[#C9A84C]/60 uppercase font-bold truncate flex-1">
            {NAV.find(n => n.id===tab)?.label ?? 'Admin'}
          </p>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs text-white/30 hidden sm:block truncate max-w-[140px] font-medium">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center" style={{boxShadow:'0 0 10px rgba(201,168,76,0.12)'}}>
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]"/>
            </div>
          </div>
        </header>

        {/* Page content — only this scrolls */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
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

          {tab === 'media' && <MediaTab onGoSettings={() => setTab('settings')}/>}

          {tab === 'schedule' && <ScheduleTab data={data} show={show} onRefresh={refresh}/>}

          {tab === 'extras' && userRole === 'owner' && <ExtraServicesTab data={data} show={show} onRefresh={refresh}/>}

          {tab === 'settings' && userRole === 'owner' && <SettingsTab data={data} show={show}/>}

          {tab === 'guide' && <GuideTab onGoMedia={() => setTab('media')} onGoSettings={() => setTab('settings')}/>}
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



