import { defaultProducts, defaultGallery, type AdminData, type Product, type GalleryItem } from './defaultData'

const STORAGE_KEY = 'craftnest_admin_data'

export type { AdminData, Product, GalleryItem }

export function getAdminData(): AdminData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as AdminData
  } catch {}
  return { products: defaultProducts, gallery: defaultGallery }
}

export function saveAdminData(data: AdminData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getProducts(category: 'jewellery' | 'gifts' | 'painting'): Product[] {
  return getAdminData().products[category]
}

export function addProduct(category: 'jewellery' | 'gifts' | 'painting', product: Omit<Product, 'id'>): void {
  const data = getAdminData()
  const id = `${category[0]}_${Date.now()}`
  data.products[category] = [...data.products[category], { ...product, id }]
  saveAdminData(data)
}

export function updateProduct(category: 'jewellery' | 'gifts' | 'painting', updated: Product): void {
  const data = getAdminData()
  data.products[category] = data.products[category].map(p => p.id === updated.id ? updated : p)
  saveAdminData(data)
}

export function deleteProduct(category: 'jewellery' | 'gifts' | 'painting', id: string): void {
  const data = getAdminData()
  data.products[category] = data.products[category].filter(p => p.id !== id)
  saveAdminData(data)
}

export function addGalleryItem(item: Omit<GalleryItem, 'id'>): void {
  const data = getAdminData()
  const id = `gal_${Date.now()}`
  data.gallery = [...data.gallery, { ...item, id }]
  saveAdminData(data)
}

export function deleteGalleryItem(id: string): void {
  const data = getAdminData()
  data.gallery = data.gallery.filter(g => g.id !== id)
  saveAdminData(data)
}

export function resetToDefaults(): void {
  localStorage.removeItem(STORAGE_KEY)
}
