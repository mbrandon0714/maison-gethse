import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Caveat } from "next/font/google";
import { LenisProvider } from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AudioProvider } from "@/components/AudioProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison Gethse — A sanctuary of becoming.",
  description:
    "A narrative brand built on stories, experiences, and the process of becoming. Each chapter honors a life, a lesson, a season.",
  keywords: ["Maison Gethse", "narrative brand", "becoming", "chapters", "Filipino brand"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${cormorant.variable} ${jost.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AudioProvider>
            <CartProvider>
              <LenisProvider>
                <CustomCursor />
                {children}
                <CartDrawer />
              </LenisProvider>
            </CartProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
