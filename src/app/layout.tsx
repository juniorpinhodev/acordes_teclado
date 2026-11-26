import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meu Teclado — Treinamento Musical",
  description:
    "Sistema didático para treinamento de acordes, inversões, campo harmônico, progressões e escalas no teclado.",
  authors: [{ name: "Junior Pinho | DEV", url: "https://www.juniorpinhodev.com.br" }],
  keywords: [
    "piano",
    "teclado",
    "acordes",
    "inversões",
    "campo harmônico",
    "escalas musicais",
    "progressões de acordes",
    "harmonia",
    "sequenciador",
  ],
};

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`}>
      <body className="min-h-screen flex flex-col items-center bg-dark-900 text-dark-100 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 antialiased">
        {children}
      </body>
    </html>
  );
}
