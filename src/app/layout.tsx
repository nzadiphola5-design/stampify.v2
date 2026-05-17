import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Stampify — Fidélisez vos clients. Automatiquement.",
  description: "Cartes de fidélité numériques via Apple Wallet et Google Wallet. Opérationnel en 5 minutes. Zéro application, zéro SMS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-950 text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
