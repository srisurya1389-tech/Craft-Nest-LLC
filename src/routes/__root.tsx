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

  // ── Feature 9: Next available date ────────────────────────────────────────
  if (/next (free|available)|when.*next|earliest|soonest|first available|next open/.test(lower)) {
    try {
      const allSched = (JSON.parse(localStorage.getItem('craftnest_admin_data')||'{}') as Record<string,Record<string,{status:string;note:string;services?:string[]}>>) ['schedule'] ?? {}
      const now = new Date()
      const fmt = (d:Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      let found: {date:string; entry:{status:string;note:string;services?:string[]}} | null = null
      for (let i=0; i<90; i++) {
        const d = new Date(now); d.setDate(d.getDate()+i)
        const ds = fmt(d); const e = allSched[ds]
        if (e && (e.status==='free'||e.status==='limited')) { found = {date:ds, entry:e}; break }
      }
      if (found) {
        const [y,m,d] = found.date.split('-').map(Number)
        const disp = new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})
        const note = found.entry.note ? `\n\n📝 ${found.entry.note}` : ''
        const svcs = found.entry.services?.length ? `\n\n✅ Available: ${found.entry.services.join(', ')}` : ''
        const emoji = found.entry.status==='limited' ? '⚡' : '🎉'
        return { id, role:'bot',
          text: `${emoji} Our **next available date** is **${disp}**!${note}${svcs}\n\nWould you like to book it?`,
          links: [waLink(`Hi CraftNest! I'd like to book for ${disp}.`)],
          quick: ['Book on WhatsApp','Check Specific Date','Our Services'],
        }
      }
      return { id, role:'bot',
        text: `📅 We haven't set our upcoming schedule yet. Please reach out on WhatsApp and we'll find the best date for you! 😊`,
        links: [waLink('Hi CraftNest! I\'d like to know your next available date.')],
        quick: ['Contact Us','Our Services'],
      }
    } catch { /* fall through */ }
  }

  // ── Feature 10: Week availability overview ─────────────────────────────────
  if (/this week|week.*availab|availab.*week|schedule this week|what.*week|week.*schedul/.test(lower)) {
    try {
      const allSched = (JSON.parse(localStorage.getItem('craftnest_admin_data')||'{}') as Record<string,Record<string,{status:string;note:string}>>) ['schedule'] ?? {}
      const now = new Date()
      const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const SM: Record<string,string> = {free:'✅ Free',limited:'⚡ Limited',busy:'🔴 Busy',booked:'📅 Booked'}
      const lines: string[] = []
      for (let i=0; i<7; i++) {
        const d = new Date(now); d.setDate(d.getDate()+i)
        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        const e = allSched[ds]
        const label = `${WD[d.getDay()]} ${d.getDate()}`
        lines.push(`• **${label}** — ${e ? SM[e.status]??'📋 Set' : '⬜ Not set'}`)
      }
      return { id, role:'bot',
        text: `📅 **This Week's Availability:**\n\n${lines.join('\n')}\n\nWant to book a specific day?`,
        links: [waLink('Hi CraftNest! I\'d like to check this week\'s availability.')],
        quick: ['Book on WhatsApp','Next Available Date','Contact Us'],
      }
    } catch { /* fall through */ }
  }

  // ── Availability / schedule check (Feature 11: service-specific) ───────────
  const schedTriggers = ['free','available','busy','availability','schedule','book','slot','appointment','open','session','date','when']
  if (schedTriggers.some(w => lower.includes(w))) {
    const date = parseDate(lower)
    if (date) {
      const [y,m,d] = date.split('-').map(Number)
      const display  = new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})
      const entry    = getSched(date)

      // Feature 11: detect if asking about a specific service
      const svcMap: [RegExp, string][] = [
        [/face.?paint|paint|mehndi|henna/i, 'Face Painting'],
        [/jewel|necklace|earring|bracelet|bangle/i, 'Handmade Jewellery'],
        [/return.?gift|gift|favour|favor|keepsake/i, 'Return Gifts'],
      ]
      const askedSvc = svcMap.find(([rx]) => rx.test(lower))?.[1] ?? null

      if (!entry) return {
        id, role:'bot',
        text: `📅 **${display}**\n\nWe haven't set our schedule for that date yet. Please reach out on WhatsApp and we'll confirm availability for you right away! 😊`,
        links: [waLink(`Hi CraftNest! I'd like to check availability for ${display}.`)],
        quick: ['Check another date','Next Available Date','Contact Us'],
      }

      // Feature 11: service-specific availability check
      if (askedSvc && entry.services?.length) {
        const svcAvail = entry.services.includes(askedSvc)
        const emoji = svcAvail ? '✅' : '❌'
        const svcText = svcAvail
          ? `**${askedSvc}** is **available** on ${display}! 🎉`
          : `**${askedSvc}** is **not available** on ${display}. Available services that day: ${entry.services.length ? entry.services.join(', ') : 'none set'}.`
        const note = entry.note ? `\n\n📝 ${entry.note}` : ''
        return { id, role:'bot',
          text: `${emoji} ${svcText}${note}`,
          links: [waLink(`Hi CraftNest! I'd like to book ${askedSvc} for ${display}.`)],
          quick: ['Book on WhatsApp','Check Another Date','Our Services'],
        }
      }

      const map: Record<string,{e:string;t:string}> = {
        free:    {e:'🎉',t:`We are **free and available** on ${display}! We'd love to hear from you.`},
        limited: {e:'⚡',t:`We have **limited slots** on ${display}. Act fast to secure your booking!`},
        busy:    {e:'😔',t:`We're **busy** on ${display}. Please contact us to explore options or alternative dates.`},
        booked:  {e:'📅',t:`We are **fully booked** on ${display}. Contact us for the next available date.`},
      }
      const {e,t} = map[entry.status] ?? map.free
      const note  = entry.note     ? `\n\n📝 ${entry.note}` : ''
      const svcs  = entry.services?.length ? `\n\n✅ Available: ${entry.services.join(', ')}` : ''
      const ampm  = (entry as {amStatus?:string;pmStatus?:string}).amStatus || (entry as {amStatus?:string;pmStatus?:string}).pmStatus
        ? `\n\n🕐 Morning: ${(entry as {amStatus?:string}).amStatus ? map[(entry as {amStatus?:string}).amStatus!]?.e+' '+(entry as {amStatus?:string}).amStatus : 'same'} · Afternoon: ${(entry as {pmStatus?:string}).pmStatus ? (entry as {pmStatus?:string}).pmStatus : 'same'}` : ''
      return {
        id, role:'bot',
        text: `${e} ${t}${note}${svcs}${ampm}`,
        links: [waLink(`Hi CraftNest! I'd like to book for ${display}.`)],
        quick: entry.status==='free'||entry.status==='limited' ? ['Book on WhatsApp','Our Services'] : ['Next Available Date','Contact Us'],
      }
    }
    return {
      id, role:'bot',
      text: `📅 Sure! To check availability, just tell me the date — for example:\n\n• "Are you free on July 4th?"\n• "Is CraftNest available next Saturday?"\n• "Free for face painting on December 25?"\n\nI'll look it up instantly! 🙌`,
      quick: ['Are you free today?','Are you free tomorrow?','Next Available Date','Contact Us'],
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

  /* ── Logo SVG shared across header avatar & background watermark ── */
  const LogoSVG = ({ className, stroke, sw }: { className?: string; stroke: string; sw?: string }) => (
    <svg viewBox="0 0 100 80" className={className} fill="none" stroke={stroke} strokeWidth={sw ?? '2'} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z"/>
      <circle cx="37" cy="51" r="5.5"/><circle cx="23" cy="49" r="3.2"/>
      <circle cx="20" cy="40" r="3.2"/><circle cx="22" cy="31" r="3.2"/>
      <circle cx="28" cy="23" r="3.2"/><circle cx="36" cy="23" r="3.2"/>
      <circle cx="43" cy="27" r="3.2"/><circle cx="46" cy="35" r="3.2"/>
      <rect x="57.5" y="32" width="3" height="40" rx="1.5"/>
      <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z"/>
      <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z"/>
    </svg>
  )

  return (
    <>
      {/* ── Chat Panel ───────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-[88px] right-4 z-[998] w-[calc(100vw-32px)] sm:w-[430px] rounded-3xl overflow-hidden flex flex-col"
          style={{
            height: 'min(660px,calc(100dvh - 116px))',
            background: 'linear-gradient(160deg,#071D10 0%,#040F08 60%,#061508 100%)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.18), 0 0 60px rgba(201,168,76,0.04)',
          }}
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="relative shrink-0 overflow-hidden" style={{ background:'linear-gradient(135deg,#0D2A18 0%,#0A2014 50%,#071A10 100%)' }}>
            {/* Decorative corner glow */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 pointer-events-none"
              style={{ background:'radial-gradient(circle,#C9A84C,transparent 70%)' }}/>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10 pointer-events-none"
              style={{ background:'radial-gradient(circle,#C9A84C,transparent 70%)' }}/>

            <div className="relative flex items-center gap-3.5 px-5 py-4">
              {/* Avatar with full logo */}
              <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))', boxShadow:'0 0 0 1px rgba(201,168,76,0.25), 0 4px 12px rgba(0,0,0,0.4)' }}>
                <LogoSVG className="w-7 h-6" stroke="#C9A84C" sw="2.2"/>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold tracking-wide" style={{ color:'#E8C96B', fontFamily:'Georgia,serif' }}>CraftNest</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{ color:'#C9A84C', borderColor:'rgba(201,168,76,0.3)', background:'rgba(201,168,76,0.08)', letterSpacing:'0.05em' }}>AI Assistant</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"/>
                  <p className="text-[10px] text-white/40 tracking-wide">Online · Replies instantly</p>
                </div>
              </div>

              <button onClick={toggle}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Gold divider line */}
            <div className="h-px mx-5" style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),rgba(201,168,76,0.15),transparent)' }}/>
          </div>

          {/* ── Messages ────────────────────────────────────────────────── */}
          <div className="relative flex-1 overflow-y-auto min-h-0">
            {/* Logo watermark centred in messages area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex:0 }}>
              <div className="flex flex-col items-center gap-1 opacity-[0.04]">
                <LogoSVG className="w-52 h-44" stroke="#C9A84C" sw="1.5"/>
                <p className="text-[22px] font-bold tracking-[0.25em] uppercase" style={{ color:'#C9A84C', fontFamily:'Georgia,serif' }}>CraftNest</p>
              </div>
            </div>

            <div className="relative z-10 px-4 py-4 space-y-4">
              {msgs.map(msg => (
                <div key={msg.id} className={`flex ${msg.role==='user'?'justify-end':'justify-start'}`}>
                  {/* Bot avatar bubble */}
                  {msg.role==='bot' && (
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 mr-2"
                      style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))', boxShadow:'0 0 0 1px rgba(201,168,76,0.2)' }}>
                      <LogoSVG className="w-4 h-3.5" stroke="#C9A84C" sw="2.5"/>
                    </div>
                  )}

                  <div className={`max-w-[80%] space-y-2 flex flex-col ${msg.role==='user'?'items-end':'items-start'}`}>
                    {/* Bubble */}
                    <div className={`px-4 py-3 text-[12.5px] leading-relaxed
                      ${msg.role==='user'
                        ? 'text-[#04140E] font-semibold rounded-2xl rounded-br-sm'
                        : 'text-white/85 rounded-2xl rounded-bl-sm'}`}
                      style={msg.role==='user'
                        ? { background:'linear-gradient(135deg,#D4A843,#C9A84C)', boxShadow:'0 4px 16px rgba(201,168,76,0.35)' }
                        : { background:'rgba(13,42,24,0.92)', boxShadow:'0 2px 12px rgba(0,0,0,0.4)', border:'1px solid rgba(201,168,76,0.1)' }}>
                      {fmtText(msg.text)}
                    </div>

                    {/* Links */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="flex flex-col gap-2 w-full">
                        {msg.links.map((l, i) => (
                          <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl text-[11.5px] font-bold transition-all hover:scale-[1.02] hover:brightness-110 text-white"
                            style={l.style==='wa'
                              ? { background:'linear-gradient(135deg,#25D366,#128C7E)', boxShadow:'0 4px_14px rgba(37,211,102,0.35)' }
                              : l.style==='ig'
                              ? { background:'linear-gradient(135deg,#833AB4,#C13584,#E1306C,#F77737)', boxShadow:'0 4px 14px rgba(225,48,108,0.35)' }
                              : { background:'linear-gradient(135deg,#D4A843,#C9A84C)', boxShadow:'0 4px 14px rgba(201,168,76,0.35)', color:'#04140E' }}>
                            {l.label}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Quick reply chips */}
                    {msg.quick && msg.quick.length > 0 && msg.id === msgs[msgs.length-1].id && !typing && (
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {msg.quick.map((q, i) => (
                          <button key={i} onClick={() => send(q)}
                            className="text-[10.5px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer"
                            style={{ border:'1px solid rgba(201,168,76,0.25)', color:'rgba(201,168,76,0.75)', background:'rgba(201,168,76,0.04)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.12)'; (e.currentTarget as HTMLButtonElement).style.color='#C9A84C'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,168,76,0.5)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.04)'; (e.currentTarget as HTMLButtonElement).style.color='rgba(201,168,76,0.75)'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,168,76,0.25)' }}>
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
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-0.5"
                    style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))', boxShadow:'0 0 0 1px rgba(201,168,76,0.2)' }}>
                    <LogoSVG className="w-4 h-3.5" stroke="#C9A84C" sw="2.5"/>
                  </div>
                  <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                    style={{ background:'rgba(13,42,24,0.92)', border:'1px solid rgba(201,168,76,0.1)' }}>
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background:'#C9A84C', opacity:0.6, animationDelay:`${i*0.18}s` }}/>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>
          </div>

          {/* ── Input ───────────────────────────────────────────────────── */}
          <div className="shrink-0 px-4 py-3.5" style={{ background:'rgba(7,26,14,0.97)', boxShadow:'0 -1px 0 rgba(201,168,76,0.1)' }}>
            <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex items-center gap-2.5">
              <input ref={inputRef}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1 min-w-0 rounded-2xl px-4 py-3 text-[13px] text-white/90 placeholder-white/20 focus:outline-none transition-all"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.15)', boxShadow:'inset 0 1px 3px rgba(0,0,0,0.3)' }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor='rgba(201,168,76,0.45)'; (e.target as HTMLInputElement).style.boxShadow='inset 0 1px 3px rgba(0,0,0,0.3),0 0 0 3px rgba(201,168,76,0.06)' }}
                onBlur={e  => { (e.target as HTMLInputElement).style.borderColor='rgba(201,168,76,0.15)'; (e.target as HTMLInputElement).style.boxShadow='inset 0 1px 3px rgba(0,0,0,0.3)' }}
              />
              <button type="submit" disabled={!input.trim() || typing}
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-30 hover:brightness-110"
                style={{ background:'linear-gradient(135deg,#D4A843,#C9A84C)', boxShadow:'0 4px 14px rgba(201,168,76,0.4)' }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#04140E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <LogoSVG className="w-3 h-2.5 opacity-30" stroke="#C9A84C" sw="2.5"/>
              <p className="text-[9px] tracking-widest uppercase" style={{ color:'rgba(201,168,76,0.3)', letterSpacing:'0.12em' }}>CraftNest · Handcrafted with ♥</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating trigger buttons ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-4 z-[999] flex flex-col items-center gap-3">
        {/* Chat toggle */}
        <button onClick={toggle} title="Chat with CraftNest"
          className="relative w-13 h-13 rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
          style={{
            width: '52px', height: '52px',
            background: open ? 'linear-gradient(135deg,#D4A843,#C9A84C)' : 'linear-gradient(135deg,#0D2A18,#071A10)',
            boxShadow: open
              ? '0 4px 24px rgba(201,168,76,0.5), 0 0 0 1px rgba(201,168,76,0.4)'
              : '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.2)',
          }}>
          {!open ? (
            <LogoSVG className="w-7 h-6" stroke="#C9A84C" sw="2.2"/>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#04140E" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          )}
          {unread > 0 && !open && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border-2 border-[#04140E] flex items-center justify-center text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {/* WhatsApp */}
        <a href={`https://wa.me/${getWA()}?text=${encodeURIComponent('Hi CraftNest! I have a question.')}`}
          target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp"
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg duration-200 ease-out hover:shadow-[0_4px_20px_rgba(37,211,102,0.4)] group"
          style={{ background: '#25D366' }}>
          <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12.004 2c-5.51 0-9.99 4.49-9.99 10 0 2 .59 3.88 1.61 5.47l-1.07 3.93 4.07-1.07c1.51.82 3.22 1.29 5.02 1.29 5.51 0 10-4.49 10-10s-4.49-10-10-10zm6.5 13.91c-.24.67-1.18 1.24-1.92 1.32-.51.05-1.18.08-3.41-.85-2.85-1.18-4.69-4.08-4.83-4.27-.14-.19-1.15-1.53-1.15-2.92S7.92 7.4 8.16 7.15c.24-.24.52-.31.7-.31.17 0 .34.01.49.02.16.01.37-.06.57.43.2.5.7 1.7.76 1.83.06.13.1.28.01.46-.09.18-.14.29-.28.45-.14.16-.3.36-.43.48-.15.14-.31.3-.13.61.18.31.8 1.31 1.71 2.12.91.81 1.67 1.06 2.05 1.25.31.16.49.14.67-.06.19-.22.82-.95 1.04-1.28.22-.33.45-.28.76-.16.31.12 1.97.93 2.31 1.1.34.17.57.25.65.39.09.14.09.82-.15 1.49z"/>
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

