import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.verrify.io"),

  title: {
    default: "Verrify Portal - Property Verification Dashboard",
    template: "%s | Verrify Portal",
  },

  description:
    "Verrify Portal is a secure dashboard for property due diligence, ownership verification, document validation, and fraud prevention. Manage and track property verification requests in real time.",

  keywords: [
    "Verrify portal",
    "property verification dashboard",
    "real estate due diligence system",
    "land verification app",
    "property document checker",
    "real estate fraud prevention tool",
    "Nigeria property verification platform",
  ],

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },

  openGraph: {
    title: "Verrify Portal - Secure Property Verification Dashboard",
    description:
      "Manage property verification, validate ownership documents, and track due diligence requests securely on Verrify Portal.",
    url: "https://app.verrify.io",
    siteName: "Verrify Portal",
    images: [
      {
        url: "https://www.verrify.io/icon.jpeg",
        width: 1200,
        height: 630,
        alt: "Verrify Portal Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Verrify Portal - Secure Dashboard",
    description:
      "Secure dashboard for property verification, ownership validation, and fraud prevention.",
    images: ["https://www.verrify.io/icon.jpeg"],
  },

  alternates: {
    canonical: "https://app.verrify.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen overflow-y-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}