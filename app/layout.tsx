import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const nationalPark = localFont({
  src: "../public/fonts/NationalPark.ttf",
  variable: "--font-national-park",
  display: "swap",
});

const dynaPuff = localFont({
  src: "../public/fonts/DynaPuff.ttf",
  variable: "--font-dyna-puff",
  display: "swap",
});

const steven = localFont({
  src: "../public/fonts/Steven.ttf",
  variable: "--font-steven",
  display: "swap",
});

const pagaki = localFont({
  src: "../public/fonts/Pagaki.ttf",
  variable: "--font-pagaki",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Summer of Making 2025 - The Ultimate Wrap-Up",
  description: "A retro magazine-style tribute to Hack Club's Summer of Making 2025. Celebrate projects, makers, and the incredible shell economy.",
  keywords: ["Hack Club", "Summer of Making", "SOM 2025", "Makers", "Projects", "Shells"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${nationalPark.variable} ${dynaPuff.variable} ${steven.variable} ${pagaki.variable}`}
    >
      <body className="paper-texture antialiased">
        {children}
      </body>
    </html>
  );
}
