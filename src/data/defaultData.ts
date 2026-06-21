export type Product = {
  id: string
  title: string
  badge: string
  desc: string
  price: string
  img: string
  occasion: string
  visible: boolean
  featured: boolean
  stock: 'available' | 'out-of-stock' | 'made-to-order' | 'limited'
  whatsappMsg: string
}

export type GalleryItem = {
  id: string
  src: string
  category: 'events' | 'arts' | 'other'
  caption: string
}

export type SiteSettings = {
  whatsappNumber: string
  instagramUrl: string
  facebookUrl: string
  announcementEnabled: boolean
  announcementText: string
  cloudinaryPreset: string
  cloudinaryCloud: string
}

export type ScheduleStatus = 'free' | 'busy' | 'limited' | 'booked'
export type ScheduleEntry = {
  date: string
  status: ScheduleStatus
  note: string
  services: string[]
  amStatus?: ScheduleStatus
  pmStatus?: ScheduleStatus
}

export type ExtraService = {
  id: string
  name: string
  emoji: string
  price: string
  description: string
  img: string
  whatsappMsg: string
  visible: boolean
}

export type WebSectionType = 'testimonials' | 'faq' | 'stats' | 'process' | 'cta'

export type WebSectionItem = {
  id: string
  label: string
  value?: string
  body?: string
  emoji?: string
  rating?: number
  img?: string
}

export type WebSection = {
  id: string
  type: WebSectionType
  layout: string
  heading: string
  subheading: string
  visible: boolean
  items: WebSectionItem[]
  ctaBtnText?: string
  ctaBtnWaMsg?: string
  ctaBgImg?: string
}

export type AdminData = {
  products: {
    jewellery: Product[]
    gifts: Product[]
    painting: Product[]
  }
  gallery: GalleryItem[]
  heroImages: string[]
  settings: SiteSettings
  schedule: Record<string, ScheduleEntry>
  extraServices: ExtraService[]
  extraServicesTemplate: 'mosaic' | 'strips' | 'showcase' | 'cards' | 'carousel'
  webSections: WebSection[]
}

export const defaultSettings: SiteSettings = {
  whatsappNumber: '14704527988',
  instagramUrl: '',
  facebookUrl: '',
  announcementEnabled: false,
  announcementText: '🎉 Free gifting on orders above ₹1000 · Limited time offer!',
  cloudinaryPreset: '',
  cloudinaryCloud: 'diancfp03',
}

export const defaultHeroImages: string[] = [
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.05.47_AM_6_zqnnzf.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_1_apkkry.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_yjrp0j.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_2_noq9ou.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_3_lerit5.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-11_at_9.05.47_AM_gkzub9.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_11_eomsmr.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-11_at_9.05.47_AM_3_iax90h.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_1_goilu2.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.05.47_AM_5_io41wh.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_2_bc00k5.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_7_easj0i.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289144/WhatsApp_Image_2026-06-11_at_9.05.47_AM_2_cermbl.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_2_pfm5vm.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.38.26_PM_ohjhxt.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781289149/WhatsApp_Image_2026-06-11_at_9.05.47_AM_4_h8ktwz.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702111/WhatsApp_Image_2026-06-15_at_11.37.40_PM_2_zysiib.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_5_uqlyui.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_wbpr2w.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_3_xpszqo.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.37.40_PM_4_suwo3v.jpg',
  'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_1_ldq5qt.jpg',
]

const p = (id: string, title: string, badge: string, desc: string, img: string): Product => ({
  id, title, badge, desc, price: '', img, occasion: '',
  visible: true, featured: false, stock: 'available', whatsappMsg: '',
})

export const defaultProducts: AdminData['products'] = {
  jewellery: [
    p('j_0',  'Handmade Jewellery', 'Bestseller', 'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812600/WhatsApp_Image_2026-06-18_at_5.58.15_PM_22_huedrg.jpg'),
    p('j_1',  'Handmade Jewellery', 'Popular',    'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812600/WhatsApp_Image_2026-06-18_at_5.58.15_PM_21_hxhpgo.jpg'),
    p('j_2',  'Handmade Jewellery', 'Bridal',     'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812602/WhatsApp_Image_2026-06-18_at_5.58.15_PM_20_irxvay.jpg'),
    p('j_3',  'Handmade Jewellery', 'Festival',   'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812603/WhatsApp_Image_2026-06-18_at_5.58.15_PM_19_ai3go9.jpg'),
    p('j_4',  'Handmade Jewellery', 'New',        'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812603/WhatsApp_Image_2026-06-18_at_5.58.15_PM_18_xybyot.jpg'),
    p('j_5',  'Handmade Jewellery', 'Bestseller', 'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812604/WhatsApp_Image_2026-06-18_at_5.58.15_PM_17_tjt3ag.jpg'),
    p('j_6',  'Handmade Jewellery', 'Custom',     'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812605/WhatsApp_Image_2026-06-18_at_5.58.15_PM_16_q9834k.jpg'),
    p('j_7',  'Handmade Jewellery', 'Bridal',     'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812606/WhatsApp_Image_2026-06-18_at_5.58.15_PM_15_gfhjid.jpg'),
    p('j_8',  'Handmade Jewellery', 'Popular',    'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812607/WhatsApp_Image_2026-06-18_at_5.58.15_PM_14_xyzf55.jpg'),
    p('j_9',  'Handmade Jewellery', 'New',        'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812608/WhatsApp_Image_2026-06-18_at_5.58.15_PM_13_csmprq.jpg'),
    p('j_10', 'Handmade Jewellery', 'Popular',    'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812649/WhatsApp_Image_2026-06-18_at_5.58.15_PM_12_gzijby.jpg'),
    p('j_11', 'Handmade Jewellery', 'Festival',   'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812652/WhatsApp_Image_2026-06-18_at_5.58.15_PM_11_cq8upa.jpg'),
    p('j_12', 'Handmade Jewellery', 'Bestseller', 'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812653/WhatsApp_Image_2026-06-18_at_5.58.15_PM_10_dnyfmj.jpg'),
    p('j_13', 'Handmade Jewellery', 'Custom',     'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812654/WhatsApp_Image_2026-06-18_at_5.58.15_PM_9_ysy6aw.jpg'),
    p('j_14', 'Handmade Jewellery', 'New',        'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812655/WhatsApp_Image_2026-06-18_at_5.58.15_PM_8_xtligu.jpg'),
    p('j_15', 'Handmade Jewellery', 'Bridal',     'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812656/WhatsApp_Image_2026-06-18_at_5.58.15_PM_7_jkz8uo.jpg'),
    p('j_16', 'Handmade Jewellery', 'Popular',    'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812657/WhatsApp_Image_2026-06-18_at_5.58.15_PM_6_sdkv5z.jpg'),
    p('j_17', 'Handmade Jewellery', 'Festival',   'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812658/WhatsApp_Image_2026-06-18_at_5.58.15_PM_5_nzta8o.jpg'),
    p('j_18', 'Handmade Jewellery', 'New',        'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812659/WhatsApp_Image_2026-06-18_at_5.58.15_PM_4_aowfb7.jpg'),
    p('j_19', 'Handmade Jewellery', 'Custom',     'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812660/WhatsApp_Image_2026-06-18_at_5.58.15_PM_3_x8rt4m.jpg'),
    p('j_20', 'Handmade Jewellery', 'Bestseller', 'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812661/WhatsApp_Image_2026-06-18_at_5.58.15_PM_2_fuehvs.jpg'),
    p('j_21', 'Handmade Jewellery', 'Popular',    'Artisan-crafted jewellery piece with unique detailing — a timeless handmade accessory for every occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781812665/WhatsApp_Image_2026-06-18_at_5.58.13_PM_jkwvb4.jpg'),
  ],
  gifts: [
    p('g_0',  'Return Gift', 'Bestseller',  'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703432/WhatsApp_Image_2026-06-15_at_11.44.38_PM_rrjcsk.jpg'),
    p('g_1',  'Return Gift', 'Bestseller',  'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_17_jtud4w.jpg'),
    p('g_2',  'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_12_ljakzf.jpg'),
    p('g_3',  'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703464/WhatsApp_Image_2026-06-15_at_11.44.39_PM_16_zxyqct.jpg'),
    p('g_4',  'Return Gift', 'New',         'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_14_nkiamc.jpg'),
    p('g_5',  'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_13_vzch7z.jpg'),
    p('g_6',  'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703466/WhatsApp_Image_2026-06-15_at_11.44.39_PM_5_fp5ev6.jpg'),
    p('g_7',  'Return Gift', 'Bestseller',  'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703470/WhatsApp_Image_2026-06-15_at_11.44.39_PM_11_ut0qm5.jpg'),
    p('g_8',  'Return Gift', 'Custom',      'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703472/WhatsApp_Image_2026-06-15_at_11.44.39_PM_15_psm5z7.jpg'),
    p('g_9',  'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703473/WhatsApp_Image_2026-06-15_at_11.44.39_PM_4_urdkmz.jpg'),
    p('g_10', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703474/WhatsApp_Image_2026-06-15_at_11.44.39_PM_6_ffkcw3.jpg'),
    p('g_11', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_9_okeqny.jpg'),
    p('g_12', 'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_10_wuurwg.jpg'),
    p('g_13', 'Return Gift', 'New',         'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703481/WhatsApp_Image_2026-06-15_at_11.44.39_PM_8_o6edty.jpg'),
    p('g_14', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703482/WhatsApp_Image_2026-06-15_at_11.44.39_PM_7_jghcyy.jpg'),
    p('g_15', 'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_3_ogkcmu.jpg'),
    p('g_16', 'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.38_PM_17_lpewy6.jpg'),
    p('g_17', 'Return Gift', 'New',         'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_1_u3xdrk.jpg'),
    p('g_18', 'Return Gift', 'Bestseller',  'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_12_akfzuq.jpg'),
    p('g_19', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_16_u6zdtb.jpg'),
    p('g_20', 'Return Gift', 'Custom',      'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703490/WhatsApp_Image_2026-06-15_at_11.44.38_PM_13_v03xkv.jpg'),
    p('g_21', 'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.39_PM_rbq9hh.jpg'),
    p('g_22', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703493/WhatsApp_Image_2026-06-15_at_11.44.38_PM_10_fnjykf.jpg'),
    p('g_23', 'Return Gift', 'New',         'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703500/WhatsApp_Image_2026-06-15_at_11.44.38_PM_4_smujcn.jpg'),
    p('g_24', 'Return Gift', 'Custom',      'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703498/WhatsApp_Image_2026-06-15_at_11.44.38_PM_5_jzajky.jpg'),
    p('g_25', 'Return Gift', 'Bestseller',  'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_9_ccmlvt.jpg'),
    p('g_26', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_7_v0ft5e.jpg'),
    p('g_27', 'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703495/WhatsApp_Image_2026-06-15_at_11.44.38_PM_15_ksfmdn.jpg'),
    p('g_28', 'Return Gift', 'New',         'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703494/WhatsApp_Image_2026-06-15_at_11.44.38_PM_11_c76arm.jpg'),
    p('g_29', 'Return Gift', 'Custom',      'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703501/WhatsApp_Image_2026-06-15_at_11.44.38_PM_6_y9ykiz.jpg'),
    p('g_30', 'Return Gift', 'Bestseller',  'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703502/WhatsApp_Image_2026-06-15_at_11.44.38_PM_3_hiqswu.jpg'),
    p('g_31', 'Return Gift', 'New',         'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703503/WhatsApp_Image_2026-06-15_at_11.44.38_PM_8_es76b1.jpg'),
    p('g_32', 'Return Gift', 'Popular',     'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_1_reku6q.jpg'),
    p('g_33', 'Return Gift', 'Custom',      'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_2_dh8mzk.jpg'),
    p('g_34', 'Return Gift', 'Traditional', 'Beautifully handcrafted return gift — a cherished keepsake your guests will treasure long after the celebration ends.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781703505/WhatsApp_Image_2026-06-15_at_11.44.38_PM_14_fnib9m.jpg'),
  ],
  painting: [
    p('p_0', 'Face Painting', 'Bestseller', 'Vibrant hand-painted design — colourful, detailed and perfect for parties and festive gatherings of all ages.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810979/WhatsApp_Image_2026-06-18_at_6.08.21_PM_2_uckpwc.jpg'),
    p('p_1', 'Face Painting', 'Popular',    'Eye-catching face design with bold colours and intricate detailing — a crowd-pleaser at every celebration and event.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810978/WhatsApp_Image_2026-06-18_at_6.08.21_PM_6_cafst9.jpg'),
    p('p_2', 'Face Painting', 'New',        'Creative face painting with vivid details — a timeless and elegant favourite for all age groups.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810980/WhatsApp_Image_2026-06-18_at_6.08.21_PM_jp5gnu.jpg'),
    p('p_3', 'Face Painting', 'Popular',    'Delicate painted design with pastel shades — a charming look for weddings, parties and festive occasions.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810978/WhatsApp_Image_2026-06-18_at_6.08.21_PM_4_mypyus.jpg'),
    p('p_4', 'Face Painting', 'Festival',   'Artistic face painting design with flowing motifs — graceful and perfect for cultural events and festivals.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810978/WhatsApp_Image_2026-06-18_at_6.08.21_PM_5_j7zcsc.jpg'),
    p('p_5', 'Face Painting', 'Adults',     'Sophisticated face painting design in vivid tones — glamorous and eye-catching for evening events and celebrations.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810978/WhatsApp_Image_2026-06-18_at_6.08.21_PM_3_dlojsf.jpg'),
    p('p_6', 'Face Painting', 'New',        'Unique and artistic face painting with rich colours — custom-made for standout looks at every event and occasion.', 'https://res.cloudinary.com/diancfp03/image/upload/v1781810981/WhatsApp_Image_2026-06-18_at_6.08.20_PM_mjsfet.jpg'),
  ],
}

export const defaultGallery: GalleryItem[] = [
  { id: 'gal_0',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.05.47_AM_6_zqnnzf.jpg',   category: 'events', caption: 'Birthday Celebration' },
  { id: 'gal_1',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_1_apkkry.jpg',   category: 'arts',   caption: 'Handcraft Creation' },
  { id: 'gal_2',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_yjrp0j.jpg',    category: 'other',  caption: 'CraftNest Studio' },
  { id: 'gal_3',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_2_noq9ou.jpg',  category: 'events', caption: 'Festival Event' },
  { id: 'gal_4',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_3_lerit5.jpg',  category: 'arts',   caption: 'Artisan Detail' },
  { id: 'gal_5',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-11_at_9.05.47_AM_gkzub9.jpg',   category: 'events', caption: 'Party Moments' },
  { id: 'gal_6',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_11_eomsmr.jpg', category: 'arts',   caption: 'Craft Workshop' },
  { id: 'gal_7',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-11_at_9.05.47_AM_3_iax90h.jpg', category: 'other',  caption: 'Behind the Scenes' },
  { id: 'gal_8',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_1_goilu2.jpg', category: 'events', caption: 'Live Face Painting' },
  { id: 'gal_9',   src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.05.47_AM_5_io41wh.jpg', category: 'arts',   caption: 'Handmade Gifts' },
  { id: 'gal_10',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_2_bc00k5.jpg', category: 'other',  caption: 'Craft Collection' },
  { id: 'gal_11',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_7_easj0i.jpg', category: 'events', caption: 'School Event' },
  { id: 'gal_12',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289144/WhatsApp_Image_2026-06-11_at_9.05.47_AM_2_cermbl.jpg', category: 'arts',   caption: 'Mandala Art' },
  { id: 'gal_13',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_2_pfm5vm.jpg', category: 'other',  caption: 'Custom Creations' },
  { id: 'gal_14',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289149/WhatsApp_Image_2026-06-11_at_9.05.47_AM_4_h8ktwz.jpg', category: 'events', caption: 'Family Celebration' },
  { id: 'gal_15',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702111/WhatsApp_Image_2026-06-15_at_11.37.40_PM_2_zysiib.jpg', category: 'arts',  caption: 'Jewellery Craft' },
  { id: 'gal_16',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_5_uqlyui.jpg', category: 'other', caption: 'Pooja & Event Décor' },
  { id: 'gal_80',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_10_rn5joh.jpg', category: 'arts',  caption: 'Lippan Art Creation' },
  { id: 'gal_84',  src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_7_qr5oqb.jpg',  category: 'arts',  caption: 'Mandala Art' },
  { id: 'gal_104', src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777393/WhatsApp_Image_2026-06-15_at_10.15.52_PM_3_bpnfpb.jpg', category: 'arts',  caption: 'Mehandi Design' },
  { id: 'gal_117', src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781810979/WhatsApp_Image_2026-06-18_at_6.08.21_PM_2_uckpwc.jpg',  category: 'arts',  caption: 'Floral Face Art' },
  { id: 'gal_138', src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781812600/WhatsApp_Image_2026-06-18_at_5.58.15_PM_22_huedrg.jpg',  category: 'arts',  caption: 'Terracotta Bead Necklace' },
  { id: 'gal_132', src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781784946/WhatsApp_Image_2026-06-18_at_5.32.51_PM_1_ccrv0f.jpg',  category: 'arts',  caption: 'Canvas Painting' },
]
