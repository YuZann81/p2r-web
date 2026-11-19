import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Jersey_15, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import "./globals.css";

const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixels to Reality — The Cyber Arcade & Inovasi Teknologi RPL",
  description:
    "Pixel To Reality: The Cyber Arcade — Pameran karya teknologi, game interaktif, web inovasi, IoT, dan digital art siswa Rekayasa Perangkat Lunak (RPL).",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#211B35",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jersey.variable} ${dmSans.variable} bg-[#211B35] text-[#FFF5E9] scroll-smooth`}
    >
      <body className="font-body antialiased bg-[#211B35] text-[#FFF5E9] selection:bg-[#FFD447] selection:text-[#211B35]">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
