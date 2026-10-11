import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Jersey_15 } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
});

/*
 * Institutional branding (name, tagline, description, logo) is rendered by the
 * Footer in this layout and is managed by a Superadmin at runtime through
 * PUT /admin/settings. Without a revalidation window the whole site was fully
 * static and permanently served whatever was fetched during `next build`, so a
 * branding change never reached the public pages.
 *
 * This follows the convention already used by the feeds (60s) and leaderboard
 * (30s) routes.
 */
export const revalidate = 60;

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
    <html lang="en" className={`${jersey.variable} bg-arcade-violet scroll-smooth`}>
      <body className="font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
