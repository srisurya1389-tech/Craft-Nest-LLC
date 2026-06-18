import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingBag, ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCart } from '../context/CartContext'

export const Route = createFileRoute('/')({
  component: Home,
})

const heroReelImages = [
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.05.47_AM_6_zqnnzf.jpg",   // 0
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_1_apkkry.jpg",   // 1
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_yjrp0j.jpg",    // 2
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_2_noq9ou.jpg",  // 3
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_3_lerit5.jpg",  // 4
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-11_at_9.05.47_AM_gkzub9.jpg",   // 5
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_11_eomsmr.jpg",// 6
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-11_at_9.05.47_AM_3_iax90h.jpg", // 7
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_1_goilu2.jpg", // 8
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.05.47_AM_5_io41wh.jpg", // 9
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_2_bc00k5.jpg", // 10
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_7_easj0i.jpg", // 11
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289144/WhatsApp_Image_2026-06-11_at_9.05.47_AM_2_cermbl.jpg", // 12
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_2_pfm5vm.jpg", // 13
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.38.26_PM_ohjhxt.jpg",  // 14 — pooja
  "https://res.cloudinary.com/diancfp03/image/upload/v1781289149/WhatsApp_Image_2026-06-11_at_9.05.47_AM_4_h8ktwz.jpg", // 15
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702111/WhatsApp_Image_2026-06-15_at_11.37.40_PM_2_zysiib.jpg",// 16 — pooja
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_5_uqlyui.jpg",// 17 — pooja
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_wbpr2w.jpg",  // 18 — pooja
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_3_xpszqo.jpg",// 19 — pooja
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.37.40_PM_4_suwo3v.jpg",// 20 — pooja
  "https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_1_ldq5qt.jpg",// 21 — pooja
];

// Distinct permutations across all 22 images so each column shows a unique order
const reel1Images = [
  heroReelImages[0],  heroReelImages[3],  heroReelImages[6],  heroReelImages[9],
  heroReelImages[12], heroReelImages[15], heroReelImages[17], heroReelImages[1],
  heroReelImages[4],  heroReelImages[7],  heroReelImages[10], heroReelImages[13],
  heroReelImages[16], heroReelImages[19], heroReelImages[2],  heroReelImages[5],
  heroReelImages[8],  heroReelImages[11], heroReelImages[14], heroReelImages[18],
  heroReelImages[20], heroReelImages[21],
];

const reel2Images = [
  heroReelImages[5],  heroReelImages[10], heroReelImages[15], heroReelImages[0],
  heroReelImages[18], heroReelImages[8],  heroReelImages[13], heroReelImages[3],
  heroReelImages[20], heroReelImages[6],  heroReelImages[11], heroReelImages[16],
  heroReelImages[1],  heroReelImages[19], heroReelImages[9],  heroReelImages[14],
  heroReelImages[4],  heroReelImages[21], heroReelImages[7],  heroReelImages[12],
  heroReelImages[17], heroReelImages[2],
];

const reel3Images = [
  heroReelImages[11], heroReelImages[4],  heroReelImages[19], heroReelImages[7],
  heroReelImages[14], heroReelImages[2],  heroReelImages[21], heroReelImages[9],
  heroReelImages[16], heroReelImages[5],  heroReelImages[20], heroReelImages[0],
  heroReelImages[13], heroReelImages[8],  heroReelImages[18], heroReelImages[3],
  heroReelImages[15], heroReelImages[10], heroReelImages[6],  heroReelImages[17],
  heroReelImages[1],  heroReelImages[12],
];

type GalleryCat = 'all' | 'events' | 'arts' | 'other'
const GALLERY_ITEMS: { id: number; src: string; category: Exclude<GalleryCat, 'all'>; caption: string }[] = [
  { id: 0,  src: heroReelImages[0],  category: 'events', caption: 'Birthday Celebration' },
  { id: 1,  src: heroReelImages[1],  category: 'arts',   caption: 'Handcraft Creation' },
  { id: 2,  src: heroReelImages[2],  category: 'other',  caption: 'CraftNest Studio' },
  { id: 3,  src: heroReelImages[3],  category: 'events', caption: 'Festival Event' },
  { id: 4,  src: heroReelImages[4],  category: 'arts',   caption: 'Artisan Detail' },
  { id: 5,  src: heroReelImages[5],  category: 'events', caption: 'Party Moments' },
  { id: 6,  src: heroReelImages[6],  category: 'arts',   caption: 'Craft Workshop' },
  { id: 7,  src: heroReelImages[7],  category: 'other',  caption: 'Behind the Scenes' },
  { id: 8,  src: heroReelImages[8],  category: 'events', caption: 'Live Face Painting' },
  { id: 9,  src: heroReelImages[9],  category: 'arts',   caption: 'Handmade Gifts' },
  { id: 10, src: heroReelImages[10], category: 'other',  caption: 'Craft Collection' },
  { id: 11, src: heroReelImages[11], category: 'events', caption: 'School Event' },
  { id: 12, src: heroReelImages[12], category: 'arts',   caption: 'Mandala Art' },
  { id: 13, src: heroReelImages[13], category: 'other',  caption: 'Custom Creations' },
  { id: 14, src: heroReelImages[15], category: 'events', caption: 'Family Celebration' },
  { id: 15, src: heroReelImages[16], category: 'arts',   caption: 'Jewellery Craft' },
  { id: 16, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_5_uqlyui.jpg',  category: 'other', caption: 'Pooja & Event Décor' },
  { id: 17, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_wbpr2w.jpg',    category: 'other', caption: 'Festive Event Props' },
  { id: 18, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_3_xpszqo.jpg',  category: 'other', caption: 'Sacred Pooja Items' },
  { id: 19, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.37.40_PM_4_suwo3v.jpg',  category: 'other', caption: 'Celebration Rentals' },
  { id: 20, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_1_ldq5qt.jpg',  category: 'other', caption: 'Décor & Accessories' },
  { id: 21, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.38.26_PM_ohjhxt.jpg',    category: 'other', caption: 'Pooja Rental Collection' },
  { id: 22, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702111/WhatsApp_Image_2026-06-15_at_11.37.40_PM_2_zysiib.jpg',  category: 'other', caption: 'Event Décor Rental' },
  { id: 23, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703432/WhatsApp_Image_2026-06-15_at_11.44.38_PM_rrjcsk.jpg',    category: 'other', caption: 'Handcrafted Return Gift' },
  { id: 24, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703458/WhatsApp_Image_2026-06-15_at_11.45.59_PM_pq4sd9.jpg',    category: 'arts',  caption: 'Handmade Hair Accessory' },
  { id: 26, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_17_jtud4w.jpg', category: 'other', caption: 'Wedding Return Gift' },
  { id: 27, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_12_ljakzf.jpg', category: 'other', caption: 'Festival Keepsake' },
  { id: 28, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703464/WhatsApp_Image_2026-06-15_at_11.44.39_PM_16_zxyqct.jpg', category: 'other', caption: 'Personalised Gift' },
  { id: 29, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_14_nkiamc.jpg', category: 'other', caption: 'Artisan Gift Box' },
  { id: 30, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_13_vzch7z.jpg', category: 'other', caption: 'Bespoke Keepsake' },
  { id: 31, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703466/WhatsApp_Image_2026-06-15_at_11.44.39_PM_5_fp5ev6.jpg',  category: 'other', caption: 'Celebration Gift' },
  { id: 32, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703470/WhatsApp_Image_2026-06-15_at_11.44.39_PM_11_ut0qm5.jpg', category: 'other', caption: 'Handmade Memento' },
  { id: 33, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703472/WhatsApp_Image_2026-06-15_at_11.44.39_PM_15_psm5z7.jpg', category: 'other', caption: 'Gifting Collection' },
  { id: 34, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703473/WhatsApp_Image_2026-06-15_at_11.44.39_PM_4_urdkmz.jpg',  category: 'other', caption: 'Premium Return Gift' },
  { id: 35, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703474/WhatsApp_Image_2026-06-15_at_11.44.39_PM_6_ffkcw3.jpg',  category: 'other', caption: 'Curated Keepsake' },
  { id: 36, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_9_okeqny.jpg',  category: 'other', caption: 'Event Return Gift' },
  { id: 37, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_10_wuurwg.jpg', category: 'other', caption: 'Custom Gift Pack' },
  { id: 38, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703481/WhatsApp_Image_2026-06-15_at_11.44.39_PM_8_o6edty.jpg',  category: 'other', caption: 'Luxury Keepsake' },
  { id: 39, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703482/WhatsApp_Image_2026-06-15_at_11.44.39_PM_7_jghcyy.jpg',  category: 'other', caption: 'Gift Craft' },
  { id: 40, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_3_ogkcmu.jpg',  category: 'other', caption: 'Artisan Keepsake' },
  { id: 41, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.38_PM_17_lpewy6.jpg', category: 'other', caption: 'Thoughtful Return Gift' },
  { id: 42, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_1_u3xdrk.jpg',  category: 'other', caption: 'Birthday Gift' },
  { id: 43, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_12_akfzuq.jpg', category: 'other', caption: 'Handcrafted Memento' },
  { id: 44, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_16_u6zdtb.jpg', category: 'other', caption: 'Custom Souvenir' },
  { id: 45, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703490/WhatsApp_Image_2026-06-15_at_11.44.38_PM_13_v03xkv.jpg', category: 'other', caption: 'Party Return Gift' },
  { id: 46, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.39_PM_rbq9hh.jpg',    category: 'other', caption: 'Gifting Craft' },
  { id: 47, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703493/WhatsApp_Image_2026-06-15_at_11.44.38_PM_10_fnjykf.jpg', category: 'other', caption: 'Handmade Gift' },
  { id: 48, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703500/WhatsApp_Image_2026-06-15_at_11.44.38_PM_4_smujcn.jpg',  category: 'other', caption: 'Return Gift Set' },
  { id: 49, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703498/WhatsApp_Image_2026-06-15_at_11.44.38_PM_5_jzajky.jpg',  category: 'other', caption: 'Festive Return Gift' },
  { id: 50, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_9_ccmlvt.jpg',  category: 'other', caption: 'Celebration Keepsake' },
  { id: 51, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_7_v0ft5e.jpg',  category: 'other', caption: 'Special Gift' },
  { id: 52, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703495/WhatsApp_Image_2026-06-15_at_11.44.38_PM_15_ksfmdn.jpg', category: 'other', caption: 'Unique Return Gift' },
  { id: 53, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703494/WhatsApp_Image_2026-06-15_at_11.44.38_PM_11_c76arm.jpg', category: 'other', caption: 'Traditional Gift' },
  { id: 54, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703501/WhatsApp_Image_2026-06-15_at_11.44.38_PM_6_y9ykiz.jpg',  category: 'other', caption: 'Craft Gift Box' },
  { id: 55, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703502/WhatsApp_Image_2026-06-15_at_11.44.38_PM_3_hiqswu.jpg',  category: 'other', caption: 'Handcrafted Souvenir' },
  { id: 56, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703503/WhatsApp_Image_2026-06-15_at_11.44.38_PM_8_es76b1.jpg',  category: 'other', caption: 'Keepsake Gift' },
  { id: 57, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_1_reku6q.jpg',  category: 'other', caption: 'Gift Collection' },
  { id: 58, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_2_dh8mzk.jpg',  category: 'other', caption: 'Artisan Return Gift' },
  { id: 59, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703505/WhatsApp_Image_2026-06-15_at_11.44.38_PM_14_fnib9m.jpg', category: 'other', caption: 'Bespoke Gift' },
  { id: 60, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_13_ispbuh.jpg',  category: 'arts', caption: 'Butterfly Wing Design' },
  { id: 61, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_11_eomsmr.jpg',  category: 'arts', caption: 'Tiger Face Art' },
  { id: 62, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_8_wmt1xn.jpg',   category: 'arts', caption: 'Spider-Man Mask' },
  { id: 63, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_9_ijammz.jpg',   category: 'arts', caption: 'Floral Crown Design' },
  { id: 64, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289144/WhatsApp_Image_2026-06-12_at_7.23.02_PM_12_jwdaxe.jpg',  category: 'arts', caption: 'Rainbow Butterfly' },
  { id: 65, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_7_easj0i.jpg',   category: 'arts', caption: 'Galaxy Eye Art' },
  { id: 66, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_6_aheirr.jpg',   category: 'arts', caption: 'Dragon Scale Design' },
  { id: 67, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_5_fdu4di.jpg',   category: 'arts', caption: 'Princess Tiara Art' },
  { id: 68, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_4_ugo4sc.jpg',   category: 'arts', caption: 'Superhero Shield Mask' },
  { id: 69, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_3_lerit5.jpg',   category: 'arts', caption: 'Mermaid Ocean Design' },
  { id: 70, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_2_hgsutd.jpg',   category: 'arts', caption: 'Mandala Forehead Art' },
  { id: 71, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_1_dn7nya.jpg',   category: 'arts', caption: 'Lion King Design' },
  { id: 72, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_yjlsgm.jpg',     category: 'arts', caption: 'Peacock Feather Eye' },
  { id: 73, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.01_PM_7_zrixno.jpg',   category: 'arts', caption: 'Pirate Skull Art' },
  { id: 74, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.01_PM_5_qvnadm.jpg',   category: 'arts', caption: 'Fairy Garden Design' },
  { id: 75, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_3_rwygcq.jpg',   category: 'arts', caption: 'Cosmic Galaxy Art' },
  { id: 76, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.01_PM_6_sc3uag.jpg',   category: 'arts', caption: 'Tribal Warrior Design' },
  { id: 77, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_1_i3fjz8.jpg',   category: 'arts', caption: 'Floral Vine Pattern' },
  { id: 78, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_4_wlcaon.jpg',   category: 'arts', caption: 'Neon Splash Art' },
  { id: 79, src: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_yjrp0j.jpg',     category: 'arts', caption: 'Golden Phoenix Design' },
  { id: 80, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_10_rn5joh.jpg', category: 'arts', caption: 'Lippan Art Creation' },
  { id: 81, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_9_suu6fd.jpg',  category: 'arts', caption: 'Lippan Mirror Work' },
  { id: 82, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_11_f6xa9n.jpg', category: 'arts', caption: 'Clay & Mirror Art' },
  { id: 83, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_8_xl2n0z.jpg',  category: 'arts', caption: 'Lippan Art Detail' },
  { id: 84, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_7_qr5oqb.jpg', category: 'arts', caption: 'Mandala Art' },
  { id: 85, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_5_vi0tek.jpg', category: 'arts', caption: 'Mandala Design' },
  { id: 86, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_4_zezrnp.jpg', category: 'arts', caption: 'Wood Art Creation' },
  { id: 87, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_6_aqnzoc.jpg', category: 'arts', caption: 'Painted Wood Art' },
  { id: 88, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.43_PM_9_ulwugp.jpg', category: 'arts', caption: 'Lippan Art Creation' },
  { id: 89, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_7_ufudhj.jpg', category: 'arts', caption: 'Handpainted Name Plate' },
  { id: 90, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_8_uvtbvd.jpg', category: 'arts', caption: 'Name Plate Art' },
  { id: 91, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_5_uyvsuo.jpg', category: 'arts', caption: 'Canvas Painting' },
  { id: 92, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_3_z8s1hx.jpg', category: 'arts', caption: 'Canvas Art' },
  { id: 93, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_6_eenwsu.jpg', category: 'arts', caption: 'Artisan Canvas Work' },
  { id: 94, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_4_zjzej4.jpg', category: 'arts', caption: 'Canvas Creation' },
  { id: 95, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.43_PM_1_ywvzg6.jpg', category: 'arts', caption: 'Wood & Pot Painting' },
  { id: 96, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.43_PM_2_gdtss3.jpg', category: 'arts', caption: 'Wood & Pot Art' },
  { id: 97, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.43_PM_pzvi3r.jpg',  category: 'arts', caption: 'Wood Craft' },
  { id: 98, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.50_PM_1_uqjbrr.jpg', category: 'arts', caption: 'Wood & Pot Painting' },
  { id: 99, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755004/WhatsApp_Image_2026-06-17_at_6.23.50_PM_e2roes.jpg',  category: 'arts', caption: 'Pot Art' },
  { id: 100, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.50_PM_2_ph99qn.jpg', category: 'arts', caption: 'Painted Pot Creation' },
  { id: 101, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_2_pfm5vm.jpg',  category: 'arts', caption: 'Custom Name Plate' },
  { id: 102, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_1_goilu2.jpg',  category: 'arts', caption: 'Custom Name Plate' },
  { id: 103, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_2_noq9ou.jpg',  category: 'arts', caption: 'Custom Name Plate' },
  { id: 104, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777393/WhatsApp_Image_2026-06-15_at_10.15.52_PM_3_bpnfpb.jpg', category: 'arts', caption: 'Mehandi Design' },
  { id: 105, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.15.51_PM_1_usmkjb.jpg', category: 'arts', caption: 'Henna Art' },
  { id: 106, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.15.52_PM_4_emyu8w.jpg', category: 'arts', caption: 'Bridal Mehandi' },
  { id: 107, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.15.52_PM_2_obcty6.jpg', category: 'arts', caption: 'Mehandi Pattern' },
  { id: 108, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.17.51_PM_1_yushz8.jpg', category: 'arts', caption: 'Henna Design' },
  { id: 109, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.17.51_PM_zwpbks.jpg',  category: 'arts', caption: 'Mehandi Creation' },
  { id: 110, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777395/WhatsApp_Image_2026-06-15_at_10.15.52_PM_hw0dbm.jpg',  category: 'arts', caption: 'Intricate Mehandi' },
  { id: 111, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777395/WhatsApp_Image_2026-06-15_at_10.15.52_PM_1_s60voz.jpg', category: 'arts', caption: 'Full Hand Henna' },
  { id: 112, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777585/WhatsApp_Image_2026-06-16_at_7.28.47_AM_1_olclzf.jpg', category: 'arts', caption: 'Mandala Art' },
  { id: 113, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777586/WhatsApp_Image_2026-06-16_at_7.27.41_AM_8_bswru2.jpg', category: 'arts', caption: 'Mandala Design' },
  { id: 114, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777586/WhatsApp_Image_2026-06-16_at_7.27.41_AM_6_nwhjit.jpg', category: 'arts', caption: 'Sacred Geometry' },
  { id: 115, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777586/WhatsApp_Image_2026-06-16_at_7.27.41_AM_7_n7y1sc.jpg', category: 'arts', caption: 'Mandala Pattern' },
  { id: 116, src: 'https://res.cloudinary.com/diancfp03/image/upload/v1781777594/WhatsApp_Image_2026-06-16_at_7.27.41_AM_5_t6qowc.jpg', category: 'arts', caption: 'Mandala Creation' },
]

function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Mobile navigation drawer
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Selected items + category filter state for interactive booking catalog
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const toggleItemSelection = (itemName: string) => {
    setSelectedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  // Initialize scroll listener for sticky header background transition
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

  // Hook to handle fade-in on scroll animations using Intersection Observer
  useScrollReveal()

  // Slideshow indices state
  const [slideIndices, setSlideIndices] = useState([0, 0, 0])
  // Modal state for product showcase
  const [activeModal, setActiveModal] = useState<string | null>(null)
  // Pooja & Event Rentals manual slideshow index
  // Active tab index for Our Services tabs section
  const [activeServiceTab, setActiveServiceTab] = useState(0)
  // Active craft index for Arts & Crafts masonry modal
  const [activeCraftModal, setActiveCraftModal] = useState<number | null>(null)
  // Slideshow index for the craft detail modal
  const [craftSlideIdx, setCraftSlideIdx] = useState(0)
  // Cursor position for the 3D storytelling section (normalized -0.5 to 0.5)
  const [storyMouse, setStoryMouse] = useState({ x: 0, y: 0 })

  useEffect(() => { setCraftSlideIdx(0) }, [activeCraftModal])

  // Gallery filter + lightbox state
  const [galleryFilter, setGalleryFilter] = useState<GalleryCat>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [galleryShowAll, setGalleryShowAll] = useState(false)

  // Global Shopping Cart State
  const { cartItems, setIsCartOpen, addToCart } = useCart()

  // Slideshow auto-timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndices((prev) => [
        (prev[0] + 1) % 3,
        (prev[1] + 1) % 3,
        (prev[2] + 1) % 3,
      ])
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return
    const filtered = galleryFilter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.category === galleryFilter)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowRight') setLightboxIdx(prev => prev === null ? 0 : (prev + 1) % filtered.length)
      if (e.key === 'ArrowLeft')  setLightboxIdx(prev => prev === null ? 0 : (prev - 1 + filtered.length) % filtered.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, galleryFilter])

  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [contactData, setContactData] = useState({
    fullName: '',
    phoneNumber: '',
    serviceNeeded: '',
    eventDate: '',
    message: ''
  })

  // 3D Magnetic Card Tilt Handlers
  const handleMouseMove3D = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 16;
    const angleY = (x - xc) / 16;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  };

  const handleMouseLeave3D = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease-out';
  };


  if (typeof window !== 'undefined') {
    (window as any).addToCart = addToCart;
  }

  const servicesPanels = [
    {
      id: 'jewellery', num: '01', name: 'Handmade Jewellery',
      tagline: 'Worn with pride, crafted with soul',
      desc: 'Elegant, masterfully crafted organic and stone accessories designed to turn heads at every occasion — from intimate celebrations to grand events.',
      features: ['Fully custom designs to order', 'Organic & semi-precious stones', 'Available in bulk for weddings & events'],
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=900',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900',
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=900',
      ],
    },
    {
      id: 'gifts', num: '02', name: 'Return Gifts',
      tagline: 'Memories wrapped in craftsmanship',
      desc: 'Curated, handcrafted keepsakes that turn your celebrations into lifetime memories. Each piece is designed with intention — a lasting token of gratitude for every guest.',
      features: ['Fully personalised per theme', 'Minimum 10 pieces per order', 'Gift-wrapped & ready to give'],
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781703432/WhatsApp_Image_2026-06-15_at_11.44.38_PM_rrjcsk.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_17_jtud4w.jpg',
      ],
    },
    {
      id: 'painting', num: '03', name: 'Face Painting',
      tagline: 'Art that wears the crowd',
      desc: 'Whimsical, safe, and event-ready designs for every age and festive occasion — bringing joy and vibrant colour to every face at your celebration.',
      features: ['Suitable for all age groups', 'Only certified skin-safe colours', 'Book for parties, schools & festivals'],
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_13_ispbuh.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_11_eomsmr.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_7_easj0i.jpg',
      ],
    },
  ]

  const craftItems = [
    {
      title: 'Lippan Art', tag: 'LIPPAN ART',
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.43_PM_9_ulwugp.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_10_rn5joh.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_9_suu6fd.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_11_f6xa9n.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_8_xl2n0z.jpg',
      ],
      desc: 'Traditional clay and mirror work showcasing intricate patterns and radial geometry. Each piece is handcrafted to reflect light beautifully, bringing an ancient art form into contemporary spaces.',
      spanClass: 'col-span-1 sm:col-span-2 md:col-span-2',
      heightClass: 'h-60 sm:h-72 md:h-80',
    },
    {
      title: 'Mandala Art', tag: 'MANDALA ART',
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_7_qr5oqb.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_5_vi0tek.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777585/WhatsApp_Image_2026-06-16_at_7.28.47_AM_1_olclzf.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777586/WhatsApp_Image_2026-06-16_at_7.27.41_AM_8_bswru2.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777586/WhatsApp_Image_2026-06-16_at_7.27.41_AM_6_nwhjit.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777586/WhatsApp_Image_2026-06-16_at_7.27.41_AM_7_n7y1sc.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777594/WhatsApp_Image_2026-06-16_at_7.27.41_AM_5_t6qowc.jpg',
      ],
      desc: 'Sacred concentric circular designs capturing cosmic symmetry, masterfully drafted using authentic artisan colours and precise geometric techniques passed down through generations.',
      spanClass: '',
      heightClass: 'h-60 sm:h-72 md:h-80',
    },
    {
      title: 'Custom Name Plates', tag: 'NAME PLATES',
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_7_ufudhj.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_8_uvtbvd.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781289148/WhatsApp_Image_2026-06-11_at_9.08.40_AM_2_pfm5vm.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_1_goilu2.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781289147/WhatsApp_Image_2026-06-11_at_9.19.32_AM_2_noq9ou.jpg',
      ],
      desc: 'Bespoke hand-carved name plaques designed to represent family identity through stunning hand-painted wooden contours and personalised lettering for every home.',
      spanClass: '',
      heightClass: 'h-56 sm:h-72 md:h-72',
    },
    {
      title: 'Canvas Painting', tag: 'CANVAS PAINTING',
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_5_uyvsuo.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_3_z8s1hx.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_6_eenwsu.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755002/WhatsApp_Image_2026-06-17_at_6.23.43_PM_4_zjzej4.jpg',
      ],
      desc: 'Premium traditional paintings on high-quality stretched canvas, capturing cultural scenes, geometric alignments, and original artisan compositions in rich, lasting colour.',
      spanClass: 'col-span-1 sm:col-span-2 md:col-span-2',
      heightClass: 'h-56 sm:h-64 md:h-72',
    },
    {
      title: 'Mehandi', tag: 'MEHANDI',
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777393/WhatsApp_Image_2026-06-15_at_10.15.52_PM_3_bpnfpb.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.15.51_PM_1_usmkjb.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.15.52_PM_4_emyu8w.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.15.52_PM_2_obcty6.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.17.51_PM_1_yushz8.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777394/WhatsApp_Image_2026-06-15_at_10.17.51_PM_zwpbks.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777395/WhatsApp_Image_2026-06-15_at_10.15.52_PM_hw0dbm.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781777395/WhatsApp_Image_2026-06-15_at_10.15.52_PM_1_s60voz.jpg',
      ],
      desc: 'Intricate and traditional bridal-grade henna patterns hand-drawn with organic plant-based pastes — from elegant minimalist designs to elaborate full-hand bridal art.',
      spanClass: 'col-span-1 md:col-span-2',
      heightClass: 'h-56 sm:h-64 md:h-72',
    },
    {
      title: 'Wood & Pot Painting', tag: 'WOOD & POT',
      images: [
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.50_PM_1_uqjbrr.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755004/WhatsApp_Image_2026-06-17_at_6.23.50_PM_e2roes.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.50_PM_2_ph99qn.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.43_PM_1_ywvzg6.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.43_PM_2_gdtss3.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755003/WhatsApp_Image_2026-06-17_at_6.23.43_PM_pzvi3r.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_4_zezrnp.jpg',
        'https://res.cloudinary.com/diancfp03/image/upload/v1781755001/WhatsApp_Image_2026-06-17_at_6.23.28_PM_6_aqnzoc.jpg',
      ],
      desc: 'Vibrant acrylic detailing applied on natural clay vessels and high-quality seasoned wood, each hand-painted with traditional motifs that transform everyday objects into art.',
      spanClass: '',
      heightClass: 'h-56 sm:h-64 md:h-72',
    },
  ]

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#E8C96B]/30 selection:text-white">
      
      {/* Sticky Header / Navbar */}
      <header className={`site-header ${isScrolled ? 'site-header-scrolled' : 'site-header-top'}`}>
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-2.5 font-serif text-sm md:text-xl text-[#C9A84C] hover:text-[#E8C96B] font-bold select-none uppercase transition-opacity shrink-0">
          <svg viewBox="0 0 100 80" className="w-7 h-6 md:w-10 md:h-9 shiny-logo-hover" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.2" />
            <circle cx="37" cy="51" r="5.5" strokeWidth="1.8" />
            <circle cx="23" cy="49" r="3.2" strokeWidth="1.8" />
            <circle cx="20" cy="40" r="3.2" strokeWidth="1.8" />
            <circle cx="22" cy="31" r="3.2" strokeWidth="1.8" />
            <circle cx="28" cy="23" r="3.2" strokeWidth="1.8" />
            <circle cx="36" cy="23" r="3.2" strokeWidth="1.8" />
            <circle cx="43" cy="27" r="3.2" strokeWidth="1.8" />
            <circle cx="46" cy="35" r="3.2" strokeWidth="1.8" />
            <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="1.8" />
            <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="1.8" />
            <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="1.8" />
          </svg>
          <span className="flex items-center tracking-[0.18em] md:tracking-[0.26em]">
            {"CRAFT NEST".split("").map((letter, index) => (
              letter === " " ? <span key={index} className="inline-block w-[0.28em]" /> : <span key={index} className="shiny-letter">{letter}</span>
            ))}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[#C9A84C] font-sans text-xs tracking-[0.18em] font-semibold">
          <a href="#services" className="hover:text-white transition-colors uppercase">Our Services</a>
          <a href="#arts-crafts" className="hover:text-white transition-colors uppercase">Arts & Crafts</a>
          <a href="#gallery" className="hover:text-white transition-colors uppercase">Gallery</a>
          <a href="#our-story" className="hover:text-white transition-colors uppercase">Our Story</a>
          <a href="#contact" className="hover:text-white transition-colors uppercase">Contact</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Cart */}
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 md:p-2.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:text-white hover:bg-white/5 transition-all cursor-pointer" aria-label="Shopping Cart">
            <ShoppingBag className="w-4 h-4 stroke-[2.0]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8C96B] text-[#0B3D2E] text-[9px] font-sans font-bold rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Enquire — hidden on tiny mobile */}
          <button
            onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="hidden sm:block font-sans text-[9px] md:text-[10px] tracking-[0.18em] font-semibold border border-[#C9A84C] text-[#C9A84C] rounded-full px-4 md:px-6 py-2 md:py-2.5 hover:bg-[#C9A84C] hover:text-[#0B3D2E] transition-all cursor-pointer"
          >
            ENQUIRE NOW
          </button>

          {/* Hamburger — visible on mobile/tablet only */}
          <button
            onClick={() => setIsMobileNavOpen(v => !v)}
            className="lg:hidden p-2 rounded-lg text-[#C9A84C] hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileNavOpen && (
          <div className="absolute top-full left-0 w-full lg:hidden z-50 animate-fade-in"
            style={{ background: 'rgba(4,13,8,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
            <nav className="flex flex-col px-6 py-6 gap-1">
              {[
                { href: '#services', label: 'Our Services' },
                { href: '#arts-crafts', label: 'Arts & Crafts' },
                { href: '#pooja-rentals', label: 'Pooja & Rentals' },
                { href: '#gallery', label: 'Gallery' },
                { href: '#our-story', label: 'Our Story' },
                { href: '#contact', label: 'Contact' },
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex items-center justify-between py-3.5 border-b font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#C9A84C] hover:text-white transition-colors"
                  style={{ borderColor: 'rgba(201,168,76,0.08)' }}
                >
                  {item.label}
                  <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
                </a>
              ))}
              {/* Mobile CTA */}
              <button
                onClick={() => { setIsMobileNavOpen(false); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                className="mt-4 w-full py-3 rounded-full font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#0B3D2E] cursor-pointer"
                style={{ background: '#E8C96B' }}
              >
                ENQUIRE NOW
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen w-full flex flex-col justify-between items-center md:items-start text-center px-4 md:px-16 lg:px-24 overflow-hidden pt-0"
        style={{
          background: 'radial-gradient(ellipse 72% 68% at 50% 52%, #1C6038 0%, #134A2A 28%, #0C3220 55%, #071A10 80%, #040C07 100%)'
        }}
      >
        {/* Layered vignette overlay (NO warm colors) */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]" 
          style={{
            background: 'radial-gradient(ellipse 80% 75% at 50% 50%, transparent 20%, rgba(5, 18, 10, 0.55) 58%, rgba(3, 11, 6, 0.90) 100%)'
          }}
        />

        {/* Embossed gold-brown mandala overlay (FULL SIZE, edge-to-edge, responsive) */}
        <div 
          className="hero-mandala-overlay"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/diancfp03/image/upload/v1780162699/home_sa22ka.png')`
          }}
        />

        {/* Moving Vintage Film Reels (3 parallel diagonal tracks) */}
        <div className="hero-film-reels-container select-none">
          {/* Column 1: Scrolling Up */}
          <div className="film-strip-column">
            <div className="film-strip-track-up">
              {[...reel1Images, ...reel1Images].map((src, i) => (
                <div key={i} className="vintage-film-frame">
                  <img src={src} alt="CraftNest Gallery Preview" className="vintage-film-image" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Scrolling Up Slow */}
          <div className="film-strip-column">
            <div className="film-strip-track-up-slow">
              {[...reel2Images, ...reel2Images].map((src, i) => (
                <div key={i} className="vintage-film-frame">
                  <img src={src} alt="CraftNest Gallery Preview" className="vintage-film-image" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Scrolling Up Alt */}
          <div className="film-strip-column">
            <div className="film-strip-track-up-alt">
              {[...reel3Images, ...reel3Images].map((src, i) => (
                <div key={i} className="vintage-film-frame">
                  <img src={src} alt="CraftNest Gallery Preview" className="vintage-film-image" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dummy spacer */}
        <div className="pt-24" />

        {/* Hero Content Aligned to the Left Half (Centered inside the left half) */}
        <div 
          className="relative flex flex-col items-center justify-center w-full md:w-[48%] lg:w-[45%] px-4 py-8 reveal-element revealed md:ml-12 lg:ml-20 text-center"
          style={{
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Custom Hand-Drawn Paint Palette & Brush SVG Logo (Super Sized in Middle-Top of Left Half) */}
          <div className="mb-8 flex flex-col items-center justify-center group select-none">
            <svg 
              viewBox="0 0 100 80" 
              className="w-48 h-40 md:w-80 md:h-64 shiny-logo-hover" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Paint Palette Outer Shape */}
              <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.2" />
              
              {/* Large Thumb Hole */}
              <circle cx="37" cy="51" r="5.5" strokeWidth="1.8" fill="none" />
              
              {/* 7 Uniform Paint Wells */}
              <circle cx="23" cy="49" r="3.2" strokeWidth="1.8" fill="none" />
              <circle cx="20" cy="40" r="3.2" strokeWidth="1.8" fill="none" />
              <circle cx="22" cy="31" r="3.2" strokeWidth="1.8" fill="none" />
              <circle cx="28" cy="23" r="3.2" strokeWidth="1.8" fill="none" />
              <circle cx="36" cy="23" r="3.2" strokeWidth="1.8" fill="none" />
              <circle cx="43" cy="27" r="3.2" strokeWidth="1.8" fill="none" />
              <circle cx="46" cy="35" r="3.2" strokeWidth="1.8" fill="none" />
              
              {/* Paintbrush */}
              <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="1.8" fill="none" />
              <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="1.8" fill="none" />
              <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="1.8" fill="none" />
            </svg>
          </div>

          {/* Heading with text-shadow glow (Uniform professional serif font matching the logo) */}
          <h1 
            className="leading-[1.15] text-[#D4A843] uppercase select-none font-serif font-bold tracking-[0.2em] flex flex-wrap items-center justify-center text-[clamp(2rem,6.5vw,5rem)] mb-4 w-full pl-[0.2em]"
            style={{
              textShadow: '0 0 60px rgba(190, 145, 50, 0.3), 0 0 20px rgba(190, 145, 50, 0.15), 0 3px 12px rgba(0, 0, 0, 0.6)'
            }}
          >
            {"CRAFT NEST".split("").map((letter, index) => (
              letter === " " ? (
                <span key={index} className="inline-block w-[0.35em]" />
              ) : (
                <span 
                  key={index} 
                  className="shiny-letter text-[#FFF0B5]" 
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  {letter}
                </span>
              )
            ))}
          </h1>

          {/* Decorative Horizontal Divider (Centered inside left column) */}
          <div 
            className="mx-auto block"
            style={{
              width: '280px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(237, 208, 106, 0.2) 15%, #EDD06A 50%, rgba(237, 208, 106, 0.2) 85%, transparent 100%)',
              marginTop: '16px',
              marginBottom: '24px'
            }}
          />

          {/* Tagline */}
          <p className="font-serif italic text-base sm:text-lg md:text-2xl lg:text-3xl text-[#C4A050] tracking-wide mb-10 flex flex-wrap items-center justify-center gap-x-3">
            {"Handmade with Love".split(" ").map((word, index) => (
              <span key={index} className="shiny-word">
                {word}
              </span>
            ))}
          </p>

        </div>

        {/* Bouncing Chevron down scroll indicator */}
        <div className="relative z-10 pb-10">
          <a 
            href="#services" 
            aria-label="Scroll Down"
            className="text-[#C9A84C] hover:text-[#E8C96B] animate-bounce transition-colors inline-block"
          >
            <ChevronDown className="w-7 h-7 stroke-[1.5]" />
          </a>
        </div>
      </section>
      
      {/* Crafts Strip — Stats + Dual Marquee */}
      <section
        className="relative overflow-hidden border-b border-[#C9A84C]/20"
        style={{ background: 'radial-gradient(ellipse 120% 200% at 50% 50%, #0F3D28 0%, #071510 55%, #040D08 100%)' }}
      >
        {/* Subtle dot texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #E8C96B 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* ── STATS ROW ── */}
        <div className="relative z-10 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            {[
              { num: '10+',  label: 'Events Done',    sub: 'across Georgia' },
              { num: '12+',  label: 'Art Forms',      sub: 'handcrafted in-house' },
              { num: '100%', label: 'Custom Made',    sub: 'every single piece' },
              { num: '5 ★',  label: 'Client Rating',  sub: 'loved by families' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center md:border-r last:border-r-0" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                <span
                  className="font-serif font-bold leading-none mb-1.5"
                  style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#E8C96B', textShadow: '0 0 30px rgba(232,201,107,0.25)' }}
                >
                  {stat.num}
                </span>
                <span className="font-sans text-xs md:text-sm font-bold tracking-[0.14em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {stat.label}
                </span>
                <span className="font-sans text-[9px] md:text-[10px]" style={{ color: 'rgba(201,168,76,0.38)' }}>
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HEADING ROW ── */}
        <div className="relative z-10 py-8 md:py-10 flex items-center justify-center gap-3 md:gap-6 px-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
          {/* Left flourish */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 select-none">
            <div className="h-[1px] w-8 md:w-14" style={{ background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 11L3 14L4.5 8.5L0 5.5H5.5L7 0Z" fill="#C9A84C" opacity="0.6"/></svg>
            <div className="h-[1px] w-4" style={{ background: '#C9A84C', opacity: 0.4 }} />
          </div>

          <h2 className="font-serif text-base sm:text-xl md:text-2xl lg:text-[28px] font-medium tracking-[0.1em] text-center select-none" style={{ color: 'rgba(255,255,255,0.82)' }}>
            <span className="transition-colors duration-300 cursor-default hover:text-[#E8C96B]">Handmade Crafts</span>
            <span className="mx-3 md:mx-5 font-light" style={{ color: 'rgba(201,168,76,0.35)' }}>·</span>
            <span className="transition-colors duration-300 cursor-default hover:text-[#E8C96B]">Face Painting</span>
            <span className="mx-3 md:mx-5 font-light" style={{ color: 'rgba(201,168,76,0.35)' }}>·</span>
            <span className="transition-colors duration-300 cursor-default hover:text-[#E8C96B]">Bespoke Gifts</span>
          </h2>

          {/* Right flourish */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 select-none">
            <div className="h-[1px] w-4" style={{ background: '#C9A84C', opacity: 0.4 }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 11L3 14L4.5 8.5L0 5.5H5.5L7 0Z" fill="#C9A84C" opacity="0.6"/></svg>
            <div className="h-[1px] w-8 md:w-14" style={{ background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
          </div>
        </div>

        {/* ── MARQUEE ROW 1 (left → right scroll) ── */}
        <div className="relative z-10 py-3 border-b overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.07)', background: 'rgba(232,201,107,0.03)' }}>
          <div className="marquee-container">
            {[0, 1].map(copy => (
              <div key={copy} className="marquee-content font-serif italic text-xl md:text-2xl tracking-widest select-none" style={{ color: '#C9A84C' }} aria-hidden={copy === 1}>
                {['Mehandi', 'Mandala Art', 'Return Gifts', 'Name Plates', 'Jewellery', 'Face Painting', 'Kundan Bangles', 'Lippan Art', 'Canvas Painting', 'Meenakari'].map((item, j) => (
                  <span key={j} className="inline-flex items-center gap-4">
                    <span className="marquee-item">{item}</span>
                    <span className="text-[#E8C96B]/30 text-base" style={{ fontStyle: 'normal' }}>◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── MARQUEE ROW 2 (right → left, reversed, slightly faster) ── */}
        <div className="relative z-10 py-3 overflow-hidden">
          <div className="marquee-container">
            {[0, 1].map(copy => (
              <div key={copy} className="marquee-content-reverse font-sans text-[10px] md:text-xs font-bold tracking-[0.28em] uppercase select-none" style={{ color: 'rgba(232,201,107,0.38)' }} aria-hidden={copy === 1}>
                {['Handcrafted with Love', 'Georgia\'s Finest', 'Event Specialists', 'Bespoke Creations', 'Artisan Family', 'Premium Quality', 'Celebrations Elevated', 'Traditional Art'].map((item, j) => (
                  <span key={j} className="inline-flex items-center gap-5">
                    <span>{item}</span>
                    <span style={{ color: 'rgba(201,168,76,0.2)' }}>—</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Large Brand Artistry Collage Banner Section */}
      <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden border-y border-[#C9A84C]/35">
        {/* Grid of All Specialties Pics */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 h-full w-full">
          
          {/* Collage Item 1: Face Painting */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img 
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600" 
              alt="Colorful Celebrations" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-5 left-5 z-10">
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-sans font-bold tracking-[0.22em] text-[#E8C96B] uppercase block mb-0.5 sm:mb-1">CELEBRATION ART</span>
              <h4 className="font-serif text-xs sm:text-sm md:text-base text-white font-medium">Face Painting</h4>
            </div>
          </div>

          {/* Collage Item 2: Return Gifts */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img
              src="https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_16_u6zdtb.jpg"
              alt="Bespoke Return Gifts"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-5 left-5 z-10">
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-sans font-bold tracking-[0.22em] text-[#E8C96B] uppercase block mb-0.5 sm:mb-1">HANDMADE MEMORIES</span>
              <h4 className="font-serif text-xs sm:text-sm md:text-base text-white font-medium">Return Gifts</h4>
            </div>
          </div>

          {/* Collage Item 3: Crafts & Arts */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img
              src="https://res.cloudinary.com/diancfp03/image/upload/v1781755000/WhatsApp_Image_2026-06-17_at_6.23.28_PM_10_rn5joh.jpg"
              alt="Sacred Mandala & Lippan Art"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-5 left-5 z-10">
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-sans font-bold tracking-[0.22em] text-[#E8C96B] uppercase block mb-0.5 sm:mb-1">CREATIVE REALMS</span>
              <h4 className="font-serif text-xs sm:text-sm md:text-base text-white font-medium">Crafts & Arts</h4>
            </div>
          </div>

          {/* Collage Item 4: Pooja & Event Rentals */}
          <div className="relative h-full w-full overflow-hidden group select-none">
            <img
              src="https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_5_uqlyui.jpg"
              alt="Bespoke Festive Props"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute bottom-5 left-5 z-10">
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-sans font-bold tracking-[0.22em] text-[#E8C96B] uppercase block mb-0.5 sm:mb-1">DIVINE CELEBRATIONS</span>
              <h4 className="font-serif text-xs sm:text-sm md:text-base text-white font-medium">Pooja Rentals</h4>
            </div>
          </div>

        </div>

        {/* Central Brand Stamp Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-5 sm:px-10 z-20">
          <div className="bg-[#04140E]/90 backdrop-blur-md border border-[#C9A84C]/45 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 md:p-8 text-center w-full max-w-xs sm:max-w-sm md:max-w-lg shadow-2xl relative gold-glow">
            <span className="text-[8px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.3em] font-sans font-bold text-[#C9A84C] uppercase mb-1.5 sm:mb-2 block">
              CRAFTNEST ARTISTRY
            </span>
            <h3 className="font-serif text-[13px] sm:text-lg md:text-2xl font-medium text-white tracking-wide leading-snug break-words">
              Handcrafted with Love, Shared with Joy
            </h3>
            <div className="w-12 sm:w-16 h-[1px] bg-[#C9A84C]/35 mx-auto my-2 sm:my-3" />
            <p className="font-sans text-[8px] sm:text-[10px] md:text-xs text-[rgba(250,246,235,0.7)] tracking-wide leading-relaxed break-words">
              Face Painting • Return Gifts • Crafts &amp; Arts • Pooja Rentals
            </p>
          </div>
        </div>
      </section>

      {/* Our Services & Featured Collections Section */}
      <section
        id="services"
        className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 border-b border-[#C9A84C]/25 services-border-frame"
        style={{ background: 'radial-gradient(ellipse 100% 120% at 50% 0%, #0F3D28 0%, #071510 55%, #040D08 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 reveal-element">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#C9A84C] uppercase mb-3 block">
              FEATURED COLLECTIONS
            </span>
            <h2 className="font-serif text-3xl md:text-[46px] text-[#E8C96B] font-medium tracking-wide">
              Our Services
            </h2>
            <div className="w-24 h-[1px] bg-[#C9A84C]/35 mx-auto mt-5 mb-5" />
            <p className="font-sans text-xs md:text-sm text-white/50 max-w-xl mx-auto leading-relaxed tracking-wide">
              Bespoke handcrafted experiences tailored for your most memorable celebrations
            </p>
          </div>

          {/* Tab Strip */}
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex min-w-max md:min-w-0 border-b border-[#C9A84C]/15">
              {servicesPanels.map((tab, tabIdx) => {
                const isActive = activeServiceTab === tabIdx;
                return (
                  <button
                    key={tabIdx}
                    onClick={() => setActiveServiceTab(tabIdx)}
                    className="relative flex-1 px-2 sm:px-5 md:px-10 lg:px-16 py-3 sm:py-4 md:py-5 flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer group"
                  >
                    <span
                      className="text-[9px] font-sans font-bold tracking-[0.2em] transition-all duration-300"
                      style={{
                        color: isActive ? '#E8C96B' : 'rgba(255,255,255,0.2)',
                        textShadow: isActive ? '0 0 12px rgba(232,201,107,0.5)' : 'none',
                      }}
                    >
                      {tab.num}
                    </span>
                    <span
                      className="font-sans text-[10px] md:text-xs tracking-[0.18em] font-bold uppercase transition-all duration-300 whitespace-nowrap"
                      style={{
                        color: isActive ? '#FFF0B5' : 'rgba(255,255,255,0.28)',
                        textShadow: isActive
                          ? '0 0 22px rgba(255,231,154,0.85), 0 0 8px rgba(232,201,107,0.5)'
                          : 'none',
                      }}
                    >
                      {tab.name}
                    </span>
                    {/* Active underline — glowing gold */}
                    <div
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-400"
                      style={{
                        background: isActive ? '#E8C96B' : 'transparent',
                        boxShadow: isActive ? '0 0 10px rgba(232,201,107,0.7)' : 'none',
                      }}
                    />
                    {/* Hover underline for inactive tabs */}
                    {!isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/25 transition-all duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Panel — key forces remount so animate-panel-enter plays on tab switch */}
          {servicesPanels.map((panel, panelIdx) =>
            activeServiceTab !== panelIdx ? null : (
              <div
                key={panelIdx}
                className="animate-panel-enter flex flex-col lg:flex-row bg-[#071510] border border-[#C9A84C]/15 border-t-0 rounded-b-[24px] overflow-hidden"
                style={{ minHeight: 'clamp(300px, 70vh, 520px)' }}
              >
                {/* Left: Image Slideshow */}
                <div className="relative w-full lg:w-[55%] h-52 sm:h-64 md:h-72 lg:h-auto overflow-hidden bg-[#04140E] flex-shrink-0 lg:min-h-[520px]">
                  {panel.images.map((imgUrl, imgIdx) => (
                    <img
                      key={imgIdx}
                      src={imgUrl}
                      alt={`${panel.name} ${imgIdx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${imgIdx === slideIndices[panelIdx] ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none hidden lg:block" />
                  <div className="absolute bottom-5 left-5 z-10 select-none pointer-events-none">
                    <span className="text-[10px] font-sans font-semibold text-white/40 tracking-[0.15em]">
                      {String(slideIndices[panelIdx] + 1).padStart(2, '0')} / {String(panel.images.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
                    <div
                      className="h-full bg-[#E8C96B]/60 transition-all duration-700"
                      style={{ width: `${((slideIndices[panelIdx] + 1) / panel.images.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Right: Details */}
                <div className="w-full lg:w-[45%] p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                  <span className="text-[#C9A84C]/18 font-serif text-6xl md:text-7xl font-bold leading-none select-none mb-2 block">
                    {panel.num}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl text-white font-medium leading-tight mb-2">
                    {panel.name}
                  </h3>
                  <p className="font-serif italic text-sm md:text-base text-[#C9A84C]/60 mb-5">
                    {panel.tagline}
                  </p>
                  <div className="w-12 h-[1px] bg-[#C9A84C]/30 mb-6" />
                  <p className="font-sans text-sm text-white/55 leading-relaxed mb-8">
                    {panel.desc}
                  </p>
                  <div className="space-y-3 mb-10">
                    {panel.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8C96B] mt-[7px] flex-shrink-0" />
                        <span className="font-sans text-xs md:text-sm text-white/65 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/collection/$id"
                    params={{ id: panel.id }}
                    className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] text-[10px] tracking-[0.2em] font-sans font-bold px-7 py-3.5 rounded-full uppercase transition-all duration-300 shadow-[0_2px_16px_rgba(201,168,76,0.25)] hover:shadow-[0_6px_28px_rgba(201,168,76,0.45)] w-fit"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Our Arts & Crafts Section — Bento Masonry Gallery */}
      <section
        id="arts-crafts"
        className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 border-b border-[#C9A84C]/25"
        style={{ background: 'radial-gradient(ellipse 100% 120% at 50% 0%, #0F3D28 0%, #071510 55%, #040D08 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14 reveal-element">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#C9A84C] uppercase mb-3 block">
              EXPLORE HERITAGE SKILLS
            </span>
            <h2 className="font-serif text-3xl md:text-[46px] text-white font-medium tracking-wide">
              Our Arts & Crafts
            </h2>
            <div className="w-24 h-[1px] bg-[#C9A84C]/35 mx-auto mt-5 mb-5" />
            <p className="font-sans text-xs md:text-sm text-[#E8C96B]/45 max-w-xl mx-auto leading-relaxed">
              Six traditional art forms — each telling a story of heritage and handcraft mastery. Tap any to explore.
            </p>
          </div>

          {/* Bento Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {craftItems.map((craft, idx) => (
              <div
                key={idx}
                onClick={() => setActiveCraftModal(idx)}
                className={`group relative overflow-hidden rounded-[18px] cursor-pointer select-none border border-[#C9A84C]/20 hover:border-[#E8C96B]/50 transition-all duration-400 ${craft.heightClass} ${craft.spanClass}`}
              >
                {/* Image */}
                <img
                  src={craft.images[0]}
                  alt={craft.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Gradient overlay — lightens on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/50 group-hover:via-black/5" />

                {/* Gold border ring on hover */}
                <div className="absolute inset-[1px] rounded-[17px] opacity-0 group-hover:opacity-100 outline outline-[2px] outline-[#E8C96B]/55 transition-all duration-500" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-[#E8C96B] font-bold uppercase mb-1.5 block transition-transform duration-500 group-hover:-translate-y-1">
                    {craft.tag}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-white font-medium leading-tight transition-transform duration-500 group-hover:-translate-y-1">
                    {craft.title}
                  </h3>

                  {/* Description + explore hint — slides up on hover */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-28 transition-all duration-500 ease-in-out">
                    <p className="font-sans text-[11px] md:text-xs text-white/70 leading-relaxed mt-2 mb-3">
                      {craft.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[9px] text-[#E8C96B] font-bold tracking-[0.22em] uppercase">
                      Tap to explore →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pooja & Event Rentals — Editorial Mosaic Grid */}
      <section
        id="pooja-rentals"
        className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 border-b border-[#C9A84C]/25"
        style={{ background: 'radial-gradient(ellipse 110% 130% at 50% 100%, #0F3D28 0%, #071510 50%, #040D08 100%)' }}
      >
        {/* Subtle scattered dot texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #E8C96B 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 reveal-element">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] text-[#C9A84C] uppercase mb-3 block">
              CELEBRATIONS MADE DIVINE
            </span>
            <h2 className="font-serif text-3xl md:text-[46px] text-white font-medium tracking-wide">
              Pooja & Event Rentals
            </h2>
            <div className="w-24 h-[1px] bg-[#C9A84C]/35 mx-auto mt-5 mb-5" />
            <p className="font-sans text-xs md:text-sm text-[#E8C96B]/40 max-w-lg mx-auto leading-relaxed">
              Sacred props and festive décor handpicked to elevate every ceremony and celebration.
            </p>
          </div>

          {/* Row 1: Featured (col-span-2) + Side Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">

            {/* Featured Card — 2/3 width, taller */}
            <div className="group relative overflow-hidden rounded-[20px] cursor-pointer md:col-span-2 h-[220px] sm:h-[300px] md:h-[440px]">
              <img
                src="https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_5_uqlyui.jpg"
                alt="Pooja Rentals"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040D08]/90 via-[#040D08]/30 to-transparent" />
              <div className="absolute inset-[1px] rounded-[19px] opacity-0 group-hover:opacity-100 outline outline-[2px] outline-[#E8C96B]/40 transition-all duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                <span className="text-[8px] tracking-[0.32em] text-[#E8C96B] font-bold uppercase block mb-2">DIVINE RENTALS</span>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-medium mb-3 leading-tight">Pooja & Event Décor</h3>
                <p className="font-sans text-xs text-white/55 leading-relaxed mb-5 max-w-md hidden sm:block">
                  Sacred props and festive décor handpicked to bring divine warmth and elegance to every ceremony and celebration.
                </p>
                <a
                  href={`https://wa.me/14704527988?text=${encodeURIComponent('Hi CraftNest! I\'d like to enquire about Pooja & Event Rentals for my event.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#E8C96B] hover:bg-[#FFF0B5] text-[#0B3D2E] text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer"
                >
                  BOOK FOR YOUR EVENT →
                </a>
              </div>
            </div>

            {/* Side Card 1 */}
            <div className="group relative overflow-hidden rounded-[20px] cursor-pointer h-[220px] sm:h-[300px] md:h-[440px]">
              <img
                src="https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_wbpr2w.jpg"
                alt="Festive Rentals"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040D08]/85 via-[#040D08]/20 to-transparent" />
              <div className="absolute inset-[1px] rounded-[19px] opacity-0 group-hover:opacity-100 outline outline-[2px] outline-[#E8C96B]/40 transition-all duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-[8px] tracking-[0.3em] text-[#E8C96B] font-bold uppercase block mb-1.5 transition-transform duration-500 group-hover:-translate-y-1">FESTIVE DÉCOR</span>
                <h3 className="font-serif text-xl text-white font-medium leading-tight transition-transform duration-500 group-hover:-translate-y-1">Festive Event Props</h3>
                <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500 ease-in-out">
                  <p className="font-sans text-[11px] text-white/60 leading-relaxed mt-2 mb-3">Beautiful handcrafted props and décor for your weddings, poojas and celebrations.</p>
                  <span className="text-[9px] text-[#E8C96B] font-bold tracking-[0.2em] uppercase">Enquire →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Three compact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {[
              { title: 'Sacred Pooja Items', tag: 'POOJA ESSENTIALS', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_3_xpszqo.jpg', desc: 'Handcrafted sacred items to bless every ceremony with divine energy.' },
              { title: 'Celebration Rentals', tag: 'EVENT RENTALS', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702095/WhatsApp_Image_2026-06-15_at_11.37.40_PM_4_suwo3v.jpg', desc: 'Premium rental items curated for birthdays, weddings and festive events.' },
              { title: 'Décor & Accessories', tag: 'FESTIVE PROPS', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781702094/WhatsApp_Image_2026-06-15_at_11.37.40_PM_1_ldq5qt.jpg', desc: 'Elegant décor accessories to elevate the ambience of any celebration.' },
            ].map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-[20px] cursor-pointer h-60 md:h-72">
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040D08]/85 via-[#040D08]/20 to-transparent" />
                <div className="absolute inset-[1px] rounded-[19px] opacity-0 group-hover:opacity-100 outline outline-[2px] outline-[#E8C96B]/40 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-[7px] tracking-[0.3em] text-[#E8C96B] font-bold uppercase block mb-1 transition-transform duration-500 group-hover:-translate-y-0.5">{item.tag}</span>
                  <h3 className="font-serif text-base text-white font-medium leading-tight transition-transform duration-500 group-hover:-translate-y-0.5">{item.title}</h3>
                  <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-in-out">
                    <p className="font-sans text-[10px] text-white/55 leading-relaxed mt-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Strip */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C9A84C]/15 rounded-[16px] px-7 py-5" style={{ background: 'rgba(15,61,40,0.35)' }}>
            <div>
              <p className="font-serif text-lg text-white font-medium">Planning a celebration?</p>
              <p className="font-sans text-xs text-[#E8C96B]/50 mt-0.5">Get a quote tailored to your event — poojas, weddings, birthdays & more.</p>
            </div>
            <a
              href={`https://wa.me/14704527988?text=${encodeURIComponent('Hi CraftNest! I\'d like to book Pooja & Event Rentals for my upcoming celebration.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-7 py-3 rounded-full transition-all hover:scale-105 cursor-pointer shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              BOOK ON WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* Craft Detail Modal */}
      {activeCraftModal !== null && craftItems[activeCraftModal] && (() => {
        const craft = craftItems[activeCraftModal];
        return (
          <div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-lg flex items-center justify-center p-4 md:p-8 animate-fade-in"
            onClick={() => setActiveCraftModal(null)}
          >
            <div
              className="relative bg-[#0F1A12] rounded-[22px] overflow-hidden flex flex-col md:flex-row max-w-4xl w-full max-h-[92vh] shadow-2xl border border-[#C9A84C]/20 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveCraftModal(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white/70 hover:text-white hover:border-white/50 flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>

              {/* Left — image slideshow */}
              <div className="relative w-full md:w-[58%] h-64 md:h-auto flex-shrink-0 overflow-hidden">
                <img
                  key={craftSlideIdx}
                  src={craft.images[craftSlideIdx]}
                  alt={craft.title}
                  className="w-full h-full object-cover transition-opacity duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-5 left-5 text-[9px] tracking-[0.3em] text-[#E8C96B] font-bold uppercase">
                  {craft.tag}
                </span>

                {/* Slide counter */}
                <div className="absolute top-4 left-4 font-sans text-[9px] font-bold tracking-[0.18em] text-white/60 bg-black/40 px-2.5 py-1 rounded-full">
                  {String(craftSlideIdx + 1).padStart(2,'0')} / {String(craft.images.length).padStart(2,'0')}
                </div>

                {/* Prev / Next arrows */}
                {craft.images.length > 1 && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); setCraftSlideIdx(i => (i - 1 + craft.images.length) % craft.images.length) }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setCraftSlideIdx(i => (i + 1) % craft.images.length) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {craft.images.length > 1 && (
                  <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1.5">
                    {craft.images.map((_, di) => (
                      <button
                        key={di}
                        onClick={e => { e.stopPropagation(); setCraftSlideIdx(di) }}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${di === craftSlideIdx ? 'bg-[#E8C96B] scale-125' : 'bg-white/35 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right — content */}
              <div className="flex flex-col justify-center p-8 md:p-10 w-full">
                <h3 className="font-serif text-2xl md:text-3xl text-white font-medium mb-4 leading-tight">
                  {craft.title}
                </h3>
                <div className="w-14 h-[1px] bg-[#C9A84C]/50 mb-5" />
                <p className="font-sans text-sm text-white/65 leading-relaxed mb-8">
                  {craft.desc}
                </p>
                <a
                  href={`https://wa.me/14704527988?text=${encodeURIComponent(`Hi CraftNest! I'd like to enquire about your ${craft.title} service.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[11px] tracking-[0.2em] font-bold uppercase px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  ENQUIRE ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Fullscreen Blurred Interactive Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#04140E]/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in select-none"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#0B3D2E]/95 border border-[#C9A84C]/45 rounded-[24px] p-6 md:p-10 shadow-2xl flex flex-col justify-between overflow-y-auto max-h-[90vh] text-[#E8C96B] gold-glow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Exit Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#C9A84C]/35 hover:border-[#E8C96B] flex items-center justify-center text-[#C9A84C] hover:text-[#E8C96B] transition-all hover:scale-110 cursor-pointer"
              aria-label="Close Modal"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Content */}
            <div className="mb-8">
              <span className="text-[10px] md:text-xs font-sans tracking-[0.25em] text-[#C9A84C] font-semibold uppercase block mb-2">
                {activeModal === 'jewellery' && 'Geometric Sacred Adornment'}
                {activeModal === 'gifts' && 'Artisan Keepsake Customization'}
                {activeModal === 'painting' && 'Sacred Body Art Geometry'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#E8C96B] font-medium leading-none">
                {activeModal === 'jewellery' && 'Handmade Jewellery Collection'}
                {activeModal === 'gifts' && 'Return Gifts & Keepsakes'}
                {activeModal === 'painting' && 'Face Painting Masterpieces'}
              </h2>
              <div className="w-20 h-[1.5px] bg-[#C9A84C]/40 mt-4" />
            </div>

            {/* Showcase Product Grid */}
            <div className={`grid gap-4 mb-8 ${activeModal === 'gifts' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-3'}`}>
              {activeModal === 'jewellery' && [
                {
                  title: 'Chakra Mandala Necklace',
                  geom: 'Sacred Octagon Geometry',
                  desc: 'Handcrafted copper-wire wrapped necklace, aligned with sacred octagonal geometry for energy shielding.'
                },
                {
                  title: 'Kundalini Gold Bangles',
                  geom: 'Fibonacci Spiral Contours',
                  desc: 'Solid gold alloy bangles engraved with the Fibonacci golden spiral curves and inset rubies.'
                },
                {
                  title: 'Golden Lotus Studs',
                  geom: 'Lotus-Petal Concentrics',
                  desc: 'Perfect concentric petals crafted in 22K yellow gold, representing standard lotus growth symmetry.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-[#0F5C42]/50 border border-[#C9A84C]/25 rounded-[16px] hover:border-[#E8C96B]/80 hover:scale-[1.03] transition-all duration-300 shadow-lg flex flex-col justify-between group cursor-default text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A84C]/70 font-semibold">{item.geom}</span>
                    <h4 className="font-serif text-lg text-white font-medium mt-1 mb-3 group-hover:text-[#E8C96B] transition-colors">{item.title}</h4>
                    <p className="text-xs font-sans text-[rgba(232,201,107,0.7)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}

              {activeModal === 'gifts' && [
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703432/WhatsApp_Image_2026-06-15_at_11.44.38_PM_rrjcsk.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703458/WhatsApp_Image_2026-06-15_at_11.45.59_PM_pq4sd9.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_17_jtud4w.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_12_ljakzf.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703464/WhatsApp_Image_2026-06-15_at_11.44.39_PM_16_zxyqct.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_14_nkiamc.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_13_vzch7z.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703466/WhatsApp_Image_2026-06-15_at_11.44.39_PM_5_fp5ev6.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703470/WhatsApp_Image_2026-06-15_at_11.44.39_PM_11_ut0qm5.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703472/WhatsApp_Image_2026-06-15_at_11.44.39_PM_15_psm5z7.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703473/WhatsApp_Image_2026-06-15_at_11.44.39_PM_4_urdkmz.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703474/WhatsApp_Image_2026-06-15_at_11.44.39_PM_6_ffkcw3.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_9_okeqny.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_10_wuurwg.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703481/WhatsApp_Image_2026-06-15_at_11.44.39_PM_8_o6edty.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703482/WhatsApp_Image_2026-06-15_at_11.44.39_PM_7_jghcyy.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_3_ogkcmu.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.38_PM_17_lpewy6.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_1_u3xdrk.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_12_akfzuq.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_16_u6zdtb.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703490/WhatsApp_Image_2026-06-15_at_11.44.38_PM_13_v03xkv.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.39_PM_rbq9hh.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703493/WhatsApp_Image_2026-06-15_at_11.44.38_PM_10_fnjykf.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703500/WhatsApp_Image_2026-06-15_at_11.44.38_PM_4_smujcn.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703498/WhatsApp_Image_2026-06-15_at_11.44.38_PM_5_jzajky.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_9_ccmlvt.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_7_v0ft5e.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703495/WhatsApp_Image_2026-06-15_at_11.44.38_PM_15_ksfmdn.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703494/WhatsApp_Image_2026-06-15_at_11.44.38_PM_11_c76arm.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703501/WhatsApp_Image_2026-06-15_at_11.44.38_PM_6_y9ykiz.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703502/WhatsApp_Image_2026-06-15_at_11.44.38_PM_3_hiqswu.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703503/WhatsApp_Image_2026-06-15_at_11.44.38_PM_8_es76b1.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_1_reku6q.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_2_dh8mzk.jpg',
                'https://res.cloudinary.com/diancfp03/image/upload/v1781703505/WhatsApp_Image_2026-06-15_at_11.44.38_PM_14_fnib9m.jpg',
              ].map((src, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-[14px] aspect-square cursor-pointer border border-[#C9A84C]/15 hover:border-[#E8C96B]/50 transition-all duration-300 hover:scale-[1.03]">
                  <img src={src} alt={`Return Gift ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] font-sans font-bold text-[#E8C96B] tracking-[0.15em] uppercase">Gift {idx + 1}</span>
                  </div>
                </div>
              ))}

              {activeModal === 'painting' && [
                {
                  title: 'Fractal Butterfly Design',
                  geom: 'Symmetrical Fractal Shapes',
                  desc: 'Full-face colorful butterfly mask painted using perfect organic fractal grid alignments.'
                },
                {
                  title: 'Golden Spiral Eye Frame',
                  geom: 'Golden Ratio Eye Curves',
                  desc: 'Elegant orbital strokes applied around the temple and eyes in shimmering gold, based on golden ratios.'
                },
                {
                  title: 'Mandala forehead Piece',
                  geom: 'Sacred Concentric Mandala',
                  desc: 'Intricate micro-mandala center dot painted centered on the forehead using organic natural dyes.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-[#0F5C42]/50 border border-[#C9A84C]/25 rounded-[16px] hover:border-[#E8C96B]/80 hover:scale-[1.03] transition-all duration-300 shadow-lg flex flex-col justify-between group cursor-default text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A84C]/70 font-semibold">{item.geom}</span>
                    <h4 className="font-serif text-lg text-white font-medium mt-1 mb-3 group-hover:text-[#E8C96B] transition-colors">{item.title}</h4>
                    <p className="text-xs font-sans text-[rgba(232,201,107,0.7)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom Detail */}
            <div className="text-center text-xs text-[#C9A84C]/65 border-t border-[#C9A84C]/20 pt-6">
              *All items are handmade, custom-designed, and aligned with traditional sacred geometry principles.
            </div>
          </div>
        </div>
      )}






      {/* Interactive Booking Catalog — Premium Upgraded Design */}
      {(() => {
        const catalog = [
          {
            category: 'Arts & Paintings', id: 'arts', icon: '🖼️',
            tagline: 'Custom handmade art for your home, events & gifting',
            items: [
              { name: 'Lippan Art', icon: '🌸', desc: 'Mirror & clay wall art' },
              { name: 'Mandala Art', icon: '🔮', desc: 'Sacred geometry patterns' },
              { name: 'Custom Name Plates', icon: '🏷️', desc: 'Bespoke door plaques' },
              { name: 'Wood Painting', icon: '🌿', desc: 'Hand-painted wood décor' },
              { name: 'Pot Painting', icon: '🏺', desc: 'Decorative painted pots' },
              { name: 'Canvas Painting', icon: '🖌️', desc: 'Original canvas artwork' },
            ]
          },
          {
            category: 'Event Services', id: 'events', icon: '🎭',
            tagline: 'Live artistry at weddings, parties & festive celebrations',
            items: [
              { name: 'Face Painting', icon: '🎨', desc: 'Live event face art' },
              { name: 'Mehandi / Henna Art', icon: '🌺', desc: 'Traditional henna designs' },
            ]
          },
          {
            category: 'Gifts & Accessories', id: 'gifts', icon: '🎁',
            tagline: 'Thoughtful handcrafted mementos & keepsakes',
            items: [
              { name: 'Handmade Jewellery', icon: '💎', desc: 'Artisan-crafted jewels' },
              { name: 'Return Gifts & Keepsakes', icon: '🎀', desc: 'Custom event mementos' },
              { name: 'German Silver Items', icon: '🥈', desc: 'Oxidised silver crafts' },
            ]
          },
          {
            category: 'Pooja & Rentals', id: 'pooja', icon: '🪔',
            tagline: 'Sacred décor props & festive ceremony rentals',
            items: [
              { name: 'Pooja Thali Sets', icon: '🪔', desc: 'Traditional ritual sets' },
              { name: 'Brass & Copper Vessels', icon: '🏺', desc: 'Ceremonial vessels' },
              { name: 'Floral Décor Rental', icon: '🌸', desc: 'Festive arrangements' },
              { name: 'Event Stage Props', icon: '🎋', desc: 'Backdrops & stage décor' },
            ]
          },
        ];

        const visibleCatalog = activeCategory === 'all'
          ? catalog
          : catalog.filter(c => c.id === activeCategory);

        const whatsappSVG = (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        );

        return (
          <section
            id="interactive-catalog"
            className="relative py-24 px-4 md:px-12 border-t border-[#C9A84C]/20"
            style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #071510 0%, #040D08 55%, #010806 100%)' }}
          >
            <div className="max-w-6xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                {/* 3-step breadcrumb */}
                <div className="inline-flex items-center gap-2 mb-7">
                  {['Choose Services', 'Review', 'Enquire via WhatsApp'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                          style={{
                            background: i === 0 ? '#E8C96B' : 'transparent',
                            border: i === 0 ? '1px solid #E8C96B' : '1px solid rgba(201,168,76,0.2)',
                            color: i === 0 ? '#0B3D2E' : 'rgba(201,168,76,0.35)',
                          }}
                        >{i + 1}</div>
                        <span
                          className="font-sans text-[9px] font-bold tracking-[0.18em] uppercase hidden sm:block"
                          style={{ color: i === 0 ? '#E8C96B' : 'rgba(255,255,255,0.2)' }}
                        >{step}</span>
                      </div>
                      {i < 2 && <div className="w-5 sm:w-8 h-[1px]" style={{ background: 'rgba(201,168,76,0.15)' }} />}
                    </div>
                  ))}
                </div>

                <span className="text-[9px] md:text-[10px] tracking-[0.38em] text-[#C9A84C] font-bold uppercase block mb-4">CUSTOM ESTIMATE & BOOKING</span>
                <h2 className="font-serif text-3xl md:text-5xl text-[#E8C96B] font-medium tracking-wide mb-4">
                  Design Your Event Package
                </h2>
                <div className="w-20 h-[1px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
                <p className="font-sans text-xs md:text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
                  Select the services you need — we'll craft a personalised quote and send it straight to your WhatsApp.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                {[{ id: 'all', category: 'All Services', icon: '✦' }, ...catalog].map(cat => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer"
                      style={{
                        background: isActive ? '#E8C96B' : 'rgba(255,255,255,0.04)',
                        color: isActive ? '#0B3D2E' : 'rgba(255,255,255,0.45)',
                        border: isActive ? '1px solid #E8C96B' : '1px solid rgba(201,168,76,0.12)',
                        boxShadow: isActive ? '0 0 14px rgba(232,201,107,0.25)' : 'none',
                      }}
                    >
                      <span className="text-sm leading-none">{cat.icon}</span>
                      {cat.category}
                    </button>
                  );
                })}
              </div>

              {/* Service Category Panels */}
              <div className="space-y-5">
                {visibleCatalog.map((cat) => {
                  const catSelectedCount = cat.items.filter(i => selectedItems.includes(i.name)).length;
                  return (
                    <div
                      key={cat.category}
                      className="rounded-[20px] overflow-hidden"
                      style={{
                        border: catSelectedCount > 0 ? '1px solid rgba(232,201,107,0.2)' : '1px solid rgba(201,168,76,0.08)',
                        background: 'rgba(10,25,16,0.5)',
                      }}
                    >
                      {/* Category header */}
                      <div className="flex items-center justify-between px-5 md:px-6 py-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                            style={{ background: 'rgba(232,201,107,0.07)', border: '1px solid rgba(232,201,107,0.13)' }}
                          >
                            {cat.icon}
                          </div>
                          <div>
                            <h3 className="font-serif text-sm md:text-base text-white font-medium leading-tight">{cat.category}</h3>
                            <p className="font-sans text-[9px] text-white/28 mt-0.5 hidden sm:block">{cat.tagline}</p>
                          </div>
                        </div>
                        {catSelectedCount > 0 && (
                          <span className="text-[8px] font-bold tracking-[0.15em] uppercase bg-[#E8C96B] text-[#0B3D2E] rounded-full px-3 py-1 shrink-0">
                            {catSelectedCount} selected
                          </span>
                        )}
                      </div>

                      {/* Service tiles */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 md:p-5">
                        {cat.items.map((service) => {
                          const active = selectedItems.includes(service.name);
                          return (
                            <button
                              key={service.name}
                              onClick={() => toggleItemSelection(service.name)}
                              className="relative flex flex-col items-center gap-2 px-2 py-5 rounded-[14px] text-center cursor-pointer select-none group"
                              style={{
                                background: active
                                  ? 'linear-gradient(145deg, rgba(232,201,107,0.15) 0%, rgba(201,168,76,0.05) 100%)'
                                  : 'rgba(15,29,22,0.6)',
                                border: active
                                  ? '1px solid rgba(232,201,107,0.5)'
                                  : '1px solid rgba(201,168,76,0.09)',
                                boxShadow: active
                                  ? '0 0 20px rgba(232,201,107,0.1), inset 0 1px 0 rgba(232,201,107,0.1)'
                                  : '0 2px 8px rgba(0,0,0,0.2)',
                                transform: active ? 'translateY(-2px)' : 'translateY(0)',
                                transition: 'all 0.18s ease',
                              }}
                            >
                              {/* Hover ring */}
                              {!active && (
                                <div
                                  className="absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100 pointer-events-none"
                                  style={{ border: '1px solid rgba(201,168,76,0.25)', transition: 'opacity 0.2s ease' }}
                                />
                              )}

                              {/* Gold checkmark badge */}
                              {active && (
                                <div
                                  className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                  style={{ background: '#E8C96B' }}
                                >
                                  <svg className="w-2.5 h-2.5 fill-none stroke-[#0B3D2E]" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}

                              {/* Icon */}
                              <span
                                className="text-3xl leading-none"
                                style={{ transition: 'transform 0.2s ease' }}
                              >{service.icon}</span>

                              {/* Name */}
                              <span
                                className="font-sans text-[10px] md:text-xs font-semibold leading-snug"
                                style={{ color: active ? '#E8C96B' : 'rgba(255,255,255,0.7)' }}
                              >{service.name}</span>

                              {/* Short descriptor */}
                              <span
                                className="font-sans text-[9px] leading-tight"
                                style={{ color: active ? 'rgba(232,201,107,0.55)' : 'rgba(255,255,255,0.22)' }}
                              >{service.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 2 + 3: Review & Enquire panel */}
              {selectedItems.length > 0 && (
                <div
                  className="mt-10 rounded-[22px] px-6 md:px-8 py-7 animate-fade-in"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,61,40,0.6) 0%, rgba(4,14,9,0.88) 100%)',
                    border: '1px solid rgba(232,201,107,0.28)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(232,201,107,0.05)',
                  }}
                >
                  {/* Step 2 label */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-5 h-5 rounded-full bg-[#E8C96B] flex items-center justify-center text-[9px] font-bold text-[#0B3D2E] shrink-0">2</div>
                    <span className="font-sans text-[9px] font-bold tracking-[0.22em] uppercase text-[#E8C96B]">Review Your Selection</span>
                    <span className="ml-auto font-sans text-[9px] text-white/28">
                      {selectedItems.length} service{selectedItems.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>

                  {/* Selected item pills — tap to deselect */}
                  <div className="flex flex-wrap gap-2 mb-7">
                    {selectedItems.map(item => (
                      <button
                        key={item}
                        onClick={() => toggleItemSelection(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        style={{
                          background: 'rgba(232,201,107,0.1)',
                          border: '1px solid rgba(232,201,107,0.28)',
                          color: '#E8C96B',
                          transition: 'opacity 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        {item}
                        <svg className="w-2.5 h-2.5 shrink-0 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] mb-6" style={{ background: 'rgba(201,168,76,0.1)' }} />

                  {/* Step 3 label + CTA row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.5)' }}>3</div>
                      <span className="font-sans text-[9px] font-bold tracking-[0.18em] uppercase text-white/28">Send Enquiry</span>
                    </div>
                    <div className="flex-1" />
                    <button
                      onClick={clearSelection}
                      className="font-sans text-[9px] font-bold uppercase tracking-wider cursor-pointer px-3 py-2 rounded-full"
                      style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => {
                        const selections = selectedItems.map(i => `• ${i}`).join('\n');
                        const msg = `Hello CraftNest! 🙏\n\nI'd like to enquire about the following services:\n\n${selections}\n\nPlease share pricing and availability. Thank you!`;
                        window.open(`https://wa.me/14704527988?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="inline-flex items-center gap-2.5 text-white font-sans text-[10px] font-bold tracking-[0.18em] uppercase px-7 py-3.5 rounded-full cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #1aa84f 100%)',
                        boxShadow: '0 4px 22px rgba(37,211,102,0.28)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 22px rgba(37,211,102,0.28)'; }}
                    >
                      {whatsappSVG}
                      SEND ENQUIRY ON WHATSAPP
                    </button>
                  </div>
                </div>
              )}

            </div>
          </section>
        );
      })()}

      {/* Contact Section — Premium Redesign */}
      <section
        id="contact"
        className="relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 130% 100% at 50% 110%, #0F3D28 0%, #071510 48%, #010806 100%)' }}
      >
        {/* Background image overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'url(/contact_shop_inquiry.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.055 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(1,8,6,0.55) 0%, rgba(15,61,40,0.2) 50%, rgba(1,8,6,0.75) 100%)' }} />

        {/* Gold radial accents */}
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(232,201,107,0.06), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none" style={{ background: 'radial-gradient(circle at bottom left, rgba(201,168,76,0.04), transparent 70%)' }} />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[9px] md:text-[10px] tracking-[0.38em] text-[#C9A84C] font-bold uppercase block mb-3">CONTACT & BOOKINGS</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-medium tracking-wide mb-4">
              Let's Create{' '}
              <span style={{ color: '#E8C96B', textShadow: '0 0 40px rgba(232,201,107,0.22)' }}>Together</span>
            </h2>
            <div className="w-16 h-[1px] mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* LEFT: Brand & contact info */}
            <div className="space-y-8">
              <p className="font-sans text-sm md:text-base leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.52)' }}>
                Planning a special event or need a custom creation? We'd love to bring your vision to life. Reach out — every enquiry gets a personal reply.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: '⚡', label: 'Responds in 2 hrs' },
                  { icon: '🤝', label: 'Free consultation' },
                  { icon: '✨', label: '100% custom made' },
                ].map(b => (
                  <div key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[9px] font-bold tracking-[0.12em] uppercase"
                    style={{ background: 'rgba(232,201,107,0.07)', border: '1px solid rgba(232,201,107,0.13)', color: 'rgba(232,201,107,0.62)' }}>
                    <span className="text-xs leading-none">{b.icon}</span>{b.label}
                  </div>
                ))}
              </div>

              {/* Contact detail rows */}
              <div className="space-y-4">
                {[
                  {
                    label: 'Phone & WhatsApp', value: '+1 (470) 452-7988', href: 'tel:+14704527988',
                    icon: <svg className="w-[18px] h-[18px] fill-current shrink-0" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
                  },
                  {
                    label: 'Location', value: 'Georgia, USA', href: null,
                    icon: <svg className="w-[18px] h-[18px] fill-none stroke-current shrink-0" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                  },
                  {
                    label: 'Website', value: 'www.craftnestshop.com', href: 'https://craftnestshop.com',
                    icon: <svg className="w-[18px] h-[18px] fill-none stroke-current shrink-0" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>,
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 text-[#C9A84C]"
                      style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.16)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-sans text-[9px] uppercase tracking-[0.14em] mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.label}</div>
                      {item.href
                        ? <a href={item.href} className="font-sans text-sm font-semibold transition-colors" style={{ color: 'rgba(255,255,255,0.82)' }} onMouseEnter={e => (e.currentTarget.style.color = '#E8C96B')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.82)')}>{item.value}</a>
                        : <span className="font-sans text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>{item.value}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Social CTA buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a href="https://wa.me/14704527988" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-sans text-[10px] font-bold tracking-[0.15em] uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #1aa84f 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.22)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 animate-pulse shrink-0" />
                  WhatsApp Us
                </a>
                <a href="https://www.instagram.com/jewelryhivebycraftnest/?hl=en" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-sans text-[10px] font-bold tracking-[0.15em] uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #833ab4 0%, #E1306C 50%, #F77737 100%)', boxShadow: '0 4px 18px rgba(225,48,108,0.22)' }}>
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
              </div>
            </div>

            {/* RIGHT: Premium Enquiry Form Card */}
            <div className="rounded-[28px] overflow-hidden relative"
              style={{ background: 'linear-gradient(145deg, rgba(7,26,16,0.97) 0%, rgba(3,11,7,0.99) 100%)', border: '1px solid rgba(201,168,76,0.18)', boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,201,107,0.04), inset 0 1px 0 rgba(232,201,107,0.06)' }}>

              {/* Inner gold corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(232,201,107,0.07), transparent 65%)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none" style={{ background: 'radial-gradient(circle at bottom left, rgba(201,168,76,0.04), transparent 65%)' }} />

              {/* Card header strip */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.09)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: 'rgba(232,201,107,0.1)', border: '1px solid rgba(232,201,107,0.2)' }}>
                    <svg className="w-4 h-4 fill-current text-[#E8C96B] transform rotate-45" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-[#E8C96B] font-medium tracking-wide leading-tight">Send an Enquiry</h3>
                    <p className="font-sans text-[9px] md:text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Your details open straight in WhatsApp — quick & personal</p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="px-6 sm:px-8 py-6 sm:py-7">
                {formSubmitted ? (
                  <div className="py-14 text-center flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(232,201,107,0.1)', border: '1px solid rgba(232,201,107,0.2)' }}>
                      <svg className="w-7 h-7 stroke-[#E8C96B] fill-none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h4 className="font-serif text-xl text-[#E8C96B] font-medium mb-2">Message Sent!</h4>
                    <p className="font-sans text-xs leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Your enquiry has been sent to WhatsApp. We'll reply within 2 hours with a personalised quote.
                    </p>
                    <button
                      onClick={() => { setContactData({ fullName: '', phoneNumber: '', serviceNeeded: '', eventDate: '', message: '' }); setFormSubmitted(false); }}
                      className="mt-7 font-sans text-[10px] font-bold tracking-[0.18em] uppercase cursor-pointer pb-0.5 transition-colors"
                      style={{ color: '#E8C96B', borderBottom: '1px solid rgba(232,201,107,0.4)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#E8C96B')}
                    >
                      Send Another Request
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const msg = `Hello! I would like to submit an enquiry. Here are my details:\n\n• *Full Name:* ${contactData.fullName}\n• *Phone Number:* ${contactData.phoneNumber}\n• *Service Needed:* ${contactData.serviceNeeded}\n• *Event Date:* ${contactData.eventDate}\n• *Details/Requirement:* ${contactData.message}`;
                      window.open(`https://wa.me/14704527988?text=${encodeURIComponent(msg)}`, '_blank');
                      setFormSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    {/* Row 1: Name + Phone side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Full Name</label>
                        <input
                          type="text" required
                          value={contactData.fullName}
                          onChange={e => setContactData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Your name"
                          className="w-full rounded-[10px] px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}
                          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(232,201,107,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,201,107,0.06)'; }}
                          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Phone / WhatsApp</label>
                        <input
                          type="tel" required
                          value={contactData.phoneNumber}
                          onChange={e => setContactData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="+1 000 000 0000"
                          className="w-full rounded-[10px] px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}
                          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(232,201,107,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,201,107,0.06)'; }}
                          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    {/* Service select */}
                    <div>
                      <label className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Service Needed</label>
                      <select
                        required
                        value={contactData.serviceNeeded}
                        onChange={e => setContactData(prev => ({ ...prev, serviceNeeded: e.target.value }))}
                        className="w-full rounded-[10px] px-4 py-3 font-sans text-sm text-white focus:outline-none transition-all cursor-pointer appearance-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}
                        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(232,201,107,0.5)'; }}
                        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)'; }}
                      >
                        <option value="" disabled style={{ background: '#071A10', color: 'rgba(255,255,255,0.4)' }}>Select a service…</option>
                        <option value="Handmade Jewellery" style={{ background: '#071A10', color: '#fff' }}>💎 Handmade Jewellery</option>
                        <option value="Arts & Crafts" style={{ background: '#071A10', color: '#fff' }}>🖌️ Arts & Crafts</option>
                        <option value="Face Painting" style={{ background: '#071A10', color: '#fff' }}>🎨 Face Painting</option>
                        <option value="Mehandi / Henna Art" style={{ background: '#071A10', color: '#fff' }}>🌺 Mehandi / Henna Art</option>
                        <option value="Return Gifts & Keepsakes" style={{ background: '#071A10', color: '#fff' }}>🎀 Return Gifts & Keepsakes</option>
                        <option value="Pooja & Event Rentals" style={{ background: '#071A10', color: '#fff' }}>🪔 Pooja & Event Rentals</option>
                        <option value="Other Bespoke Request" style={{ background: '#071A10', color: '#fff' }}>✨ Other Bespoke Request</option>
                      </select>
                    </div>

                    {/* Event date */}
                    <div>
                      <label className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Event Date</label>
                      <input
                        type="date" required
                        value={contactData.eventDate}
                        onChange={e => setContactData(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full rounded-[10px] px-4 py-3 font-sans text-sm text-white focus:outline-none transition-all cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', colorScheme: 'dark' }}
                        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(232,201,107,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,201,107,0.06)'; }}
                        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Your Message</label>
                      <textarea
                        rows={3} required
                        value={contactData.message}
                        onChange={e => setContactData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Describe your event, theme, quantity, or any custom requirements…"
                        className="w-full rounded-[10px] px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:outline-none transition-all resize-none leading-relaxed"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}
                        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(232,201,107,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,201,107,0.06)'; }}
                        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-[12px] font-sans text-[10px] md:text-xs font-bold tracking-[0.22em] uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer mt-1"
                      style={{ background: 'linear-gradient(135deg, #E8C96B 0%, #C9A84C 100%)', color: '#0B3D2E', boxShadow: '0 4px 20px rgba(232,201,107,0.25)' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(232,201,107,0.38)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,201,107,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0 transform rotate-45" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                      SEND ENQUIRY ON WHATSAPP
                    </button>

                    <p className="text-center font-sans text-[9px] mt-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
                      Opens WhatsApp with your details pre-filled · Free &amp; instant
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY SECTION ─────────────────────────────────────────────────────── */}
      {(() => {
        const filtered = galleryFilter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.category === galleryFilter)
        const GALLERY_LIMIT = 12
        const visibleItems = galleryShowAll ? filtered : filtered.slice(0, GALLERY_LIMIT)
        const FILTERS: { id: GalleryCat; label: string; icon: string }[] = [
          { id: 'all',    label: 'All Photos', icon: '✦' },
          { id: 'events', label: 'Events',     icon: '🎉' },
          { id: 'arts',   label: 'Arts',       icon: '🎨' },
          { id: 'other',  label: 'Others',     icon: '📸' },
        ]
        // Heights cycle to create varied masonry feel
        const HEIGHTS = ['h-44 sm:h-64', 'h-52 sm:h-80', 'h-48 sm:h-72', 'h-56 sm:h-96', 'h-40 sm:h-60', 'h-52 sm:h-80', 'h-48 sm:h-72', 'h-44 sm:h-64', 'h-52 sm:h-80', 'h-56 sm:h-96', 'h-40 sm:h-60', 'h-48 sm:h-72', 'h-52 sm:h-80', 'h-44 sm:h-64', 'h-56 sm:h-96', 'h-48 sm:h-72']

        return (
          <section
            id="gallery"
            className="relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 border-t border-[#C9A84C]/15"
            style={{ background: 'radial-gradient(ellipse 110% 80% at 50% 0%, #0A2318 0%, #050F0A 55%, #020806 100%)' }}
          >
            {/* Dot texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #E8C96B 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="max-w-7xl mx-auto relative z-10">

              {/* Section Header */}
              <div className="text-center mb-12">
                <span className="text-[9px] md:text-[10px] tracking-[0.38em] text-[#C9A84C] font-bold uppercase block mb-3">CRAFTNEST PORTFOLIO</span>
                <h2 className="font-serif text-3xl md:text-5xl text-white font-medium tracking-wide mb-4">
                  Our <span style={{ color: '#E8C96B', textShadow: '0 0 40px rgba(232,201,107,0.2)' }}>Gallery</span>
                </h2>
                <div className="w-20 h-[1px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
                <p className="font-sans text-xs md:text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  A glimpse into our world of handmade crafts, live events, and artisan creations — every frame tells a story.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mb-8 sm:mb-10 px-2 sm:px-0">
                {FILTERS.map(f => {
                  const isActive = galleryFilter === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => { setGalleryFilter(f.id); setGalleryShowAll(false) }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[10px] font-bold tracking-[0.16em] uppercase cursor-pointer transition-all duration-200"
                      style={{
                        background: isActive ? '#E8C96B' : 'rgba(255,255,255,0.04)',
                        color: isActive ? '#0B3D2E' : 'rgba(255,255,255,0.45)',
                        border: isActive ? '1px solid #E8C96B' : '1px solid rgba(201,168,76,0.12)',
                        boxShadow: isActive ? '0 0 18px rgba(232,201,107,0.22)' : 'none',
                        transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                      }}
                    >
                      <span className="text-sm leading-none">{f.icon}</span>
                      {f.label}
                      <span
                        className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: isActive ? 'rgba(11,61,46,0.25)' : 'rgba(201,168,76,0.1)',
                          color: isActive ? '#0B3D2E' : 'rgba(201,168,76,0.45)',
                        }}
                      >
                        {f.id === 'all' ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(g => g.category === f.id).length}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Masonry Grid (CSS columns) */}
              {filtered.length === 0 ? (
                <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <p className="font-serif text-xl">No photos yet in this category</p>
                  <p className="font-sans text-xs mt-2">Check back soon — we're adding more!</p>
                </div>
              ) : (
                <>
                <div className="gallery-masonry" style={{ columnGap: '14px' }}>
                  {visibleItems.map((item) => {
                    const i = filtered.findIndex(g => g.id === item.id)
                    return (
                    <div
                      key={item.id}
                      onClick={() => setLightboxIdx(i)}
                      className={`group relative overflow-hidden rounded-[16px] cursor-pointer ${HEIGHTS[i % HEIGHTS.length]}`}
                      style={{
                        breakInside: 'avoid',
                        marginBottom: '14px',
                        display: 'block',
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-400 opacity-60 group-hover:opacity-80" />
                      {/* Gold border ring on hover */}
                      <div className="absolute inset-[1px] rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ outline: '1.5px solid rgba(232,201,107,0.5)' }} />

                      {/* Category badge */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <span
                          className="font-sans text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                          style={{
                            background: item.category === 'events' ? 'rgba(232,201,107,0.85)' : item.category === 'arts' ? 'rgba(141,184,124,0.85)' : 'rgba(155,114,207,0.85)',
                            color: '#fff',
                          }}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Caption + expand icon */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350">
                        <div className="flex items-end justify-between">
                          <span className="font-sans text-xs font-semibold text-white/90 leading-tight">{item.caption}</span>
                          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 ml-2">
                            <svg className="w-3.5 h-3.5 fill-none stroke-white" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19A8 8 0 1011 3a8 8 0 000 16z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 8v6M8 11h6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  })}
                </div>

                {/* Show More / Show Less button */}
                {filtered.length > GALLERY_LIMIT && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setGalleryShowAll(prev => !prev)}
                      className="inline-flex items-center gap-2.5 font-sans text-[10px] font-bold tracking-[0.22em] uppercase px-8 py-3.5 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer"
                      style={{
                        background: galleryShowAll ? 'rgba(201,168,76,0.1)' : 'rgba(232,201,107,0.92)',
                        color: galleryShowAll ? '#E8C96B' : '#0B3D2E',
                        border: galleryShowAll ? '1px solid rgba(201,168,76,0.35)' : '1px solid #E8C96B',
                        boxShadow: galleryShowAll ? 'none' : '0 4px 20px rgba(232,201,107,0.2)',
                      }}
                    >
                      {galleryShowAll ? (
                        <>
                          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                          SHOW LESS
                        </>
                      ) : (
                        <>
                          VIEW ALL {filtered.length} PHOTOS
                          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
                </>
              )}

              {/* Bottom CTA */}
              <div className="mt-14 text-center">
                <p className="font-serif italic text-sm mb-5" style={{ color: 'rgba(232,201,107,0.45)' }}>
                  Want to see more? Follow us on Instagram for daily updates.
                </p>
                <a
                  href="https://www.instagram.com/jewelryhivebycraftnest/?hl=en"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white px-7 py-3.5 rounded-full font-sans text-[10px] font-bold tracking-[0.18em] uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #833ab4 0%, #E1306C 50%, #F77737 100%)', boxShadow: '0 4px 18px rgba(225,48,108,0.25)' }}
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Follow on Instagram
                </a>
              </div>
            </div>
          </section>
        )
      })()}

      {/* Gallery Lightbox */}
      {lightboxIdx !== null && (() => {
        const filtered = galleryFilter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.category === galleryFilter)
        const item = filtered[lightboxIdx]
        if (!item) return null
        const goPrev = () => setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length)
        const goNext = () => setLightboxIdx((lightboxIdx + 1) % filtered.length)
        return (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in"
            style={{ background: 'rgba(2,8,5,0.94)', backdropFilter: 'blur(18px)' }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button
              onClick={e => { e.stopPropagation(); setLightboxIdx(null) }}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer z-10"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase z-10" style={{ color: 'rgba(201,168,76,0.55)' }}>
              {lightboxIdx + 1} <span style={{ color: 'rgba(255,255,255,0.18)' }}>/ {filtered.length}</span>
            </div>

            {/* Prev arrow */}
            <button
              onClick={e => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 md:left-8 w-11 h-11 rounded-full flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-all hover:scale-110 z-10"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </button>

            {/* Image container */}
            <div
              className="relative max-w-4xl w-full mx-16 md:mx-24 animate-scale-in"
              onClick={e => e.stopPropagation()}
            >
              <div className="rounded-[20px] overflow-hidden" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.12)' }}>
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full max-h-[80vh] object-contain"
                  style={{ background: '#020A05' }}
                />
              </div>
              {/* Caption bar */}
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <span
                    className="font-sans text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: item.category === 'events' ? 'rgba(232,201,107,0.15)' : item.category === 'arts' ? 'rgba(141,184,124,0.15)' : 'rgba(155,114,207,0.15)',
                      color: item.category === 'events' ? '#E8C96B' : item.category === 'arts' ? '#8DB87C' : '#9B72CF',
                      border: `1px solid ${item.category === 'events' ? 'rgba(232,201,107,0.25)' : item.category === 'arts' ? 'rgba(141,184,124,0.25)' : 'rgba(155,114,207,0.25)'}`,
                    }}
                  >
                    {item.category}
                  </span>
                  <span className="font-sans text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.caption}</span>
                </div>
                <span className="font-sans text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Press ← → to navigate • Esc to close</span>
              </div>
            </div>

            {/* Next arrow */}
            <button
              onClick={e => { e.stopPropagation(); goNext() }}
              className="absolute right-4 md:right-8 w-11 h-11 rounded-full flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-all hover:scale-110 z-10"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        )
      })()}


            {/* Our Story & Heritage — Combined 3D Cinematic Ending */}
      <section
        id="our-story"
        className="relative overflow-hidden py-20 md:py-28 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16 border-t border-[#C9A84C]/10"
        style={{ background: 'radial-gradient(ellipse 130% 90% at 50% 110%, #0F3D28 0%, #071510 48%, #010806 100%)' }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setStoryMouse({
            x: (e.clientX - rect.left - rect.width / 2) / rect.width,
            y: (e.clientY - rect.top - rect.height / 2) / rect.height,
          })
        }}
        onMouseLeave={() => setStoryMouse({ x: 0, y: 0 })}
      >
        {/* ── Parallax layer 1: slow rotating mandala backdrop ── */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            transform: `translate(${storyMouse.x * 22}px, ${storyMouse.y * 22}px)`,
            transition: 'transform 1s ease-out',
          }}
        >
          <div
            className="rotating-mandala-bg opacity-[0.045]"
            style={{
              width: '130vw', height: '130vw', maxWidth: '1100px', maxHeight: '1100px',
              backgroundImage: 'url(https://res.cloudinary.com/diancfp03/image/upload/v1780162699/home_sa22ka.png)',
              backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            }}
          />
        </div>

        {/* ── Parallax layer 2: floating gold orbs (medium speed) ── */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{ transform: `translate(${storyMouse.x * 45}px, ${storyMouse.y * 45}px)`, transition: 'transform 0.45s ease-out' }}
        >
          <div className="absolute top-[18%] left-[8%]  w-1.5 h-1.5 rounded-full bg-[#E8C96B]/20" />
          <div className="absolute top-[32%] right-[12%] w-2   h-2   rounded-full bg-[#E8C96B]/12" />
          <div className="absolute top-[60%] left-[15%] w-1   h-1   rounded-full bg-[#C9A84C]/25" />
          <div className="absolute top-[75%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#E8C96B]/10" />
          <div className="absolute top-[48%] left-[5%]  w-1   h-1   rounded-full bg-[#E8C96B]/18" />
          <div className="absolute top-[22%] right-[6%]  w-1.5 h-1.5 rounded-full bg-[#C9A84C]/15" />
        </div>

        {/* ── Dot grid texture ── */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #E8C96B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* ═══════════════════════════════ CONTENT ═══════════════════════════════ */}
        <div className="max-w-7xl mx-auto relative z-10">

          {/* ── Chapter 1: Opening Title ── */}
          <div className="text-center mb-16 md:mb-24 lg:mb-32">
            <span className="text-[9px] md:text-[10px] tracking-[0.42em] text-[#C9A84C] font-bold uppercase block mb-6">
              OUR STORY & HERITAGE
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] text-white font-medium tracking-tight leading-[1.08] mb-8"
              style={{
                transform: `translate(${storyMouse.x * -18}px, ${storyMouse.y * -10}px)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              Where Creativity<br />
              <span style={{ color: '#E8C96B', textShadow: '0 0 60px rgba(232,201,107,0.25)' }}>
                Meets Celebration
              </span>
            </h2>
            <div className="w-28 h-[1.5px] mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          </div>

          {/* ── Chapter 2: The Story — editorial split ── */}
          <div className="flex flex-col lg:flex-row gap-10 md:gap-14 lg:gap-20 items-center mb-20 md:mb-28 lg:mb-36">

            {/* Story text */}
            <div className="w-full lg:w-[48%] space-y-6">
              <p className="font-serif italic text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed" style={{ color: 'rgba(232,201,107,0.72)' }}>
                Born from a passion for handmade art.
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                CraftNest was born from a passion for handmade art, personalized gifts, and creating memorable experiences for families and children. What started as a hobby of crafting unique handmade creations gradually grew into a business dedicated to bringing joy through art and creativity.
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                At CraftNest, we believe handmade creations tell a story. Every item we create is crafted with love and designed to make your celebrations more meaningful and memorable.
              </p>
              <div className="border-l-2 pl-5 mt-2" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
                <p className="font-serif italic text-sm leading-relaxed" style={{ color: 'rgba(232,201,107,0.5)' }}>
                  "Thank you for supporting our small business and allowing us to be a part of your special moments."
                </p>
              </div>
            </div>

            {/* 3D floating image — tilts with cursor */}
            <div
              className="w-full lg:w-[52%]"
              style={{
                transform: `perspective(1000px) rotateX(${storyMouse.y * -11}deg) rotateY(${storyMouse.x * 11}deg)`,
                transition: 'transform 0.18s ease-out',
              }}
            >
              <div
                className="relative rounded-[26px] overflow-hidden"
                style={{
                  border: '1px solid rgba(201,168,76,0.18)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 0 60px rgba(201,168,76,0.04)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=900"
                  alt="CraftNest handcrafted art"
                  className="w-full h-52 sm:h-64 md:h-72 lg:h-[360px] object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(1,8,6,0.65) 0%, transparent 55%)' }} />
                {/* Subtle inner border glow */}
                <div className="absolute inset-0 rounded-[26px]" style={{ boxShadow: 'inset 0 0 50px rgba(232,201,107,0.05)' }} />
              </div>
            </div>
          </div>

          {/* ── Chapter 3: Specialties — 3D tilt cards ── */}
          <div className="mb-28 md:mb-36">
            <div className="text-center mb-12">
              <span className="text-[9px] tracking-[0.38em] text-[#C9A84C] uppercase font-bold">WHAT WE SPECIALIZE IN</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {[
                { icon: '🎨', title: 'Face Painting', desc: 'Transforming birthdays, festivals, school events, and parties into colourful and unforgettable experiences with creative, skin-safe face painting designs.' },
                { icon: '🎁', title: 'Return Gifts', desc: 'Thoughtfully handcrafted return gifts for every occasion — custom hair accessories, bangles, and keepsakes your guests will cherish long after the celebration.' },
                { icon: '🖌️', title: 'Crafts & Arts', desc: 'Traditional Lippan Art, personalized nameplates, mandala art, canvas painting, wood painting, and custom handmade décor — every piece crafted with love.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onMouseMove={handleMouseMove3D}
                  onMouseLeave={(e) => {
                    handleMouseLeave3D(e as React.MouseEvent<HTMLElement>);
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.14)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(232,201,107,0.04)';
                  }}
                  className="relative rounded-[22px] p-7 md:p-8 cursor-default group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,61,40,0.6) 0%, rgba(4,14,9,0.8) 100%)',
                    border: '1px solid rgba(201,168,76,0.14)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(232,201,107,0.04)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,201,107,0.3)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 64px rgba(0,0,0,0.6), 0 0 40px rgba(232,201,107,0.06), inset 0 1px 0 rgba(232,201,107,0.08)';
                  }}
                >
                  {/* Top gold shimmer on hover */}
                  <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,201,107,0.4), transparent)' }} />

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                    style={{ background: 'rgba(232,201,107,0.07)', border: '1px solid rgba(232,201,107,0.14)' }}
                  >
                    {item.icon}
                  </div>
                  <h4 className="font-serif text-xl text-white font-medium mb-3 group-hover:text-[#E8C96B] transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Chapter 4: Heritage Finale ── */}
          <div className="text-center">

            {/* Manifesto — slow parallax */}
            <div
              className="max-w-3xl mx-auto mb-14"
              style={{
                transform: `translate(${storyMouse.x * 12}px, ${storyMouse.y * 7}px)`,
                transition: 'transform 0.4s ease-out',
              }}
            >
              <p
                className="font-serif italic text-lg md:text-2xl leading-relaxed"
                style={{ color: 'rgba(232,201,107,0.6)', textShadow: '0 0 40px rgba(232,201,107,0.08)' }}
              >
                "CraftNest is an artistic sanctuary dedicated to handcrafting bespoke legacy art, luxury return gifts, and creative event experiences that connect homes and hearts across Georgia and beyond."
              </p>
            </div>

            {/* Logo — 3D floating */}
            <div
              className="flex items-center justify-center mb-5"
              style={{
                transform: `perspective(700px) rotateX(${storyMouse.y * -9}deg) rotateY(${storyMouse.x * 9}deg)`,
                transition: 'transform 0.22s ease-out',
              }}
            >
              <svg viewBox="0 0 100 80" className="w-20 h-16 shiny-logo-hover" fill="none" stroke="#E8C96B" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 52 35 C 55 18, 38 12, 24 16 C 10 20, 8 38, 12 50 C 16 62, 30 70, 42 66 C 46 64, 48 58, 45 54 C 42 50, 48 44, 52 35 Z" strokeWidth="2.5" />
                <circle cx="37" cy="51" r="5.5" strokeWidth="2.0" />
                <circle cx="23" cy="49" r="3.2" strokeWidth="2.0" /><circle cx="20" cy="40" r="3.2" strokeWidth="2.0" />
                <circle cx="22" cy="31" r="3.2" strokeWidth="2.0" /><circle cx="28" cy="23" r="3.2" strokeWidth="2.0" />
                <circle cx="36" cy="23" r="3.2" strokeWidth="2.0" /><circle cx="43" cy="27" r="3.2" strokeWidth="2.0" />
                <circle cx="46" cy="35" r="3.2" strokeWidth="2.0" />
                <rect x="57.5" y="32" width="3.0" height="40" rx="1.5" strokeWidth="2.0" />
                <path d="M 57.5 32 L 56.5 29 L 57.5 24 H 60.5 L 61.5 29 L 60.5 32 Z" strokeWidth="2.0" />
                <path d="M 57.5 24 C 54.5 19, 54.5 13, 59 7 C 62.5 11, 62.5 19, 60.5 24 Z" strokeWidth="2.0" />
              </svg>
            </div>

            {/* Founder signature */}
            <div className="select-none py-2 flex items-center justify-center mb-2">
              <div className="flex items-baseline">
                <span className="text-6xl md:text-7xl font-serif font-extrabold leading-none italic" style={{ color: '#E8C96B', textShadow: '0 0 30px rgba(232,201,107,0.3)' }}>P</span>
                <span className="text-3xl md:text-4xl tracking-wide font-normal -ml-1 mr-3" style={{ fontFamily: 'var(--font-cursive)', color: 'rgba(255,255,255,0.45)' }}>rasanthi</span>
                <span className="text-6xl md:text-7xl font-serif font-extrabold leading-none italic" style={{ color: '#E8C96B', textShadow: '0 0 30px rgba(232,201,107,0.3)' }}>G</span>
                <span className="text-3xl md:text-4xl tracking-wide font-normal -ml-1" style={{ fontFamily: 'var(--font-cursive)', color: 'rgba(255,255,255,0.45)' }}>anta</span>
              </div>
            </div>

            <span className="text-[9px] md:text-[10px] tracking-[0.32em] text-[#C9A84C] font-bold uppercase block mb-12">
              Owner, Proprietor & Founder · Craft Nest
            </span>

            {/* Contact row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.28)' }}>
              <span>📞 +1 (470) 452-7988</span>
              <span style={{ color: 'rgba(201,168,76,0.25)' }}>•</span>
              <span>📍 Georgia, USA</span>
              <span style={{ color: 'rgba(201,168,76,0.25)' }}>•</span>
              <span>🌐 www.craftnestshop.com</span>
            </div>

          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t" style={{ background: '#040D08', borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-12">
          {/* Top row: logo + nav links */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-7 mb-6 sm:mb-8 pb-6 sm:pb-8" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
            {/* Brand */}
            <div className="text-center sm:text-left">
              <span className="font-serif text-base tracking-[0.25em] font-bold uppercase" style={{ color: '#E8C96B' }}>CRAFT NEST</span>
              <p className="font-sans text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Handmade with pride in Georgia, USA</p>
            </div>
            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
              {['#services', '#arts-crafts', '#pooja-rentals', '#gallery', '#our-story', '#contact'].map((href, i) => (
                <a key={href} href={href} className="font-sans text-[9px] font-semibold tracking-[0.15em] uppercase transition-colors"
                  style={{ color: 'rgba(201,168,76,0.5)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E8C96B')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.5)')}
                >
                  {['Our Services', 'Arts & Crafts', 'Pooja Rentals', 'Gallery', 'Our Story', 'Contact'][i]}
                </a>
              ))}
            </div>
          </div>
          {/* Bottom row: copyright + socials */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-[9px] tracking-[0.18em] text-center sm:text-left" style={{ color: 'rgba(201,168,76,0.35)' }}>
              © {new Date().getFullYear()} CRAFT NEST. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/14704527988" target="_blank" rel="noopener noreferrer" className="font-sans text-[9px] font-bold tracking-wider uppercase transition-colors" style={{ color: 'rgba(37,211,102,0.5)' }} onMouseEnter={e => (e.currentTarget.style.color = '#25D366')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(37,211,102,0.5)')}>WhatsApp</a>
              <a href="https://www.instagram.com/jewelryhivebycraftnest/?hl=en" target="_blank" rel="noopener noreferrer" className="font-sans text-[9px] font-bold tracking-wider uppercase transition-colors" style={{ color: 'rgba(225,48,108,0.45)' }} onMouseEnter={e => (e.currentTarget.style.color = '#E1306C')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(225,48,108,0.45)')}>Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <a 
          href="https://wa.me/14704527988" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Contact on WhatsApp"
          className="flex items-center justify-center w-[52px] h-[52px] bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ease-out hover:shadow-[0_4px_20px_rgba(37,211,102,0.4)] group"
        >
          {/* Custom SVG WhatsApp logo in white */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.004 2c-5.51 0-9.99 4.49-9.99 10 0 2 .59 3.88 1.61 5.47l-1.07 3.93 4.07-1.07c1.51.82 3.22 1.29 5.02 1.29 5.51 0 10-4.49 10-10s-4.49-10-10-10zm6.5 13.91c-.24.67-1.18 1.24-1.92 1.32-.51.05-1.18.08-3.41-.85-2.85-1.18-4.69-4.08-4.83-4.27-.14-.19-1.15-1.53-1.15-2.92S7.92 7.4 8.16 7.15c.24-.24.52-.31.7-.31.17 0 .34.01.49.02.16.01.37-.06.57.43.2.5.7 1.7.76 1.83.06.13.1.28.01.46-.09.18-.14.29-.28.45-.14.16-.3.36-.43.48-.15.14-.31.3-.13.61.18.31.8 1.31 1.71 2.12.91.81 1.67 1.06 2.05 1.25.31.16.49.14.67-.06.19-.22.82-.95 1.04-1.28.22-.33.45-.28.76-.16.31.12 1.97.93 2.31 1.1.34.17.57.25.65.39.09.14.09.82-.15 1.49z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
