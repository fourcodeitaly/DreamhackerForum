import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { ToastContainer } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Study Abroad Interview Forum",
  description: "Share and discuss tips for study abroad interviews",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <ToastContainer />
                </div>
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
