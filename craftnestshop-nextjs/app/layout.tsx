import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Craft Nest',
  description: 'Handmade crafts, jewellery, face painting and return gifts — Georgia, USA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
