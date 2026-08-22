"use client";

import React, { useState } from "react";
import ChatAdminModal from "@/components/ChatAdmin";

export default function GlobalChatLauncher() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsChatOpen((prev) => !prev)}
        aria-expanded={isChatOpen}
        aria-label={
          isChatOpen
            ? "Tutup Live Chat Admin Support"
            : "Buka Live Chat Admin Support"
        }
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white text-arcade-ink shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all hover:bg-arcade-yellow hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow cursor-pointer"
      >
        <svg
          className="h-7 w-7 text-arcade-ink transition-transform"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3c-4.97 0-9 3.358-9 7.5 0 2.38 1.34 4.5 3.38 5.82-.18 1.76-1.19 3.51-1.28 3.66a.75.75 0 00.98 1.05c2.31-1.33 4.14-2.58 5.09-3.23.6.07 1.21.1 1.83.1 4.97 0 9-3.358 9-7.5S16.97 3 12 3z" />
        </svg>
      </button>

      {isChatOpen && (
        <ChatAdminModal onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
}
