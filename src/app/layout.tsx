import React from "react";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { THEME_STORAGE_KEY } from "@/constants";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { TanstackQueryClientProvider } from "@/lib/TanstackQueryClientProvider";
import { MobileChrome } from "@/components/home/MobileChrome";
import { Sidebar } from "@/components/home/Sidebar";
import { Footer } from "@/components/home/Footer";
import { SidebarSearchProvider } from "@/context/SidebarSearchContext";
import { AdminSessionBar } from "@/components/admin/AdminSessionBar";

const eUkraine = localFont({
  src: [
    {
      path: "../fonts/e-ukraine/e-Ukraine-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-UltraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Bold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Bold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/e-ukraine/e-Ukraine-Bold.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-e-ukraine",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  applicationName: "VSGO",
  title: {
    default:
      "VSGO — Confederation of Organizations of Persons with Disabilities of Ukraine",
    template: "%s | VSGO",
  },
  description:
    'All‑Ukrainian Union of Public Organizations "Confederation of Organizations of Persons with Disabilities of Ukraine".',
  keywords: [
    "VSGO",
    "Confederation",
    "organizations",
    "disability",
    "Ukraine",
    "non‑profit",
  ],
  authors: [{ name: "VSGO" }],
  creator: "VSGO",
  category: "Non‑profit",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: "VSGO",
    title:
      "VSGO — Confederation of Organizations of Persons with Disabilities of Ukraine",
    description:
      'All‑Ukrainian Union of Public Organizations "Confederation of Organizations of Persons with Disabilities of Ukraine".',
    images: [
      {
        url: "/logo1.svg",
        width: 512,
        height: 512,
        alt: "VSGO logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "VSGO — Confederation of Organizations of Persons with Disabilities of Ukraine",
    description:
      'All‑Ukrainian Union of Public Organizations "Confederation of Organizations of Persons with Disabilities of Ukraine".',
    images: ["/logo1.svg"],
  },
  icons: {
    icon: "/logo1.svg",
    shortcut: "/logo1-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${eUkraine.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            enableColorScheme={true}
            storageKey={THEME_STORAGE_KEY}
          >
            <SidebarSearchProvider>
              <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
                <MobileChrome />
                <div className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 px-3 pt-4 pb-8 sm:px-4 sm:pt-5">
                  <div className="grid min-w-0 grid-cols-12 gap-4 sm:gap-5">
                    <aside className="hidden lg:col-span-3 lg:block">
                      <Sidebar />
                    </aside>
                    <div className="col-span-12 min-w-0 lg:col-span-9">
                      <AdminSessionBar />
                      <TooltipProvider>{children}</TooltipProvider>
                    </div>
                  </div>
                </div>
                <Footer />
              </div>
              <Toaster />
            </SidebarSearchProvider>
          </ThemeProvider>
        </TanstackQueryClientProvider>
        <Analytics debug={false} />
        <SpeedInsights debug={false} />
      </body>
    </html>
  );
}
