import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/store/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MemeVerse - Your Ultimate Meme Platform",
  description: "Explore, create, and share the best memes on the internet",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'