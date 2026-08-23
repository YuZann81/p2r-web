"use client";

import React from "react";

export function ChatSkeleton() {
  return (
    <div
      data-testid="chat-skeleton-container"
      className="flex flex-col gap-4 p-2 w-full animate-pulse select-none"
      aria-label="Memuat riwayat chat..."
      role="status"
    >
      {/* Date badge skeleton */}
      <div className="flex justify-center my-1">
        <div className="h-5 w-24 bg-white/10 rounded-full" />
      </div>

      {/* Admin Message 1 Skeleton (Left) */}
      <div className="flex flex-col max-w-[80%] self-start items-start gap-1">
        <div className="h-3 w-16 bg-white/15 rounded-sm ml-1" />
        <div className="px-4 py-3 rounded-2xl rounded-bl-xs bg-arcade-purple/40 border border-white/10 w-64 sm:w-72 flex flex-col gap-2">
          <div className="h-3.5 bg-white/20 rounded-md w-full" />
          <div className="h-3.5 bg-white/15 rounded-md w-4/5" />
        </div>
        <div className="h-2.5 w-12 bg-white/10 rounded-sm ml-1" />
      </div>

      {/* User Message 1 Skeleton (Right) */}
      <div className="flex flex-col max-w-[75%] self-end items-end gap-1">
        <div className="h-3 w-12 bg-white/15 rounded-sm mr-1" />
        <div className="px-4 py-3 rounded-2xl rounded-br-xs bg-arcade-yellow/30 border border-arcade-yellow/20 w-48 sm:w-56 flex flex-col gap-2">
          <div className="h-3.5 bg-white/25 rounded-md w-full" />
          <div className="h-3.5 bg-white/20 rounded-md w-2/3" />
        </div>
        <div className="h-2.5 w-14 bg-white/10 rounded-sm mr-1" />
      </div>

      {/* Admin Message 2 Skeleton (Left) */}
      <div className="flex flex-col max-w-[85%] self-start items-start gap-1">
        <div className="h-3 w-16 bg-white/15 rounded-sm ml-1" />
        <div className="px-4 py-3 rounded-2xl rounded-bl-xs bg-arcade-purple/40 border border-white/10 w-72 sm:w-80 flex flex-col gap-2">
          <div className="h-3.5 bg-white/20 rounded-md w-full" />
          <div className="h-3.5 bg-white/15 rounded-md w-5/6" />
          <div className="h-3.5 bg-white/10 rounded-md w-1/2" />
        </div>
        <div className="h-2.5 w-12 bg-white/10 rounded-sm ml-1" />
      </div>

      {/* User Message 2 Skeleton (Right) */}
      <div className="flex flex-col max-w-[70%] self-end items-end gap-1">
        <div className="px-4 py-2.5 rounded-2xl rounded-br-xs bg-arcade-yellow/30 border border-arcade-yellow/20 w-40 flex flex-col gap-1.5">
          <div className="h-3.5 bg-white/25 rounded-md w-full" />
        </div>
        <div className="h-2.5 w-10 bg-white/10 rounded-sm mr-1" />
      </div>
    </div>
  );
}
