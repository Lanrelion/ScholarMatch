import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SerwistInit } from "@/components/pwa/SerwistInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScholarMatch",
  description: "AI-powered scholarship matching for African students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#768666" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <SerwistInit />
          {children}
          <div className="grain-overlay" aria-hidden="true" />
        </body>
      </html>
    </ClerkProvider>
  );
}
