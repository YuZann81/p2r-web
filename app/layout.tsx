import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Jersey_15 } from "next/font/google";
import "./globals.css";

const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
});

export const metadata: Metadata = {
  title: "Pixels to Reality: The Cyber Arcade",
  description:
    "Pixels to Reality: The Cyber Arcade — a hands-on event for teens, teachers, and industry professionals exploring the future of games and interactive media.",
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
  themeColor: "#5b2be6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jersey.variable} bg-arcade-violet`}>
      <body className="font-body antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
