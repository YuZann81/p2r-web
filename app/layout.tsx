import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Jersey_15 } from "next/font/google";
import PlatformStatusGuard from "@/components/maintenance/PlatformStatusGuard";
import { AuthProvider } from "@/lib/auth/auth-context";
import { fetchServerPlatformStatus } from "@/lib/maintenance/status";
import "./globals.css";

const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
});

/*
 * Dynamic rendering guarantees every request reads live canonical platform
 * status (`GET /api/v1/health` + `GET /api/v1/settings`) and Super Admin
 * settings (maintenance mode, institutional branding) without stale ISR lag.
 */
export const dynamic = "force-dynamic";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialStatus = await fetchServerPlatformStatus({
    allowMissingConfig: true,
  });

  return (
    <html lang="id" className={`${jersey.variable} bg-arcade-violet scroll-smooth`}>
      <body className="font-body antialiased">
        <PlatformStatusGuard initialStatus={initialStatus}>
          <AuthProvider>{children}</AuthProvider>
        </PlatformStatusGuard>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
