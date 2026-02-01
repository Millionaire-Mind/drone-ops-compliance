import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UAS FlightCheck - Advisory Preflight Decision Support for U.S. Drone Operations",
  description: "Advisory preflight decision support for drone operators. Aggregates FAA airspace, NOAA weather, and TFR data to help identify operational constraints before flight. For flight schools, Part 107 pilots, and recreational operators.",
  keywords: ["drone", "UAS", "Part 107", "preflight", "airspace", "LAANC", "TFR", "weather", "FAA", "flight school"],
  authors: [{ name: "UAS FlightCheck" }],
  openGraph: {
    title: "UAS FlightCheck - Preflight Advisory for Drone Operations",
    description: "Advisory decision support for airspace, weather, and TFR constraints. For flight schools, Part 107 pilots, and recreational operators.",
    url: "https://drone-ops-compliance.vercel.app",
    siteName: "UAS FlightCheck",
    images: [
      {
        url: "/drone-hero.png",
        width: 1200,
        height: 1200,
        alt: "UAS FlightCheck - Drone Preflight Advisory",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAS FlightCheck - Preflight Advisory for Drone Operations",
    description: "Advisory decision support for airspace, weather, and TFR constraints.",
    images: ["/drone-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}