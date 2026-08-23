import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo?: Echo<"reverb">;
  }
}

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

export function getEcho(): Echo<"reverb"> | null {
  if (typeof window === "undefined") return null;

  if (window.Echo) return window.Echo;

  const isHttps = window.location.protocol === "https:";
  const reverbHost =
    process.env.NEXT_PUBLIC_REVERB_HOST || (isHttps ? "ws.razzan.site" : "127.0.0.1");
  const reverbPort = process.env.NEXT_PUBLIC_REVERB_PORT
    ? Number(process.env.NEXT_PUBLIC_REVERB_PORT)
    : (isHttps ? 443 : 8080);
  const reverbScheme =
    process.env.NEXT_PUBLIC_REVERB_SCHEME || (isHttps ? "https" : "http");
  const reverbAppKey =
    process.env.NEXT_PUBLIC_REVERB_APP_KEY || "p2rreverbkey123";

  window.Echo = new Echo({
    broadcaster: "reverb",
    key: reverbAppKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbScheme === "https",
    enabledTransports: ["ws", "wss"],
  });

  return window.Echo;
}
