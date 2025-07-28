import type { Metadata } from "next"
import { Providers } from "./components/providers"
import { Navbar } from "@/components/layout/Navbar"

import "./globals.css"

export const metadata: Metadata = {
  title: "FormBuilder - Create Beautiful Forms",
  description: "Create beautiful forms with drag-and-drop ease",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
