import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { CartProvider } from '../context/CartContext'
import { CartDrawer } from '../components/CartDrawer'

import '../styles.css'

// ── CraftNest Chatbot ─────────────────────────────────────────────────────────

type ChatMsg = {
  id: number
  role: 'bot' | 'user'
  text: string
  quick?: string[]
  links?: { label: string; href: string; style: 'wa' | 'ig' | 'default' }[]
}

function readStore<T>(key: string, fallback: T): T {
  try { return (JSON.parse(localStorage.getItem('craftnest_admin_data') || '{}') as Record<string,T>)[key] ?? fallback } catch { return fallback }
}
const getWA  = () => (readStore('settings', {} as Record<string,string>)['whatsappNumber'] as string) || '14704527988'
const getIG  = () => (readStore('settings', {} as Record<string,string>)['instagramUrl']  as string) || ''
const getSched = (d: string): { status: string; note: string; services?: string[] } | null => {
  try { return (JSON.parse(localStorage.getItem('craftnest_admin_data') || '{}') as Record<string, Record<string, { status:string; note:string; services?:string[] }>>) ['schedule']?.[d] ?? null } catch { return null }
}

function parseDate(text: string): string | null {
  const lower = text.toLowerCase()
  const now   = new Date()
  const fmt   = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

  if (/\btoday\b/.test(lower))    return fmt(now)
  if (/\btomorrow\b/.test(lower)) { const d=new Date(now); d.setDate(d.getDate()+1); return fmt(d) }

  const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
  if (iso) return iso[0]

  const slash = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\b/)
  if (slash) return fmt(new Date(slash[3] ? +slash[3] : now.getFullYear(), +slash[1]-1, +slash[2]))

  const MN = ['january','february','march','april','may','june','july','august','september','october','november','december']
  const MS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
  let month = -1
  for (let i=0; i<12; i++) if (lower.includes(MN[i])||lower.includes(MS[i])) { month=i; break }
  if (month >= 0) {
    const dm = lower.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/)
    const ym = lower.match(/\b(20\d{2})\b/)
    if (dm && +dm[1]>=1 && +dm[1]<=31) return fmt(new Date(ym ? +ym[1] : now.getFullYear(), month, +dm[1]))
  }

  const WD = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  for (let i=0; i<7; i++) if (lower.includes(WD[i])) {
    const d=new Date(now); const diff=((i-d.getDay())+7)%7||7; d.setDate(d.getDate()+diff); return fmt(d)
  }
  return null
}

function buildReply(input: string): ChatMsg {
  const lower  = input.toLowerCase().trim()
  const id     = Date.now()
  const waNum  = getWA()
  const ig     = getIG()
  const waLink = (msg = 'Hi CraftNest! I have a question.') =>
    ({ label:'💬 Chat on WhatsApp', href:`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, style:'wa' as const })
  const igLink  = ig ? { label:'📸 View on Instagram', href: ig, style:'ig' as const } : null

  // ── Availability / schedule check ──────────────────────────────────────────
  const schedTriggers = ['free','available','busy','availability','schedule','book','slot','appointment','open','session','date','when']
  if (schedTriggers.some(w => lower.includes(w))) {
    const date = parseDate(lower)
    if (date) {
      const [y,m,d] = date.split('-').map(Number)
      const display  = new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})
      const entry    = getSched(date)
      if (!entry) return {
        id, role:'bot',
        text: `📅 **${display}**\n\nWe haven't set our schedule for that date yet. Please reach out on WhatsApp and we'll confirm availability for you right away! 😊`,
        links: [waLink(`Hi CraftNest! I'd like to check availability for ${display}.`)],
        quick: ['Check another date','Our Services','Contact Us'],
      }
      const map: Record<string,{e:string;t:string}> = {
        free:    {e:'🎉',t:`We are **free and available** on ${display}! We'd love to hear from you.`},
        limited: {e:'⚡',t:`We have **limited slots** on ${display}. Act fast to secure your booking!`},
        busy:    {e:'😔',t:`We're **busy** on ${display}. Please contact us to explore options or alternative dates.`},
        booked:  {e:'📅',t:`We are **fully booked** on ${display}. Contact us for the next available date.`},
      }
      const {e,t} = map[entry.status] ?? map.free
      const note  = entry.note     ? `\n\n📝 ${entry.note}`                                        : ''
      const svcs  = entry.services?.length ? `\n\n✅ Services available: ${entry.services.join(', ')}` : ''
      return {
        id, role:'bot',
        text: `${e} ${t}${note}${svcs}`,
        links: [waLink(`Hi CraftNest! I'd like to book for ${display}.`)],
        quick: entry.status==='free'||entry.status==='limited' ? ['Book on WhatsApp','Our Services'] : ['Check Another Date','Contact Us'],
      }
    }
    return {
      id, role:'bot',
      text: `📅 Sure! To check availability, just tell me the date — for example:\n\n• "Are you free on July 4th?"\n• "Is craft nest available on December 25?"\n• "Check next Saturday"\n\nI'll look it up instantly! 🙌`,
      quick: ['Are you free today?','Are you free tomorrow?','Contact Us'],
    }
  }

  // ── Greetings ──────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|namaste|howdy|hii|helo|good morning|good evening|good afternoon|yo)\b/.test(lower)) return {
    id, role:'bot',
    text: `👋 Hi there! Welcome to **CraftNest**! 🌟\n\nWe bring handcrafted beauty to life — jewellery, return gifts, and face painting. How can I help you today?`,
    quick: ['Our Services','Check Availability','View Crafts on Instagram','Contact Us'],
  }

  // ── About ──────────────────────────────────────────────────────────────────
  if (/\b(about|who are|what is|craftnest|craft nest|tell me)\b/.test(lower)) return {
    id, role:'bot',
    text: `✨ **About CraftNest**\n\nCraftNest is a handcrafted arts & crafts business based in **Georgia, USA** 🇺🇸\n\nWe create:\n💎 Handmade Jewellery\n🎁 Custom Return Gifts\n🎨 Face Painting for Events\n\nEvery piece is made with love and artisanal skill, serving Atlanta and surrounding areas!`,
    quick: ['Our Services','Check Availability','Contact Us'],
  }

  // ── Services ───────────────────────────────────────────────────────────────
  if (/\b(service|services|offer|provide|do you|specialise|specialize|what do)\b/.test(lower)) return {
    id, role:'bot',
    text: `✨ **CraftNest Services**\n\n💎 **Handmade Jewellery**\nNecklaces, earrings, bracelets & more for every occasion\n\n🎁 **Return Gifts**\nUnique handcrafted keepsakes for weddings, birthdays & events\n\n🎨 **Face Painting**\nVibrant artistic face painting for parties & events, all ages!`,
    quick: ['Jewellery Details','Return Gifts Info','Face Painting','Book Now'],
  }

  // ── Jewellery ──────────────────────────────────────────────────────────────
  if (/\b(jewel|jewellery|jewelry|necklace|earring|bracelet|bangle|pendant|kundan)\b/.test(lower)) return {
    id, role:'bot',
    text: `💎 **Handmade Jewellery at CraftNest**\n\nOur collection includes:\n• Necklaces (traditional, bridal, festival styles)\n• Earrings (jhumkas, danglers, studs)\n• Bracelets, bangles & sets\n• Kundan & stone-work pieces\n• Custom designs for special occasions\n\nPerfect for weddings, festivals, birthdays & everyday styling! 🌟`,
    links: [...(igLink ? [igLink] : []), waLink('Hi CraftNest! I\'d like to enquire about your jewellery collection.')],
    quick: ['View on Instagram','Check Availability','Book on WhatsApp'],
  }

  // ── Return Gifts ───────────────────────────────────────────────────────────
  if (/\b(gift|gifts|return gift|favour|favor|keepsake|goodie|party return|wedding return)\b/.test(lower)) return {
    id, role:'bot',
    text: `🎁 **Return Gifts at CraftNest**\n\nBeautiful handcrafted gifts for:\n• Weddings & engagements 💍\n• Baby showers & namings 👶\n• Birthday parties 🎂\n• Pooja & religious events\n• Corporate gifting 🏢\n\nEach gift is custom-made and beautifully packed. We also handle **bulk orders**! 🌸`,
    links: [...(igLink ? [igLink] : []), waLink('Hi CraftNest! I\'d like to enquire about return gifts.')],
    quick: ['View on Instagram','Check Availability','Book on WhatsApp'],
  }

  // ── Face Painting ──────────────────────────────────────────────────────────
  if (/\b(face|paint|painting|body art|mehndi|mehendi|henna)\b/.test(lower)) return {
    id, role:'bot',
    text: `🎨 **Face Painting at CraftNest**\n\nProfessional face painting for:\n• Birthday parties 🎂\n• School & college events 🏫\n• Cultural festivals 🎉\n• Corporate family days\n• Wedding sangeet & functions 🌸\n\nSafe, skin-friendly paints — beautiful designs for kids & adults! Book early, slots fill fast. 🌟`,
    links: [...(igLink ? [igLink] : []), waLink('Hi CraftNest! I\'d like to book a face painting session.')],
    quick: ['Check Availability','Book on WhatsApp','View Designs'],
  }

  // ── Price ──────────────────────────────────────────────────────────────────
  if (/\b(price|cost|rate|charge|how much|pricing|fee|payment|budget|affordable)\b/.test(lower)) return {
    id, role:'bot',
    text: `💰 **Pricing at CraftNest**\n\nPrices vary based on:\n• Product type & design complexity\n• Quantity (bulk orders get discounts! 🎉)\n• Customisation requirements\n• Event duration for face painting\n\nFor an exact quote please reach out on WhatsApp — we respond quickly! 📱`,
    links: [waLink('Hi CraftNest! I\'d like to know the pricing for your services.')],
    quick: ['Book on WhatsApp','Check Availability','Our Services'],
  }

  // ── Booking ────────────────────────────────────────────────────────────────
  if (/\b(book|booking|order|reserve|enquire|enquiry|hire|buy|purchase)\b/.test(lower)) return {
    id, role:'bot',
    text: `📱 **How to Book CraftNest**\n\n1️⃣ Check our availability for your date (ask me: "Are you free on [date]?")\n2️⃣ Reach out on WhatsApp with your date, service & requirements\n3️⃣ We'll confirm and plan everything with you!\n\nWe usually respond within a few hours 😊`,
    links: [waLink('Hi CraftNest! I\'d like to book your services. Please share details.')],
    quick: ['Check Availability','Our Services','View on Instagram'],
  }

  // ── Location ───────────────────────────────────────────────────────────────
  if (/\b(location|where|address|place|city|georgia|atlanta|area|travel|local)\b/.test(lower)) return {
    id, role:'bot',
    text: `📍 **CraftNest Location**\n\nWe are based in **Georgia, USA** 🇺🇸 and primarily serve the **Atlanta metro area** and surrounding communities.\n\nFor events further away, reach out on WhatsApp to discuss travel options!`,
    links: [waLink('Hi CraftNest! I\'d like to know about your service area and travel availability.')],
    quick: ['Book on WhatsApp','Check Availability','Contact Us'],
  }

  // ── Instagram / Photos ─────────────────────────────────────────────────────
  if (/\b(instagram|insta|photo|picture|pic|gallery|view|see|look|design|sample|portfolio)\b/.test(lower)) return {
    id, role:'bot',
    text: `📸 **View Our Crafts on Instagram!**\n\nSee our beautiful creations:\n💎 Jewellery collections\n🎁 Return gift sets\n🎨 Face painting designs\n🌸 Event highlights\n\nTap below to visit our Instagram! ✨`,
    links: [...(igLink ? [igLink] : [{...waLink('Hi CraftNest! Could you share some photos of your work?'), label:'📸 Ask for Portfolio'}]), waLink()],
    quick: ['Book on WhatsApp','Check Availability','Our Services'],
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  if (/\b(contact|reach|call|phone|number|whatsapp|message|chat)\b/.test(lower)) return {
    id, role:'bot',
    text: `📞 **Contact CraftNest**\n\nThe best way to reach us is **WhatsApp** — we're active and reply quickly!\n\nFollow us on Instagram to see our latest work & updates 📸`,
    links: [waLink(), ...(igLink ? [igLink] : [])],
    quick: ['Check Availability','Our Services'],
  }

  // ── Bulk / Corporate ───────────────────────────────────────────────────────
  if (/\b(bulk|wholesale|corporate|quantity|large|many|lot of|hundreds|event planning)\b/.test(lower)) return {
    id, role:'bot',
    text: `📦 **Bulk & Corporate Orders**\n\nWe welcome large orders! We handle:\n• Wedding return gift sets (50–500+ pieces)\n• Corporate gifting packages\n• School & institution events\n\nSpecial rates for bulk orders — contact us with your requirements! 🌟`,
    links: [waLink('Hi CraftNest! I\'m interested in a bulk order. Please share details.')],
    quick: ['Check Availability','Our Services'],
  }

  // ── Default ────────────────────────────────────────────────────────────────
  return {
    id, role:'bot',
    text: `🤔 I'm not sure about that specific question! Let me connect you with our team — they'll have the perfect answer.\n\nYou can also ask me about:\n• Our services\n• Availability on a date\n• Pricing & booking\n• Location`,
    links: [waLink(`Hi CraftNest! I have a question: "${input}"`), ...(igLink ? [igLink] : [])],
    quick: ['Our Services','Check Availability','Book on WhatsApp'],
  }
}

const INIT_MSG: ChatMsg = {
  id: 0, role: 'bot',
  text: '👋 Hi! Welcome to **CraftNest**! 🌟\n\nI can help you with our services, check your event date availability, and more. What would you like to know?',
  quick: ['Our Services','Check Availability','View Crafts on Instagram','Contact Us'],
}

function CraftNestChat() {
  const [open,    setOpen]    = useState(false)
  const [msgs,    setMsgs]    = useState<ChatMsg[]>([INIT_MSG])
  const [input,   setInput]   = useState('')
  const [typing,  setTyping]  = useState(false)
  const [unread,  setUnread]  = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) } }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  const send = (text: string) => {
    if (!text.trim() || typing) return
    const userMsg: ChatMsg = { id: Date.now(), role:'user', text: text.trim() }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = buildReply(text.trim())
      setMsgs(m => [...m, reply])
      setTyping(false)
      if (!open) setUnread(n => n+1)
    }, 700 + Math.random()*400)
  }

  const toggle = () => setOpen(o => !o)

  const fmtText = (text: string) =>
    text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-bold text-white">{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br/>}
      </span>
    ))

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-[998] w-[calc(100vw-40px)] sm:w-[380px] rounded-2xl border border-[#C9A84C]/20 overflow-hidden flex flex-col shadow-2xl"
          style={{ height:'min(540px,calc(100dvh - 140px))', background:'linear-gradient(180deg,#061A0F 0%,#04140E 100%)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#C9A84C]/10 shrink-0"
            style={{ background:'rgba(6,26,15,0.98)' }}>
            <div className="w-8 h-8 rounded-full border border-[#C9A84C]/30 flex items-center justify-center shrink-0"
              style={{ background:'rgba(201,168,76,0.1)' }}>
              <svg viewBox="0 0 100 80" className="w-5 h-4" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z"/>
                <circle cx="37" cy="51" r="5.5"/><circle cx="23" cy="49" r="3.2"/>
                <rect x="57.5" y="32" width="3.0" height="40" rx="1.5"/>
                <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z"/>
                <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#E8C96B] leading-tight">CraftNest Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"/>
                <p className="text-[9px] text-white/35">Online · Usually replies instantly</p>
              </div>
            </div>
            <button onClick={toggle} className="text-white/30 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/5 shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
            {msgs.map(msg => (
              <div key={msg.id} className={`flex ${msg.role==='user'?'justify-end':'justify-start'}`}>
                {msg.role==='bot' && (
                  <div className="w-6 h-6 rounded-full border border-[#C9A84C]/25 flex items-center justify-center shrink-0 mt-1 mr-1.5"
                    style={{ background:'rgba(201,168,76,0.08)' }}>
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                )}
                <div className={`max-w-[82%] space-y-2 ${msg.role==='user'?'items-end':'items-start'} flex flex-col`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed
                    ${msg.role==='user'
                      ? 'bg-[#C9A84C] text-[#04140E] font-medium rounded-br-sm'
                      : 'text-white/80 rounded-bl-sm border border-[#C9A84C]/10'}`}
                    style={msg.role==='bot' ? { background:'rgba(10,35,24,0.95)' } : {}}>
                    {fmtText(msg.text)}
                  </div>

                  {/* Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-col gap-1.5 w-full">
                      {msg.links.map((l, i) => (
                        <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full text-[11px] font-bold transition-all hover:scale-[1.02]
                            ${l.style==='wa' ? 'text-white shadow-[0_2px_10px_rgba(37,211,102,0.3)]' :
                              l.style==='ig' ? 'text-white shadow-[0_2px_10px_rgba(225,48,108,0.3)]' :
                              'bg-[#C9A84C] text-[#04140E] shadow-[0_2px_10px_rgba(201,168,76,0.3)]'}`}
                          style={l.style==='wa' ? { background:'#25D366' } : l.style==='ig' ? { background:'linear-gradient(135deg,#833AB4,#C13584,#E1306C,#F77737)' } : {}}
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Quick replies */}
                  {msg.quick && msg.quick.length > 0 && msg.id === msgs[msgs.length-1].id && !typing && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.quick.map((q, i) => (
                        <button key={i} onClick={() => send(q)}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#C9A84C]/25 text-[#C9A84C]/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all cursor-pointer">
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full border border-[#C9A84C]/25 flex items-center justify-center shrink-0 mr-1.5 mt-1"
                  style={{ background:'rgba(201,168,76,0.08)' }}>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-[#C9A84C]/10 flex items-center gap-1"
                  style={{ background:'rgba(10,35,24,0.95)' }}>
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50 animate-bounce"
                      style={{ animationDelay:`${i*0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#C9A84C]/10 shrink-0" style={{ background:'rgba(6,26,15,0.98)' }}>
            <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex items-center gap-2">
              <input ref={inputRef}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything…"
                className="flex-1 min-w-0 bg-white/5 border border-[#C9A84C]/15 rounded-full px-4 py-2.5 text-white/90 text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
              <button type="submit" disabled={!input.trim() || typing}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-30"
                style={{ background:'#C9A84C' }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#04140E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </form>
            <p className="text-[9px] text-white/15 text-center mt-1.5">CraftNest AI · Powered by your schedule & knowledge base</p>
          </div>
        </div>
      )}

      {/* Floating buttons row */}
      <div className="fixed bottom-6 right-5 z-[999] flex flex-col items-center gap-3">
        {/* Chatbot toggle */}
        <button onClick={toggle} title="Chat with CraftNest"
          className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-[#C9A84C]/30 transition-all hover:scale-110 cursor-pointer"
          style={{ background: open ? '#C9A84C' : 'linear-gradient(135deg,#0A2318,#061A0F)' }}>
          {!open ? (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <circle cx="9" cy="10" r="0.8" fill="#C9A84C" stroke="none"/>
              <circle cx="12" cy="10" r="0.8" fill="#C9A84C" stroke="none"/>
              <circle cx="15" cy="10" r="0.8" fill="#C9A84C" stroke="none"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#04140E" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          )}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-[#04140E] flex items-center justify-center text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {/* WhatsApp */}
        <a href={`https://wa.me/${getWA()}?text=${encodeURIComponent('Hi CraftNest! I have a question.')}`}
          target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-all"
          style={{ background: '#25D366' }}>
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </>
  )
}

function FloatingButtons() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return <CraftNestChat />
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

