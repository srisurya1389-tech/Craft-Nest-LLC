import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

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
    bannerImg: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703432/WhatsApp_Image_2026-06-15_at_11.44.38_PM_rrjcsk.jpg',
    heroDesc: 'Curated, handcrafted keepsakes your guests will treasure long after the celebration ends.',
    promoTitle: 'CUSTOM RETURN GIFTS',
    promoSubtitle: 'Minimum 10 pieces · Premium wraps + personalised tags included',
    filters: [],
    products: [
      { title: 'Brass Diya Set',                  badge: 'Bestseller',  desc: 'Polished brass oil lamp diyas — the most cherished and auspicious return gift for every pooja and wedding celebration.',         price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703432/WhatsApp_Image_2026-06-15_at_11.44.38_PM_rrjcsk.jpg',    occasion: 'Bronze' },
      { title: 'German Silver Katori Set',         badge: 'Traditional', desc: 'Classic German silver katori (bowl) set with intricate floral engravings — a timeless gifting staple for all occasions.',         price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703457/WhatsApp_Image_2026-06-15_at_11.45.59_PM_1_rskjp3.jpg',  occasion: 'Silver' },
      { title: 'Personalised Wooden Keychain',     badge: 'Popular',     desc: 'Custom laser-engraved wooden keychain with name or monogram — a practical and charming keepsake every guest will use.',            price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703458/WhatsApp_Image_2026-06-15_at_11.45.59_PM_pq4sd9.jpg',    occasion: 'Wood' },
      { title: 'Embroidered Potli Bag',            badge: 'Bestseller',  desc: 'Hand-embroidered silk potli bags with drawstring — elegantly filled with sweets or mementos, ideal for weddings and festivals.',   price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_17_jtud4w.jpg', occasion: 'Fabric' },
      { title: 'Brass Ganesha Idol',               badge: 'Traditional', desc: 'Miniature hand-cast brass Ganesha idol — a sacred and meaningful return gift that blesses every home it enters.',                   price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703460/WhatsApp_Image_2026-06-15_at_11.44.39_PM_12_ljakzf.jpg', occasion: 'Bronze' },
      { title: 'Silver-Plated Photo Frame',        badge: 'Popular',     desc: 'Elegant silver-plated photo frame with ornate border — a sentimental keepsake your guests will proudly display at home.',           price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703464/WhatsApp_Image_2026-06-15_at_11.44.39_PM_16_zxyqct.jpg', occasion: 'Silver' },
      { title: 'Wooden Coaster Set',               badge: 'New',         desc: 'Set of 4 hand-painted wooden coasters with mandala or floral motifs — a stylish and practical everyday keepsake.',                   price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_14_nkiamc.jpg', occasion: 'Wood' },
      { title: 'Silk Gift Pouch',                  badge: 'Popular',     desc: 'Luxurious pure silk drawstring pouch in festive colours — perfect for tucking in small gifts, dry fruits, or trinkets.',            price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703465/WhatsApp_Image_2026-06-15_at_11.44.39_PM_13_vzch7z.jpg', occasion: 'Fabric' },
      { title: 'Brass Kumkum Box',                 badge: 'Traditional', desc: 'Intricately etched brass kumkum dabbi with lid — a sacred gifting essential for poojas, namakarnams, and weddings.',                price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703466/WhatsApp_Image_2026-06-15_at_11.44.39_PM_5_fp5ev6.jpg',  occasion: 'Bronze' },
      { title: 'German Silver Bowl',               badge: 'Bestseller',  desc: 'Heavy-gauge German silver bowl with hammered finish — a premium gifting choice for corporate and wedding celebrations alike.',        price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703470/WhatsApp_Image_2026-06-15_at_11.44.39_PM_11_ut0qm5.jpg', occasion: 'Silver' },
      { title: 'Hand-Painted Name Plate',          badge: 'Custom',      desc: 'Personalised hand-painted wooden name plate with your choice of colour, font and motif — a unique gift guests will remember.',        price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703472/WhatsApp_Image_2026-06-15_at_11.44.39_PM_15_psm5z7.jpg', occasion: 'Wood' },
      { title: 'Handmade Scrunchie Set',           badge: 'Popular',     desc: 'Set of 3 handmade fabric scrunchies in coordinating prints — a fun, affordable and much-loved return gift for all ages.',            price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703473/WhatsApp_Image_2026-06-15_at_11.44.39_PM_4_urdkmz.jpg',  occasion: 'Fabric' },
      { title: 'Brass Incense Holder',             badge: 'Traditional', desc: 'Ornamental brass agarbatti stand with peacock or lotus design — brings fragrance and elegance to every home pooja corner.',           price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703474/WhatsApp_Image_2026-06-15_at_11.44.39_PM_6_ffkcw3.jpg',  occasion: 'Bronze' },
      { title: 'German Silver Coin',               badge: 'Traditional', desc: 'Embossed German silver coin with Lakshmi or Ganesha motif — an auspicious token gifted at poojas, weddings, and namakarnams.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_9_okeqny.jpg',  occasion: 'Silver' },
      { title: 'Engraved Wooden Box',              badge: 'Popular',     desc: 'Laser-engraved wooden keepsake box with personalised name and date — ideal for storing jewellery, rings, or precious mementos.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703478/WhatsApp_Image_2026-06-15_at_11.44.39_PM_10_wuurwg.jpg', occasion: 'Wood' },
      { title: 'Cotton Tote Bag',                  badge: 'New',         desc: 'Printed cotton tote bag with event name or motif — an eco-friendly, reusable return gift loved by guests of every generation.',        price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703481/WhatsApp_Image_2026-06-15_at_11.44.39_PM_8_o6edty.jpg',  occasion: 'Fabric' },
      { title: 'Brass Puja Bell',                  badge: 'Traditional', desc: 'Handcrafted brass ghanti with wooden handle — a classic return gift item that carries divine resonance to every household.',          price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703482/WhatsApp_Image_2026-06-15_at_11.44.39_PM_7_jghcyy.jpg',  occasion: 'Bronze' },
      { title: 'Velvet Gift Pouch',                badge: 'Popular',     desc: 'Plush velvet drawstring pouch in rich jewel tones — a sophisticated packaging choice for coins, trinkets, or small gift items.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_3_ogkcmu.jpg',  occasion: 'Fabric' },
      { title: 'Silver-Plated Keychain',           badge: 'Popular',     desc: 'Personalised silver-plated keychain with engraved name or charm — a sleek, everyday keepsake your guests will carry with them.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.38_PM_17_lpewy6.jpg', occasion: 'Silver' },
      { title: 'Wooden Pen Stand',                 badge: 'New',         desc: 'Hand-finished wooden pen stand with carved detailing — a desk-worthy return gift for corporate events and school functions.',           price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703488/WhatsApp_Image_2026-06-15_at_11.44.39_PM_1_u3xdrk.jpg',  occasion: 'Wood' },
      { title: 'Brass Elephant Figurine',          badge: 'Bestseller',  desc: 'Polished brass elephant idol with raised trunk — a symbol of good fortune and prosperity, cherished as a return gift across cultures.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_12_akfzuq.jpg', occasion: 'Bronze' },
      { title: 'German Silver Spoon Set',          badge: 'Traditional', desc: 'Set of 2 German silver spoons with floral engravings — a classic housewarming and wedding return gift with lasting sentimental value.',price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.38_PM_16_u6zdtb.jpg', occasion: 'Silver' },
      { title: 'Embroidered Key Pouch',            badge: 'Custom',      desc: 'Handmade fabric key pouch with mirror-work or thread embroidery — a compact, personalised return gift with artisan flair.',            price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703490/WhatsApp_Image_2026-06-15_at_11.44.38_PM_13_v03xkv.jpg', occasion: 'Fabric' },
      { title: 'Painted Wooden Diya',              badge: 'Popular',     desc: 'Handcrafted and hand-painted wooden diya with gold and floral motifs — a decorative festive return gift with a traditional heart.',     price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703491/WhatsApp_Image_2026-06-15_at_11.44.39_PM_rbq9hh.jpg',    occasion: 'Wood' },
      { title: 'Brass Kalash',                     badge: 'Traditional', desc: 'Sacred brass kalash with coin lid — offered as a return gift at griha pravesh, naming ceremonies, and auspicious family events.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703493/WhatsApp_Image_2026-06-15_at_11.44.38_PM_10_fnjykf.jpg', occasion: 'Bronze' },
      { title: 'Silk Drawstring Pouch',            badge: 'New',         desc: 'Fine silk pouch in bridal or festive palette, finished with golden tassels — an elegant wrapping for small gifts and dry fruits.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703500/WhatsApp_Image_2026-06-15_at_11.44.38_PM_4_smujcn.jpg',  occasion: 'Fabric' },
      { title: 'Wooden Photo Frame',               badge: 'Custom',      desc: 'Personalised hand-carved or painted wooden photo frame — a heartfelt return gift families will display for years to come.',             price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703498/WhatsApp_Image_2026-06-15_at_11.44.38_PM_5_jzajky.jpg',  occasion: 'Wood' },
      { title: 'Silver-Plated Bowl',               badge: 'Bestseller',  desc: 'Classic silver-plated katori bowl — a time-honoured return gift for weddings and poojas that every Indian household treasures.',         price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_9_ccmlvt.jpg',  occasion: 'Silver' },
      { title: 'Brass Namaskar Idol',              badge: 'Traditional', desc: 'Brass figurine in the classic namaskar pose — a spiritually meaningful and beautifully finished return gift for all celebrations.',       price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703497/WhatsApp_Image_2026-06-15_at_11.44.38_PM_7_v0ft5e.jpg',  occasion: 'Bronze' },
      { title: 'German Silver Pen Stand',          badge: 'Popular',     desc: 'German silver desk pen stand with etched patterns — a refined return gift for corporate galas, school events, and office farewells.',    price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703495/WhatsApp_Image_2026-06-15_at_11.44.38_PM_15_ksfmdn.jpg', occasion: 'Silver' },
      { title: 'Engraved Wooden Coaster',          badge: 'New',         desc: 'Single personalised wooden coaster with laser-engraved mandala or name — a thoughtful everyday keepsake for every guest.',               price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703494/WhatsApp_Image_2026-06-15_at_11.44.38_PM_11_c76arm.jpg', occasion: 'Wood' },
      { title: 'Handwoven Gift Pouch',             badge: 'Custom',      desc: 'Artisan handwoven fabric pouch in traditional weave patterns — a unique and eco-conscious return gift with authentic cultural character.',  price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703501/WhatsApp_Image_2026-06-15_at_11.44.38_PM_6_y9ykiz.jpg',  occasion: 'Fabric' },
      { title: 'Brass Oil Lamp',                   badge: 'Bestseller',  desc: 'Traditional brass deepam oil lamp with decorative wick holder — a divine return gift for griha pravesh, weddings, and poojas.',          price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703502/WhatsApp_Image_2026-06-15_at_11.44.38_PM_3_hiqswu.jpg',  occasion: 'Bronze' },
      { title: 'Silver-Plated Keychain Tag',       badge: 'New',         desc: 'Engraved silver-plated tag keychain with event name or date — a minimalist, modern return gift with lasting personal value.',             price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703503/WhatsApp_Image_2026-06-15_at_11.44.38_PM_8_es76b1.jpg',  occasion: 'Silver' },
      { title: 'Personalised Wooden Gift Box',     badge: 'Popular',     desc: 'Custom-engraved wooden gift box with magnetic lid — a premium presentation box that doubles as a lasting keepsake for the guest.',        price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_1_reku6q.jpg',  occasion: 'Wood' },
      { title: 'Beaded Fabric Pouch',              badge: 'Custom',      desc: 'Hand-beaded fabric pouch with mirror-work accents — a festive, artisan return gift that doubles as a gorgeous jewellery holder.',         price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703504/WhatsApp_Image_2026-06-15_at_11.44.38_PM_2_dh8mzk.jpg',  occasion: 'Fabric' },
      { title: 'Brass Puja Thali',                 badge: 'Traditional', desc: 'Handcrafted brass puja thali with engraved border and matching accessories — a complete sacred return gift for every auspicious occasion.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/v1781703505/WhatsApp_Image_2026-06-15_at_11.44.38_PM_14_fnib9m.jpg', occasion: 'Bronze' },
    ]
  },
  painting: {
    title: 'Face Painting',
    subtitle: 'Art that wears\nthe crowd',
    tag: 'FACE PAINTING',
    bannerImg: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_13_ispbuh.jpg',
    heroDesc: 'Whimsical, safe, and event-ready designs. Only certified skin-safe colours. Perfect for all ages.',
    promoTitle: 'BOOK YOUR EVENT NOW',
    promoSubtitle: 'Parties · Schools · Festivals · Corporate Events — all ages welcome',
    filters: [],
    products: [
      { title: 'Butterfly Wing Design',    badge: 'Bestseller', desc: 'Full-face rainbow butterfly mask with layered wing gradients — the most requested design for birthday parties and kids events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_13_ispbuh.jpg',  occasion: '' },
      { title: 'Tiger Face Art',           badge: 'Popular',    desc: 'Bold tiger stripe design with amber and black — fierce, detailed, and a favourite among kids who love wild animals.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_11_eomsmr.jpg',  occasion: '' },
      { title: 'Spider-Man Mask',          badge: 'Bestseller', desc: 'Iconic web-pattern Spider-Man face art with red and navy — brings out the superhero in every child at parties and school events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_8_wmt1xn.jpg',   occasion: '' },
      { title: 'Floral Crown Design',      badge: 'New',        desc: 'Delicate hand-painted floral crown with pastel roses and green leaves — elegant and perfect for garden parties and weddings.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289143/WhatsApp_Image_2026-06-12_at_7.23.02_PM_9_ijammz.jpg',   occasion: '' },
      { title: 'Rainbow Butterfly',        badge: 'Popular',    desc: 'Vibrant rainbow-coloured butterfly spread across both cheeks — fun, colourful, and loved by kids and adults alike.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289144/WhatsApp_Image_2026-06-12_at_7.23.02_PM_12_jwdaxe.jpg',  occasion: '' },
      { title: 'Galaxy Eye Art',           badge: 'New',        desc: 'Celestial galaxy eye design with deep blue, purple and gold star dust — a showstopper for festival and themed events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_7_easj0i.jpg',   occasion: '' },
      { title: 'Dragon Scale Design',      badge: 'Popular',    desc: 'Shimmering dragon scale texture painted on cheeks with metallic greens and golds — perfect for fantasy-themed events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_6_aheirr.jpg',   occasion: '' },
      { title: 'Princess Tiara Art',       badge: 'Bestseller', desc: 'Sparkling princess tiara with pink roses and gold glitter — every little girl\'s dream design for birthday parties.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_5_fdu4di.jpg',   occasion: '' },
      { title: 'Superhero Shield Mask',    badge: 'Popular',    desc: 'Bold superhero half-mask design in red and gold — versatile for any character and a hit at all kids\' parties and fairs.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289145/WhatsApp_Image_2026-06-12_at_7.23.02_PM_4_ugo4sc.jpg',   occasion: '' },
      { title: 'Mermaid Ocean Design',     badge: 'New',        desc: 'Oceanic mermaid scales in turquoise and coral with pearl accents — a dreamy underwater look for themed parties.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_3_lerit5.jpg',   occasion: '' },
      { title: 'Mandala Forehead Art',     badge: 'Popular',    desc: 'Sacred mandala pattern centred on the forehead with fine detailing — elegant for festivals, cultural events, and adult celebrations.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_2_hgsutd.jpg',   occasion: '' },
      { title: 'Lion King Design',         badge: 'Bestseller', desc: 'Majestic lion face with golden mane strokes — a powerful and dramatic design that steals the show at any event.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_1_dn7nya.jpg',   occasion: '' },
      { title: 'Peacock Feather Eye',      badge: 'New',        desc: 'Intricate peacock feather eye design with teal, green and gold — stunning for cultural shows, festivals, and photo shoots.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.02_PM_yjlsgm.jpg',     occasion: '' },
      { title: 'Pirate Skull Art',         badge: 'Popular',    desc: 'Dramatic pirate skull and crossbones eye patch design — an adventure favourite for kids\' treasure hunt and pirate parties.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.01_PM_7_zrixno.jpg',   occasion: '' },
      { title: 'Fairy Garden Design',      badge: 'New',        desc: 'Whimsical fairy design with pastel wings, stars, and flowers — magical and delightful for garden parties and kids\' events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.01_PM_5_qvnadm.jpg',   occasion: '' },
      { title: 'Cosmic Galaxy Art',        badge: 'Popular',    desc: 'Deep space galaxy swirl with nebula colours and glitter stars — a bold and artistic design for all ages and night events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_3_rwygcq.jpg',   occasion: '' },
      { title: 'Tribal Warrior Design',    badge: 'Bestseller', desc: 'Strong geometric tribal warrior stripes in bold black and ochre — striking and versatile for festival and corporate events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289146/WhatsApp_Image_2026-06-12_at_7.23.01_PM_6_sc3uag.jpg',   occasion: '' },
      { title: 'Floral Vine Pattern',      badge: 'New',        desc: 'Delicate trailing vine and bloom pattern along the cheekbone — a subtle, feminine design that photographs beautifully.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_1_i3fjz8.jpg',   occasion: '' },
      { title: 'Neon Splash Art',          badge: 'Popular',    desc: 'Vibrant neon colour splash design with UV-reactive paints — electric and eye-catching for night events and glow parties.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_4_wlcaon.jpg',   occasion: '' },
      { title: 'Golden Phoenix Design',    badge: 'Bestseller', desc: 'Majestic golden phoenix with fiery wing feathers spreading across the cheek — a premium design for galas and special events.', price: '', img: 'https://res.cloudinary.com/diancfp03/image/upload/e_improve/e_blur_region:700,g_faces/v1781289147/WhatsApp_Image_2026-06-12_at_7.23.01_PM_yjrp0j.jpg',     occasion: '' },
    ]
  }
}

const badgeColors: Record<string, string> = {
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

function CollectionPage() {
  const { id } = Route.useParams()
  const data = collectionData[id] || collectionData.jewellery
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [wishlist, setWishlist] = useState<string[]>([])

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
      <div className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] min-h-[260px] sm:min-h-[340px] md:min-h-[480px] overflow-hidden">
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
      {data.filters.length > 0 && (
        <div className="sticky top-16 md:top-[68px] z-40 border-b border-[#C9A84C]/10 px-4 sm:px-6 md:px-16 py-3 sm:py-4 overflow-x-auto" style={{ background: 'rgba(4,20,10,0.97)', backdropFilter: 'blur(12px)' }}>
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
      )}

      {/* Product Grid */}
      <main className="flex-grow px-4 sm:px-6 md:px-16 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-white/30">No items match this filter.</p>
            <button onClick={() => setActiveFilter('All')} className="mt-6 text-[10px] tracking-[0.2em] font-bold uppercase text-[#C9A84C] border border-[#C9A84C]/30 px-6 py-3 rounded-full hover:border-[#C9A84C] transition-all cursor-pointer">
              Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6 lg:gap-8">
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
                    style={id === 'painting' ? { filter: 'saturate(1.4) contrast(1.08) brightness(1.05)' } : undefined}
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

                  <div className="pt-4 border-t border-[#C9A84C]/10">
                    <a
                      href={`https://wa.me/14704527988?text=${encodeURIComponent(`Hi CraftNest! I'm interested in the "${item.title}". Please share more details.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] font-bold uppercase bg-[#C9A84C] hover:bg-[#E8C96B] text-[#04140E] px-4 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow-[0_2px_12px_rgba(201,168,76,0.15)] hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)] w-full justify-center"
                    >
                      ENQUIRE ON WHATSAPP →
                    </a>
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
          © {new Date().getFullYear()} Craft Nest · Handmade with Pride in Georgia, USA
        </p>
      </footer>
    </div>
  )
}
