import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { LanguageProvider } from "@/components/providers/language-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MobileNavButton } from "@/components/layout/mobile-nav-button";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Session } from "next-auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dreamhacker - Touch your dreams",
  description: "Share and discuss tips for study abroad interviews",
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon.ico",
        type: "image/ico",
      },
    ],
    shortcut: ["/favicon_io/favicon.ico"],
    apple: [
      {
        url: "/favicon_io/favicon.ico",
        type: "image/ico",
      },
    ],
  },
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Providers session={session}>
              <AuthProvider>
                <NotificationProvider>
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <MobileNavButton />
                    <Footer />
                    <Toaster />
                  </div>
                </NotificationProvider>
              </AuthProvider>
            </Providers>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
