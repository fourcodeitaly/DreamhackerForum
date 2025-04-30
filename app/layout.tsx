import NextTopLoader from "nextjs-toploader";
import type React from "react";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/components/auth-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Study Abroad Interview Forum",
  description: "Share and discuss tips for study abroad interviews",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Add the NextTopLoader component */}
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
            <AuthProvider>
              <NotificationProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Toaster />
                </div>
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
