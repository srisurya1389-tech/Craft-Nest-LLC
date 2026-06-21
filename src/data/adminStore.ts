import {
  defaultProducts, defaultGallery, defaultHeroImages, defaultSettings,
  type AdminData, type Product, type GalleryItem, type SiteSettings,
  type ScheduleEntry, type ScheduleStatus, type ExtraService,
} from './defaultData'

export type { AdminData, Product, GalleryItem, SiteSettings, ScheduleEntry, ScheduleStatus, ExtraService }

const KEY = 'craftnest_admin_data'

export function getAdminData(): AdminData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AdminData
      // migrate older data that lacks new fields
      for (const cat of ['jewellery', 'gifts', 'painting'] as const) {
        parsed.products[cat] = parsed.products[cat].map(p => ({
          ...p,
          visible:     p.visible     ?? true,
          featured:    p.featured    ?? false,
          stock:       p.stock       ?? ('available' as const),
          whatsappMsg: p.whatsappMsg ?? '',
        }))
      }
      if (!parsed.heroImages)              parsed.heroImages             = defaultHeroImages
      if (!parsed.settings)               parsed.settings              = defaultSettings
      if (!parsed.schedule)               parsed.schedule              = {}
      if (!parsed.extraServices)          parsed.extraServices         = []
      if (!parsed.extraServicesTemplate)  parsed.extraServicesTemplate = 'mosaic'
      return parsed
    }
  } catch {}
  return { products: defaultProducts, gallery: defaultGallery, heroImages: defaultHeroImages, settings: defaultSettings, schedule: {}, extraServices: [], extraServicesTemplate: 'mosaic' }
}

export function saveAdminData(data: AdminData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

// ── Products ────────────────────────────────────────────────────────────────

export type Category = 'jewellery' | 'gifts' | 'painting'

export function getProducts(cat: Category): Product[] {
  return getAdminData().products[cat]
}

export function addProduct(cat: Category, product: Omit<Product, 'id'>): void {
  const data = getAdminData()
  data.products[cat] = [...data.products[cat], { ...product, id: `${cat[0]}_${Date.now()}` }]
  saveAdminData(data)
}

export function updateProduct(cat: Category, updated: Product): void {
  const data = getAdminData()
  data.products[cat] = data.products[cat].map(p => p.id === updated.id ? updated : p)
  saveAdminData(data)
}

export function deleteProduct(cat: Category, id: string): void {
  const data = getAdminData()
  data.products[cat] = data.products[cat].filter(p => p.id !== id)
  saveAdminData(data)
}

export function reorderProducts(cat: Category, ordered: Product[]): void {
  const data = getAdminData()
  data.products[cat] = ordered
  saveAdminData(data)
}

// ── Gallery ─────────────────────────────────────────────────────────────────

export function addGalleryItem(item: Omit<GalleryItem, 'id'>): void {
  const data = getAdminData()
  data.gallery = [...data.gallery, { ...item, id: `gal_${Date.now()}` }]
  saveAdminData(data)
}

export function deleteGalleryItem(id: string): void {
  const data = getAdminData()
  data.gallery = data.gallery.filter(g => g.id !== id)
  saveAdminData(data)
}

// ── Hero Images ──────────────────────────────────────────────────────────────

export function addHeroImage(url: string): void {
  const data = getAdminData()
  data.heroImages = [...data.heroImages, url]
  saveAdminData(data)
}

export function removeHeroImage(url: string): void {
  const data = getAdminData()
  data.heroImages = data.heroImages.filter(u => u !== url)
  saveAdminData(data)
}

export function reorderHeroImages(images: string[]): void {
  const data = getAdminData()
  data.heroImages = images
  saveAdminData(data)
}

// ── Settings ─────────────────────────────────────────────────────────────────

export function getSettings(): SiteSettings {
  return getAdminData().settings
}

export function saveSettings(settings: SiteSettings): void {
  const data = getAdminData()
  data.settings = settings
  saveAdminData(data)
}

// ── Cloudinary Upload ────────────────────────────────────────────────────────

export async function uploadToCloudinary(file: File): Promise<string> {
  const settings = getSettings()
  if (!settings.cloudinaryPreset) throw new Error('No Cloudinary upload preset configured in Settings.')
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', settings.cloudinaryPreset)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${settings.cloudinaryCloud}/image/upload`, {
    method: 'POST', body: fd,
  })
  if (!res.ok) throw new Error('Upload failed')
  const json = await res.json() as { secure_url: string }
  return json.secure_url
}

// ── CSV Export ────────────────────────────────────────────────────────────────

export function exportProductsCSV(): void {
  const data = getAdminData()
  const rows = [['Category', 'Title', 'Badge', 'Price', 'Stock', 'Visible', 'Featured', 'Description', 'Image URL']]
  for (const [cat, products] of Object.entries(data.products)) {
    for (const p of products as Product[]) {
      rows.push([cat, p.title, p.badge, p.price, p.stock, String(p.visible), String(p.featured), p.desc, p.img])
    }
  }
  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `craftnest-products-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Schedule ──────────────────────────────────────────────────────────────────

export function getSchedule(): Record<string, ScheduleEntry> {
  return getAdminData().schedule ?? {}
}

export function setScheduleEntry(entry: ScheduleEntry): void {
  const data = getAdminData()
  if (!data.schedule) data.schedule = {}
  data.schedule[entry.date] = entry
  saveAdminData(data)
}

export function removeScheduleEntry(date: string): void {
  const data = getAdminData()
  if (!data.schedule) return
  delete data.schedule[date]
  saveAdminData(data)
}

// ── Extra Services ─────────────────────────────────────────────────────────────

export function addExtraService(svc: Omit<ExtraService, 'id'>): void {
  const data = getAdminData()
  data.extraServices.push({ ...svc, id: `svc_${Date.now()}` })
  saveAdminData(data)
}

export function updateExtraService(svc: ExtraService): void {
  const data = getAdminData()
  data.extraServices = data.extraServices.map(s => s.id === svc.id ? svc : s)
  saveAdminData(data)
}

export function deleteExtraService(id: string): void {
  const data = getAdminData()
  data.extraServices = data.extraServices.filter(s => s.id !== id)
  saveAdminData(data)
}

export function setExtraServicesTemplate(t: 'mosaic' | 'strips' | 'showcase'): void {
  const data = getAdminData()
  data.extraServicesTemplate = t
  saveAdminData(data)
}

// ── Reset ─────────────────────────────────────────────────────────────────────

export function resetToDefaults(): void {
  localStorage.removeItem(KEY)
}
